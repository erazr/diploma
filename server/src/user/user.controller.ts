import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { YupValidationPipe } from 'src/utils/yupValidationPipe';
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from 'src/validation/user.schema';
import {
  ForgotPasswordDto,
  LoginCredentialsDto,
  RegisterCredentialsDto,
  ResetPasswordDto,
  UpdateDto,
} from './userCredentials.dto';
import { Request, Response, Express } from 'express';
import { UserService } from './user.service';
import { UserSchema } from 'src/validation/user.schema';
import { GetUser } from 'src/config/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('account')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(
    @Body(new YupValidationPipe(RegisterSchema))
    credentials: RegisterCredentialsDto,
    @Req() req: Request,
  ) {
    return await this.userService.register(credentials, req);
  }

  @Post('/login')
  async login(
    @Body(new YupValidationPipe(LoginSchema)) credentials: LoginCredentialsDto,
    @Req() req: Request,
  ) {
    return await this.userService.login(credentials, req);
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session?.destroy((err) => console.log(err));
    return res.clearCookie('discord_test').status(200).send(true);
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body(new YupValidationPipe(ForgotPasswordSchema))
    { email }: ForgotPasswordDto,
  ) {
    return await this.userService.forgotPassword(email);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body(new YupValidationPipe(ResetPasswordSchema))
    credentials: ResetPasswordDto,
    @Req() req: Request,
  ) {
    return await this.userService.resetPassword(credentials, req);
  }

  @Get()
  async findCurrentUser(@GetUser() id: string) {
    return await this.userService.findCurrentUser(id);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: 'src/files',
      }),
    }),
  )
  async update(
    @GetUser() id: string,
    @Body(
      new YupValidationPipe(UserSchema),
      new ValidationPipe({ transform: true }),
    )
    data: UpdateDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return await this.userService.updateUser(id, data, avatar);
  }

  @Get('/avatar/:fileId')
  async getAvatar(@Param('fileId') fileId, @Res() res: Response) {
    res.sendFile(fileId, { root: 'src/files/avatars' });
  }

  @Get('/me/friends')
  async getFriends(@GetUser() id: string) {
    return await this.userService.getFriends(id);
  }

  @Get('/me/pending')
  async getFriendRequests(@GetUser() id: string) {
    return await this.userService.getFriendRequests(id);
  }

  @Post('/:memberId/friend')
  async sendFriendRequest(
    @Param('memberId') memberId: string,
    @GetUser() userId: string,
  ) {
    return await this.userService.sendFriendRequest(memberId, userId);
  }

  @Post('/:memberId/friend/accept')
  async acceptFriendRequest(
    @Param('memberId') memberId: string,
    @GetUser() userId: string,
  ) {
    return await this.userService.acceptFriendRequest(memberId, userId);
  }

  @Post('/:memberId/friend/cancel')
  async cancelFriendRequest(
    @Param('memberId') memberId: string,
    @GetUser() userId: string,
  ) {
    return await this.userService.cancelFriendRequest(memberId, userId);
  }

  @Delete('/:memberId/friend')
  async removeFriend(
    @Param('memberId') memberId: string,
    @GetUser() userId: string,
  ) {
    return await this.userService.removeFriend(memberId, userId);
  }
}
