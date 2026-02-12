import { DynamicModule, Global, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule as NestJsPinoLoggerModule } from 'nestjs-pino';
import { ConfigurableModuleClass } from './module-definition';
import { LoggerExceptionFilter } from './exception-filter';
import { buildSuccessMessage, buildErrorMessage } from './message';
import { LoggerService } from './service';
import type { LoggerConfig } from './types';

@Global()
@Module({})
export class LoggerModule extends ConfigurableModuleClass {
  static forRoot(options: LoggerConfig = {}): DynamicModule {
    const base = super.forRoot(options);

    return {
      ...base,
      imports: [
        ...(base.imports ?? []),
        NestJsPinoLoggerModule.forRoot({
          pinoHttp: {
            level: options.level ?? 'info',
            timestamp: false,
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: false,
                ignore: 'pid,hostname,req,res,responseTime,reqId',
                messageFormat: '{msg}',
              },
            },
            customSuccessMessage: buildSuccessMessage,
            customErrorMessage: buildErrorMessage,
          },
          forRoutes: [
            {
              path: '*',
              method: RequestMethod.ALL,
            },
          ],
        }),
      ],
      providers: [
        ...(base.providers ?? []),
        LoggerService,
        {
          provide: APP_FILTER,
          useClass: LoggerExceptionFilter,
        },
      ],
      exports: [...(base.exports ?? []), LoggerService],
    };
  }
}
