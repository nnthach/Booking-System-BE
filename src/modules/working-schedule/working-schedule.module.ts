import { Module } from '@nestjs/common';
import { WorkingScheduleService } from './working-schedule.service';
import { WorkingScheduleController } from './working-schedule.controller';

@Module({
  controllers: [WorkingScheduleController],
  providers: [WorkingScheduleService],
})
export class WorkingScheduleModule {}
