import { EvasionConfig } from '../types';

export class EvasionConfigManager {
  private config: EvasionConfig;

  constructor(baseConfig: EvasionConfig) {
    this.config = { ...baseConfig };
  }

  merge(override: Partial<EvasionConfig>): void {
    this.config = { ...this.config, ...override };
  }

  getConfig(): EvasionConfig {
    return this.config;
  }
} 