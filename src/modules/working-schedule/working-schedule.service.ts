import { Injectable } from '@nestjs/common';
import { CreateWorkingScheduleDto } from './dto/create-working-schedule.dto';
import { UpdateWorkingScheduleDto } from './dto/update-working-schedule.dto';

@Injectable()
export class WorkingScheduleService {
  create(createWorkingScheduleDto: CreateWorkingScheduleDto) {
    return 'This action adds a new workingSchedule';
  }

  findAll() {
    return `This action returns all workingSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workingSchedule`;
  }

  update(id: number, updateWorkingScheduleDto: UpdateWorkingScheduleDto) {
    return `This action updates a #${id} workingSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} workingSchedule`;
  }
}
