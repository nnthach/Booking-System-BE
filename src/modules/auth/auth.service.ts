import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserStatus } from 'src/enums/user.enum';
import { JwtService } from '@nestjs/jwt';
import { AuthenUserHelpers } from 'src/utils/helpers';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';
import { EmailJobNameEnum } from 'src/enums/email-job-name.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    @InjectQueue(QueueNameEnum.EMAIL) private emailQueue: Queue,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | undefined> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email or password not correct');
    }
    const isValidPassword = await AuthenUserHelpers.compareHashedPassword(
      pass,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Email or password not correct');
    }

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      // add job vô queue => NestJS gọi BullMQ => BullMQ ghi 1 job vào Redis => Redis giữ job delayed/bull:EMAIL:delayed => consumer lắng nghe và thực hiện
      const job = await this.emailQueue.add(
        EmailJobNameEnum.SEND_EMAIL_VERIFICATION,
        {
          email: user?.email || '',
          token: user?.emailVerificationToken || '',
        },
        { delay: 2000 },
      );

      console.log('job', job);

      return {
        message: 'Registration successful. Let open email to active account',
        email: user?.email,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Register failed');
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { emailVerificationToken: token },
      });

      if (!user) {
        throw new InternalServerErrorException('Invalid verification token');
      }

      if (
        user?.emailVerificationExpire &&
        user?.emailVerificationExpire < new Date()
      ) {
        throw new BadRequestException('Token has expired');
      }

      user.status = UserStatus.VERIFIED;
      user.emailVerificationToken = null;
      user.emailVerificationExpire = null;

      await this.userRepository.save(user);
      return true;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Verified email failed');
    }
  }

  login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name || null,
    };
    return {
      message: 'Login successfully',
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
