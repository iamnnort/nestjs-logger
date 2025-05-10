import { Module } from '@nestjs/common';
import { LoggerModule } from '../../src/module';
import { ProductModule } from './product/module';

@Module({
  imports: [LoggerModule, ProductModule],
})
export class AppModule {}
