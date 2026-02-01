import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StaffWorkCalendar])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
