import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';
import { Queue } from 'bullmq';
import { EmailJobNameEnum } from 'src/enums/email-job-name.enum';
import * as XLSX from 'xlsx';
import { FormatConvertExcelRow } from 'src/utils/helpers';
import { Store } from 'src/entities/store.entity';

@Injectable()
export class StaffService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,

    @InjectRepository(StaffWorkCalendar)
    private staffWorkCalendarRepository: Repository<StaffWorkCalendar>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectQueue(QueueNameEnum.EMAIL) private emailQueue: Queue,

    private readonly dataSource: DataSource,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    // const randomPassword = '123456';
    const randomPassword = Date.now().toString();
    const payload = {
      createStaffDto,
      password: randomPassword,
    };
    const { staff, password } = await this.userService.createStaff(payload);

    if (!staff) {
      throw new InternalServerErrorException('Create Staff Failed');
    }

    await this.emailQueue.add(
      EmailJobNameEnum.SEND_EMAIL_WELCOME_STAFF,
      {
        fullName: staff.fullName,
        email: staff.email || '',
        password: password || '',
      },
      {
        delay: 2000,
        removeOnComplete: {
          age: 3600,
        },
      },
    );

    const createStaff = this.staffRepository.create({
      userId: staff.id,
      isActive: true,
      storeId: createStaffDto.storeId,
    });

    return await this.staffRepository.save(createStaff);
  }

  async createByImportExcel(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File not correct');
    }

    let workbook: XLSX.WorkBook;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      workbook = XLSX.read(file.buffer, { type: 'buffer' });
    } catch {
      throw new BadRequestException('Can not read excel file');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // lấy tên
    const sheetName = workbook.SheetNames[0];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // lấy sheet theo name
    const sheet = workbook.Sheets[sheetName];
    // chuyển các row hành json
    // eslint-disable-next-line , @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unnecessary-type-assertion
    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
    }) as Array<Record<string, string>>;

    if (!rows || rows.length === 0) {
      throw new BadRequestException('No data in file');
    }

    // luu tru ket qua
    const results = {
      created: 0,
      failed: [] as Array<{ row: number; reason: string; data: any }>,
    };

    // get field form row
    const formatField = new FormatConvertExcelRow();

    // start create
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 2; // Giả sử header ở dòng 1

      const email = formatField.getField(row, [
        'email',
        'Email',
        'mail',
        'Mail',
      ]);
      const fullName = formatField.getField(row, [
        'fullName',
        'fullname',
        'full name',
        'FullName',
        'hoTen',
        'Họ tên',
        'full_name',
      ]);
      const storeId = formatField.getField(row, [
        'storeId',
        'store_id',
        'StoreId',
        'Trạm',
        'store',
        'maTram',
        'storeid',
      ]);

      // Validate cac field
      if (!email || email === '') {
        results.failed.push({
          row: rowIndex,
          reason: 'Missing email',
          data: row,
        });
        continue;
      }

      if (!fullName || fullName === '') {
        results.failed.push({
          row: rowIndex,
          reason: 'Missing fullName',
          data: row,
        });
        continue;
      }

      if (!storeId || storeId === '') {
        results.failed.push({
          row: rowIndex,
          reason: 'Missing storeId',
          data: row,
        });
        continue;
      }

      const store = Number(storeId);
      if (Number.isNaN(store) || store <= 0) {
        results.failed.push({
          row: rowIndex,
          reason: `StoreID not correct: ${storeId}`,
          data: row,
        });
        continue;
      }

      try {
        // go on each row
        await this.dataSource.transaction(async (manager) => {
          // 1. check store
          const station = await manager.findOne(Store, {
            where: { id: store },
          });
          if (!station) {
            throw new NotFoundException(`Store id=${store} not found`);
          }

          const payload = {
            fullName: fullName,
            email: email,
            storeId: store,
          };

          // 2. create staff
          await this.create(payload);
        });

        results.created++;
      } catch (error) {
        console.log('create staff by import err', error);
        results.failed.push({
          row: rowIndex,
          reason: 'create staff by import err',
          data: row,
        });
      }
    }

    return {
      message: `Create success ${results.created} account, error ${results.failed.length} row`,
      created: results.created,
      failed: results.failed,
    };
  }

  async findAll(storeId: number, order: 'ASC' | 'DESC', search: string) {
    const query = this.staffRepository.createQueryBuilder('staffs');

    query
      .innerJoin('staffs.user', 'user')
      .addSelect([
        'user.fullName',
        'user.phoneNumber',
        'user.email',
        'user.avatar',
      ]);

    if (storeId) {
      query.where('staffs.storeId=:storeId', { storeId });
    }
    if (order) {
      query.orderBy('user.fullName', order);
    } else {
      query.orderBy('user.createdAt', 'DESC');
    }
    if (search) {
      query.andWhere('user.fullName LIKE :search', { search: `%${search}%` });
    }

    return await query.getMany();
  }

  async getStaffByStoreId(storeId: number) {
    return await this.staffRepository.find({ where: { storeId } });
  }

  async findOne(id: number) {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          fullName: true,
          email: true,
          roleId: true,
          phoneNumber: true,
          status: true,
        },
      },
    });
    if (!staff) {
      throw new NotFoundException('Not found staff');
    }
    return staff;
  }

  async findOneStaffByUserId(userId: number) {
    const staff = await this.staffRepository.findOne({
      where: { userId },
      relations: ['user'],
      select: {
        user: {
          fullName: true,
          email: true,
          roleId: true,
          phoneNumber: true,
          status: true,
        },
      },
    });
    if (!staff) {
      throw new NotFoundException('Not found staff');
    }
    return staff;
  }

  async getStaffSchedule(staffId: number) {
    const staff = await this.staffRepository.findOne({
      where: { id: staffId },
      relations: {
        user: true,
        staffWorkCalendar: {
          workSchedule: true,
        },
      },
      select: {
        id: true,
        user: {
          id: true,
          fullName: true,
          email: true,
        },
        staffWorkCalendar: {
          id: true,
          workDate: true,
          status: true,
          workSchedule: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${staffId} not found`);
    }

    // count working day
    const totalWorkingDays: number = staff.staffWorkCalendar
      ? staff.staffWorkCalendar.length
      : 0;

    return {
      ...staff,
      totalWorkingDays,
    };
  }

  async remove(id: number) {
    const staff = await this.staffRepository.findOne({
      where: { userId: id },
    });

    if (!staff) {
      throw new NotFoundException('Not found staff');
    }
    await this.staffRepository.delete({ userId: id });
    await this.userRepository.delete({ id });

    return { message: 'Delete staff success' };
  }
}
