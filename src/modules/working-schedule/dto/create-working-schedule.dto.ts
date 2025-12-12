import {
  EnumRequired,
  NumberRequired,
  StringRequired,
} from 'src/common/decorators/swagger.decorator';
import { WorkScheduleStatus } from 'src/enums/workSchedule';

export class CreateWorkingScheduleDto {
  @NumberRequired('Day of week')
  dayOfWeek: number;

  @StringRequired('Start Time')
  startTime: string;

  @StringRequired('End Time')
  endTime: string;

  @EnumRequired('Status', WorkScheduleStatus)
  status: WorkScheduleStatus;
}
