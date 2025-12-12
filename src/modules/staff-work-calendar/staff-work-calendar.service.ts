import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffWorkCalendarDto } from './dto/create-staff-work-calendar.dto';
import { UpdateStaffWorkCalendarDto } from './dto/update-staff-work-calendar.dto';
import { getNextWeekRange } from 'src/utils/date.utils';
import { StaffService } from '../staff/staff.service';
import { WorkingScheduleService } from '../working-schedule/working-schedule.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';
import { DataSource, Repository } from 'typeorm';
import { StaffWorkScheduleStatus } from 'src/enums/staffWorkSchedule.enum';

@Injectable()
export class StaffWorkCalendarService {
  constructor(
    private readonly staffService: StaffService,
    private readonly workScheduleService: WorkingScheduleService,
    @InjectRepository(StaffWorkCalendar)
    private staffWorkCalendarRepository: Repository<StaffWorkCalendar>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createStaffWorkCalendarDto: CreateStaffWorkCalendarDto) {
    const { staffId, workDates } = createStaffWorkCalendarDto;

    const { nextMonday, nextSunday } = getNextWeekRange();

    // 1. Kiểm tra staff có tồn tại không
    const staff = await this.staffService.findOne(staffId);
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
            staffId,
            workDate: registerDate,
          },
        });

        if (isExisting) {
          console.warn(`Staff already registered schedule on ${dateString}.`);
          continue;
        }

        // 4. Tạo và LƯU vào DB
        const newEntry = manager.create(StaffWorkCalendar, {
          staffId: staffId,
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

  findOne(id: number) {
    return `This action returns a #${id} staffWorkCalendar`;
  }

  update(id: number, updateStaffWorkCalendarDto: UpdateStaffWorkCalendarDto) {
    return `This action updates a #${id} staffWorkCalendar`;
  }

  remove(id: number) {
    return `This action removes a #${id} staffWorkCalendar`;
  }
}
