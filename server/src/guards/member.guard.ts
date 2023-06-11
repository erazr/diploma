import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { Guild } from 'src/models/guild.model';

/**
 * Check if the current user is authenticated
 * using the sessionID and member of the guild
 */
@Injectable()
export class MemberGuard implements CanActivate {
  constructor(@InjectModel('Guild') private guildModel: typeof Guild) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: e.Request = context.switchToHttp().getRequest();
    if (!request?.session['userId']) return false;

    const { guildId } = request.params;
    const member = await this.guildModel.findOne({
      _id: guildId,
      members: request.session['userId'],
    });
    return !!member;
  }
}
