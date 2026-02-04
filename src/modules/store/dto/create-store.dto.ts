import { StringRequired } from 'src/common/decorators/swagger.decorator';

export class CreateStoreDto {
  @StringRequired('address')
  address: string;

  @StringRequired('image')
  image: string;

  @StringRequired('name')
  name: string;
}
