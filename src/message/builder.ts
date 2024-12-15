import { stringify } from 'qs';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Response, Request } from 'express';
import { LoggerConfig } from '@src/types';

export class MessageBuilder {
  private printQueue: string[] = [];

  private request!: InternalAxiosRequestConfig & Request;
  private response!: AxiosResponse & Response;
  private error!: AxiosError;

  constructor(private config: LoggerConfig = {}) {}

  setRequest(request: InternalAxiosRequestConfig & Request) {
    this.request = request;

    return this;
  }

  setResponse(response: AxiosResponse & Response) {
    this.response = response;

    return this;
  }

  setError(error: AxiosError) {
    this.error = error;

    return this;
  }

  makeType(type: string) {
    this.printQueue.push(`[${type}]`);

    return this;
  }

  makeUrl() {
    const url =
      this.request?.originalUrl ||
      this.response?.req?.originalUrl ||
      this.request?.url ||
      this.response?.config?.url ||
      this.error?.response?.config.url;

    const params = this.request?.params || this.response?.config?.params || this.error?.response?.config.params;

    if (url) {
      if (params) {
        delete params['0'];
        this.printQueue.push(
          [
            url,
            stringify(params, {
              arrayFormat: this.config.serializer?.array || 'brackets',
            }),
          ]
            .filter((_) => _)
            .join('?'),
        );
      } else {
        this.printQueue.push(url);
      }
    }

    return this;
  }

  makeMethod() {
    const method =
      this.request?.method ||
      this.response?.req?.method ||
      this.response?.config?.method ||
      this.error?.response?.config.method;

    if (method) {
      this.printQueue.push(method.toUpperCase());
    }

    return this;
  }

  makeRequestData() {
    const data =
      this.request?.body ||
      this.response?.req?.body ||
      this.request?.data ||
      this.response?.config?.data ||
      this.error?.response?.config.data;

    if (data) {
      if (typeof data === 'string') {
        this.printQueue.push(data);

        return this;
      }

      if (Object.keys(data).length) {
        this.printQueue.push(JSON.stringify(data));

        return this;
      }
    }

    return this;
  }

  makeResponseData() {
    const data = this.response?.data || this.error?.response?.data;

    if (data) {
      if (typeof data === 'string') {
        this.printQueue.push(data);

        return this;
      }

      if (Object.keys(data).length) {
        this.printQueue.push(JSON.stringify(data));

        return this;
      }
    }

    return this;
  }

  makeStatus() {
    const status = this.response?.statusCode || this.response?.status || this.error?.response?.status;

    if (status) {
      this.printQueue.push(`${status}`);

      const statusText = this.response?.statusMessage || this.response?.statusText || this.error?.response?.statusText;

      if (statusText) {
        this.printQueue.push(statusText);
      }
    }

    return this;
  }

  build() {
    return this.printQueue.join(' ');
  }
}
