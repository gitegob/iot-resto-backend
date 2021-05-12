import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { RestoService } from 'src/resto/resto.service';
import { adminAuth } from 'src/_shared_/config/env.config';

@Injectable()
export class RestoGuard implements CanActivate {
  constructor(
    @Inject('RestoService') private readonly restoService: RestoService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAdminUsername = request?.body?.username === adminAuth.username;
    const isAdminPwd = request?.body?.password === adminAuth.password;
    if (isAdminUsername && isAdminPwd) return true;
    const resto_token = request.headers['resto-token'];
    if (!resto_token)
      throw new ForbiddenException('1111Forbidden, Restaurant unknown');
    const resto = await this.restoService.validateResto(resto_token);
    if (!resto) throw new ForbiddenException('Forbidden, Restaurant unknown');
    request.resto = resto;
    return true;
  }
}
