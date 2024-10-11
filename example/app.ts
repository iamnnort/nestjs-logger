import { Module } from '@nestjs/common';
import { LoggerModule } from '../src/module';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}
