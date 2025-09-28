import pm2 from 'pm2';

export type PM2AppConfig = {
  id: string;
  entryPoint: string;
  cluster?: boolean;
  instances?: number;
  env?: { [key: string]: string };
};

export class PM2App {
  private config: PM2AppConfig;

  constructor(config: PM2AppConfig) {
    this.config = config;
  }

  getConfig() {
    return this.config;
  }

  getPM2Config(): pm2.StartOptions {
    return {
      name: this.config.id,
      script: this.config.entryPoint,
      exec_mode: (this.config.instances ?? 1) > 1 ? 'cluster' : 'fork',
      instances: this.config.instances ?? 1,
      env: this.config.env ?? {},
    };
  }
}
