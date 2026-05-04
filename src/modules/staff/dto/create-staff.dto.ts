import {
  NumberRequired,
  StringRequired,
} from 'src/common/decorators/swagger.decorator';

export class CreateStaffDto {
  @StringRequired('fullName')
  fullName!: string;

  @StringRequired('email')
  email!: string;

  @StringRequired('avatar')
  avatar!: string;

  @StringRequired('phoneNumber')
  phoneNumber!: string;

  @NumberRequired('store')
  storeId!: number;
}
