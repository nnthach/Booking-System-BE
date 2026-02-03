import { StoreStatus } from 'src/enums/store.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Staff } from './staff.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;
  @Column()
  address: string;

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: StoreStatus,
    default: StoreStatus.OPEN,
  })
  status: StoreStatus;

  @OneToMany(() => Booking, (booking) => booking.store)
  bookings: Booking[];

  @OneToMany(() => Staff, (staff) => staff.store)
  staffs: Staff[];
}
