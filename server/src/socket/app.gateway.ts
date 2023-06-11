import { Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Request } from 'express';
// import * as sharedsession from 'express-socket.io-session';
import { sessionMiddleware } from '../config/sessionmiddleware';
import { GetUser } from 'src/config/user.decorator';
import { WsAuthGuard } from 'src/guards/ws.auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from 'src/models/channel.model';
import { MessageDto } from 'src/message/message.dto';
import { ChannelDto } from 'src/channel/channel.dto';
// import { WsMemberGuard } from '../guards/ws/ws.guild.guard';
// import { WsAuthGuard } from '../guards/ws/ws.auth.guard';

@WebSocketGateway({
  upgrade: true,
  transports: ['websocket'],
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

  constructor(@InjectModel('Channel') private channelModel: typeof Channel) {}

  afterInit(server: Server) {
    // server.use(sharedsession(sessionMiddleware, { autoSave: true }));
    server.use(this.wrap(sessionMiddleware));
  }

  async handleConnection(socket: Socket) {}

  async handleDisconnect(client: Socket): Promise<any> {}

  // @UseGuards(WsAuthGuard)
  // @SubscribeMessage('toggleOnline')
  // handleToggleOnline(client: Socket): void {
  //   this.socketService.toggleOnlineStatus(client);
  // }

  // @UseGuards(WsAuthGuard)
  // @SubscribeMessage('toggleOffline')
  // handleToggleOffline(client: Socket): void {
  //   this.socketService.toggleOfflineStatus(client);
  // }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinUser')
  handleUserJoin(client: Socket, room: string): void {
    client.join(room);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinChannel')
  async handleChannelJoin(client: any, room: string) {
    const id: string = client.request.session['userId'];
    const channel = await this.channelModel.findOne({
      _id: room,
    });

    if (!channel) {
      throw new WsException('Not Found');
    }

    await this.isChannelMember(channel, id);

    client.join(room);
  }

  @UseGuards(WsAuthGuard)
  async pushDMToTop(message: { room: string; channelId: string }) {
    const { members } = await this.channelModel.findOne({
      _id: message.channelId,
    });
    members.forEach((m) => {
      this.server.to(m.toHexString()).emit('push_to_top', message.channelId);
    });
  }

  async newGuild(guild) {
    this.server.emit('new_guild', guild);
  }

  // @UseGuards(WsAuthGuard)
  // async newNotification(channelId: string) {
  //   const url = 'https://localhost:8000/'
  //   this.server.to(channelId).emit('new_notification');
  // }

  // @UseGuards(WsMemberGuard)
  // @SubscribeMessage('joinGuild')
  // handleGuildJoin(client: Socket, room: string): void {
  //   client.join(room);
  // }

  // @SubscribeMessage('leaveGuild')
  // handleGuildLeave(client: Socket, room: string): void {
  //   client.leave(room);
  //   this.socketService.updateLastSeen(client, room);
  // }

  // @SubscribeMessage('leaveRoom')
  // handleRoomLeave(client: Socket, room: string): void {
  //   client.leave(room);
  // }

  @SubscribeMessage('startTyping')
  handleStartTyping(_client: Socket, data: string[]): void {
    const room = data[0];
    const username = data[1];
    this.server.to(room).emit('addToTyping', username);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(_client: Socket, data: string[]): void {
    const room = data[0];
    const username = data[1];
    this.server.to(room).emit('removeFromTyping', username);
  }

  // @UseGuards(WsAuthGuard)
  // @SubscribeMessage('getRequestCount')
  // async handleGetFriendRequestCount(client: Socket): Promise<void> {
  //   const id: string = client.handshake.session['userId'];
  //   await this.socketService.getPendingFriendRequestCount(id);
  // }

  editChannel(message: { room: string; channel: any }) {
    this.server.to(message.room).emit('edit_channel', message.channel);
  }

  deleteChannel(message: { room: string; channelId: string }) {
    this.server.to(message.room).emit('delete_channel', message.channelId);
  }

  addChannel(message: { room: string; channel: any }) {
    this.server.to(message.room).emit('add_channel', message.channel);
  }

  sendMessage(message: { room: string; message: any }) {
    this.server.to(message.room).emit('new_message', message.message);
  }

  editMessage(message: { room: string; message: MessageDto }) {
    this.server.to(message.room).emit('edit_message', message.message);
  }

  deleteMessage(message: { room: string; message: MessageDto }) {
    this.server.to(message.room).emit('delete_message', message.message);
  }

  private async isChannelMember(channel, userId: string) {
    if (!channel.isPublic) {
      if (channel.dm) {
        const member = await this.channelModel.findOne({
          _id: channel._id,
          members: userId,
        });
        if (!member) {
          throw new UnauthorizedException('Not Authorized');
        }
      } else {
        const member = await this.channelModel.findOne({
          _id: channel._id,
          members: userId,
        });
        if (!member) {
          throw new UnauthorizedException('Not Authorized');
        }
      }
    } else {
      const member = await this.channelModel.findOne({
        _id: channel._id,
        members: userId,
      });
      if (!member) {
        throw new UnauthorizedException('Not Authorized');
      }
    }
  }
}
