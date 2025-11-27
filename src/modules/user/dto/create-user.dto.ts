import { IsEmail } from 'class-validator';
import { StringRequired } from 'src/common/decorators/swagger.decorator';

export class CreateUserDto {
  @StringRequired('Password', 6)
  password: string;

  @StringRequired('Email')
  @IsEmail({}, { message: 'Email not correct' })
  email: string;
}
