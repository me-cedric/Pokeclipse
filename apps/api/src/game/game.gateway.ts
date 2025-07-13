import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DrawCardDto } from './dto/draw-card.dto';
import { PlayCardDto } from './dto/play-card.dto';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinGame')
  handleJoin(
    @MessageBody() data: { playerId: string },
    // @ConnectedSocket() socket: Socket,
  ) {
    this.gameService.joinGame(data.playerId);
    this.server.emit('gameState', this.gameService.getState());
  }

  @SubscribeMessage('drawCard')
  handleDraw(@MessageBody() dto: DrawCardDto) {
    this.gameService.drawCard(dto.playerId);
    this.server.emit('gameState', this.gameService.getState());
  }

  @SubscribeMessage('playCard')
  handlePlay(@MessageBody() dto: PlayCardDto) {
    this.gameService.playCard(dto.playerId, dto.cardId);
    this.server.emit('gameState', this.gameService.getState());
  }

  @SubscribeMessage('subscribeGames')
  handleSubscribeGames() {
    // Emit the list of ongoing games to all clients
    this.server.emit('gamesList', this.gameService.getGames());
  }
}
