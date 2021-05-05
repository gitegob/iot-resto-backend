import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((results) => {
        const res = ctx.switchToHttp().getResponse();
        return {
          status: res.statusCode,
          message: results?.message || 'Success',
          data: results.data || null,
        };
      }),
    );
  }
}
