import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerService } from './service';
import { LoggerMiddleware } from './middleware';
import { ConfigurableModuleClass } from './module-definition';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule extends ConfigurableModuleClass {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
