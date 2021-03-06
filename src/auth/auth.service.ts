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
import { FindOneOptions, Repository } from 'typeorm';
import { adminAuth } from '../_shared_/config/env.config';
import { LoginDto } from './dto/login-dto';
import { User } from './entities/user.entity';
import { Role } from '../_shared_/interfaces/enums.interface';
import { JwtPayload, RestoPayload } from '../_shared_/interfaces';
import { SignupDto } from './dto/signup-dto';
import { DeactivateUserDto } from './dto/deactivate-user.dto';
import { RegisterAgentDto } from './dto/register-agent.dto';

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
        where: { username: loginDto.username, role: Role.SITE_ADMIN },
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

  async logIn(resto: RestoPayload, loginDto: LoginDto) {
    const isAdmin =
      loginDto.username === adminAuth.username &&
      loginDto.password === adminAuth.password;
    const conditions: FindOneOptions<User> = isAdmin
      ? {
          where: { username: loginDto.username, active: true },
          relations: ['resto'],
        }
      : {
          where: { username: loginDto.username, active: true, resto },
          relations: ['resto'],
        };
    const user = await this.userRepo.findOne(conditions);
    if (!user) throw new UnauthorizedException('This account does not exist');
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Invalid username or password');
    delete user.password;
    delete user.resto?.password;
    return {
      data: {
        access_token: this.jwtService.sign({ ...user }),
        userData: user,
      },
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

  async signUp(resto: any, signupDto: SignupDto) {
    if (signupDto.username === adminAuth.username)
      throw new ConflictException('That username exists');
    const user = await this.userRepo.findOne({
      where: { username: signupDto.username, resto: resto.id },
    });
    if (user) throw new ConflictException('User already exists');
    const newUser = new User();
    newUser.firstName = signupDto.firstName;
    newUser.lastName = signupDto.lastName;
    newUser.username = signupDto.username;
    newUser.role = signupDto.role;
    newUser.resto = resto.id;
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

  async registerAgent(registerAgentDto: RegisterAgentDto) {
    if (registerAgentDto.username === adminAuth.username)
      throw new ConflictException('That username exists');
    const user = await this.userRepo.findOne({
      where: { username: registerAgentDto.username },
    });
    if (user) throw new ConflictException('User already exists');
    const newAgent = new User();
    newAgent.firstName = registerAgentDto.firstName;
    newAgent.lastName = registerAgentDto.lastName;
    newAgent.username = registerAgentDto.username;
    newAgent.role = Role.AGENT;
    newAgent.password = await bcrypt.hash(registerAgentDto.password, 10);
    await this.userRepo.save(newAgent);
    delete newAgent.password;
    return {
      data: {
        access_token: this.jwtService.sign({ ...newAgent }),
        userData: newAgent,
      },
    };
  }

  async deactivate(resto: RestoPayload, deactivateDto: DeactivateUserDto) {
    const user = await this.userRepo.findOne({
      where: {
        username: deactivateDto.username,
        resto: resto.id,
        active: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    user.active = false;
    await this.userRepo.save(user);
    return { message: 'User deactivated' };
  }
}
