import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingService } from './booking-service.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({ default: true })
  status!: boolean;

  @Column({ nullable: true })
  duration!: number;

  @Column()
  price!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @OneToMany(() => BookingService, (bookingService) => bookingService.service)
  bookingServices!: BookingService[];
}
