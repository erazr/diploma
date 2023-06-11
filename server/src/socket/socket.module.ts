import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { MessageSchema } from 'src/models/message.model';
import { ChannelSchema } from 'src/models/channel.model';
import { UserSchema } from 'src/models/user.model';
import { AppGateway } from './app.gateway';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      // { name: 'Message', schema: MessageSchema },
      { name: 'Channel', schema: ChannelSchema },
    ]),
  ],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class SocketModule {}
