import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from 'src/enums/user.enum';
import { GenerateHelpers } from 'src/utils/helpers';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { Staff } from 'src/entities/staff.entity';
import { JwtUser } from '../auth/dto/login-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async getUserInfo(user: JwtUser) {
    const result = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });

    if (!result) {
      throw new NotFoundException('Not found user');
    }
    return {
      id: result.id,
      email: result.email,
      fullName: result.fullName,
      status: result.status,
      phoneNumber: result.phoneNumber,
      role: {
        id: result.role.id,
        name: result.role.name,
      },
    };
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      });

      return user ?? undefined;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new NotFoundException('Not found user');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    try {
      const isExistingUser = await this.findUserByEmail(createUserDto.email);

      if (isExistingUser) {
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const { token: emailVerificationToken, expire: emailVerificationExpire } =
        GenerateHelpers.generateEmailVerificationToken();

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        roleId: 2,
        status: UserStatus.PENDING_VERIFICATION,
        emailVerificationToken,
        emailVerificationExpire,
      });

      return await this.userRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Create user failed');
    }
  }

  async createStaff(payload: {
    createStaffDto: CreateStaffDto;
    password: string;
  }): Promise<{ staff: User; password: string }> {
    try {
      const { createStaffDto, password } = payload;
      const isExistingUser = await this.findUserByEmail(createStaffDto.email);

      if (isExistingUser) {
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        ...createStaffDto,
        password: hashedPassword,
        roleId: 3,
        status: UserStatus.VERIFIED,
      });

      const saveStaff = await this.userRepository.save(user);
      return { staff: saveStaff, password: password };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Create user failed');
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.find({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Not found user');
    }

    const isEmpty = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );

    console.log('update user isEmpty', isEmpty);

    if (!Object.keys(isEmpty).length) {
      throw new BadRequestException('Not any value to update');
    }

    let hashedPassword = '';
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, { ...updateUserDto, password: hashedPassword });

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Not found user');
    }
    if (user.roleId === 3) {
      await this.staffRepository.delete({ userId: user.id });
    }
    await this.userRepository.delete(id);

    return { message: 'Delete account success' };
  }
}
