import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtUser } from '../auth/dto/login-auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BookingStatus } from 'src/enums/booking.enum';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Payment method ONLINE | OFFLINE',
  })
  @Post()
  create(
    @Request() req: Request & { user: JwtUser },
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.create(createBookingDto, req.user);
  }

  @Get()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BookingStatus,
    description: 'Filter bookings by status',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Order bookings by date',
  })
  findAll(
    @Query('status') status: BookingStatus,
    @Query('order') order: 'ASC' | 'DESC',
  ) {
    return this.bookingService.findAll(status, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }
}
