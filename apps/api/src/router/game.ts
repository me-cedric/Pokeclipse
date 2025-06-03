import { GameState } from "generated/prisma";
import { z } from "zod";
import { GameService } from "../services/GameService";
import { SocketService } from "../services/SocketService";
import { t } from "./trpc";

export const GameStateSchema = z.nativeEnum(GameState);

export const gameRouter = t.router({
  updateGameState: t.procedure
    .input(z.object({ id: z.string(), state: GameStateSchema }))
    .mutation(async ({ input }) => {
      const gameService = new GameService();
      // utils to manage game state checks and updates according to roles etc ??
      // before updating
      const updated = await gameService.updateGameState(input.id, input.state);
      if (updated) {
        SocketService.emit(`game:${input.id}:update`, updated);
      }
      return updated;
    }),

  onGameUpdate: t.procedure
    .input(z.object({ gameId: z.string() }))
    .subscription(({ input }) =>
      SocketService.subscribe(`game:${input.gameId}:update`)
    ),
});
