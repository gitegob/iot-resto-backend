import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger: Logger = new Logger('TRAFFIC');
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const res = ctx.switchToHttp().getResponse();
    this.logger.verbose(`REQUEST: ${req.method} ${req.url}`);
    return next.handle().pipe(
      tap(() => {
        this.logger.verbose(`RESPONSE: ${res.statusCode} ${req.url}`);
      }),
    );
  }
}
