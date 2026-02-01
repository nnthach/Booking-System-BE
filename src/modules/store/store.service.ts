import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { Repository } from 'typeorm';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,

    @InjectRepository(StaffWorkCalendar)
    private staffWorkCalendarRepository: Repository<StaffWorkCalendar>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    return await this.storeRepository.save(createStoreDto);
  }

  async findAllStoreWorkingCalendar(storeId: number) {
    const store = await this.findOne(storeId);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const workingCalendars = await this.staffWorkCalendarRepository
      .createQueryBuilder('swc')
      .innerJoin('swc.staff', 'staff')
      .where('staff.storeId = :storeId', { storeId })
      .getMany();

    return workingCalendars;
  }

  async findAll() {
    return await this.storeRepository.find();
  }

  async findOne(id: number) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.findOne(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    await this.storeRepository.update(id, updateStoreDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const store = await this.findOne(id);
    if (!store) {
      throw new Error('Store not found');
    }
    return await this.storeRepository.remove(store);
  }
}
