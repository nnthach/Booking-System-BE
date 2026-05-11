import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
  Patch,
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

  @Get('booking-of-store/:storeId')
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    example: '2026-02-02',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    example: '2026-02-02',
  })
  findBookingOfEachStore(
    @Param('storeId') storeId: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.bookingService.findBookingOfEachStore(
      storeId,
      fromDate,
      toDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }
  @Patch(':id/check-in')
  updateBookingCheckIn(@Param('id') id: string) {
    return this.bookingService.updateBookingCheckIn(+id);
  }

  @Patch(':id/completed')
  updateBookingCompleted(@Param('id') id: string) {
    return this.bookingService.updateBookingCompleted(+id);
  }
}
