import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StaffWorkCalendarService } from './staff-work-calendar.service';
import { CreateStaffWorkCalendarDto } from './dto/create-staff-work-calendar.dto';
import { UpdateStaffWorkCalendarDto } from './dto/update-staff-work-calendar.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { JwtUser } from '../auth/dto/login-auth.dto';

@ApiTags('Staff register schedule')
@Controller('staff-work-calendar')
export class StaffWorkCalendarController {
  constructor(
    private readonly staffWorkCalendarService: StaffWorkCalendarService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: Request & { user: JwtUser },
    @Body() createStaffWorkCalendarDto: CreateStaffWorkCalendarDto,
  ) {
    return this.staffWorkCalendarService.create(
      createStaffWorkCalendarDto,
      req.user,
    );
  }

  @Get()
  findAll() {
    return this.staffWorkCalendarService.findAll();
  }

  @Get('by-staff-and-date')
  @ApiQuery({ name: 'staffId', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'date', required: true, type: String })
  findByStaffAndDate(
    @Query('staffId') staffId: number,
    @Query('date') date: string,
  ) {
    return this.staffWorkCalendarService.findByStaffAndDate(staffId, date);
  }

  @ApiOperation({
    summary: 'Get Schedule Registered',
    description: 'Get 2 weeks working week and next week',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/register-schedule')
  @ApiQuery({
    name: 'workDateFrom',
    required: true,
    type: String,
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'workDateTo',
    required: true,
    type: String,
    example: '2025-01-13',
  })
  findStaffScheduleRegistered(
    @Request() req: Request & { user: JwtUser },
    @Query('workDateTo') workDateTo: string,
    @Query('workDateFrom') workDateFrom: string,
  ) {
    return this.staffWorkCalendarService.findStaffScheduleRegistered(
      req.user,
      workDateFrom,
      workDateTo,
    );
  }

  @Get(':staffId')
  findByStaff(@Param('staffId') staffId: number) {
    return this.staffWorkCalendarService.findByStaff(+staffId);
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
