import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly loggerService: LoggerService) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const res = ctx.switchToHttp().getResponse();
    this.loggerService.verbose(`REQUEST: ${req.method} ${req.url}`);
    return next.handle().pipe(
      tap(() => {
        this.loggerService.verbose(`RESPONSE: ${res.statusCode} ${req.url}`);
      }),
    );
  }
}
