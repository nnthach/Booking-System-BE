import { PartialType } from '@nestjs/swagger';
import { CreateStaffWorkCalendarDto } from './create-staff-work-calendar.dto';

export class UpdateStaffWorkCalendarDto extends PartialType(CreateStaffWorkCalendarDto) {}
