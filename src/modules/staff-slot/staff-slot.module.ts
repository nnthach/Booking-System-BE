import { Module } from '@nestjs/common';
import { StaffSlotService } from './staff-slot.service';
import { StaffSlotController } from './staff-slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffSlot } from 'src/entities/staff-slot.entity';
import { Booking } from 'src/entities/booking.entity';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Staff } from 'src/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffSlot, Booking, TimeSlot, Staff])],
  controllers: [StaffSlotController],
  providers: [StaffSlotService],
})
export class StaffSlotModule {}
