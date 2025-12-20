import { Module } from '@nestjs/common';
import { StaffSlotService } from './staff-slot.service';
import { StaffSlotController } from './staff-slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffSlot } from 'src/entities/staff-slot.entity';
import { Booking } from 'src/entities/booking.entity';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Staff } from 'src/entities/staff.entity';
import { TimeSlotModule } from '../time-slot/time-slot.module';

@Module({
  imports: [TypeOrmModule.forFeature([StaffSlot, Booking, TimeSlot, Staff]), TimeSlotModule],
  controllers: [StaffSlotController],
  providers: [StaffSlotService],
  exports: [StaffSlotService],
})
export class StaffSlotModule {}
