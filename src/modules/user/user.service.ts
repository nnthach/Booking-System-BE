import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from 'src/enums/user.enum';
import { GenerateHelpers } from 'src/utils/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      return user ?? undefined;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Not found user');
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
