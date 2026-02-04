import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffWorkCalendarDto } from './dto/create-staff-work-calendar.dto';
import { UpdateStaffWorkCalendarDto } from './dto/update-staff-work-calendar.dto';
import {
  endOfDay,
  getNextWeekRange,
  parseDateOnly,
  startOfDay,
} from 'src/utils/date.utils';
import { StaffService } from '../staff/staff.service';
import { WorkingScheduleService } from '../working-schedule/working-schedule.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';
import { Between, DataSource, Repository } from 'typeorm';
import { StaffWorkScheduleStatus } from 'src/enums/staffWorkSchedule.enum';
import { JwtUser } from '../auth/dto/login-auth.dto';
import { StoreService } from '../store/store.service';
import { FindListOfStaffWorkOnDateDTO } from './dto/staff-work-calendar.dto';

@Injectable()
export class StaffWorkCalendarService {
  constructor(
    private readonly staffService: StaffService,
    private readonly storeService: StoreService,
    private readonly workScheduleService: WorkingScheduleService,
    @InjectRepository(StaffWorkCalendar)
    private staffWorkCalendarRepository: Repository<StaffWorkCalendar>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createStaffWorkCalendarDto: CreateStaffWorkCalendarDto,
    user: JwtUser,
  ) {
    const { workDates } = createStaffWorkCalendarDto;

    const { nextMonday, nextSunday } = getNextWeekRange();
    const userId = user.id;

    // 1. Kiểm tra staff có tồn tại không
    const staff = await this.staffService.findOneStaffByUserId(userId);

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return this.dataSource.transaction(async (manager) => {
      const createdEntries: StaffWorkCalendar[] = []; // Mảng để lưu các bản ghi đã tạo

      for (const dateString of workDates) {
        const registerDate = new Date(dateString);
        const dayOfWeek = registerDate.getDay();

        // check ngày đăng ký nằm trong tuần sau ko
        if (registerDate < nextMonday || registerDate > nextSunday) {
          throw new BadRequestException(
            `Date ${dateString} is not within the allowed range for next week's registration.`,
          );
        }

        // 2. Kiểm tra work schedule mẫu có tồn tại cho ngày này không
        const workSchedule = await this.workScheduleService.findOne(dayOfWeek);
        if (!workSchedule) {
          throw new NotFoundException(
            `No working schedule template found for date ${dateString}`,
          );
        }

        // 3. Kiểm tra staff có đăng ký trùng ngày không
        const isExisting = await manager.findOne(StaffWorkCalendar, {
          where: {
            staffId: staff.id,
            workDate: registerDate,
          },
        });

        if (isExisting) {
          console.warn(`Staff already registered schedule on ${dateString}.`);
          continue;
        }

        // 4. Tạo và LƯU vào DB
        const newEntry = manager.create(StaffWorkCalendar, {
          staffId: staff.id,
          workScheduleID: workSchedule.id,
          workDate: registerDate,
          startTime: workSchedule.startTime,
          endTime: workSchedule.endTime,
          status: StaffWorkScheduleStatus.REGISTER,
        });

        // save data
        await manager.save(newEntry);
        // lưu lại data vô mảng để return về client
        createdEntries.push(newEntry);
      }

      return createdEntries;
    });
  }

  findAll() {
    return `This action returns all staffWorkCalendar`;
  }

  async findStaffScheduleRegistered(
    user: JwtUser,
    workDateFrom: string,
    workDateTo: string,
  ) {
    const userId = user.id;

    // 1. Kiểm tra staff có tồn tại không
    const staff = await this.staffService.findOneStaffByUserId(userId);

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    const fromDate = startOfDay(parseDateOnly(workDateFrom));
    const toDate = endOfDay(parseDateOnly(workDateTo));

    // 2. get by work date input
    const schedule = await this.staffWorkCalendarRepository.find({
      where: {
        staffId: staff.id,
        workDate: Between(fromDate, toDate),
      },
    });

    return schedule;
  }

