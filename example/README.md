# Example – test the logger locally

Minimal NestJS app that uses `@iamnnort/nestjs-logger` from the parent package. The dependency uses `link:..`, so **after you change and rebuild the lib, the example picks up changes** — no need to reinstall in `example/`.

## Run

From the **repository root**:

```bash
yarn build              # build the library
cd example
yarn install
yarn build
yarn start
```

Or from root in one go:

```bash
yarn build && cd example && yarn install && yarn build && yarn start
```

## Routes

| Method | Path   | Description                    |
|--------|--------|--------------------------------|
| GET    | /      | Hello message                  |
| POST   | /echo  | Echo request body (see logs)  |
| GET    | /error | Throws HTTP exception         |

## Try it

```bash
curl http://localhost:3000
curl -X POST http://localhost:3000/echo -H "Content-Type: application/json" -d '{"greeting":"hello"}'
curl http://localhost:3000/error
```

Check the terminal for request/response and error logging.
