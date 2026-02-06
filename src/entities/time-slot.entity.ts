import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StaffSlot } from './staff-slot.entity';

@Entity('time-slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'time', nullable: true })
  startTime!: string;

  @Column({ type: 'time', nullable: true })
  endTime!: string;

  @Column({ nullable: true, default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => StaffSlot, (staffSlot) => staffSlot.timeSlot)
  staffSlot!: StaffSlot[];
}
