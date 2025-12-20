import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post()
  create(@Body() createTimeSlotDto: CreateTimeSlotDto) {
    return this.timeSlotService.create(createTimeSlotDto);
  }

  @ApiOperation({
    summary: 'Get for booking',
    description: 'Get by staffId or not and booking date is require',
  })
  @Get()
  @ApiQuery({ name: 'staffId', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'date', required: true, type: String })
  findSlotByDateAndStaffId(
    @Query('staffId') staffId: number,
    @Query('date') date: string,
  ) {
    return this.timeSlotService.findSlotByDateAndStaffId(staffId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeSlotService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeSlotDto: UpdateTimeSlotDto,
  ) {
    return this.timeSlotService.update(+id, updateTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotService.remove(+id);
  }
}
