import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/entities/service.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const isExisting = await this.serviceRepository.findOne({
        where: { name: createServiceDto.name },
      });

      if (isExisting) {
        throw new BadRequestException('Service already existed');
      }

      const service = this.serviceRepository.create(createServiceDto);

      return await this.serviceRepository.save(service);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Create service failed');
    }
  }

  async findAll() {
    try {
      return await this.serviceRepository.find();
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Find all service failed');
    }
  }

  async findOne(id: number) {
    return await this.serviceRepository.findOne({ where: { id } });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Not found service');
    }

    // Biến mảng các cặp [key, value] thành object
    const filteredDto = Object.fromEntries(
      // biến object thành các mảng [key,value]
      Object.entries(updateServiceDto).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined,
      ),
    );

    if (!Object.keys(filteredDto).length) {
      throw new BadRequestException('No data provided for update');
    }

    if (updateServiceDto.name) {
      const existed = await this.serviceRepository.findOne({
        where: {
          name: updateServiceDto.name,
          id: Not(id),
        },
      });

      if (existed) {
        throw new BadRequestException('Service name already existed');
      }
    }


    Object.assign(service, updateServiceDto); // đưa dữ liệu dto vô entity

    await this.serviceRepository.save(service);

    return {
      message: 'Update service success',
    };
  }

  async remove(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Not found service');
    }
    await this.serviceRepository.softDelete(id);

    return { message: 'Delete service success' };
  }
}
