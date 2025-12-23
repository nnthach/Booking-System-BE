import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingService } from 'src/entities/booking-service.entity';
import { EntityManager, Repository } from 'typeorm';
import { Service } from 'src/entities/service.entity';

@Injectable()
export class BookingServiceService {
  constructor(
    @InjectRepository(BookingService)
    private bookingServiceRepository: Repository<BookingService>,
  ) {}

  async create(services: Service[], bookingId: number, manager: EntityManager) {
    const bookingServices = services.map((service) =>
      manager.create(BookingService, {
        booking: { id: bookingId },
        service: { id: service.id },
        price: service.price,
      }),
    );

    await manager.save(bookingServices);
  }
}
