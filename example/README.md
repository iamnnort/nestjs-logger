# Example

Minimal NestJS app that uses `@iamnnort/nestjs-logger` from the parent package. The dependency uses `link:..`, so after you rebuild the lib the example picks up changes automatically.

## Run

From the repository root:

```bash
yarn start
```

Or step by step:

```bash
yarn build
cd example
yarn install
yarn start
```

## Routes

| Method | Path            | Description               |
|--------|-----------------|---------------------------|
| GET    | /               | Success response          |
| POST   | /               | Echo request body         |
| POST   | /http-error     | Throws BadRequestException |
| POST   | /runtime-error  | Throws unhandled Error    |
| POST   | /user-error     | Logs error via LoggerService |

## Try it

```bash
curl http://localhost:3000
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"foo":"bar"}'
curl -X POST http://localhost:3000/http-error
curl -X POST http://localhost:3000/runtime-error
curl -X POST http://localhost:3000/user-error
```

## Expected output

```
INFO: [NestFactory] Application is starting...
INFO: [NestApplication] Application started.
INFO: [Http] GET / 200 (3ms)
INFO: [Http] POST / 200 (1ms)
INFO: [Http] POST /http-error 400 (2ms)
INFO: [Http] POST /runtime-error 500 (1ms)
ERROR: [AppController] User error.
INFO: [Http] POST /user-error 200 (1ms)
```
