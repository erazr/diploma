import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from 'src/models/channel.model';
import { Guild } from 'src/models/guild.model';
import { User } from 'src/models/user.model';
import { AppGateway } from 'src/socket/app.gateway';
import { GuildDto } from './guild.dto';

@Injectable()
export class GuildService {
  constructor(
    @InjectModel('User') private userModel: typeof User,
    @InjectModel('Guild') private guildModel: typeof Guild,
    @InjectModel('Channel') private channelModel: typeof Channel,
    private socketService: AppGateway,
  ) {}

  async getGuildMembers(guildId: string) {
    const guild = await this.guildModel
      .findOne({ _id: guildId })
      .populate('channels members ownerId');
    return guild.members;
  }

  async getUserGuilds(userId: string) {
    const guilds = await this.guildModel
      .find({ members: userId })
      .populate('channels members')
      .select('-inviteLinks -__v')
      .sort('-createdAt');

    return guilds;
  }

  async createGuild(guildDto: GuildDto, userId: string) {
    const { name, image } = guildDto;

    const user = await this.userModel.findById(userId);

    const guild = new this.guildModel({
      ownerId: userId,
    });
    const channel = new this.channelModel({
      name: 'general',
    });

    guild.name = name.trim();
    guild.default_channel_id = channel._id;
    guild.members.push(user._id);
    if (!image) {
      guild.icon = `https://ui-avatars.com/api/?name=${name}&uppercase=false&background=242f3d&color=4295ff&rounded=true&bold=true&format=svg`;
    } else {
      guild.icon = `http://localhost:8000/api/guilds/${guild._id}/${image.originalname}`;
    }
    await guild.save();
    channel.guild = guild._id;
    await channel.save();

    this.socketService.newGuild({
      _id: guild._id,
      name: guild.name,
      icon: guild.icon,
      channels: guild.channels,
      members: guild.members,
      default_channel_id: guild.default_channel_id,
      hasNotification: false,
    });

    return guild.toJSON({
      transform(_doc, ret, _options) {
        delete ret.members;
        delete ret.channels;
        delete ret.__v;
        delete ret.inviteLinks;
        return {
          ...ret,
          hasNotification: false,
        };
      },
    });
  }
}
