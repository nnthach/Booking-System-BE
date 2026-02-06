import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { Booking } from './booking.entity';

@Entity('booking-services')
export class BookingService {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Service, (service) => service.bookingServices)
  @JoinColumn({ name: 'serviceId' })
  service!: Service;

  @ManyToOne(() => Booking, (booking) => booking.bookingServices)
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column()
  price!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
