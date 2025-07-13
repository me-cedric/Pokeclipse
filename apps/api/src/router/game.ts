import { on } from "events";
import { GameState } from "generated/prisma";
import { UserService } from "src/services/UserService";
import { z } from "zod";
import { GameService } from "../services/GameService";
import { SocketService } from "../services/SocketService";
import { baseProcedure, protectedProcedure } from "./procedures";
import { t } from "./trpc";

export const GameStateSchema = z.nativeEnum(GameState);

export const gameRouter = t.router({
  updateGameState: protectedProcedure
    .input(z.object({ gameId: z.string(), state: GameStateSchema }))
    .mutation(async ({ input, ctx }) => {
      const gameService = new GameService();
      const game = await gameService.getGameById(input.gameId);
      if (!game) throw new Error("Game not found");
      if (!game.isActive) throw new Error("Game is not active");
      // check if user is admin or has permission to update game state
      if (
        game.players.some(
          (player) =>
            player.userId === ctx.userId && player.userType !== "ADMIN"
        )
      ) {
        throw new Error("You do not have permission to update game state");
      }
      const updated = await gameService.updateGameState(
        input.gameId,
        input.state
      );
      if (updated) {
        SocketService.emit(`game:${input.gameId}:update`, updated);
      }
      return updated;
    }),

  joinGame: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const gameService = new GameService();
      let game = await gameService.getGameById(input.gameId);
      if (!game) throw new Error("Game not found");

      // add player to game if not already a member
      if (!game.players.find((player) => player.userId === ctx.userId)) {
        // todo checks before allowing
        const userService = new UserService();
        const user = await userService.getUserById(ctx.userId);
        if (!user) throw new Error("User not found");
        game = await gameService.addPlayerToGame(
          input.gameId,
          ctx.userId,
          user?.isAdmin ? "ADMIN" : "PLAYER"
        );
        SocketService.emit(`game:${input.gameId}:update`, game);
        SocketService.emit(`game:update`, game);
      }
      return game;
    }),

  leaveGame: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const gameService = new GameService();
      let game = await gameService.getGameById(input.gameId);
      if (!game) throw new Error("Game not found");

      // remove player from game if not already a member
      if (game.players.find((player) => player.userId === ctx.userId)) {
        // todo checks before allowing
        game = await gameService.removePlayerFromGame(input.gameId, ctx.userId);
        SocketService.emit(`game:${input.gameId}:update`, game);
        SocketService.emit(`game:update`, game);
      }
      return game;
    }),

  onGameUpdate: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .subscription(async ({ input }) => {
      return SocketService.subscribe(`game:${input.gameId}:update`);
    }),

  createGame: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const gameService = new GameService();
      const game = await gameService.createGame(input.name);
      if (!game) throw new Error("Failed to create game");

      // add creator as admin
      await gameService.addPlayerToGame(game.id, ctx.userId, "ADMIN");
      SocketService.emit("game:update", game);
      return game;
    }),

  endGame: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const gameService = new GameService();
      const game = await gameService.getGameById(input.gameId);
      if (!game) throw new Error("Game not found");
      if (!game.isActive) throw new Error("Game is not active");

      // check if user is admin or has permission to end game
      if (
        !game.players.some(
          (player) =>
            player.userId === ctx.userId && player.userType === "ADMIN"
        )
      ) {
        throw new Error("You do not have permission to end the game");
      }

      const updated = await gameService.updateGameIsActive(input.gameId, false);
      SocketService.emit(`game:${input.gameId}:update`, updated);
      SocketService.emit(`game:update`, updated);
      return updated;
    }),

  onActiveGamesChange: baseProcedure.subscription(async function* (opts) {
    const gameService = new GameService();
    yield await gameService.listActiveGames();

    for await (const data of SocketService.subscribe<{ id: string }[]>(
      "game:update",
      {
        signal: opts.signal,
      }
    )) {
      yield await gameService.listActiveGames();
    }
  }),
});
