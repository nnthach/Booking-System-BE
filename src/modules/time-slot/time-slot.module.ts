import { Module } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { TimeSlotController } from './time-slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { StaffSlot } from 'src/entities/staff-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot, StaffSlot])],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
})
export class TimeSlotModule {}
