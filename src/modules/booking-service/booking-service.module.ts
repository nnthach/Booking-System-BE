import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from 'src/entities/booking-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingService])],
  controllers: [],
  providers: [],
})
export class BookingServiceModule {}
