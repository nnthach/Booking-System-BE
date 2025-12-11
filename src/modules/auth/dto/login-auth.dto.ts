import { IsEmail } from 'class-validator';
import { StringRequired } from 'src/common/decorators/swagger.decorator';

export class LoginAuthDto {
  @StringRequired('Password')
  password: string;

  @StringRequired('Email')
  @IsEmail({}, { message: 'Email not correct' })
  email: string;
}

export interface JwtUser {
  id: number;
  email: string;
}
