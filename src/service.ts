import { Inject, Injectable, type LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { Logger as PinoNestLogger } from 'nestjs-pino';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(@Inject(PinoNestLogger) private readonly logger: PinoNestLogger) {}

  setContext(context: string) {
    this.context = context;
  }

  private getContext(...optionalParams: unknown[]) {
    // NestJS error: error(message, stack, context) — context at index 1
    if (typeof optionalParams[1] === 'string') {
      return optionalParams[1];
    }

    // NestJS other: log(message, context) — context at index 0
    if (typeof optionalParams[0] === 'string') {
      return optionalParams[0];
    }

    // Manual call: no context in params, use this.context
    return this.context;
  }

  private format(message: unknown, context?: string) {
    const ignoredContexts = ['InstanceLoader', 'RoutesResolver', 'RouterExplorer'];

    if (context && ignoredContexts.includes(context)) {
      return null;
    }

    let msg = typeof message === 'string' ? message : String(message);

    const messageMap = {
      NestFactory: {
        'Starting Nest application...': 'Application is starting...',
      },
      NestApplication: {
        'Nest application successfully started': 'Application started.',
      },
    };

    if (context && messageMap[context]) {
      msg = messageMap[context][msg] ?? msg;
    }

    return context ? `[${context}] ${msg}` : msg;
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    const msg = this.format(message, this.getContext(...optionalParams));

    if (msg === null) {
      return;
    }

    this.logger.log(msg);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    const msg = this.format(message, this.getContext(...optionalParams));

    if (msg === null) {
      return;
    }

    this.logger.error(msg);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    const msg = this.format(message, this.getContext(...optionalParams));

    if (msg === null) {
      return;
    }

    this.logger.warn(msg);
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    const msg = this.format(message, this.getContext(...optionalParams));

    if (msg === null) {
      return;
    }

    this.logger.debug(msg);
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    const msg = this.format(message, this.getContext(...optionalParams));

    if (msg === null) {
      return;
    }

    this.logger.verbose(msg);
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    const msg = this.format(message, this.getContext(...optionalParams));

    if (msg === null) {
      return;
    }

    this.logger.fatal(msg);
  }
}
