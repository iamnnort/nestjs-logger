import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductController {
  @Get()
  search() {
    return [{ id: 1, name: 'Product 1' }];
  }
}
