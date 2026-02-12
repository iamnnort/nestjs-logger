export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type LoggerConfig = {
  level?: LogLevel;
};
