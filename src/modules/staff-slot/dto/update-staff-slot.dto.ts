import { PartialType } from '@nestjs/swagger';
import { CreateStaffSlotDto } from './create-staff-slot.dto';

export class UpdateStaffSlotDto extends PartialType(CreateStaffSlotDto) {}
