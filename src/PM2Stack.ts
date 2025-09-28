import pm2 from 'pm2';
import {
  pm2Connect,
  pm2IsRunning,
  pm2List,
  pm2Restart,
  pm2Stop,
} from './pm2Helpers';
import { pm2Start } from './pm2Helpers';
import { PM2App } from './PM2App';

type PM2StackOptions = {
  verbose?: boolean;
  exitOnStart?: boolean;
};

export class PM2Stack {
  private apps: PM2App[];
  private options: PM2StackOptions;
  private started: boolean;

  constructor(options: PM2StackOptions = {}) {
    this.apps = [];
    this.options = options;
    this.started = false;
  }

  isStarted(): boolean {
    return this.started;
  }

  logVerbose(message: string) {
    if (this.options.verbose) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }

  warnVerbose(message: string) {
    if (this.options.verbose) {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }

  errorVerbose(message: string) {
    if (this.options.verbose) {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  }

  registerApp(app: PM2App) {
    if (this.started) {
      this.errorVerbose('Cannot register apps after stack has been started');
      throw new Error('Cannot register apps after stack has been started');
    }

    if (this.apps.find(a => a.getConfig().id === app.getConfig().id)) {
      this.errorVerbose(`App ${app.getConfig().id} already registered`);
      throw new Error(`App ${app.getConfig().id} already registered`);
    }

    this.apps.push(app);
    this.logVerbose(`App ${app.getConfig().id} registered`);
  }

  async start() {
    this.logVerbose('Starting PM2 Stack');
    this.started = true;

    await pm2Connect();
    this.logVerbose('PM2 Stack connected');

    for (const app of this.apps) {
      await this.startApp(app);
    }

    const runningApps = await pm2List();
    const appsForRemove = runningApps.filter(
      app => app.name && !this.apps.find(a => a.getConfig().id === app.name)
    );
    this.logVerbose(
      `Apps for remove: ${appsForRemove.map(app => app.name).join(', ')}`
    );

    for (const app of appsForRemove) {
      await pm2Stop(app.name!);
      this.logVerbose(`App ${app.name} removed`);
    }

    this.logVerbose('PM2 Stack started');

    if (this.options.exitOnStart) {
      pm2.disconnect();
      this.logVerbose('PM2 Stack disconnected');
      process.exit(0);
    }
  }

  private async startApp(app: PM2App) {
    if (await pm2IsRunning(app.getConfig().id)) {
      this.logVerbose(`App ${app.getConfig().id} already running, restarting`);
      await pm2Restart(app.getConfig().id);
      this.logVerbose(`App ${app.getConfig().id} restarted`);
      return;
    }

    this.logVerbose(`App ${app.getConfig().id} starting`);
    await pm2Start(app.getPM2Config());
    this.logVerbose(`App ${app.getConfig().id} started`);
  }

  async stop() {
    this.logVerbose('Stopping PM2 Stack');

    for (const app of this.apps) {
      await pm2Stop(app.getConfig().id);
      this.logVerbose(`App ${app.getConfig().id} stopped`);
    }

    this.logVerbose('PM2 Stack stopped');

    pm2.disconnect();
    this.logVerbose('PM2 Stack disconnected');
    process.exit(0);
  }
}

export class PM2StackError extends Error {
  constructor(err: Error) {
    super(err.message);
    this.name = 'PM2StackError';
  }
}

export class PM2StackConnectionError extends PM2StackError {
  constructor(err: Error) {
    super(err);
    this.name = 'PM2StackConnectionError';
  }
}
