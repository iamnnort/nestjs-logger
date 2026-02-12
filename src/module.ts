import { DynamicModule, Global, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule as NestJsPinoLoggerModule } from 'nestjs-pino';
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './module-definition';
import { LoggerExceptionFilter } from './exception-filter';
import { buildSuccessMessage, buildErrorMessage } from './message';
import { LoggerService } from './service';
import type { LoggerConfig } from './types';

function buildPinoParams(options: typeof OPTIONS_TYPE) {
  return {
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
      customAttributeKeys: {
        err: 'error',
      },
    },
    forRoutes: [
      {
        path: '*',
        method: RequestMethod.ALL,
      },
    ],
  };
}

@Global()
@Module({
  providers: [LoggerService, { provide: APP_FILTER, useClass: LoggerExceptionFilter }],
  exports: [LoggerService],
})
export class LoggerModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const base = super.register(options);

    return {
      ...base,
      imports: [...(base.imports ?? []), NestJsPinoLoggerModule.forRoot(buildPinoParams(options))],
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const base = super.registerAsync(options);

    return {
      ...base,
      imports: [
        ...(base.imports ?? []),
        NestJsPinoLoggerModule.forRootAsync({
          imports: options.imports,
          inject: [MODULE_OPTIONS_TOKEN],
          useFactory: (config: LoggerConfig) => buildPinoParams(config),
        }),
      ],
    };
  }
}
