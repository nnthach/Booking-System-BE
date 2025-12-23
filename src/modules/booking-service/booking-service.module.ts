import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from 'src/entities/booking-service.entity';
import { BookingServiceService } from './booking-service.service';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookingService]), ServiceModule],
  controllers: [],
  providers: [BookingServiceService],
  exports: [BookingServiceService],
})
export class BookingServiceModule {}
