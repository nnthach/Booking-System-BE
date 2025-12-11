import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
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
    console.log('end', end);
    console.log('end toTimeString', end.toTimeString());
    const endTime = end.toTimeString().slice(0, 5);
    console.log('endTime', endTime);

    const timeSlot = this.timeSlotRepository.create({
      startTime: createTimeSlotDto.startTime,
      endTime,
    });
    return await this.timeSlotRepository.save(timeSlot);
  }

  async findAll() {
    return await this.timeSlotRepository.find({
      order: {
        startTime: 'ASC',
      },
    });
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
