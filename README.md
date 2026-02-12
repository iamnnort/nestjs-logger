# @iamnnort/nestjs-logger

Logger module for NestJS - Simple - Informative - Pretty

## Installation

```bash
npm install @iamnnort/nestjs-logger
# or
yarn add @iamnnort/nestjs-logger
```

## Usage

**app.module.ts**

```ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@iamnnort/nestjs-logger';

@Module({
  imports: [
    LoggerModule.register({
      level: 'info',
    }),
  ],
})
export class AppModule {}
```

**main.ts**

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
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

### Async configuration

Use `registerAsync` when the config depends on other providers (e.g. `ConfigService`):

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@iamnnort/nestjs-logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        level: config.get('LOG_LEVEL', 'info'),
      }),
    }),
  ],
})
export class AppModule {}
```

### Log level

Levels (most to least verbose): `trace`, `debug`, `info`, `warn`, `error`, `fatal`.

### Using the logger in your code

Inject `LoggerService` and set the context to get `[ClassName]` prefix in all log messages:

```ts
import { Controller, Get, Post } from '@nestjs/common';
import { LoggerService } from '@iamnnort/nestjs-logger';

@Controller()
export class AppController {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(AppController.name);
  }

  @Get()
  get() {
    this.loggerService.log('Handling GET request');
    return { success: true };
  }

  @Post()
  post() {
    this.loggerService.error('Something failed');
    return { success: false };
  }
}
```

### Global exception filter

The module registers a global exception filter automatically. It returns proper error responses for both HTTP exceptions and unhandled errors:

```json
// BadRequestException('Http error.')
{ "message": "Http error.", "error": "Bad Request", "statusCode": 400 }

// throw new Error('Runtime error.')
{ "message": "Something went wrong.", "error": "Internal Server Error", "statusCode": 500 }
```

## Output

```
INFO: [NestFactory] Application is starting...
INFO: [NestApplication] Application started.
INFO: [Http] GET / 200 (3ms)
INFO: [Http] POST / 200 (1ms)
INFO: [Http] POST /http-error 400 (2ms)
ERROR: [AppController] User error.
INFO: [Http] POST /user-error 200 (1ms)
```

## Example

An example app lives in [`example/`](example/). To run it:

```bash
yarn start
```

## License

MIT © [Nikita Pavets](https://github.com/iamnnort)
