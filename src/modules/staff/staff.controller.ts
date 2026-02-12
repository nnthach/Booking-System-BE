import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type File from 'multer';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Post('import-staff')
  @ApiOperation({
    summary: 'Admin create new staff by excel file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File Excel include 3 columns: email, fullName, storeId',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  createByImportExcel(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.staffService.createByImportExcel(file);
  }

  @Get()
  @ApiQuery({ name: 'storeId', required: false, type: Number, example: 1 })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'ASC',
    description: 'Order staffs by name',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search staffs by name',
  })
  findAll(
    @Query('storeId') storeId: number,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('search') search: string,
  ) {
    return this.staffService.findAll(storeId, order, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Get(':staffId/schedule')
  getStaffSchedule(@Param('staffId') staffId: string) {
    return this.staffService.getStaffSchedule(+staffId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
