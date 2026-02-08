import { NumberRequired } from 'src/common/decorators/swagger.decorator';

export class CreateTransactionDto {
  @NumberRequired('bookingId')
  bookingId!: number;
}
