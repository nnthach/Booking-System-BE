import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      return {
        message: 'Registration successful. Let open email to active account',
        email: user?.email,
      };
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
}
