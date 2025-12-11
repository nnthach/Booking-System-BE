
import {
  BooleanNotRequired,
  NumberNotRequired,
  StringNotRequired,
} from 'src/common/decorators/swagger.decorator';

export class UpdateServiceDto {
  @StringNotRequired('Name')
  name?: string;

  @NumberNotRequired('Price')
  price?: number;

  @StringNotRequired('Description')
  description?: string;

  @NumberNotRequired('Duration')
  duration?: number;

  @BooleanNotRequired('Status')
  status?: boolean;
}
