import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerContexts } from './types';
import { LoggerService } from './service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const loggerService = new LoggerService();

    loggerService.setContext(LoggerContexts.SYSTEM);

    loggerService.logRequest(request as any);

    response.on('finish', () => {
      loggerService.logResponse(response as any);
    });

    return next();
  }
}
