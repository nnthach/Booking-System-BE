import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
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
import { BookingServiceService } from '../booking-service/booking-service.service';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { BookingPaymentTypeEnum } from 'src/enums/booking-payment-type.enum';
import { Store } from 'src/entities/store.entity';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private readonly bookingServiceService: BookingServiceService,
    private readonly timeSlotService: TimeSlotService,
    private readonly staffWorkCalendar: StaffWorkCalendarService,
    private readonly staffService: StaffService,
    private readonly dataSource: DataSource,
  ) {}

  private validateBookingTime(date: string, timeSlot: TimeSlot) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const isToday = todayStr === date;
    const currentTime = today.toTimeString().slice(0, 8);

    if (todayStr > date) {
      throw new BadRequestException('Expired booking date');
    }

    if (isToday && currentTime >= timeSlot.startTime) {
      throw new BadRequestException('Expired booking time');
    }
  }

  private async validateAndCalculatePrice(
    serviceIds: number[],
    manager: EntityManager,
  ) {
    const services = await manager.find(Service, {
      where: { id: In(serviceIds), status: true },
    });

    if (services.length !== serviceIds.length) {
      throw new BadRequestException('One or more services are invalid');
    }

    const totalPrice = services.reduce((acc, s) => acc + Number(s.price), 0);

    return { services, totalPrice };
  }

  private async resolveStaffId(
    staffId: number,
    storeId: number,
    skipStaff: boolean,
    date: string,
    timeSlotId: number,
  ) {
    await this.staffService.findOne(staffId);

    // check staff belong store
    const isStaffBelongStore = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: { staffs: true },
      select: { staffs: { id: true } },
    });

    if (!isStaffBelongStore) {
      throw new BadRequestException('Staff not belong to store');
    }

    if (skipStaff && staffId === 0) {
      const staffWorkOnDate = await this.staffWorkCalendar.findStaffWorkOnDate(
        date,
        timeSlotId,
        storeId,
      );

      if (!staffWorkOnDate) {
        throw new BadRequestException('No staff working on this date');
      }
      console.log('staffWorkOnDate', staffWorkOnDate);

      return staffWorkOnDate;
    } else if (staffId && skipStaff) {
      throw new BadRequestException('Skip staff or select staff only');
    }

    // kiem tra staffId co slot trong ko
    const isStaffSlotAvailable =
      await this.timeSlotService.findSlotByDateAndStaffId(
        staffId,
        date,
        storeId,
      );

    const isValidSlot = isStaffSlotAvailable.some(
      (slot) => slot.id === timeSlotId,
    );

    if (!isValidSlot) {
      throw new BadRequestException('Staff is busy');
    }

    return staffId;
  }

  async create(createBookingDto: CreateBookingDto, user: JwtUser) {
    return this.dataSource.transaction(async (manager) => {
      const {
        serviceIds,
        staffId,
        timeSlotId,
        date,
        skipStaff,
        note,
        storeId,
      } = createBookingDto;

      if (!user) {
        throw new UnauthorizedException('Not found user');
      }

      // lấy timeSlotId
      // kiểm tra ngày giờ có quá hạn chưa
      const timeSlot = await this.timeSlotService.findOne(timeSlotId);
      if (!timeSlot) {
        throw new BadRequestException('Please select correct time slot');
      }
      this.validateBookingTime(date, timeSlot);

      // check totalPrice từ service
      const { services, totalPrice } = await this.validateAndCalculatePrice(
        serviceIds,
        manager,
      );

      // 1. main flow check có staff id hay skip staff
      const finalStaffId = await this.resolveStaffId(
        staffId,
        storeId,
        skipStaff,
        date,
        timeSlotId,
      );

      // 2. create staff slot
      const staffSlot = await this.findOrCreateStaffSlot(
        finalStaffId,
        date,
        timeSlotId,
        manager,
      );

      // 3. create booking
      const booking = manager.create(Booking, {
        customerId: user.id,
        staffSlotId: staffSlot.id,
        status: BookingStatus.CONFIRM_BOOKING,
        totalPrice,
        note,
        paymentType: BookingPaymentTypeEnum.PENDING,
        storeId,
      });

      // 4. save booking
      const saveBooking = await manager.save(booking);

      // 5. create booking service
      await this.bookingServiceService.create(
        services,
        saveBooking.id,
        manager,
      );

      const bookingCreated = await this.findOne(saveBooking.id, manager);

      return bookingCreated;
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
      slotDate: slotDate,
      timeSlotId,
      status: StaffSlotStatus.BOOKED,
    });

    const savedSlot = await manager.save(slot);
    return savedSlot;
  }

  findAll() {
    return `This action returns all booking`;
  }

  async findOne(id: number, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Booking)
      : this.bookingRepository;

    return await repo.findOne({
      where: { id },
      relations: {
        customer: true,
        staffSlot: {
          staff: {
            user: true,
          },
          timeSlot: true,
        },
        bookingServices: {
          service: true,
        },
      },
      select: {
        // id: true,
        customer: {
          email: true,
          fullName: true,
        },
        staffSlot: {
          id: true,
          staff: {
            id: true,
            avatar: true,
            user: {
              fullName: true,
            },
          },
          timeSlot: {
            id: true,
            startTime: true,
            endTime: true,
          },
          slotDate: true,
        },
        bookingServices: {
          id: true,
          service: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
  }
}
