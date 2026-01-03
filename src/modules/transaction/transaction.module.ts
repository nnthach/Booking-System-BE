import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { BookingModule } from '../booking/booking.module';
import { HttpModule } from '@nestjs/axios';
import { PayOsGateway } from 'src/gateways/qr.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), BookingModule, HttpModule],
  controllers: [TransactionController],
  providers: [TransactionService, PayOsGateway],
})
export class TransactionModule {}
