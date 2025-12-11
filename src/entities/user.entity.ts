import { UserStatus } from 'src/enums/user.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { Booking } from './booking.entity';
import { Staff } from './staff.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiration: Date;

  @Column()
  roleId: number;

  @ManyToOne(() => Role) // muốn đi đến bảng nào
  @JoinColumn({ name: 'roleId' }) // cầm cái FK trỏ đến bảng đó
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ nullable: true, type: 'varchar' })
  emailVerificationToken: string | null;

  @Column({ nullable: true, type: 'datetime' })
  emailVerificationExpire: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookingsUser: Booking[]; // cánh cửa nhìn từ User qua Bookings

  @OneToOne(() => Staff, (staff) => staff.user)
  staff: Staff;
}
