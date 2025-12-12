import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { typeormConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { SeedModule } from './modules/seed/seed.module';
import { MailModule } from './modules/mail/mail.module';
import { BookingServiceModule } from './modules/booking-service/booking-service.module';
import { BookingModule } from './modules/booking/booking.module';
import { ServiceModule } from './modules/service/service.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { StaffModule } from './modules/staff/staff.module';
import { StaffSlotModule } from './modules/staff-slot/staff-slot.module';
import { TimeSlotModule } from './modules/time-slot/time-slot.module';
import { WorkingScheduleModule } from './modules/working-schedule/working-schedule.module';
import { StaffWorkCalendarModule } from './modules/staff-work-calendar/staff-work-calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeormConfig),
    SeedModule,
    AuthModule,
    UserModule,
    MailModule,
    BookingModule,
    ServiceModule,
    TransactionModule,
    BookingServiceModule,
    StaffModule,
    StaffSlotModule,
    TimeSlotModule,
    WorkingScheduleModule,
    StaffWorkCalendarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
