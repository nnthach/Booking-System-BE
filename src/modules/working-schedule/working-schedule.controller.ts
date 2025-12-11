import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkingScheduleService } from './working-schedule.service';
import { CreateWorkingScheduleDto } from './dto/create-working-schedule.dto';
import { UpdateWorkingScheduleDto } from './dto/update-working-schedule.dto';

@Controller('working-schedule')
export class WorkingScheduleController {
  constructor(private readonly workingScheduleService: WorkingScheduleService) {}

  @Post()
  create(@Body() createWorkingScheduleDto: CreateWorkingScheduleDto) {
    return this.workingScheduleService.create(createWorkingScheduleDto);
  }

  @Get()
  findAll() {
    return this.workingScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workingScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkingScheduleDto: UpdateWorkingScheduleDto) {
    return this.workingScheduleService.update(+id, updateWorkingScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workingScheduleService.remove(+id);
  }
}
