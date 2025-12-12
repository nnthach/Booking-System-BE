import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import {
  ArrayRequired,
  NumberRequired,
} from 'src/common/decorators/swagger.decorator';

export class CreateStaffWorkCalendarDto {
  @NumberRequired('Staff ID')
  staffId: number;

  @ApiProperty({
    description: 'Array of dates to register for, in YYYY-MM-DD format',
    example: ['2025-12-15', '2025-12-16'],
  })
  @ArrayRequired('Work Date', String, 1, 7)
  @IsDateString({}, { each: true })
  @IsNotEmpty()
  workDates: string[];
}
