import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayRequired,
  BooleanNotRequired,
  NumberNotRequired,
  NumberRequired,
  StringNotRequired,
  StringRequired,
} from 'src/common/decorators/swagger.decorator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Array of number of serviceId',
    example: [1, 2],
  })
  @ArrayRequired('serviceIds', Number, 1, 5)
  serviceIds: number[];

  @NumberNotRequired('staffId')
  staffId: number;

  @ApiProperty({
    description: 'YYYY-MM-DD format',
    example: '2025-12-15',
  })
  @StringRequired('date')
  date: string;

  @StringNotRequired('note')
  note: string;

  @NumberRequired('timeSlotId')
  timeSlotId: number;

  @BooleanNotRequired('skipStaff')
  skipStaff: boolean;
}
