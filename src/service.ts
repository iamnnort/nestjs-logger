import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { type LoggerConfig, LoggerContexts } from './types';
import { Request, Response } from 'express';
import { MessageBuilder } from './message/builder';
import { MODULE_OPTIONS_TOKEN } from './module-definition';
import { merge } from 'lodash';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService extends ConsoleLogger {
  private config: LoggerConfig;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) customConfig: LoggerConfig = {}) {
    const defaultConfig = {
      context: LoggerContexts.SYSTEM,
      forbiddenKeys: ['password'],
      logResponse: true,
      serializer: {
        array: 'brackets',
      },
    };

    const config = merge({}, defaultConfig, customConfig);

    super(config.context);

    this.config = config;
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

  error(error: unknown, context?: string) {
    const ctx = context?.replace(/^_/, '') || this.context || '';

    console.log(`[${ctx}] [Error] Internal server error`);

    console.error(error);
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

    const loggerMesage = loggerMessageBuilder
      .setResponse(response)
      .makeType('Response')
      .makeMethod()
      .makeUrl()
      .makeRequestData()
      .makeStatus();

    if (this.config.logResponse) {
      loggerMesage.makeResponseData();
    }

    const message = loggerMesage.build();

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
