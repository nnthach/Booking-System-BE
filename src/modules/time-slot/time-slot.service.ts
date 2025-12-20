import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Between, Not, Repository } from 'typeorm';
import { WorkingScheduleService } from '../working-schedule/working-schedule.service';
import { StaffWorkCalendarService } from '../staff-work-calendar/staff-work-calendar.service';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,

    private readonly workingScheduleService: WorkingScheduleService,
    private readonly staffWorkCalendarService: StaffWorkCalendarService,
  ) {}

  async create(createTimeSlotDto: CreateTimeSlotDto) {
    const isAvailableStartTime = await this.timeSlotRepository.findOne({
      where: { startTime: createTimeSlotDto.startTime },
    });

    if (isAvailableStartTime) {
      throw new BadRequestException('Start time is available');
    }

    // Parse "HH:MM"
    const [hour, minute] = createTimeSlotDto.startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    const end = new Date(date.getTime() + 30 * 60 * 1000);
    const endTime = end.toTimeString().slice(0, 5);

    const timeSlot = this.timeSlotRepository.create({
      startTime: createTimeSlotDto.startTime,
      endTime,
    });
    return await this.timeSlotRepository.save(timeSlot);
  }

  async findSlotByDateAndStaffId(staffId: number, date: string) {
    const checkDayOfWeek = new Date(date);
    const dayOfWeek = checkDayOfWeek.getDay();

    // 1. xem ngày thứ mấy để lấy open vs close time
    const { startTime: startTimeRequire, endTime: endTimeRequire } =
      await this.workingScheduleService.getWorkingTimeOfDay(dayOfWeek);

    // 2. nếu client có truyền staff check xem staff có đi làm ko
    if (staffId) {
      const isStaffWorkOnDate =
        await this.staffWorkCalendarService.findByStaffAndDate(staffId, date);

      // nếu ngày đó staff không làm thì return như này
      if (!isStaffWorkOnDate) {
        return { message: 'Staff off on this day' };
      }
    }

    // 3. kiểm tra xem đã qua thời gian chưa
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const isToday = todayStr === date;
    const currentTime = today.toTimeString().slice(0, 8);

    // 4. kiểm tra tgian từ client đã == endtime hôm nay chưa
    if (isToday && currentTime >= endTimeRequire) {
      return { message: 'Please select tomorrow' };
    }

    // 5. nếu ngày quá khứ
    if (todayStr > date) {
      return { message: 'Please select tomorrow' };
    }

    // chỉ lấy slot tgian sắp tới chưa hết hạn
    const result = await this.timeSlotRepository.find({
      where: {
        startTime: isToday
          ? Between(currentTime, endTimeRequire)
          : Between(startTimeRequire, endTimeRequire),
        isActive: true,
      },
      order: {
        startTime: 'ASC',
      },
    });

    return result;
  }

  async findOne(id: number) {
    return await this.timeSlotRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTimeSlotDto: UpdateTimeSlotDto) {
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { id },
    });

    if (!timeSlot) {
      throw new NotFoundException('Not found time slot');
    }

    const isEmpty = Object.fromEntries(
      Object.entries(updateTimeSlotDto).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value != undefined,
      ),
    );

    if (!Object.keys(isEmpty).length) {
      throw new BadRequestException('No data provided for update');
    }

    let endTime = '';
    if (updateTimeSlotDto.startTime) {
      const isExisted = await this.timeSlotRepository.findOne({
        where: { startTime: updateTimeSlotDto.startTime, id: Not(id) },
      });

      if (isExisted) {
        throw new BadRequestException('Time slot already existed');
      }
      // Parse to HH:MM
      const [hour, minute] = updateTimeSlotDto.startTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hour, minute, 0, 0);

      // end
      const end = new Date(date.getTime() + 30 * 60 * 1000);

      endTime = end.toTimeString().slice(0, 5);
    }

    const newData = {
      startTime: updateTimeSlotDto.startTime,
      endTime,
    };

    Object.assign(timeSlot, newData);

    await this.timeSlotRepository.save(timeSlot);

    return {
      message: 'Update service success',
    };
  }

  async remove(id: number) {
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { id },
    });

    if (!timeSlot) {
      throw new NotFoundException('Not found time slot');
    }
    await this.timeSlotRepository.delete(id);

    return { message: 'Delete time slot success' };
  }
}
