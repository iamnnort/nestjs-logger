import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { Logger as PinoNestLogger } from 'nestjs-pino';
import { LoggerContexts } from './types';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService extends ConsoleLogger {
  @Inject(PinoNestLogger)
  private readonly logger: PinoNestLogger;

  private print(fnName: string, message: any, context?: string) {
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

    return this.logger[fnName](`[${ctx}] ${msg}`);
  }

  log(message: any, context?: string) {
    this.print('log', message, context);
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
    this.print('verbose', message, context);
  }

  fatal(message: any, context?: string) {
    this.print('fatal', message, context);
  }
}
