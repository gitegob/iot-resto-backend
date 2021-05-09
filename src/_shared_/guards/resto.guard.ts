import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RestoGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { resto_token } = request.headers as any;
    if (!resto_token)
      throw new ForbiddenException('Forbidden, Restaurant unknown');
    const resto = this.jwtService.verify(resto_token);
    console.log(resto);
    if (!resto) throw new ForbiddenException('Forbidden, Restaurant unknown');
    request.resto = resto;
    return true;
  }
}
