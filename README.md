# @iamnnort/nestjs-logger

Logger module for NestJS — simple, informative, pretty.

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
  imports: [LoggerModule],
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

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  await app.listen(3000);
}

bootstrap();
```

## Output

```
[System] Application is starting...
[System] Application started.
[System] [Request] POST /echo {"greeting":"hello"}
[System] [Response] POST /echo {"greeting":"hello"} 200 OK
```

## Example

An example app lives in [`example/`](example/). To run it (build the library, then the example):

```bash
yarn example
```

Or step by step: `yarn build` → `cd example` → `yarn install` → `yarn build` → `yarn start`. See [example/README.md](example/README.md).

## License

MIT © [Nikita Pavets](https://github.com/iamnnort)
