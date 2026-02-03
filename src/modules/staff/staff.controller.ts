import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @ApiQuery({ name: 'storeId', required: true, type: Number, example: 1 })
  findAll(@Query('storeId') storeId: number) {
    return this.staffService.findAll(storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Get(':staffId/schedule')
  getStaffSchedule(@Param('staffId') staffId: string) {
    return this.staffService.getStaffSchedule(+staffId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
