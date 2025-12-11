import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { User } from 'src/entities/user.entity';
import { WorkingSchedule } from 'src/entities/work-schedule.entity';
import { StaffSlot } from 'src/entities/staff-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, StaffSlot, User, WorkingSchedule])],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
