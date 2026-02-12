# @iamnnort/nestjs-logger

Logger module for NestJS using [nestjs-pino](https://github.com/iamolegga/nestjs-pino) — structured JSON logging with **automatic HTTP request/response logging**.

## Installation

```bash
npm install @iamnnort/nestjs-logger pino-http
# or
yarn add @iamnnort/nestjs-logger pino-http
```

For pretty-printed logs in development:

```bash
npm install pino-pretty
# or
yarn add pino-pretty
```

## Usage

**app.module.ts**

```ts
import { RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@iamnnort/nestjs-logger';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        genReqId: (req) => req.headers['x-request-id'] ?? crypto.randomUUID(),
      },
      forRoutes: ['*'],
      exclude: [{ method: RequestMethod.ALL, path: 'health' }],
    }),
  ],
})
export class AppModule {}
```

**main.ts**

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@iamnnort/nestjs-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  await app.listen(3000);
}
bootstrap();
```

Every HTTP request and response is logged automatically. Use `Logger` (NestJS-style) or inject `PinoLogger` for full Pino API and request-scoped fields (e.g. `PinoLogger.assign({ userId })`).

### Configuration options

| Option         | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `pinoHttp`     | [pino-http](https://github.com/pinojs/pino-http#api) options (level, transport, customAttributeKeys, genReqId, etc.) |
| `forRoutes`    | Routes where the HTTP logger runs (default: `['*']`)                        |
| `exclude`      | Routes to skip (e.g. health checks)                                         |
| `renameContext`| Rename the `context` key in logs (e.g. `'service'`)                        |
| `assignResponse` | Include assigned fields in response logs                                |

### Using the logger in your code

```ts
import { Controller } from '@nestjs/common';
import { Logger, PinoLogger } from '@iamnnort/nestjs-logger';

@Controller()
export class AppController {
  constructor(
    private readonly logger: Logger,       // NestJS LoggerService API
    private readonly pino: PinoLogger,     // Full Pino API + request context
  ) {}

  @Get()
  get() {
    this.logger.log('Handling GET');
    this.pino.assign({ userId: '123' });   // Added to all logs in this request
    return { ok: true };
  }
}
```

## Example

Run the example app (build the library first):

```bash
yarn build && yarn --cwd example start
```

Then send requests to see request/response logs:

```bash
curl http://localhost:3000
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"foo":"bar"}'
```

## License

MIT © [Nikita Pavets](https://github.com/iamnnort)
