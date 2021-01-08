import {
    Controller,
    Body,
    Post,
    HttpException,
    HttpStatus,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
import { RegistrationStatus } from './regisration-status.interface';
import { AuthService } from './auth.service';
import { LoginStatus } from './login-status.interface';
import { JwtPayload } from './payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../user/user.create.dto';
import { LoginUserDto } from '../user/user-login.dto';

  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    // @UseGuards(AuthGuard())
    public async register(
      @Body() createUserDto: CreateUserDto,
    ): Promise<RegistrationStatus> {
      const result: RegistrationStatus = await this.authService.register(
        createUserDto,
      );

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return result;
    }

    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
      return await this.authService.login(loginUserDto);
    }

    @Get('whoami')
    @UseGuards(AuthGuard())
    public async testAuth(@Req() req): Promise<JwtPayload> {
      return req.user;
    }
  }
