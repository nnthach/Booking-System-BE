import {
  NumberRequired,
  StringRequired,
} from 'src/common/decorators/swagger.decorator';

export class CreateStaffSlotDto {
  @NumberRequired('staffId')
  staffId: number;

  @NumberRequired('timeSlotId')
  timeSlotId: number;

  @StringRequired('slotDate')
  slotDate: string;
}
