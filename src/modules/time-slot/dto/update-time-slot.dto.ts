import { PartialType } from '@nestjs/swagger';
import { CreateTimeSlotDto } from './create-time-slot.dto';
import { StringNotRequired } from 'src/common/decorators/swagger.decorator';

export class UpdateTimeSlotDto extends PartialType(CreateTimeSlotDto) {
  @StringNotRequired('Start time')
  startTime?: string | undefined;
}
