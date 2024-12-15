export enum LoggerContexts {
  SYSTEM = 'System',
  INSTANCE_LOADER = 'InstanceLoader',
  ROUTER_EXPLORER = 'RouterExplorer',
  ROUTES_RESOLVER = 'RoutesResolver',
  NEST_FACTORY = 'NestFactory',
  NEST_APPLICATION = 'NestApplication',
}

export type LoggerConfig = {
  context?: string;
  serializer?: {
    array?: 'indices' | 'brackets' | 'repeat' | 'comma';
  };
};
