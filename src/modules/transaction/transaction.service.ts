import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { BookingService } from '../booking/booking.service';
import { PayOsGateway } from 'src/gateways/qr.gateway';
import { PaymentMethodEnum } from 'src/enums/payment-method.enum';
import { TransactionEnum } from 'src/enums/transaction.enum';
import { BookingStatus } from 'src/enums/booking.enum';
import { BookingPaymentTypeEnum } from 'src/enums/booking-payment-type.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';
import { Queue } from 'bullmq';
import { EmailJobNameEnum } from 'src/enums/email-job-name.enum';
import { Webhook } from '@payos/node';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
    private readonly payosQrGateway: PayOsGateway,
    private readonly dataSource: DataSource,

    @InjectQueue(QueueNameEnum.CANCELLED_BOOKING)
    private cancelBookingQueue: Queue,
    @InjectQueue(QueueNameEnum.EMAIL)
    private emailQueue: Queue,
  ) {}

  async create(createTransactionDTO: CreateTransactionDto) {
    return this.dataSource.transaction(async (manager) => {
      const { bookingId } = createTransactionDTO;
      const existingTransaction = await manager.findOne(Transaction, {
        where: {
          booking: { id: bookingId },
          status: TransactionEnum.PENDING,
        },
      });
      if (existingTransaction) {
        return {
          transaction: existingTransaction,
          paymentUrl: existingTransaction.paymentUrl,
        };
      }
      const booking = await this.bookingService.findOne(bookingId, manager);
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      const transaction = manager.create(Transaction, {
        totalPrice: booking.totalPrice,
        paymentMethod: PaymentMethodEnum.QR,
        status: TransactionEnum.PENDING,
        booking: booking,
      });
      if (!transaction) {
        throw new InternalServerErrorException('Create transaction fail');
      }
      const saveTransaction = await manager.save(transaction);
      const expiredAt = Math.floor(Date.now() / 1000) + 15 * 60;
      const orderCode = saveTransaction.id;
      saveTransaction.orderCode = orderCode;
      await manager.save(saveTransaction);
      const payload = {
        orderCode,
        amount: booking?.totalPrice,
        description: 'Payment booking',
        returnUrl: 'http://localhost:3000/payment',
        cancelUrl: 'http://localhost:3000/payment',
        expiredAt,
      };
      const url = await this.payosQrGateway.createPaymentLink(payload);
      if (!url) {
        throw new InternalServerErrorException('Create payment link fail');
      }
      saveTransaction.paymentUrl = url.checkoutUrl;
      await manager.save(saveTransaction);

      const job = await this.cancelBookingQueue.add(
        'BOOKING_PAYMENT_TIMEOUT',
        { transactionId: transaction.id },
        {
          delay: 15 * 1000 * 60,
          removeOnComplete: {
            age: 3600,
          },
        },
      );

      console.log('cancel booking job', job);
      return {
        transaction: saveTransaction,
        paymentUrl: url.checkoutUrl,
      };
    });
  }

  async handleWebhookPayOS(webhookData: Webhook) {
    if (!webhookData) {
      throw new BadRequestException('Webhook data không hợp lệ');
    }
    const verifiedWebhook =
      await this.payosQrGateway.verifyPaymentWebhook(webhookData);
    if (!verifiedWebhook) {
      throw new BadRequestException('Invalid webhook signature');
    }
    const { orderCode, code } = verifiedWebhook;
    const transaction = await this.transactionRepository.findOne({
      where: { orderCode },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.status !== TransactionEnum.PENDING) {
      return { message: 'Transaction was completed before' };
    }
    // neu payment success => send email
    if (code === '00') {
      await this.transactionRepository.update(transaction.id, {
        status: TransactionEnum.COMPLETED,
      });

      const transactionDetail = await this.findOne(transaction.id);
      if (!transactionDetail) {
        throw new NotFoundException('Transaction not found');
      }

      await this.bookingService.updateBookingStatus(
        transaction.bookingId,
        BookingStatus.CONFIRMED_PAYMENT,
        BookingPaymentTypeEnum.ONLINE,
      );

      const bookingDetail = await this.bookingService.findOne(
        transactionDetail.bookingId,
      );

      if (!bookingDetail) {
        throw new NotFoundException('Booking not found');
      }
      // await this.mailService.sendEmailBookingSuccess(bookingDetail);
      await this.emailQueue.add(
        EmailJobNameEnum.SEND_EMAIL_BOOKING_SUCCESS,
        { bookingId: transactionDetail.bookingId },
        {
          delay: 2000,
          removeOnComplete: {
            age: 3600,
          },
        },
      );
    } else {
      await this.transactionRepository.update(transaction.id, {
        status: TransactionEnum.FAILED,
      });
    }
    return null;
  }

  async findOne(id: number) {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async checkPayment(orderCode: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { orderCode },
    });

    if (!transaction) {
      throw new NotFoundException('Not found transaction');
    }

    return {
      status: transaction.status,
      paymentUrl: transaction.paymentUrl,
    };
  }

  async findOneByOrderCode(orderCode: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { orderCode },
    });

    if (!transaction) {
      throw new NotFoundException('Not found transaction');
    }

    const { bookingId } = transaction;

    const bookingResult = await this.bookingService.findOne(bookingId);

    if (!bookingResult) {
      throw new NotFoundException('Not found booking');
    }

    return { transaction, booking: bookingResult };
  }
}
