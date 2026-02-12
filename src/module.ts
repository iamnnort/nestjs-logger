import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule as NestJsPinoLoggerModule } from 'nestjs-pino';
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './module-definition';
import { LoggerExceptionFilter } from './exception-filter';
import { makePinoParams } from './builder';
import { LoggerService } from './service';
import type { LoggerConfig } from './types';

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
      imports: [...(base.imports ?? []), NestJsPinoLoggerModule.forRoot(makePinoParams(options))],
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
          inject: options.inject,
          useFactory: async (...args: unknown[]) => {
            if (options.useFactory) {
              const config = await options.useFactory(...args);

              return makePinoParams(config);
            }

            return makePinoParams({} as LoggerConfig);
          },
        }),
      ],
    };
  }
}
