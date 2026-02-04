import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { Repository } from 'typeorm';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';
import { StoreStatus } from 'src/enums/store.enum';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,

    @InjectRepository(StaffWorkCalendar)
    private staffWorkCalendarRepository: Repository<StaffWorkCalendar>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const store = await this.storeRepository.findOne({
      where: { name: createStoreDto.name },
    });

    if (store) {
      throw new BadRequestException('Store name already exists');
    }
    
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

  async findAll(status?: StoreStatus, order?: 'ASC' | 'DESC', search?: string) {
    const query = this.storeRepository.createQueryBuilder('stores');

    if (status) {
      query.where('stores.status = :status', { status });
    }
    if (search) {
      query.andWhere('stores.name LIKE :search', { search: `%${search}%` });
    }
    if (order) {
      query.orderBy('stores.name', order);
    } else {
      query.orderBy('stores.createdAt', 'DESC');
    }

    return await query.getMany();
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
