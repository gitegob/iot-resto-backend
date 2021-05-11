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
import { LoginDto } from './dto/login-dto';
import { SignupDto } from './dto/signup-dto';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { DeactivateUserDto } from './dto/deactivate-user.dto';
import { Roles } from '../_shared_/decorators/role.decorator';
import { CreateRestoDto } from '../resto/dto/create-resto.dto';
import { RestoService } from '../resto/resto.service';
import { LoginRestoDto } from '../resto/dto/login-resto.dto';
import { RestoGuard } from './guards/resto.guard';
import { RestoDec } from 'src/_shared_/decorators/resto.decorator';
import { RestoPayload } from 'src/_shared_/interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private restoService: RestoService,
  ) {}

  @Post('admin')
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('login')
  @UseGuards(RestoGuard)
  @HttpCode(HttpStatus.OK)
  logIn(@RestoDec() resto: RestoPayload, @Body() loginDto: LoginDto) {
    return this.authService.logIn(resto, loginDto);
  }

  @Post('login-resto')
  @HttpCode(HttpStatus.OK)
  logInResto(@Body() loginRestoDto: LoginRestoDto) {
    return this.restoService.loginResto(loginRestoDto);
  }

  @Post('register')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RestoGuard, RolesGuard)
  @Roles(Role.SITE_ADMIN, Role.RESTO_ADMIN)
  signUp(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @Post('register-resto')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.SITE_ADMIN)
  registerResto(@Body() createRestoDto: CreateRestoDto) {
    return this.restoService.createResto(createRestoDto);
  }

  @Put('admin/deactivate')
  @ApiBearerAuth()
  @Roles(Role.RESTO_ADMIN)
  @UseGuards(JwtGuard, RestoGuard, RolesGuard)
  deactivate(@Body() deactivateDto: DeactivateUserDto) {
    return this.authService.deactivate(deactivateDto);
  }
}
