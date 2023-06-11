import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GuildService } from './guild.service';
import { MemberGuard } from 'src/guards/member.guard';
import { GetUser } from 'src/config/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { YupValidationPipe } from 'src/utils/yupValidationPipe';
import { GuildSchema } from 'src/validation/guild.schema';
import { GuildDto } from './guild.dto';

@Controller('guilds')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get('/:guildId/members')
  @UseGuards(MemberGuard)
  async getGuildMembers(
    @Param('guildId') guildId: string,
    @GetUser() userId: string,
  ) {
    return await this.guildService.getGuildMembers(guildId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getGuilds(@GetUser() userId: string) {
    return await this.guildService.getUserGuilds(userId);
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: 'src/files/guildIcons',
        filename(req, file, callback) {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  async createGuild(
    @Body(new YupValidationPipe(GuildSchema)) guildDto: GuildDto,
    @GetUser() user: string,
    @UploadedFile() icon: Express.Multer.File,
  ) {
    guildDto.image = icon;
    return await this.guildService.createGuild(guildDto, user);
  }

  @Get('/:guildId/:icon')
  async getIcon(@Param('icon') icon, @Res() res: Response) {
    res.sendFile(icon, { root: 'src/files/guildIcons' });
  }
}
