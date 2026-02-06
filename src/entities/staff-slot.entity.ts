import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { StaffSlotStatus } from 'src/enums/staffSlot.enum';
import { TimeSlot } from './time-slot.entity';
import { Booking } from './booking.entity';

@Entity('staff-slots')
export class StaffSlot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  staffId!: number;

  @ManyToOne(() => Staff, (staff) => staff.staffSlot)
  @JoinColumn({ name: 'staffId' })
  staff!: Staff;

  @Column()
  timeSlotId!: number;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.staffSlot)
  @JoinColumn({ name: 'timeSlotId' })
  timeSlot!: TimeSlot;

  @Column({ type: 'date' })
  slotDate!: Date;

  @Column({
    type: 'enum',
    enum: StaffSlotStatus,
    default: StaffSlotStatus.AVAILABLE,
  })
  status!: StaffSlotStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.staffSlot)
  bookingsStaff!: Booking[];
}
