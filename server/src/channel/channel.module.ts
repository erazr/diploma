import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSchema } from 'src/models/channel.model';
import { UserSchema } from 'src/models/user.model';
import { GuildSchema } from 'src/models/guild.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Channel', schema: ChannelSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Guild', schema: GuildSchema },
    ]),
    SocketModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
