import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from 'src/models/channel.model';
import { Guild } from 'src/models/guild.model';
import { User } from 'src/models/user.model';
import { ChannelDto } from './channel.dto';
import { AppGateway } from 'src/socket/app.gateway';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('User') private userModel: typeof User,
    @InjectModel('Channel') private channelModel: typeof Channel,
    @InjectModel('Guild') private guildModel: typeof Guild,
    private readonly socketService: AppGateway,
  ) {}

  async getGuildChannels(guildId: string, userId: string) {
    const guild = await this.guildModel.findOne({
      _id: guildId,
      members: userId,
    });
    return guild.channels;
  }

  async createChannel(guildId: string, userId: string, channelDto: ChannelDto) {
    const { name, isPublic } = channelDto;
    const user = await this.userModel.findById(userId);

    const data = { name: name.trim(), public: isPublic };

    const guild = await this.guildModel.findById(guildId);

    if (guild.ownerId.toHexString() !== userId)
      throw new UnauthorizedException();

    const count = guild.channels.length;

    if (count >= 50) {
      throw new BadRequestException('Channel Limit is 50');
    }

    const channel = new this.channelModel({ data });
    channel.members = channel.members.filter((u) => u !== user._id);
    channel.members.push(user._id);
    await channel.save();
    this.socketService.addChannel({
      room: guildId,
      channel: {
        _id: channel!._id,
        name: channel!.name,
        isPublic: channel!.isPublic,
        createdAt: channel!.createdAt.toString(),
        updatedAt: channel!.updatedAt.toString(),
      },
    });
    return true;
  }

  async editChannel(userId: string, channelId: string, channelDto: ChannelDto) {
    const channel = await this.channelModel.findById(channelId);
    const guild = await this.guildModel.findOne({ channels: channel._id });

    if (!channel) {
      throw new NotFoundException();
    }

    if (guild.ownerId.toHexString() !== userId) {
      throw new UnauthorizedException();
    }

    const { name, isPublic } = channelDto;

    await this.channelModel
      .findByIdAndUpdate(
        channel._id,
        {
          name: name ?? channel.name,
          isPublic: isPublic ?? channel.isPublic,
        },
        {
          returnDocument: 'after',
        },
      )
      .then((res) => {
        this.socketService.editChannel({
          room: guild._id.toHexString(),
          channel: {
            _id: res!._id,
            name: res!.name,
            isPublic: res!.isPublic,
            createdAt: res!.createdAt.toString(),
            updatedAt: res!.updatedAt.toString(),
          },
        });
      });
    return true;
  }

  async getOrCreateChannel(memberId: string, userId: string) {
    const member = await this.userModel.findById(memberId);
    const user = await this.userModel.findById(userId);
    if (!member) {
      throw new NotFoundException();
    }

    const data = await this.channelModel.findOne({
      dm: true,
      members: { $all: [member._id, user._id] },
    });

    if (data) {
      const channel = await this.channelModel
        .findOne({ _id: data._id })
        .orFail();

      if (!channel) throw new NotFoundException();

      await this.channelModel.updateOne(
        { _id: data._id },
        {
          isOpen: true,
        },
      );

      return {
        id: data.id,
        user: member,
      };
    }

    const channel = new this.channelModel({
      name: 'dm',
      isPublic: false,
      dm: true,
    });

    const allMembers = [member._id, user._id];

    channel.members = allMembers;
    await channel.save();
    return {
      id: channel._id,
      user: member.toJSON(),
    };
  }

  async getDirectMessageChannels(userId: string) {
    const user = await this.userModel.findById(userId);

    const dms = await this.channelModel
      .find({
        $and: [{ members: user._id }, { members: { $size: 2 } }],
      })
      .lean()
      .populate('members', '-password -__v -email -requests -friends');

    const res = [];

    dms.map((dm) => {
      let member: any = dm.members.find((m) => !user._id.equals(m._id));
      return res.push({
        _id: dm._id,
        user: {
          _id: member._id,
          username: member.username,
          avatar: member.avatar,
          isOnline: member.isOnline,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        },
      });
    });
    return res;
  }

  async deleteChannel(userId: string, channelId: string) {
    const channel = await this.channelModel.findById(channelId);
    const guild = await this.guildModel.findOne({ channels: channel._id });

    if (!channel) {
      throw new NotFoundException();
    }

    if (guild.ownerId.toHexString() !== userId) {
      throw new UnauthorizedException();
    }

    const count = guild.channels.length;

    if (count === 1) {
      throw new BadRequestException('A server needs at least one channel');
    }

    await this.channelModel.deleteOne({ _id: channel._id });

    this.socketService.deleteChannel({
      room: guild._id.toHexString(),
      channelId,
    });

    return true;
  }

  async setDirectMessageStatus(
    channelId: string,
    userId: string,
    isOpen: boolean,
  ) {
    const channel = await this.channelModel.findOne({
      _id: channelId,
      members: userId,
    });

    if (!channel) throw new NotFoundException();

    await this.channelModel.updateOne({ _id: channel._id }, { isOpen });

    return true;
  }
}
