import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerService } from './service';
import { LoggerMiddleware } from './middleware';
import { ConfigurableModuleClass } from './module-definition';
import { LoggerExceptionFilter } from './exception-filter';

@Global()
@Module({
  providers: [
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: LoggerExceptionFilter,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule extends ConfigurableModuleClass {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
