import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private loggerService: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction) {
    this.loggerService.logRequest(request as any);

    response.on('finish', () => {
      this.loggerService.logResponse(response as any);
    });

    return next();
  }
}
