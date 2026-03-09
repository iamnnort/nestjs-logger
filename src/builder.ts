import type { IncomingMessage, ServerResponse } from 'http';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Params as NestJsPinoParams } from 'nestjs-pino';
import { OPTIONS_TYPE } from './module-definition';
import { RequestMethod } from '@nestjs/common';
import { HttpMessageBuilder, HttpStatuses } from '@iamnnort/config/http';
import { HttpMessageFormatter } from '@iamnnort/config/http';

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
  const formatter = new HttpMessageFormatter();

  return {
    pinoHttp: [
      {
        name: 'Http',
        level: options.level,
        timestamp: false,
        customReceivedMessage: (req) => {
          const response = toAxiosResponse(req, {} as ServerResponse);

          const messageBuilder = new HttpMessageBuilder({
            response,
          });

          return messageBuilder.makeMethodText().makeUrlText().build();
        },
        customSuccessMessage: (req, res, duration) => {
          const response = toAxiosResponse(req, res);

          const messageBuilder = new HttpMessageBuilder({
            response,
            duration,
          });

          return messageBuilder.makeMethodText().makeUrlText().makeStatusText().makeDurationText().build();
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

          return messageBuilder.makeMethodText().makeUrlText().makeStatusText().build();
        },
        customLogLevel: (_req, res, error) => {
          if (error || res.statusCode >= HttpStatuses.INTERNAL_SERVER_ERROR) {
            return 'error';
          }

          if (res.statusCode >= HttpStatuses.BAD_REQUEST) {
            return 'warn';
          }

          return 'info';
        },
        customAttributeKeys: {
          err: 'error',
        },
      },
      formatter.makeLogStream(),
    ],
    forRoutes: [
      {
        path: '*',
        method: RequestMethod.ALL,
      },
    ],
  };
}
