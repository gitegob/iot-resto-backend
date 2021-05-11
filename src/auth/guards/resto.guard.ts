import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RestoGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('RestoService') private readonly restoService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const resto_token = request.headers['resto_token'];
    if (!resto_token)
      throw new ForbiddenException('1111Forbidden, Restaurant unknown');
    const resto = await this.restoService.validateResto(resto_token);
    if (!resto) throw new ForbiddenException('Forbidden, Restaurant unknown');
    request.resto = resto;
    return true;
  }
}
