export type LoggerConfig = {
  level: LoggerLevels;
  output?: LoggerOutputs;
};

export enum LoggerLevels {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export enum LoggerOutputs {
  MESSAGE = 'message',
  DATA = 'data',
}

export enum LoggerContexts {
  SYSTEM = 'System',
  INSTANCE_LOADER = 'InstanceLoader',
  ROUTES_RESOLVER = 'RoutesResolver',
  ROUTER_EXPLORER = 'RouterExplorer',
  NEST_FACTORY = 'NestFactory',
  NEST_APPLICATION = 'NestApplication',
}
