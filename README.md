## Info

Logger module for NestJS - Simple - Informative - Pretty

## Installation

```bash
yarn install @iamnnort/nestjs-logger
```

## Usage

```javascript
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule, LoggerService } from '@iamnnort/nestjs-logger';

@Module({
  imports: [
    LoggerModule,
  ],
})
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

const app = await NestFactory.create<NestExpressApplication>(AppModule);

app.useLogger(new LoggerService());
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
