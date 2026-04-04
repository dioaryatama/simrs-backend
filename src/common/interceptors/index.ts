import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req   = ctx.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = ctx.switchToHttp().getResponse();
        this.logger.log(
          `${req.method} ${req.url} ${res.statusCode} — ${Date.now() - start}ms`
          + (req.user ? ` [${req.user.username}]` : ''),
        );
      }),
    );
  }
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Jika sudah berbentuk ApiResponse (ada property success), kembalikan apa adanya
        if (data && typeof data === 'object' && 'success' in data) return data;
        return {
          success:   true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
