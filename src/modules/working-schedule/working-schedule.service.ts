import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkingScheduleDto } from './dto/create-working-schedule.dto';
import { UpdateWorkingScheduleDto } from './dto/update-working-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkingSchedule } from 'src/entities/work-schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkingScheduleService {
  constructor(
    @InjectRepository(WorkingSchedule)
    private workScheduleRepository: Repository<WorkingSchedule>,
  ) {}

  async create(createWorkingScheduleDto: CreateWorkingScheduleDto) {
    const isExist = await this.workScheduleRepository.findOne({
      where: { dayOfWeek: createWorkingScheduleDto.dayOfWeek },
    });

    if (isExist) {
      throw new BadRequestException(
        `This day ${createWorkingScheduleDto.dayOfWeek} already existed`,
      );
    }

    const workSchedule = this.workScheduleRepository.create(
      createWorkingScheduleDto,
    );

    return await this.workScheduleRepository.save(workSchedule);
  }

  async findAll() {
    return await this.workScheduleRepository.find({
      order: { dayOfWeek: 'ASC' },
    });
  }

  async findOne(dayOfWeek: number) {
    return await this.workScheduleRepository.findOne({
      where: { dayOfWeek },
    });
  }

  async update(
    dayOfWeek: number,
    updateWorkingScheduleDto: UpdateWorkingScheduleDto,
  ) {
    const workSchedule = await this.findOne(dayOfWeek);

    if (!workSchedule) {
      throw new NotFoundException('Not found work schedule day');
    }

    const isEmpty = Object.fromEntries(
      Object.entries(updateWorkingScheduleDto).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value != undefined,
      ),
    );

    if (!Object.keys(isEmpty).length) {
      throw new BadRequestException('No data provided for update');
    }

    Object.assign(workSchedule, updateWorkingScheduleDto);

    await this.workScheduleRepository.save(workSchedule);

    return {
      message: 'Update day of week success',
    };
  }

  async remove(dayOfWeek: number) {
    const workSchedule = await this.findOne(dayOfWeek);
    if (!workSchedule) {
      throw new NotFoundException('Not found work schedule day');
    }
    await this.workScheduleRepository.delete(dayOfWeek);

    return { message: 'Delete work schedule day success' };
  }
}
