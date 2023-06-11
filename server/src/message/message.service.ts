import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from 'src/models/channel.model';
import { Message } from 'src/models/message.model';
import { User } from 'src/models/user.model';
import { MessageDto } from './message.dto';
import { AppGateway } from 'src/socket/app.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('User') private userModel: typeof User,
    @InjectModel('Message') private messageModel: typeof Message,
    @InjectModel('Channel') private channelModel: typeof Channel,
    private socketService: AppGateway,
  ) {}

  async getMessages(
    channelId: string,
    userId: string,
    cursor?: string | null,
    around?: string | null,
    after?: string | null,
  ) {
    const channel = await this.channelModel.findById(channelId);

    if (!channel) {
      throw new NotFoundException();
    }

    let time: any;

    const result = await this.messageModel
      .find({ channelId: channel._id })
      .sort({ createdAt: 'desc' })
      .limit(30)
      .select('-__v')
      .populate('author', '-password -email -friends -requests -__v')
      .populate({
        path: 'referencedMessage',
        populate: {
          path: 'author',
          select: ['-password -email -friends -requests -__v'],
        },
      });

    if (cursor) {
      time = new Date(cursor).getTime();
      const other = await this.messageModel
        .find({
          channelId: channel._id,
          createdAt: { $lt: time },
        })
        .sort({ createdAt: 'desc' })
        .limit(30)
        .select('-__v')
        .populate('author', '-password -email -friends -requests -__v')
        .populate({
          path: 'referencedMessage',
          populate: {
            path: 'author',
            select: ['-password -email -friends -requests -__v'],
          },
        });
      return other;
    }

    if (around) {
      time = new Date(around).getTime();
      let res = [];
      await this.messageModel
        .find({
          channelId: channel._id,
          createdAt: { $lte: time },
        })
        .limit(15)
        .sort({ createdAt: 'desc' })
        .select('-__v')
        .populate('author', '-password -email -friends -requests -__v')
        .populate({
          path: 'referencedMessage',
          populate: {
            path: 'author',
            select: ['-password -email -friends -requests -__v'],
          },
        })
        .then(async (docs) => {
          res = [...docs.reverse()];

          await this.messageModel
            .find({
              channelId: channel._id,
              createdAt: { $gt: docs[docs.length - 1].createdAt },
            })
            .limit(15)
            .sort({ createdAt: 'asc' })
            .select('-__v')
            .populate('author', '-password -email -friends -requests -__v')
            .populate({
              path: 'referencedMessage',
              populate: {
                path: 'author',
                select: ['-password -email -friends -requests -__v'],
              },
            })
            .then((docs) => {
              res.splice(res.length, 0, ...docs);
            });
        });
      return res;
    }

    if (after) {
      time = new Date(after).getTime();
      const res = await this.messageModel
        .find({ channelId: channel._id, createdAt: { $gt: time } })
        .sort({ createdAt: 'asc' })
        .limit(30)
        .select('-__v')
        .populate('author', '-password -email -friends -requests -__v')
        .populate({
          path: 'referencedMessage',
          populate: {
            path: 'author',
            select: ['-password -email -friends -requests -__v'],
          },
        });
      return res;
    }
    return result;
  }

  async createMessage(
    channelId: string,
    userId: string,
    messageDto: MessageDto,
    files?: Array<Express.Multer.File>,
  ) {
    const channel = await this.channelModel.findOne({ _id: channelId });
    const user = await this.userModel.findById(userId);

    this.isChannelMember(channel, userId);

    if (!files && !messageDto.content) {
      throw new BadRequestException();
    }

    const message = await new this.messageModel({
      ...messageDto,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      channelId,
      author: user._id,
    }).populate('author mentions', '-password -email -friends -requests -__v');

    if (files) {
      //  const directory = `channels/${channelId}`;
      // const url = await uploadToS3(directory, file);
      //  const data = await uploadFromBuffer(file);
      files.forEach((f) => {
        message.attachments.push({
          filetype: f.mimetype,
          url: `http://localhost:8000/api/messages/${channelId}/${f.filename}`,
        });
      });
    }

    const refMessage = await message.populate({
      path: 'referencedMessage',
      populate: {
        path: 'author',
        select: '-password -email -friends -requests -__v',
      },
    });

    message.mentions.push(refMessage.author);

    this.socketService.sendMessage({ room: channelId, message });

    if (channel.dm) {
      channel.updateOne({
        isOpen: true,
        updatedAt: Date.now(),
      });
      this.socketService.pushDMToTop({ room: channelId, channelId });
    }

    await message.save();

    return message;
  }

  async editMessage(userId: string, id: string, content: string) {
    await this.messageModel
      .findOneAndUpdate(
        { _id: id },
        { content, edited: Date.now() },
        { returnOriginal: false },
      )
      .populate('author', '-password -email -friends -requests -__v')
      .populate({
        path: 'referencedMessage',
        populate: {
          path: 'author',
          select: '-password -email -friends -requests -__v',
        },
      })
      .then(
        (res) => {
          if (res.author._id.toHexString() !== userId) {
            throw new UnauthorizedException();
          }
          this.socketService.editMessage({
            room: res.channelId.toHexString(),
            message: res,
          });
        },
        (err) => {
          if (err) throw new NotFoundException();
        },
      );
    return true;
  }

  async deleteMessage(userId: string, id: string) {
    await this.messageModel.findOneAndDelete({ _id: id, author: userId }).then(
      (res) => {
        this.socketService.deleteMessage({
          room: res.channelId.toHexString(),
          message: res,
        });
      },
      (err) => {
        if (err) throw new NotFoundException();
      },
    );

    return true;
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
