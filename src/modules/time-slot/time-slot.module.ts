import { Module } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { TimeSlotController } from './time-slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { StaffSlot } from 'src/entities/staff-slot.entity';
import { WorkingScheduleModule } from '../working-schedule/working-schedule.module';
import { StaffWorkCalendarModule } from '../staff-work-calendar/staff-work-calendar.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeSlot, StaffSlot]),
    WorkingScheduleModule,
    StaffWorkCalendarModule,
    StaffModule,
  ],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
