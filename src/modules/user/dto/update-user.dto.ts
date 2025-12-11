import { StringNotRequired } from 'src/common/decorators/swagger.decorator';

export class UpdateUserDto {
  @StringNotRequired('Fullname')
  fullName: string;

  @StringNotRequired('Password')
  password: string;
}
