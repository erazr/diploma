import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { GetUser } from 'src/config/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { MemberGuard } from 'src/guards/member.guard';
import { YupValidationPipe } from 'src/utils/yupValidationPipe';
import { ChannelSchema } from 'src/validation/channel.schema';
import { ChannelDto } from './channel.dto';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('/:guildId')
  @UseGuards(MemberGuard)
  async getGuildChannels(
    @Param('guildId') guildId: string,
    @GetUser() userId: string,
  ) {
    return this.channelService.getGuildChannels(guildId, userId);
  }

  @Post('/:guildId')
  @UseGuards(MemberGuard)
  async createChannel(
    @GetUser() userId: string,
    @Param('guildId') guildId: string,
    @Body(
      new YupValidationPipe(ChannelSchema),
      new ValidationPipe({ transform: true }),
    )
    channelDto: ChannelDto,
  ): Promise<boolean> {
    return this.channelService.createChannel(guildId, userId, channelDto);
  }

  @Post('/:memberId/dm')
  @UseGuards(AuthGuard)
  async getOrCreateChannel(
    @GetUser() userId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.channelService.getOrCreateChannel(memberId, userId);
  }

  @Put('/:guildId/:channelId')
  @UseGuards(AuthGuard)
  async editChannel(
    @GetUser() user: string,
    @Param('channelId') channelId: string,
    @Body(
      new YupValidationPipe(ChannelSchema),
      new ValidationPipe({ transform: true }),
    )
    channelDto: ChannelDto,
  ) {
    return this.channelService.editChannel(user, channelId, channelDto);
  }

  @Get('/me/dm')
  @UseGuards(AuthGuard)
  async getDirectMessageChannels(@GetUser() userId: string) {
    return await this.channelService.getDirectMessageChannels(userId);
  }

  @Delete('/:channelId/dm')
  @UseGuards(AuthGuard)
  async closeDirectMessage(
    @GetUser() userId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.setDirectMessageStatus(channelId, userId, false);
  }

  @Delete('/:guildId/:channelId')
  @UseGuards(MemberGuard)
  async deleteChannel(
    @GetUser() userId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.deleteChannel(userId, channelId);
  }
}
