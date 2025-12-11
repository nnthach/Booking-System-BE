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
import { WorkingSchedule } from './work-schedule.entity';
import { StaffSlot } from './staff-slot.entity';

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

  @OneToMany(() => WorkingSchedule, (workingSchedule) => workingSchedule.staff)
  workingSchedule: WorkingSchedule[];

  @OneToMany(() => StaffSlot, (staffSlot) => staffSlot.staff)
  staffSlot: StaffSlot[];
}
