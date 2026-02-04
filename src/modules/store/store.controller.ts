import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StoreStatus } from 'src/enums/store.enum';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({
    description: 'Create store',
  })
  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @ApiOperation({
    summary: 'Get store working calendar',
    description: 'Get store working calendar',
  })
  @Get(':storeId/working-calendar')
  findAllStoreWorkingCalendar(@Param('storeId') storeId: number) {
    return this.storeService.findAllStoreWorkingCalendar(storeId);
  }

  @Get()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: StoreStatus,
    example: StoreStatus.OPEN,
    description: 'Filter stores by status',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'ASC',
    description: 'Order stores by name',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search stores by name',
  })
  findAll(
    @Query('status') status: StoreStatus,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('search') search: string,
  ) {
    return this.storeService.findAll(status, order, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
