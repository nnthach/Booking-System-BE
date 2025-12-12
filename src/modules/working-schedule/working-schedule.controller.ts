import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkingScheduleService } from './working-schedule.service';
import { CreateWorkingScheduleDto } from './dto/create-working-schedule.dto';
import { UpdateWorkingScheduleDto } from './dto/update-working-schedule.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Working Schedule / Mon-Fri: 1-5, Sat-Sun: 6-0')
@Controller('working-schedule')
export class WorkingScheduleController {
  constructor(
    private readonly workingScheduleService: WorkingScheduleService,
  ) {}

  @ApiOperation({
    summary: 'Create day of week',
    description: 'Status: AVAILABLE | OFF | LACK_OF_STAFF',
  })
  @Post()
  create(@Body() createWorkingScheduleDto: CreateWorkingScheduleDto) {
    return this.workingScheduleService.create(createWorkingScheduleDto);
  }

  @Get()
  findAll() {
    return this.workingScheduleService.findAll();
  }

  @ApiOperation({
    summary: 'Find by day of week',
    description: 'Mon-Fri: 1-5, Sat-Sun: 6-0',
  })
  @Get(':dayOfWeek')
  findOne(@Param('dayOfWeek') dayOfWeek: string) {
    return this.workingScheduleService.findOne(+dayOfWeek);
  }

  @ApiOperation({
    summary: 'Update day of week',
    description: 'Status: AVAILABLE | OFF | LACK_OF_STAFF',
  })
  @Patch(':dayOfWeek')
  update(
    @Param('dayOfWeek') dayOfWeek: string,
    @Body() updateWorkingScheduleDto: UpdateWorkingScheduleDto,
  ) {
    return this.workingScheduleService.update(
      +dayOfWeek,
      updateWorkingScheduleDto,
    );
  }

  @ApiOperation({ summary: 'Delete by day of week' })
  @Delete(':dayOfWeek')
  remove(@Param('dayOfWeek') dayOfWeek: string) {
    return this.workingScheduleService.remove(+dayOfWeek);
  }
}
