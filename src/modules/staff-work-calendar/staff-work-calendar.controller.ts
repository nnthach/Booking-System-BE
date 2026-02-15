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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '../auth/dto/login-auth.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/enums/role.enum';

@ApiTags('Staff working schedule')
@Controller('staff-work-calendar')
export class StaffWorkCalendarController {
  constructor(
    private readonly staffWorkCalendarService: StaffWorkCalendarService,
  ) {}

  @ApiOperation({
    summary: 'Staff register schedule',
    description: 'Staff only',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
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

  @Get('by-staff/:staffId')
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    example: '2026-02-02',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    example: '2026-02-02',
  })
  findStaffWorkingSchedule(
    @Param('staffId') staffId: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.staffWorkCalendarService.findStaffWorkingSchedule(
      staffId,
      fromDate,
      toDate
    );
  }

  @Get('of-each-store/:storeId')
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    example: '2026-02-02',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    example: '2026-02-02',
  })
  findStoreWorkingSchedule(
    @Param('storeId') storeId: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.staffWorkCalendarService.findStoreWorkingSchedule(
      storeId,
      fromDate,
      toDate,
    );
  }

  @Get('by-staff-and-date')
  @ApiQuery({ name: 'staffId', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'storeId', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'date', required: true, type: String })
  findByStaffAndDate(
    @Query('staffId') staffId: number,
    @Query('storeId') storeId: number,
    @Query('date') date: string,
  ) {
    return this.staffWorkCalendarService.findByStaffAndDate(
      staffId,
      date,
      storeId,
    );
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
