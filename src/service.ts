import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LoggerContexts } from './types';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService extends ConsoleLogger {
  @Inject(PinoLogger)
  private readonly pinoLogger: PinoLogger;

  private print(level: string, message: any, context?: string) {
    const ctx = context?.replace(/^_/, '') || this.context || '';

    const ctxBlacklist: string[] = [
      LoggerContexts.INSTANCE_LOADER,
      LoggerContexts.ROUTES_RESOLVER,
      LoggerContexts.ROUTER_EXPLORER,
    ];

    if (ctxBlacklist.includes(ctx)) {
      return;
    }

    const ctxMessageMap: Record<string, string> = {
      [LoggerContexts.NEST_FACTORY]: 'Application is starting...',
      [LoggerContexts.NEST_APPLICATION]: 'Application started.',
    };

    const msg = ctxMessageMap[ctx] || message || '';

    const logger = ctx ? this.pinoLogger.logger.child({ name: ctx }) : this.pinoLogger.logger;

    logger[level](msg);
  }

  log(message: any, context?: string) {
    this.print('info', message, context);
  }

  error(message: any, context?: string) {
    this.print('error', message, context);
  }

  warn(message: any, context?: string) {
    this.print('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.print('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.print('trace', message, context);
  }

  fatal(message: any, context?: string) {
    this.print('fatal', message, context);
  }
}
