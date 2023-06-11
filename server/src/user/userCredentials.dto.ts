export class RegisterCredentialsDto {
  username!: string;

  email!: string;

  password!: string;
}

export class LoginCredentialsDto {
  email!: string;

  password!: string;
}

export class ForgotPasswordDto {
  email!: string;
}

export class ResetPasswordDto {
  token!: string;

  newPassword!: string;

  confirmNewPassword!: string;
}

export class UpdateDto {
  email!: string;

  username!: string;

  avatar?: string;
}
