import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { adminAuth } from '../_shared_/config/env.config';
import { LoginDto } from './dto/login-dto';
import { User } from './entities/auth.entity';
import { Role } from '../_shared_/interfaces/enum.interface';
import { JwtPayload } from '../_shared_/interfaces';
import { SignupDto } from './dto/signup-dto';
import { DeactivateUserDto } from './dto/deactivate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async adminLogin(loginDto: LoginDto) {
    if (
      loginDto.username === adminAuth.username &&
      loginDto.password === adminAuth.password
    ) {
      const admin = await this.userRepo.findOne({
        where: { username: loginDto.username },
      });
      if (admin) {
        const isMatch = await bcrypt.compare(loginDto.password, admin.password);
        if (!isMatch)
          throw new ForbiddenException(
            'You are trying to access a forbidden resource',
          );
        delete admin.password;
        return { data: { access_token: this.jwtService.sign({ ...admin }) } };
      }
      const newSiteAdmin = new User();
      newSiteAdmin.username = loginDto.username;
      const hash = await bcrypt.hash(loginDto.password, 10);
      newSiteAdmin.password = hash;
      newSiteAdmin.firstName = 'Pressme';
      newSiteAdmin.lastName = 'Admin';
      newSiteAdmin.role = Role.SITE_ADMIN;
      await this.userRepo.save(newSiteAdmin);
      delete newSiteAdmin.password;
      return {
        data: {
          access_token: this.jwtService.sign({ ...newSiteAdmin }),
        },
      };
    }
    throw new ForbiddenException(
      'You are trying to access a forbidden resource',
    );
  }

  async logIn(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: loginDto.username, active: true },
    });
    if (!user) throw new UnauthorizedException('This account does not exist');
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Invalid username or password');
    delete user.password;
    return {
      data: { access_token: this.jwtService.sign({ ...user }), userData: user },
    };
  }

  /**
   * @Service Find and validate a user by username
   * @param payload
   * @returns Promise<User>
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username: payload.username },
    });
    if (!user) throw new UnauthorizedException('Invalid access_token');
    delete user.password;
    return user;
  }

  async signUp(signupDto: SignupDto) {
    const user = await this.userRepo.findOne({
      where: { username: signupDto.username },
    });
    if (user) throw new ConflictException('User already exists');
    const newUser = new User();
    newUser.firstName = signupDto.firstName;
    newUser.lastName = signupDto.lastName;
    newUser.username = signupDto.username;
    newUser.role = signupDto.role;
    newUser.password = await bcrypt.hash(signupDto.password, 10);
    await this.userRepo.save(newUser);
    delete newUser.password;
    return {
      data: {
        access_token: this.jwtService.sign({ ...newUser }),
        userData: newUser,
      },
    };
  }

  async deactivate(deactivateDto: DeactivateUserDto) {
    const user = await this.userRepo.findOne({
      where: { username: deactivateDto.username, active: true },
    });
    if (!user) throw new NotFoundException('User not found');
    user.active = false;
    await this.userRepo.save(user);
    return { message: 'User deactivated' };
  }
}
