## Info

Logger module for NestJS - Simple - Informative - Pretty

## Installation

```bash
yarn install @iamnnort/nestjs-logger
```

## Usage

```javascript
// app.ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@iamnnort/nestjs-logger';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}

// index.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app';
import { LoggerService } from '@iamnnort/nestjs-logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const loggerService = await app.resolve(LoggerService);

  app.useLogger(loggerService);

  await app.listen(3000);
}

bootstrap();
```

## Output

```bash
[System] Application is starting...
[System] Application started.
[System] [Request] POST /echo {"greeting":"hello"}
[System] [Response] POST /echo {"greeting":"hello"} 200 OK
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
