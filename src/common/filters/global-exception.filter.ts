import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx    = host.switchToHttp();
    const res    = ctx.getResponse<Response>();
    const req    = ctx.getRequest<Request>();

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status  = exception.getStatus();
      const r = exception.getResponse();
      if (typeof r === 'object') {
        message = (r as any).message || message;
        errors  = (r as any).errors || null;
      } else {
        message = r as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      // PostgreSQL unique violation
      if ((exception as any).code === '23505') {
        status  = HttpStatus.CONFLICT;
        message = 'Data sudah ada (duplicate)';
      }
      // PostgreSQL FK violation
      if ((exception as any).code === '23503') {
        status  = HttpStatus.BAD_REQUEST;
        message = 'Referensi data tidak valid';
      }
    }

    this.logger.error(
      `${req.method} ${req.url} → ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    res.status(status).json({
      success:   false,
      message,
      errors,
      path:      req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
