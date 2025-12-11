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

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.transaction)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  totalPrice: number;

  @Column()
  paymentMethod: string;

  @Column()
  paymentUrl: string;

  @Column({
    type: 'enum',
    enum: TransactionEnum,
    default: TransactionEnum.PENDING,
  })
  status: TransactionEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
