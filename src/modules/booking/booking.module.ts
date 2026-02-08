import { forwardRef, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { StaffSlotModule } from '../staff-slot/staff-slot.module';
import { StaffWorkCalendarModule } from '../staff-work-calendar/staff-work-calendar.module';
import { TimeSlotModule } from '../time-slot/time-slot.module';
import { BookingServiceModule } from '../booking-service/booking-service.module';
import { Store } from 'src/entities/store.entity';
import { StaffModule } from '../staff/staff.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Transaction, Store]),
    StaffSlotModule,
    StaffWorkCalendarModule,
    TimeSlotModule,
    BookingServiceModule,
    StaffModule,
    forwardRef(() => TransactionModule),
    BullModule.registerQueue({
      name: QueueNameEnum.CANCELLED_BOOKING,
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
