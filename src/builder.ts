import type { IncomingMessage, ServerResponse } from 'http';
import type { Params as NestJsPinoParams } from 'nestjs-pino';
import { OPTIONS_TYPE } from './module-definition';
import { RequestMethod } from '@nestjs/common';

export function makePinoParams(options: typeof OPTIONS_TYPE): NestJsPinoParams {
  return {
    pinoHttp: {
      level: options.level,
      timestamp: false,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: false,
          ignore: 'pid,hostname,req,res,responseTime,reqId',
          messageFormat: '{msg}',
        },
      },
      customSuccessMessage: makeSuccessMessage,
      customErrorMessage: makeErrorMessage,
      customAttributeKeys: {
        err: 'error',
      },
    },
    forRoutes: [
      {
        path: '*',
        method: RequestMethod.ALL,
      },
    ],
  };
}

function makeSuccessMessage(req: IncomingMessage, res: ServerResponse, responseTime: number): string {
  return `[Http] ${req.method} ${req.url} ${res.statusCode} (${responseTime}ms)`;
}

function makeErrorMessage(req: IncomingMessage, res: ServerResponse): string {
  return `[Http] ${req.method} ${req.url} ${res.statusCode}`;
}
