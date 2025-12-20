import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { StaffSlot } from './staff-slot.entity';
import { StaffWorkCalendar } from './staff-work-calendar.entity';

@Entity('staffs')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.staff)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  specialty: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, default: 0 })
  rating: number;

  @Column({ nullable: true, default: 0 })
  totalBookings: number;

  @Column({ nullable: true, default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => StaffWorkCalendar,
    (staffWorkCalendar) => staffWorkCalendar.staff,
  )
  staffWorkCalendar: StaffWorkCalendar[];

  @OneToMany(() => StaffSlot, (staffSlot) => staffSlot.staff)
  staffSlot: StaffSlot[];
}
