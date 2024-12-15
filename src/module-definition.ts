import { ConfigurableModuleBuilder } from '@nestjs/common';
import { LoggerConfig } from './types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<LoggerConfig>().build();
