import prisma from "../db";
import type { Game, GameState } from "../../generated/prisma/index";

export class GameService {
  async createGame(name: string): Promise<Game> {
    return prisma.game.create({
      data: { name },
    });
  }

  async getGameById(id: string): Promise<Game | null> {
    return prisma.game.findUnique({
      where: { id },
    });
  }

  async listGames(): Promise<Game[]> {
    return prisma.game.findMany();
  }

  async listActiveGames(): Promise<Game[]> {
    return prisma.game.findMany({
      where: { isActive: true },
    });
  }

  async updateGameState(id: string, state: GameState): Promise<Game | null> {
    return prisma.game.update({
      where: { id },
      data: { currentState: state },
    });
  }
}
