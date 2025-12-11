import { Injectable } from '@nestjs/common';
import { CreateStaffSlotDto } from './dto/create-staff-slot.dto';
import { UpdateStaffSlotDto } from './dto/update-staff-slot.dto';

@Injectable()
export class StaffSlotService {
  create(createStaffSlotDto: CreateStaffSlotDto) {
    return 'This action adds a new staffSlot';
  }

  findAll() {
    return `This action returns all staffSlot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staffSlot`;
  }

  update(id: number, updateStaffSlotDto: UpdateStaffSlotDto) {
    return `This action updates a #${id} staffSlot`;
  }

  remove(id: number) {
    return `This action removes a #${id} staffSlot`;
  }
}
