import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { LoggerService } from '@iamnnort/nestjs-logger';

@Controller()
export class AppController {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(AppController.name);
  }

  @Get()
  get() {
    return {
      success: true,
    };
  }

  @Post()
  post(@Body() dto: unknown) {
    return {
      success: true,
      dto,
    };
  }

  @Post('http-error')
  error() {
    throw new BadRequestException('Http error.');
  }

  @Post('runtime-error')
  unhandledError() {
    throw new Error('Runtime error.');
  }

  @Post('user-error')
  userError() {
    this.loggerService.error('User error.');
  }
}
