import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtUser, LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register account' })
  @HttpCode(201)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Verify email' })
  @HttpCode(200)
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @ApiOperation({ summary: 'Login account' })
  @HttpCode(201)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: Request & { user: JwtUser },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() loginDto: LoginAuthDto,
  ) {
    console.log('req', req);
    return this.authService.login(req.user);
  }
}
