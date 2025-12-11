import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffSlotService } from './staff-slot.service';
import { CreateStaffSlotDto } from './dto/create-staff-slot.dto';
import { UpdateStaffSlotDto } from './dto/update-staff-slot.dto';

@Controller('staff-slot')
export class StaffSlotController {
  constructor(private readonly staffSlotService: StaffSlotService) {}

  @Post()
  create(@Body() createStaffSlotDto: CreateStaffSlotDto) {
    return this.staffSlotService.create(createStaffSlotDto);
  }

  @Get()
  findAll() {
    return this.staffSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffSlotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffSlotDto: UpdateStaffSlotDto) {
    return this.staffSlotService.update(+id, updateStaffSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffSlotService.remove(+id);
  }
}
