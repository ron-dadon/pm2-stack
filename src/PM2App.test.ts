import { describe, it, expect } from 'vitest';
import { PM2App, PM2AppConfig } from './PM2App';

describe('PM2App', () => {
  describe('constructor', () => {
    it('should create PM2App with basic config', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
      };

      const app = new PM2App(config);
      expect(app).toBeInstanceOf(PM2App);
    });

    it('should create PM2App with full config', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        cluster: true,
        instances: 4,
        env: {
          NODE_ENV: 'production',
          PORT: '3000',
        },
      };

      const app = new PM2App(config);
      expect(app).toBeInstanceOf(PM2App);
    });
  });

  describe('getConfig', () => {
    it('should return the original config', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        cluster: true,
        instances: 2,
        env: { NODE_ENV: 'test' },
      };

      const app = new PM2App(config);
      expect(app.getConfig()).toEqual(config);
    });

    it('should return config with undefined optional fields', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
      };

      const app = new PM2App(config);
      const returnedConfig = app.getConfig();

      expect(returnedConfig.id).toBe('test-app');
      expect(returnedConfig.entryPoint).toBe('index.js');
      expect(returnedConfig.cluster).toBeUndefined();
      expect(returnedConfig.instances).toBeUndefined();
      expect(returnedConfig.env).toBeUndefined();
    });
  });

  describe('getPM2Config', () => {
    it('should return basic PM2 config for fork mode', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config).toEqual({
        name: 'test-app',
        script: 'index.js',
        exec_mode: 'fork',
        instances: 1,
        env: {},
      });
    });

    it('should return PM2 config with cluster mode when instances > 1', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        instances: 4,
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config).toEqual({
        name: 'test-app',
        script: 'index.js',
        exec_mode: 'cluster',
        instances: 4,
        env: {},
      });
    });

    it('should return PM2 config with custom environment variables', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        env: {
          NODE_ENV: 'production',
          PORT: '3000',
          DEBUG: 'app:*',
        },
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config).toEqual({
        name: 'test-app',
        script: 'index.js',
        exec_mode: 'fork',
        instances: 1,
        env: {
          NODE_ENV: 'production',
          PORT: '3000',
          DEBUG: 'app:*',
        },
      });
    });

    it('should return PM2 config with cluster mode and custom env', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        instances: 3,
        env: {
          NODE_ENV: 'production',
          PORT: '3000',
        },
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config).toEqual({
        name: 'test-app',
        script: 'index.js',
        exec_mode: 'cluster',
        instances: 3,
        env: {
          NODE_ENV: 'production',
          PORT: '3000',
        },
      });
    });

    it('should handle empty environment object', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        env: {},
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config.env).toEqual({});
    });

    it('should use fork mode when instances is 1', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        instances: 1,
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config.exec_mode).toBe('fork');
      expect(pm2Config.instances).toBe(1);
    });

    it('should use cluster mode when instances > 1', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        instances: 2,
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config.exec_mode).toBe('cluster');
      expect(pm2Config.instances).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle zero instances by defaulting to 1', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        instances: 0,
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config.instances).toBe(0);
      expect(pm2Config.exec_mode).toBe('fork');
    });

    it('should handle negative instances', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        instances: -1,
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config.instances).toBe(-1);
      expect(pm2Config.exec_mode).toBe('fork');
    });

    it('should handle very large instance counts', () => {
      const config: PM2AppConfig = {
        id: 'test-app',
        entryPoint: 'index.js',
        instances: 1000,
      };

      const app = new PM2App(config);
      const pm2Config = app.getPM2Config();

      expect(pm2Config.instances).toBe(1000);
      expect(pm2Config.exec_mode).toBe('cluster');
    });
  });
});
