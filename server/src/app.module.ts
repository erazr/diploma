import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './message/message.module';
import { ChannelModule } from './channel/channel.module';
import { SocketModule } from './socket/socket.module';
import { GuildModule } from './guild/guild.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://smirkill76:disctest1234@cluster0.uxhfufe.mongodb.net/test?retryWrites=true&w=majority',
    ),
    UserModule,
    MessageModule,
    ChannelModule,
    SocketModule,
    GuildModule,
  ],
})
export class AppModule {}
