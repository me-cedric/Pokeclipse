import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Card, Game, GameState, Player } from './game-state';

@Injectable()
export class GameService {
  // Store all games
  private games: Game[] = [];

  createDeck(): Card[] {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: uuid(),
      value: `Card ${i + 1}`,
    }));
  }

  joinGame(playerId: string): Player {
    const game = this.games.find((g) => g.isActive);
    if (!game) throw new Error('No active game found');

    if (!game.players[playerId]) {
      game.players[playerId] = { id: playerId, hand: [] };
    }
    return game.players[playerId];
  }

  drawCard(playerId: string): Card | undefined {
    const game = this.games.find((g) => g.isActive);
    if (!game) throw new Error('No active game found');

    const player = game.players[playerId];
    if (!player || game.deck.length === 0) return undefined;
    const card = game.deck.pop();
    if (card) {
      player.hand.push(card);
    }
    return card;
  }

  playCard(playerId: string, cardId: string): Card | null {
    const game = this.games.find((g) => g.isActive);
    if (!game) throw new Error('No active game found');

    const player = game.players[playerId];
    if (!player) return null;
    const idx = player.hand.findIndex((c) => c.id === cardId);
    if (idx === -1) return null;
    const [card] = player.hand.splice(idx, 1);
    return card;
  }

  // Create a new game and add to the list
  createGame(name: string): Game {
    const newGame: Game = {
      deck: this.createDeck(),
      players: {},
      id: uuid(),
      name,
      isActive: true,
      currentState: GameState.IDLE,
    };
    this.games.push(newGame);
    return newGame;
  }

  // Get all ongoing games
  getGames(): Game[] {
    return this.games.filter((g) => g.isActive);
  }

  getState(): Game {
    const game = this.games.find((g) => g.isActive);
    if (!game) throw new Error('No active game found');
    return game;
  }
}
