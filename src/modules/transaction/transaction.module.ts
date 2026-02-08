import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { BookingModule } from '../booking/booking.module';
import { HttpModule } from '@nestjs/axios';
import { PayOsGateway } from 'src/gateways/qr.gateway';
import { BullModule } from '@nestjs/bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';
import { TransactionConsumer } from './transaction.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => BookingModule),
    HttpModule,
    BullModule.registerQueue(
      {
        name: QueueNameEnum.CANCELLED_BOOKING,
      },
      {
        name: QueueNameEnum.EMAIL,
      },
    ),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, PayOsGateway, TransactionConsumer],
  exports: [TransactionService],
})
export class TransactionModule {}
