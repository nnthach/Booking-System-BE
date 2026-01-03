import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BookingStatus } from 'src/enums/booking.enum';
import { BookingService } from './booking-service.entity';
import { Transaction } from './transaction.entity';
import { StaffSlot } from './staff-slot.entity';
import { BookingPaymentTypeEnum } from 'src/enums/booking-payment-type.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @ManyToOne(() => User, (user) => user.bookingsUser) // xác định bảng muốn trỏ tới
  @JoinColumn({ name: 'customerId' }) // lấy khóa ngoại trỏ đến User
  customer: User; // 1 ROW trong bảng users được ánh xạ thành object trong Booking

  @Column()
  staffSlotId: number;

  @ManyToOne(() => StaffSlot, (staffSlot) => staffSlot.bookingsStaff)
  @JoinColumn({ name: 'staffSlotId' })
  staffSlot: StaffSlot;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRM_BOOKING,
  })
  status: BookingStatus;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({
    type: 'enum',
    enum: BookingPaymentTypeEnum,
  })
  paymentType: BookingPaymentTypeEnum;

  @Column({ type: 'date', nullable: true })
  bookingDate: Date;

  @Column({ nullable: true })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookingService, (bookingService) => bookingService.booking)
  bookingServices: BookingService[];

  @OneToOne(() => Transaction, (transaction) => transaction.booking)
  transaction: Transaction;
}
