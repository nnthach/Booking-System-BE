import {
  BooleanRequired,
  NumberNotRequired,
  NumberRequired,
  StringNotRequired,
  StringRequired,
} from 'src/common/decorators/swagger.decorator';

export class CreateServiceDto {
  @StringRequired('Name')
  name: string;

  @NumberRequired('Price')
  price: number;

  @StringNotRequired('Description')
  description: string;

  @NumberNotRequired('Duration')
  duration: number;

  @BooleanRequired('Status')
  status: boolean;
}
