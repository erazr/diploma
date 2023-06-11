import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { MessageService } from './message.service';
import { GetUser } from 'src/config/user.decorator';
import { YupValidationPipe } from 'src/utils/yupValidationPipe';
import { MessageSchema } from 'src/validation/message.schema';
import { MessageDto } from './message.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { diskStorage } from 'multer';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:channelId')
  async getMessages(
    @Param('channelId') channelId: string,
    @GetUser() userId: string,
    @Query('cursor') cursor?: string | null,
    @Query('around') around?: string | null,
    @Query('after') after?: string | null,
  ) {
    return this.messageService.getMessages(
      channelId,
      userId,
      cursor,
      around,
      after,
    );
  }

  @Post('/:channelId')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: 'src/files',
        filename(req, file, callback) {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  async createMessage(
    @GetUser() userId: string,
    @Param('channelId') channelId: string,
    @Body(new YupValidationPipe(MessageSchema)) messageDto: MessageDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.messageService.createMessage(
      channelId,
      userId,
      messageDto,
      files,
    );
  }

  @Put('/:messageId')
  async editMessage(
    @GetUser() user: string,
    @Param('messageId') messageId: string,
    @Body(new YupValidationPipe(MessageSchema)) messageDto: MessageDto,
  ) {
    return this.messageService.editMessage(user, messageId, messageDto.content);
  }

  @Delete('/:messageId')
  async deleteMessage(
    @GetUser() userId: string,
    @Param('messageId') messageId: string,
  ): Promise<boolean> {
    return this.messageService.deleteMessage(userId, messageId);
  }

  @Get()
  async notification(@Res() res: Response) {
    return res.sendFile('deduction-588.mp3', { root: 'src/files/' });
  }

  @Get('/:channelId/:fileId')
  async getFile(@Param('fileId') fileId, @Res() res: Response) {
    return res.sendFile(fileId, { root: 'src/files/' });
  }
}
