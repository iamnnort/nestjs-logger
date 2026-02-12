import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { LoggerService } from '@iamnnort/nestjs-logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  await app.listen(3000);
}

bootstrap();
