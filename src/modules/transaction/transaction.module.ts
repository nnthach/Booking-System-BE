import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { BookingModule } from '../booking/booking.module';
import { HttpModule } from '@nestjs/axios';
import { PayOsGateway } from 'src/gateways/qr.gateway';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BookingModule,
    HttpModule,
    MailModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, PayOsGateway],
})
export class TransactionModule {}
