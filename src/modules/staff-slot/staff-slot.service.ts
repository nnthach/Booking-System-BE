import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateStaffSlotDto } from './dto/create-staff-slot.dto';
import { UpdateStaffSlotDto } from './dto/update-staff-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffSlot } from 'src/entities/staff-slot.entity';
import { Between, Repository } from 'typeorm';
import { TimeSlotService } from '../time-slot/time-slot.service';

@Injectable()
export class StaffSlotService {
  constructor(
    @InjectRepository(StaffSlot)
    private staffSlotRepository: Repository<StaffSlot>,

    @Inject(forwardRef(() => TimeSlotService))
    private readonly timeSlotService: TimeSlotService,
  ) {}

  // tạo staffSlot khi có booking
  async create(createStaffSlotDto: CreateStaffSlotDto) {
    const timeSlot = await this.timeSlotService.findOne(
      createStaffSlotDto.timeSlotId,
    );

    if (!timeSlot) {
      throw new BadRequestException('Time slot is not exist');
    }
    const createStaffSlot = this.staffSlotRepository.create(createStaffSlotDto);

    return await this.staffSlotRepository.save(createStaffSlot);
  }

  findAll() {
    return `This action returns all staffSlot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staffSlot`;
  }

  // tìm 1 staff đi làm 1 ngày nào đó
  async findOneByStaffId(
    staffId: number,
    timeSlotId: number,
    slotDate: string,
  ) {
    if (!slotDate || !timeSlotId || !staffId) {
      throw new BadRequestException('Missing field required');
    }

    const startOfDay = new Date(slotDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(slotDate);
    endOfDay.setHours(23, 59, 59, 999);

    const staff = await this.staffSlotRepository.findOne({
      where: {
        staffId,
        timeSlotId,
        slotDate: Between(startOfDay, endOfDay),
      },
    });

    return staff;
  }

  async countStaffBookedOnTimeSlot(
    date: string,
    storeId: number,
  ): Promise<Map<number, number>> {
    const query = await this.staffSlotRepository
      .createQueryBuilder('ss')
      .innerJoin('ss.staff', 's')
      .select([
        'ss.timeSlotId as timeSlotId',
        'COUNT(DISTINCT ss.staffId) as staffCount',
      ])
      .where('ss.slotDate = :date', { date })
      .andWhere('s.storeId = :storeId', { storeId })
      .groupBy('ss.timeSlotId')
      .getRawMany<{ timeSlotId: number; staffCount: number }>();

    const map = new Map<number, number>();
    query.forEach((row) => {
      map.set(Number(row.timeSlotId), Number(row.staffCount));
    });

    return map;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateStaffSlotDto: UpdateStaffSlotDto) {
    return `This action updates a #${id} staffSlot`;
  }

  remove(id: number) {
    return `This action removes a #${id} staffSlot`;
  }
}
