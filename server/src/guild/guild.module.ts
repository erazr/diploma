import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.model';
import { ChannelSchema } from 'src/models/channel.model';
import { GuildSchema } from 'src/models/guild.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Channel', schema: ChannelSchema },
      { name: 'Guild', schema: GuildSchema },
    ]),
    SocketModule,
  ],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule {}
