import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../_shared_/interfaces/enum.interface';
import { AuthService } from './auth.service';
import { Roles } from './decorators/role.decorator';
import { LoginDto } from './dto/login-dto';
import { SignupDto } from './dto/signup-dto';
import { JwtGuard } from '../_shared_/guards/jwt.guard';
import { RolesGuard } from '../_shared_/guards/roles.guard';
import { DeactivateUserDto } from './dto/deactivate-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin')
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  logIn(@Body() loginDto: LoginDto) {
    return this.authService.logIn(loginDto);
  }

  @Post('register')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  signUp(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @Put('admin/deactivate')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  deactivate(@Body() deactivateDto: DeactivateUserDto) {
    return this.authService.deactivate(deactivateDto);
  }
}
