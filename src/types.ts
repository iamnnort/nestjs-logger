export type LoggerConfig = {
  context?: string;
  forbiddenKeys?: string[];
  logResponse?: boolean;
  serializer?: {
    array: 'indices' | 'brackets' | 'repeat' | 'comma';
  };
};

export enum LoggerContexts {
  SYSTEM = 'System',
  INSTANCE_LOADER = 'InstanceLoader',
  ROUTER_EXPLORER = 'RouterExplorer',
  ROUTES_RESOLVER = 'RoutesResolver',
  NEST_FACTORY = 'NestFactory',
  NEST_APPLICATION = 'NestApplication',
}
