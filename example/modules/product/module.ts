import { Module } from '@nestjs/common';
import { ProductController } from './controller';

@Module({
  controllers: [ProductController],
})
export class ProductModule {}
