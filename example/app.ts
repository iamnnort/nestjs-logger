import { Module } from '@nestjs/common';
import { LoggerModule } from '../src';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}
