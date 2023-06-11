import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/models/message.model';
import { ChannelSchema } from 'src/models/channel.model';
import { UserSchema } from 'src/models/user.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'Channel', schema: ChannelSchema },
    ]),
    SocketModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
