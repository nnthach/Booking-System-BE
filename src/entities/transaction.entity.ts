import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { TransactionEnum } from 'src/enums/transaction.enum';
import { PaymentMethodEnum } from 'src/enums/payment-method.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bookingId: number;

  @OneToOne(() => Booking, (booking) => booking.transaction)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
  })
  paymentMethod: PaymentMethodEnum;

  @Column({ nullable: true })
  paymentUrl: string;

  @Column({
    type: 'enum',
    enum: TransactionEnum,
    default: TransactionEnum.PENDING,
  })
  status: TransactionEnum;

  @Column({ nullable: true })
  orderCode: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
