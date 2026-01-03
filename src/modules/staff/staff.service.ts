import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { User } from 'src/entities/user.entity';
import { StaffWorkCalendar } from 'src/entities/staff-work-calendar.entity';

@Injectable()
export class StaffService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,

    @InjectRepository(StaffWorkCalendar)
    private staffWorkCalendarRepository: Repository<StaffWorkCalendar>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    const { staff, password } =
      await this.userService.createStaff(createStaffDto);

    if (!staff) {
      throw new InternalServerErrorException('Create Staff Failed');
    }

    // Gửi email chào mừng kèm email và password để login
    this.mailService
      .sendEmailWelcomeStaff(staff.fullName, staff.email, password)
      .catch((err) => {
        console.error('Send welcome staff email failed:', err);
      });

    const createStaff = this.staffRepository.create({
      userId: staff.id,
      isActive: true,
    });

    return await this.staffRepository.save(createStaff);
  }

  async findAll() {
    return await this.staffRepository.find({
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
