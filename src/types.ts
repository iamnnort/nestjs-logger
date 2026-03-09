export type LoggerConfig = {
  level: LoggerLevels;
};

export enum LoggerLevels {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export enum LoggerContexts {
  SYSTEM = 'System',
  INSTANCE_LOADER = 'InstanceLoader',
  ROUTES_RESOLVER = 'RoutesResolver',
  ROUTER_EXPLORER = 'RouterExplorer',
  NEST_FACTORY = 'NestFactory',
  NEST_APPLICATION = 'NestApplication',
}
