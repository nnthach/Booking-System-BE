import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { StaffSlotService } from '../staff-slot/staff-slot.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { DataSource, EntityManager, Equal, In, Repository } from 'typeorm';
import { JwtUser } from '../auth/dto/login-auth.dto';
import { BookingStatus } from 'src/enums/booking.enum';
import { StaffWorkCalendarService } from '../staff-work-calendar/staff-work-calendar.service';
import { StaffSlot } from 'src/entities/staff-slot.entity';
import { StaffSlotStatus } from 'src/enums/staffSlot.enum';
import { TimeSlotService } from '../time-slot/time-slot.service';
import { Service } from 'src/entities/service.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private readonly staffSlotService: StaffSlotService,
    private readonly timeSlotService: TimeSlotService,
    private readonly staffWorkCalendar: StaffWorkCalendarService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: JwtUser) {
    return this.dataSource.transaction(async (manager) => {
      const { serviceIds, staffId, timeSlotId, date, skipStaff, note } =
        createBookingDto;

      if (!timeSlotId || timeSlotId === 0) {
        throw new BadRequestException('Please choose time slot');
      }

      if (!user) {
        throw new UnauthorizedException('Not found user');
      }

      if (!serviceIds?.length) {
        throw new BadRequestException('Please choose at least one service');
      }

      if (!date) {
        throw new BadRequestException('Please choose date');
      }

      // lấy timeSlotId
      const timeSlot = await this.timeSlotService.findOne(timeSlotId);

      // kiểm tra ngày giờ có quá hạn chưa
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const isToday = todayStr === date;
      const currentTime = today.toTimeString().slice(0, 8);

      if (!timeSlot) {
        throw new BadRequestException('Please select correct time slot');
      }

      // nếu ngày quá khứ
      if (todayStr > date) {
        throw new BadRequestException('Expired booking date');
      }

      // nếu quá thời gian
      if (isToday && currentTime >= timeSlot?.startTime) {
        throw new BadRequestException('Expired booking time');
      }

      // check totalPrice từ service
      const services = await manager.find(Service, {
        where: { id: In(serviceIds), status: true },
      });

      if (services.length !== serviceIds.length) {
        throw new BadRequestException('One or more services are invalid');
      }
      // totalPrice
      const totalPrice = services.reduce((acc, s) => acc + Number(s.price), 0);

      // main flow
      let finalStaffId = staffId;

      // skip staff
      if (skipStaff && staffId === 0) {
        // tìm random staff từ cái schedule nó đăng ký đi làm
        // đồng thời bỏ qua mấy thằng có trong TimeSlot luôn
        const staffWorkOnDate =
          await this.staffWorkCalendar.findStaffWorkOnDate(date, timeSlotId);
        console.log('staffWorkOnDate', staffWorkOnDate);

        if (!staffWorkOnDate) {
          throw new BadRequestException('No staff working on this date');
        }

        finalStaffId = staffWorkOnDate;
      }

      // 1. create staff slot
      const staffSlot = await this.findOrCreateStaffSlot(
        finalStaffId,
        date,
        timeSlotId,
        manager,
      );

      // 2. create booking
      const booking = manager.create(Booking, {
        customerId: user.id,
        staffSlotId: staffSlot.id,
        status: BookingStatus.PENDING,
        totalPrice,
        note,
      });

      return await manager.save(booking);
    });
  }

  private async findOrCreateStaffSlot(
    staffId: number,
    date: string,
    timeSlotId: number,
    manager: EntityManager,
  ): Promise<StaffSlot> {
    const slotDate = new Date(date);

    const existing = await manager.findOne(StaffSlot, {
      where: {
        staffId,
        slotDate: Equal(slotDate),
        timeSlotId,
      },
    });

    if (existing) {
      throw new BadRequestException('Staff is busy');
    }

    const slot = manager.create(StaffSlot, {
      staffId,
      slotDate: date,
      timeSlotId,
      status: StaffSlotStatus.BOOKED,
    });

    return manager.save(slot);
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
