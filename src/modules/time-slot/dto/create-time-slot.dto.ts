import { StringRequired } from 'src/common/decorators/swagger.decorator';

export class CreateTimeSlotDto {
  @StringRequired('Start Time')
  startTime: string;
}
