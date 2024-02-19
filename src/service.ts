import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { LoggerContexts } from './types';
import { Request, Response } from 'express';
import { MessageBuilder } from './message/builder';

@Injectable({
  scope: Scope.REQUEST,
})
export class LoggerService extends ConsoleLogger {
  setContext(context?: string) {
    super.setContext(context || LoggerContexts.SYSTEM);
  }

  log(message: string, context?: string) {
    const ctx = context || this.context || '';

    const ctxBlacklist: string[] = [
      LoggerContexts.INSTANCE_LOADER,
      LoggerContexts.ROUTER_EXPLORER,
      LoggerContexts.ROUTES_RESOLVER,
    ];

    if (ctxBlacklist.includes(ctx)) {
      return;
    }

    const ctxMessageMap: Record<string, string> = {
      [LoggerContexts.NEST_FACTORY]: 'Application is starting...',
      [LoggerContexts.NEST_APPLICATION]: 'Application started.',
    };

    const ctxMessage = ctxMessageMap[ctx];

    if (ctxMessage) {
      return console.log(`[${LoggerContexts.SYSTEM}] ${ctxMessage}`);
    }

    return console.log(`[${ctx}] ${message}`);
  }

  logRequest(request: InternalAxiosRequestConfig & Request) {
    const loggerMessageBuilder = new MessageBuilder();

    const message = loggerMessageBuilder
      .setRequest(request)
      .makeType('Request')
      .makeMethod()
      .makeUrl()
      .makeRequestData()
      .build();

    return this.log(message);
  }

  logResponse(response: AxiosResponse & Response) {
    const loggerMessageBuilder = new MessageBuilder();

    const message = loggerMessageBuilder
      .setResponse(response)
      .makeType('Response')
      .makeMethod()
      .makeUrl()
      .makeRequestData()
      .makeStatus()
      .makeResponseData()
      .build();

    return this.log(message);
  }

  logRequestError(error: AxiosError) {
    const loggerMessageBuilder = new MessageBuilder();

    const message = loggerMessageBuilder
      .setError(error)
      .makeType('Error')
      .makeMethod()
      .makeUrl()
      .makeRequestData()
      .makeStatus()
      .makeResponseData()
      .build();

    return this.log(message);
  }
}
