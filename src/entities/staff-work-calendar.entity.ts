import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { StaffWorkScheduleStatus } from 'src/enums/staffWorkSchedule.enum';
import { WorkingSchedule } from './work-schedule.entity';

@Entity('staff-work-calendar')
export class StaffWorkCalendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  staffId: number;

  @ManyToOne(() => Staff, (staff) => staff.staffWorkCalendar)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @Column()
  workScheduleID: number;

  @ManyToOne(
    () => WorkingSchedule,
    (workSchedule) => workSchedule.staffWorkCalendar,
  )
  @JoinColumn({ name: 'workScheduleID' })
  workSchedule: WorkingSchedule;

  @Column({ nullable: true })
  workDate: Date;

  @Column({ nullable: true })
  startTime: string;

  @Column({ nullable: true })
  endTime: string;

  @Column({
    type: 'enum',
    enum: StaffWorkScheduleStatus,
    default: StaffWorkScheduleStatus.NONE,
  })
  status: StaffWorkScheduleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
