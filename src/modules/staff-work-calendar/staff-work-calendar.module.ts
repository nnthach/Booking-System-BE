import { Module } from '@nestjs/common';
import { StaffWorkCalendarService } from './staff-work-calendar.service';
import { StaffWorkCalendarController } from './staff-work-calendar.controller';
import { WorkingSchedule } from 'src/entities/work-schedule.entity';
import { Staff } from 'src/entities/staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from '../staff/staff.module';
import { WorkingScheduleModule } from '../working-schedule/working-schedule.module';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, WorkingSchedule, StaffWorkCalendar]),
    StaffModule,
    WorkingScheduleModule,
  ],
  controllers: [StaffWorkCalendarController],
  providers: [StaffWorkCalendarService],
  exports: [StaffWorkCalendarService],
})
export class StaffWorkCalendarModule {}
