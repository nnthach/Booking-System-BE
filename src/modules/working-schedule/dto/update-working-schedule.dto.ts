import { PartialType } from '@nestjs/swagger';
import { CreateWorkingScheduleDto } from './create-working-schedule.dto';

export class UpdateWorkingScheduleDto extends PartialType(CreateWorkingScheduleDto) {}
