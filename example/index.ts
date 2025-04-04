import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app';
import { LoggerService } from '../src/service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const loggerService = await app.resolve(LoggerService);

  app.useLogger(loggerService);

  await app.listen(3000);
}

bootstrap();
