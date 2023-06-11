import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/user.model';
import {
  RegisterCredentialsDto,
  LoginCredentialsDto,
  ResetPasswordDto,
  UpdateDto,
} from './userCredentials.dto';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { redis } from 'src/config/redis';
import { sendMail } from 'src/utils/sendMail';
import { unlink } from 'fs';

const bcrypt = require('bcrypt');
const randomColor = require('randomcolor');
const sharp = require('sharp');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: typeof User) {}

  async register(credentials: RegisterCredentialsDto, req: Request) {
    const { email, username, password } = credentials;
    let bg = randomColor({ luminosity: 'dark' });
    bg = bg.substring(1);

    const emailTaken = await this.userModel.findOne({ email });

    if (emailTaken) {
      throw new HttpException(
        {
          errors: [
            {
              field: 'email',
              message: 'Email must be unique.',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new this.userModel({
      email: email.trim(),
      username: username.trim(),
      password: await bcrypt.hash(password, 10),
    });
    user.avatar = `https://ui-avatars.com/api/?name=${username}&background=${bg}&length=1&color=fff&rounded=true&bold=true&format=svg`;
    await user.save();
    req!.session!['userId'] = user._id;
    return user.toJSON();
  }

  async login(credentials: LoginCredentialsDto, req: Request) {
    const { email, password } = credentials;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException();
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException();
    }

    req!.session!['userId'] = user.id;

    return user.toJSON();
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return true;
    }

    const token = randomUUID();

    await redis.set(
      'forgot-password:' + token,
      user._id.toHexString(),
      'EX',
      1000 * 60 * 60 * 24 * 3,
    ); // 3 days
    await sendMail(
      email,
      `<a href='http://localhost:3000/reset-password/${token}'>Reset Password</a>`,
    );
    return true;
  }

  async resetPassword(credentials: ResetPasswordDto, req: Request) {
    const { newPassword, token } = credentials;

    const key = 'forgot-password:' + token;
    const userId = await redis.get(key);
    if (!userId) {
      throw new HttpException(
        {
          errors: [
            {
              field: 'token',
              message: 'Token expired',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException();

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    await redis.del(key);

    req!.session!['userId'] = user._id;

    return user.toJSON();
  }

  async findCurrentUser(id: any) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException({
        message: 'An account with that username or email does not exist.',
      });
    }
    return user.toJSON();
  }

  async updateUser(id: string, data: UpdateDto, avatar: Express.Multer.File) {
    const { email } = data;

    const user = await this.userModel.findById(id).orFail();

    if (user.email !== email) {
      const checkEmail = await this.userModel.findOne({ email });
      if (checkEmail) {
        throw new HttpException(
          {
            errors: [
              {
                field: 'email',
                message: 'Email must be unique.',
              },
            ],
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (avatar) {
      // if (ext !== 'webp') {
      const randomName = Array(12)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      await sharp(avatar.path)
        .webp({ quality: 95 })
        .resize(80, 80, { fit: 'cover' })
        .toFile(`src/files/avatars/${randomName}.webp`);

      unlink(`src/files/${avatar.filename}`, (err) => {
        if (err) console.log(err);
      });
      data.avatar = `http://localhost:8000/api/account/avatar/${randomName}.webp`;
    }

    if (!data.avatar || data.avatar === '') data.avatar = user.avatar;

    await this.userModel.updateOne({ _id: user._id }, data);

    return this.findCurrentUser(user._id);
  }

  async getFriends(id: string) {
    const user = await this.userModel
      .findById(id)
      .orFail()
      .lean()
      .populate('friends', '-password -__v -friends -requests -email');
    return user.friends;
  }

  async getFriendRequests(id: string) {
    const user = await this.userModel
      .findById(id)
      .orFail()
      .lean()
      .populate('requests.senderId', '-password -__v -friends -requests')
      .populate('requests.receiverId', '-password -__v -friends -requests');
    for (let i = 0; i < user.requests.length; i++) {
      let res: any = {};
      if (user.requests[i].senderId._id.equals(user._id)) {
        delete user.requests[i].senderId;

        res = user.requests[i].receiverId;
        res.type = 0;
        user.requests[i] = res;
      } else if (user.requests[i].receiverId._id.equals(user._id)) {
        delete user.requests[i].receiverId;

        res = user.requests[i].senderId;
        res.type = 1;
        user.requests[i] = res;
      }
    }
    return user.requests;
  }

  async sendFriendRequest(memberId: string, userId: string) {
    if (userId === memberId) {
      throw new BadRequestException('You cannot add yourself');
    }

    const user = await this.userModel.findById(userId).orFail();
    const member = await this.userModel
      .findById(memberId)
      .orFail()
      .catch(() => {
        throw new NotFoundException('User not found');
      });

    if (!user.friends.includes(member._id)) {
      user.requests.push({ senderId: user._id, receiverId: member._id });
      member.requests.push({ senderId: user._id, receiverId: member._id });
      user.save();
      member.save();
    }
    return true;
  }

  async acceptFriendRequest(memberId: string, userId: string) {
    const member = await this.userModel.findById(memberId).orFail();
    const user = await this.userModel.findById(userId).orFail();

    let hasRequest = false;
    let sIndex = 0;
    member.requests.map((r, i) => {
      if (r.receiverId.equals(user._id)) {
        hasRequest = true;
        sIndex = i;
      }
    });

    if (hasRequest) {
      user.friends.push(member._id);

      member.requests = member.requests.filter(
        (r) => !r.receiverId.equals(user._id),
      );

      user.requests = user.requests.filter(
        (r) => !r.receiverId.equals(user._id),
      );

      member.friends.push(user._id);
      await user.save();
      await member.save();
      // req.io.to(member._id).emit('add_friend', user);
    }
    return true;
  }

  async cancelFriendRequest(memberId: string, userId: string) {
    const member = await this.userModel.findById(memberId).orFail();
    const user = await this.userModel.findById(userId).orFail();

    member.requests = member.requests.filter(
      (r) => !r.senderId.equals(member._id) && !r.senderId.equals(user._id),
    );
    user.requests = user.requests.filter(
      (r) => !r.receiverId.equals(member._id) && !r.receiverId.equals(user._id),
    );

    await user.save();
    await member.save();

    return true;
  }

  async removeFriend(memberId: string, userId: string) {
    const member = await this.userModel.findById(memberId).orFail();
    const user = await this.userModel.findById(userId).orFail();

    user.friends = user.friends.filter((f) => {
      !f.equals(member._id);
    });
    member.friends = member.friends.filter((f) => !f.equals(user._id));

    await user.save();
    await member.save();

    // req.io.to(user2).emit('remove_friend', user);

    return true;
  }
}
