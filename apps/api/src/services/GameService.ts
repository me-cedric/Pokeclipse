import type {
  Game,
  GameState,
  Prisma,
  UsersOnGames,
} from "../../generated/prisma/index";
import prisma from "../db";

type GameWithPlayers = Prisma.GameGetPayload<{
  include: { players: { include: { user: true } } };
}>;

export class GameService {
  async createGame(name: string): Promise<Game> {
    return prisma.game.create({
      data: { name },
    });
  }

  async getGameById(id: string): Promise<GameWithPlayers | null> {
    return prisma.game.findUnique({
      where: { id },
      include: { players: { include: { user: true } } },
    });
  }

  async listGames(): Promise<GameWithPlayers[]> {
    return prisma.game.findMany({
      include: { players: { include: { user: true } } },
    });
  }

  async listActiveGames(): Promise<GameWithPlayers[]> {
    return prisma.game.findMany({
      where: { isActive: true },
      include: { players: { include: { user: true } } },
    });
  }

  async updateGameIsActive(
    id: string,
    isActive: boolean
  ): Promise<GameWithPlayers | null> {
    return prisma.game.update({
      where: { id },
      data: { isActive },
      include: { players: { include: { user: true } } },
    });
  }

  async updateGameState(
    id: string,
    state: GameState
  ): Promise<GameWithPlayers | null> {
    return prisma.game.update({
      where: { id },
      data: { currentState: state },
      include: { players: { include: { user: true } } },
    });
  }

  async addPlayerToGame(
    gameId: string,
    userId: string,
    userType: UsersOnGames["userType"]
  ): Promise<GameWithPlayers | null> {
    await prisma.usersOnGames.create({
      data: {
        gameId,
        userId,
        userType,
        assignedAt: new Date(),
        assignedBy: userId, // Assuming the user is assigning themselves
      },
    });
    return this.getGameById(gameId);
  }

  // remove player from game
  async removePlayerFromGame(
    gameId: string,
    userId: string
  ): Promise<GameWithPlayers | null> {
    await prisma.usersOnGames.delete({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });
    const usersOnGame = await prisma.usersOnGames.findMany({
      where: { gameId },
      include: { user: true },
    });
    if (usersOnGame.length === 0) {
      // If no players left, delete the game
      await prisma.game.delete({ where: { id: gameId } });
      return null;
    }
    return this.getGameById(gameId);
  }
}
