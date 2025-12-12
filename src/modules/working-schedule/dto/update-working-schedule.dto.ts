import {
  EnumNotRequired,
  StringNotRequired,
} from 'src/common/decorators/swagger.decorator';
import { WorkScheduleStatus } from 'src/enums/workSchedule';

export class UpdateWorkingScheduleDto {
  @StringNotRequired('Start Time')
  startTime: string;

  @StringNotRequired('End Time')
  endTime: string;

  @EnumNotRequired('Status', WorkScheduleStatus)
  status: WorkScheduleStatus;
}