  // phục vụ skip staff booking
  // tìm staff làm ngày đó đồng thời bỏ qua mấy thằng có trong TimeSlot luôn
  async findStaffWorkOnDate(
    date: string,
    timeSlotId: number,
    storeId: number,
  ): Promise<number | null> {
    const rows: { staffId: number }[] = await this.dataSource.query(
      `
    SELECT swc.staffId
    FROM \`staff-work-calendar\` swc
    INNER JOIN staffs s ON s.id = swc.staffId
    WHERE DATE(swc.workDate) = ?
      AND swc.status = 'REGISTER'
      AND s.storeId = ?
      AND NOT EXISTS (
        SELECT 1
        FROM \`staff-slots\` ss
        WHERE ss.staffId = swc.staffId
          AND ss.timeSlotId = ?
          AND DATE(ss.slotDate) = ?
      )
    ORDER BY swc.staffId ASC
    LIMIT 1
    `,
      [date, storeId, timeSlotId, date],
    );

    return rows.length ? rows[0].staffId : null;
  }

  async findByStaff(staffId: number) {
    const staff = await this.staffService.findOne(staffId);
    if (!staff) {
      throw new NotFoundException('Not found staff');
    }
    const staffWorkSchedule = await this.staffWorkCalendarRepository.find({
      where: { staffId },
      relations: ['workSchedule'],
      select: {
        workSchedule: {
          dayOfWeek: true,
          status: true,
        },
      },
    });
    if (!staffWorkSchedule) {
      throw new NotFoundException('Not found staff schedule');
    }
    return staffWorkSchedule;
  }

  async findByStaffAndDate(staffId: number, date: string, storeId: number) {
    // 1. check staff
    const staff = await this.staffService.findOne(staffId);
    if (!staff) {
      throw new NotFoundException('Not found staff');
    }

    // 1.2 check store
    const store = await this.storeService.findOne(storeId);
    if (!store) {
      throw new NotFoundException('Not found store');
    }

    // 2. convert string to date
    const workDate = parseDateOnly(date);
    if (!workDate || isNaN(workDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use YYYY-MM-DD.',
      );
    }
    // 3. staff schedule
    const staffWorkSchedule = await this.staffWorkCalendarRepository
      .createQueryBuilder('swc')
      .innerJoin('swc.staff', 'staff')
      .innerJoin('staff.store', 'store')
      .innerJoinAndSelect('swc.workSchedule', 'workSchedule')
      .where('staff.id = :staffId', { staffId })
      .andWhere('store.id = :storeId', { storeId })
      .andWhere('swc.workDate = :workDate', { workDate })
      .select([
        'swc.id',
        'swc.workDate',
        'swc.startTime',
        'swc.endTime',
        'swc.status',
        'workSchedule.dayOfWeek',
        'workSchedule.status',
      ])
      .getOne();

    if (!staffWorkSchedule) {
      throw new NotFoundException(`Staff schedule not found for date ${date}`);
    }

    return staffWorkSchedule;
  }

  async findListOfStaffWorkOnDate(
    date: string,
    storeId: number,
  ): Promise<FindListOfStaffWorkOnDateDTO[]> {
    const query = await this.staffWorkCalendarRepository
      .createQueryBuilder('swc')
      .innerJoin('swc.staff', 's')
      .innerJoin('s.user', 'u')
      .where('DATE(swc.workDate) = :date', { date })
      .andWhere('swc.status = :status', { status: 'REGISTER' })
      .andWhere('s.storeId = :storeId', { storeId })
      .select([
        'swc.staffId AS staffId',
        'u.fullName AS staffName',
        'u.email AS staffEmail',
      ])
      .getRawMany<FindListOfStaffWorkOnDateDTO>();

    return query;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateStaffWorkCalendarDto: UpdateStaffWorkCalendarDto) {
    return `This action updates a #${id} staffWorkCalendar`;
  }

  remove(id: number) {
    return `This action removes a #${id} staffWorkCalendar`;
  }
}
