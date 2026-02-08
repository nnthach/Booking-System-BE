import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { User } from 'src/entities/user.entity';
import { WorkingSchedule } from 'src/entities/work-schedule.entity';
import { StaffSlot } from 'src/entities/staff-slot.entity';
import { UserModule } from '../user/user.module';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';
import { Store } from 'src/entities/store.entity';
import { BullModule } from '@nestjs/bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';

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
    BullModule.registerQueue({
      name: QueueNameEnum.EMAIL,
    }),
    UserModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
