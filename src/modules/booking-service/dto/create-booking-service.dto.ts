import {
  ArrayRequired,
  NumberRequired,
} from 'src/common/decorators/swagger.decorator';

export class CreateBookingServiceDto {
  @ArrayRequired('serviceIds', Number, 1, 5)
  serviceIds: number[];

  @NumberRequired('bookingId')
  bookingId: number;

  @NumberRequired('price')
  price: number;
}
