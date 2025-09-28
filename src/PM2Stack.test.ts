import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PM2Stack, PM2StackError, PM2StackConnectionError } from './PM2Stack';
import { PM2App } from './PM2App';
import {
  pm2Connect,
  pm2IsRunning,
  pm2List,
  pm2Restart,
  pm2Stop,
  pm2Start,
} from './pm2Helpers';
import pm2 from 'pm2';

// Mock pm2Helpers
vi.mock('./pm2Helpers', () => ({
  pm2Connect: vi.fn(),
  pm2IsRunning: vi.fn(),
  pm2List: vi.fn(),
  pm2Restart: vi.fn(),
  pm2Stop: vi.fn(),
  pm2Start: vi.fn(),
}));

// Mock pm2
vi.mock('pm2', () => ({
  default: {
    disconnect: vi.fn(),
  },
}));

// Mock process.exit
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

describe('PM2Stack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create PM2Stack with default options', () => {
      const stack = new PM2Stack();
      expect(stack).toBeInstanceOf(PM2Stack);
    });

    it('should create PM2Stack with custom options', () => {
      const options = { verbose: true, exitOnStart: false };
      const stack = new PM2Stack(options);
      expect(stack).toBeInstanceOf(PM2Stack);
    });
  });

  describe('logVerbose', () => {
    it('should not throw when verbose is true', () => {
      const stack = new PM2Stack({ verbose: true });
      expect(() => stack.logVerbose('Test message')).not.toThrow();
    });

    it('should not throw when verbose is false', () => {
      const stack = new PM2Stack({ verbose: false });
      expect(() => stack.logVerbose('Test message')).not.toThrow();
    });

    it('should not throw when verbose is undefined', () => {
      const stack = new PM2Stack();
      expect(() => stack.logVerbose('Test message')).not.toThrow();
    });
  });

  describe('warnVerbose', () => {
    it('should not throw when verbose is true', () => {
      const stack = new PM2Stack({ verbose: true });
      expect(() => stack.warnVerbose('Test warning')).not.toThrow();
    });

    it('should not throw when verbose is false', () => {
      const stack = new PM2Stack({ verbose: false });
      expect(() => stack.warnVerbose('Test warning')).not.toThrow();
    });
  });

  describe('errorVerbose', () => {
    it('should not throw when verbose is true', () => {
      const stack = new PM2Stack({ verbose: true });
      expect(() => stack.errorVerbose('Test error')).not.toThrow();
    });

    it('should not throw when verbose is false', () => {
      const stack = new PM2Stack({ verbose: false });
      expect(() => stack.errorVerbose('Test error')).not.toThrow();
    });
  });

  describe('registerApp', () => {
    it('should register an app successfully', () => {
      const stack = new PM2Stack();
      const app = new PM2App({ id: 'test-app', entryPoint: 'index.js' });

      expect(() => stack.registerApp(app)).not.toThrow();
    });

    it('should throw error when app is already registered', () => {
      const stack = new PM2Stack();
      const app1 = new PM2App({ id: 'test-app', entryPoint: 'index.js' });
      const app2 = new PM2App({ id: 'test-app', entryPoint: 'other.js' });

      stack.registerApp(app1);
      expect(() => stack.registerApp(app2)).toThrow(
        'App test-app already registered'
      );
    });

    it('should allow registering apps with different IDs', () => {
      const stack = new PM2Stack();
      const app1 = new PM2App({ id: 'app1', entryPoint: 'index.js' });
      const app2 = new PM2App({ id: 'app2', entryPoint: 'other.js' });

      expect(() => {
        stack.registerApp(app1);
        stack.registerApp(app2);
      }).not.toThrow();
    });

    it('should throw error when trying to register after start', async () => {
      const stack = new PM2Stack();
      const app1 = new PM2App({ id: 'app1', entryPoint: 'index.js' });
      const app2 = new PM2App({ id: 'app2', entryPoint: 'other.js' });

      stack.registerApp(app1);

      vi.mocked(pm2Connect).mockResolvedValue(undefined);
      vi.mocked(pm2IsRunning).mockResolvedValue(false);
      vi.mocked(pm2Start).mockResolvedValue({} as any);
      vi.mocked(pm2List).mockResolvedValue([]);

      await stack.start();

      expect(() => stack.registerApp(app2)).toThrow(
        'Cannot register apps after stack has been started'
      );
    });
  });

  describe('isStarted', () => {
    it('should return false initially', () => {
      const stack = new PM2Stack();
      expect(stack.isStarted()).toBe(false);
    });

    it('should return true after start is called', async () => {
      const stack = new PM2Stack();
      const app = new PM2App({ id: 'test-app', entryPoint: 'index.js' });
      stack.registerApp(app);

      vi.mocked(pm2Connect).mockResolvedValue(undefined);
      vi.mocked(pm2IsRunning).mockResolvedValue(false);
      vi.mocked(pm2Start).mockResolvedValue({} as any);
      vi.mocked(pm2List).mockResolvedValue([]);

      expect(stack.isStarted()).toBe(false);
      await stack.start();
      expect(stack.isStarted()).toBe(true);
    });
  });

  describe('start', () => {
    it('should start all registered apps', async () => {
      const stack = new PM2Stack();
      const app = new PM2App({ id: 'test-app', entryPoint: 'index.js' });
      stack.registerApp(app);

      vi.mocked(pm2Connect).mockResolvedValue(undefined);
      vi.mocked(pm2IsRunning).mockResolvedValue(false);
      vi.mocked(pm2Start).mockResolvedValue({} as any);
      vi.mocked(pm2List).mockResolvedValue([]);

      await stack.start();

      expect(pm2Connect).toHaveBeenCalled();
      expect(pm2IsRunning).toHaveBeenCalledWith('test-app');
      expect(pm2Start).toHaveBeenCalledWith(app.getPM2Config());
    });

    it('should restart app if already running', async () => {
      const stack = new PM2Stack();
      const app = new PM2App({ id: 'test-app', entryPoint: 'index.js' });
      stack.registerApp(app);

      vi.mocked(pm2Connect).mockResolvedValue(undefined);
      vi.mocked(pm2IsRunning).mockResolvedValue(true);
      vi.mocked(pm2Restart).mockResolvedValue({} as any);
      vi.mocked(pm2List).mockResolvedValue([]);

      await stack.start();

      expect(pm2Restart).toHaveBeenCalledWith('test-app');
      expect(pm2Start).not.toHaveBeenCalled();
    });

    it('should remove apps not in the stack', async () => {
      const stack = new PM2Stack();
      const app = new PM2App({ id: 'test-app', entryPoint: 'index.js' });
      stack.registerApp(app);

      vi.mocked(pm2Connect).mockResolvedValue(undefined);
      vi.mocked(pm2IsRunning).mockResolvedValue(false);
      vi.mocked(pm2Start).mockResolvedValue({} as any);
      vi.mocked(pm2List).mockResolvedValue([
        { name: 'test-app', pid: 1234 },
        { name: 'old-app', pid: 5678 },
      ]);
      vi.mocked(pm2Stop).mockResolvedValue(undefined);

      await stack.start();

      expect(pm2Stop).toHaveBeenCalledWith('old-app');
    });

    it('should exit when exitOnStart is true', async () => {
      const stack = new PM2Stack({ exitOnStart: true });
      const app = new PM2App({ id: 'test-app', entryPoint: 'index.js' });
      stack.registerApp(app);

      vi.mocked(pm2Connect).mockResolvedValue(undefined);
      vi.mocked(pm2IsRunning).mockResolvedValue(false);
      vi.mocked(pm2Start).mockResolvedValue({} as any);
      vi.mocked(pm2List).mockResolvedValue([]);

      await expect(stack.start()).rejects.toThrow();
      expect(pm2.disconnect).toHaveBeenCalled();
    });

    it('should not exit when exitOnStart is false', async () => {
      const stack = new PM2Stack({ exitOnStart: false });
      const app = new PM2App({ id: 'test-app', entryPoint: 'index.js' });
      stack.registerApp(app);

      vi.mocked(pm2Connect).mockResolvedValue(undefined);
      vi.mocked(pm2IsRunning).mockResolvedValue(false);
      vi.mocked(pm2Start).mockResolvedValue({} as any);
      vi.mocked(pm2List).mockResolvedValue([]);

      await stack.start();
      expect(mockExit).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop all registered apps', async () => {
      const stack = new PM2Stack();
      const app1 = new PM2App({ id: 'app1', entryPoint: 'index.js' });
      const app2 = new PM2App({ id: 'app2', entryPoint: 'other.js' });
      stack.registerApp(app1);
      stack.registerApp(app2);

      vi.mocked(pm2Stop).mockResolvedValue(undefined);

      await expect(stack.stop()).rejects.toThrow();

      expect(pm2Stop).toHaveBeenCalledWith('app1');
      expect(pm2Stop).toHaveBeenCalledWith('app2');
      expect(pm2.disconnect).toHaveBeenCalled();
    });

    it('should handle empty app list', async () => {
      const stack = new PM2Stack();

      await expect(stack.stop()).rejects.toThrow();

      expect(pm2Stop).not.toHaveBeenCalled();
      expect(pm2.disconnect).toHaveBeenCalled();
    });
  });

  describe('PM2StackError', () => {
    it('should create PM2StackError with correct name and message', () => {
      const originalError = new Error('Original error');
      const stackError = new PM2StackError(originalError);

      expect(stackError).toBeInstanceOf(Error);
      expect(stackError).toBeInstanceOf(PM2StackError);
      expect(stackError.name).toBe('PM2StackError');
      expect(stackError.message).toBe('Original error');
    });
  });

  describe('PM2StackConnectionError', () => {
    it('should create PM2StackConnectionError with correct name and message', () => {
      const originalError = new Error('Connection failed');
      const connectionError = new PM2StackConnectionError(originalError);

      expect(connectionError).toBeInstanceOf(Error);
      expect(connectionError).toBeInstanceOf(PM2StackError);
      expect(connectionError).toBeInstanceOf(PM2StackConnectionError);
      expect(connectionError.name).toBe('PM2StackConnectionError');
      expect(connectionError.message).toBe('Connection failed');
    });
  });
});
