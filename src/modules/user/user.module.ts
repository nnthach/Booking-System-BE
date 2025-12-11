import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Booking } from 'src/entities/booking.entity';
import { Staff } from 'src/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Booking, Staff])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
