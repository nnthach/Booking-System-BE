import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffWorkCalendarService } from './staff-work-calendar.service';
import { CreateStaffWorkCalendarDto } from './dto/create-staff-work-calendar.dto';
import { UpdateStaffWorkCalendarDto } from './dto/update-staff-work-calendar.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Staff register schedule')
@Controller('staff-work-calendar')
export class StaffWorkCalendarController {
  constructor(
    private readonly staffWorkCalendarService: StaffWorkCalendarService,
  ) {}

  @Post()
  create(@Body() createStaffWorkCalendarDto: CreateStaffWorkCalendarDto) {
    return this.staffWorkCalendarService.create(createStaffWorkCalendarDto);
  }

  @Get()
  findAll() {
    return this.staffWorkCalendarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffWorkCalendarService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffWorkCalendarDto: UpdateStaffWorkCalendarDto,
  ) {
    return this.staffWorkCalendarService.update(
      +id,
      updateStaffWorkCalendarDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffWorkCalendarService.remove(+id);
  }
}
