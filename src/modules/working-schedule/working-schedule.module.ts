import { Module } from '@nestjs/common';
import { WorkingScheduleService } from './working-schedule.service';
import { WorkingScheduleController } from './working-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';
import { WorkingSchedule } from 'src/entities/work-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, StaffWorkCalendar, WorkingSchedule]),
  ],
  controllers: [WorkingScheduleController],
  providers: [WorkingScheduleService],
  exports: [WorkingScheduleService],
})
export class WorkingScheduleModule {}
