import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';
import { BookingService } from '../booking/booking.service';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionEnum } from 'src/enums/transaction.enum';

interface BookingPaymentTimeoutJob {
  transactionId: number;
}

@Processor(QueueNameEnum.CANCELLED_BOOKING)
export class TransactionConsumer extends WorkerHost {
  constructor(
    private readonly bookingService: BookingService,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {
    super();
  }

  async process(job: Job) {
    const { transactionId } = job.data as BookingPaymentTimeoutJob;

    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
    });

    if (!transaction || transaction.status !== TransactionEnum.PENDING) return;

    // 1. update transaction
    await this.transactionRepo.update(transactionId, {
      status: TransactionEnum.CANCELED,
    });

    // 2. gọi Booking service
    await this.bookingService.cancelBooking(transaction.bookingId);
  }
}
