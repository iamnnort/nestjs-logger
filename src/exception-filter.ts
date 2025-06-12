import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from './service';

@Catch()
export class LoggerExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();

      return response.status(statusCode).json(errorResponse);
    }

    this.loggerService.error(exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
