import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger();
  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    if (status === 500) Logger.error(exception);
    response.status(status).json({
      status: status,
      error: isHttp
        ? exception.response.message
        : 'Sorry, An Internal Error Occurred.',
    });
  }
}
