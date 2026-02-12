export type LoggerConfig = {
  level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
};

export enum LoggerContexts {
  SYSTEM = 'System',
  INSTANCE_LOADER = 'InstanceLoader',
  ROUTES_RESOLVER = 'RoutesResolver',
  ROUTER_EXPLORER = 'RouterExplorer',
  NEST_FACTORY = 'NestFactory',
  NEST_APPLICATION = 'NestApplication',
}
