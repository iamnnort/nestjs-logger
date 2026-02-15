import { Module } from '@nestjs/common';
import { LoggerModule, LoggerLevels } from '@iamnnort/nestjs-logger';
import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule.register({
      level: LoggerLevels.INFO,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
