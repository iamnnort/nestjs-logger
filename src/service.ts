import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { type LoggerConfig, LoggerContexts } from './types';
import { Request, Response } from 'express';
import { MessageBuilder } from './message/builder';
import { MODULE_OPTIONS_TOKEN } from './module-definition';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService extends ConsoleLogger {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private config: LoggerConfig = {}) {
    const ctx = config.context || LoggerContexts.SYSTEM;

    super(ctx);
  }

  log(message: string, context?: string) {
    const ctx = context?.replace(/^_/, '') || this.context || '';

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
    const loggerMessageBuilder = new MessageBuilder(this.config);

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
    const loggerMessageBuilder = new MessageBuilder(this.config);

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
    const loggerMessageBuilder = new MessageBuilder(this.config);

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
