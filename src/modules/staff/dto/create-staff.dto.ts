import {
  StringRequired,
} from 'src/common/decorators/swagger.decorator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateStaffDto extends CreateUserDto {
  @StringRequired('fullName')
  fullName: string;
}
