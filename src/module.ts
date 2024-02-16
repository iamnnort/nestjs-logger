import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerService } from './service';
import { LoggerMiddleware } from './middleware';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
