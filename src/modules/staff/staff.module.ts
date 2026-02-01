import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { User } from 'src/entities/user.entity';
import { WorkingSchedule } from 'src/entities/work-schedule.entity';
import { StaffSlot } from 'src/entities/staff-slot.entity';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';
import { Store } from 'src/entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      StaffSlot,
      User,
      WorkingSchedule,
      StaffWorkCalendar,
      Store,
    ]),
    UserModule,
    MailModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
