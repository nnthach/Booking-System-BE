import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StaffWorkCalendar } from './staff-work-calendar.entity';
import { WorkScheduleStatus } from 'src/enums/workSchedule';

@Entity('working-schedule')
export class WorkingSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  dayOfWeek: number;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({
    type: 'enum',
    enum: WorkScheduleStatus,
    default: WorkScheduleStatus.AVAILABLE,
  })
  status: WorkScheduleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => StaffWorkCalendar,
    (staffWorkCalendar) => staffWorkCalendar.workSchedule,
  )
  staffWorkCalendar: StaffWorkCalendar[];
}
