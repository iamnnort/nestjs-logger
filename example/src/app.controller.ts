import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  get() {
    return {
      message: 'Example',
    };
  }

  @Post()
  post(@Body() body: Record<string, unknown>) {
    return body;
  }

  @Post('error')
  error() {
    throw new BadRequestException('Example error');
  }
}
