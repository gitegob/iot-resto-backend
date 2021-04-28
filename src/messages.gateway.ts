import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5001)
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.verbose('INITIALIZED...');
  }

  handleDisconnect(client: Socket) {
    this.logger.verbose(
      this.logger.getTimestamp() + ' Client disconnected...' + client.id,
    );
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.verbose(
      this.logger.getTimestamp() + ' Client connected...' + client.id,
    );
    this.server.emit('message', 'Hllo');
    // return { event: 'msgToClient', data: 'Hello there' };
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, text: string) {
    console.log('################################');
    // client.emit('msgToClient', text); // alternative to return
    this.server.emit('message', text + 'received'); // to all subscribed clients
    // return { event: 'message', data: text + 'received' }; // only to the client that sent it
  }
}
