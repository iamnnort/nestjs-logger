import type { IncomingMessage, ServerResponse } from 'http';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Params as NestJsPinoParams } from 'nestjs-pino';
import { OPTIONS_TYPE } from './module-definition';
import { RequestMethod } from '@nestjs/common';
import { HttpMessageBuilder } from '@iamnnort/config/http';

function toAxiosConfig(req: IncomingMessage): AxiosRequestConfig {
  const expressReq = req as IncomingMessage & { body?: unknown };

  return {
    url: req.url,
    method: req.method,
    data: expressReq.body,
  } as AxiosRequestConfig;
}

function toAxiosResponse(req: IncomingMessage, res: ServerResponse): AxiosResponse {
  return {
    status: res.statusCode,
    statusText: res.statusMessage,
    data: undefined,
    headers: {},
    config: toAxiosConfig(req),
  } as AxiosResponse;
}

function toAxiosError(req: IncomingMessage, res: ServerResponse, error: Error): AxiosError {
  return {
    ...error,
    name: error.name,
    message: error.message,
    response: toAxiosResponse(req, res),
    config: toAxiosConfig(req),
  } as AxiosError;
}

export function makePinoParams(options: typeof OPTIONS_TYPE): NestJsPinoParams {
  return {
    pinoHttp: {
      name: 'Http',
      level: options.level,
      timestamp: false,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: false,
          ignore: 'pid,hostname,req,res,responseTime,reqId',
        },
      },
      customSuccessMessage: (req, res, duration) => {
        const response = toAxiosResponse(req, res);

        const messageBuilder = new HttpMessageBuilder({
          response,
          duration,
        });

        const message = messageBuilder.makeMethodText().makeUrlText().makeStatusText().makeDurationText().build();

        return message;
      },
      customSuccessObject: (req, res) => {
        const response = toAxiosResponse(req, res);

        const messageBuilder = new HttpMessageBuilder({
          response,
        });

        const data = {};

        const requestData = messageBuilder.makeRequestDataObj();

        if (Object.keys(requestData).length > 0) {
          data['request'] = requestData;
        }

        return data;
      },
      customErrorMessage: (req, res, error) => {
        const axiosError = toAxiosError(req, res, error);

        const messageBuilder = new HttpMessageBuilder({
          error: axiosError,
        });

        const message = messageBuilder.makeMethodText().makeUrlText().makeStatusText().build();

        return message;
      },
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
