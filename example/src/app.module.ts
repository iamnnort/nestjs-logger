import { Module } from '@nestjs/common';
import { LoggerModule } from '@iamnnort/nestjs-logger';
import { AppController } from './app.controller';

@Module({
  imports: [LoggerModule],
  controllers: [AppController],
})
export class AppModule {}
