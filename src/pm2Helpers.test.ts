import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  pm2Connect,
  pm2List,
  pm2Restart,
  pm2Stop,
  pm2IsRunning,
  pm2Start,
} from './pm2Helpers';
import pm2 from 'pm2';

// Define the mock type for PM2
interface MockPm2 {
  connect: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
  restart: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
}

vi.mock('pm2', () => ({
  default: {
    connect: vi.fn(),
    list: vi.fn(),
    restart: vi.fn(),
    stop: vi.fn(),
    start: vi.fn(),
  },
}));

const mockPm2 = pm2 as unknown as MockPm2;

describe('pm2Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pm2Connect', () => {
    it('should connect to pm2 successfully', async () => {
      mockPm2.connect.mockImplementation((callback: (err: any) => void) => {
        callback(null);
      });

      await expect(pm2Connect()).resolves.toBeUndefined();
      expect(mockPm2.connect).toHaveBeenCalledTimes(1);
    });

    it('should reject when pm2 connection fails', async () => {
      const error = new Error('Failed to connect to pm2');
      mockPm2.connect.mockImplementation((callback: (err: any) => void) => {
        callback(error);
      });

      await expect(pm2Connect()).rejects.toThrow('Failed to connect to pm2');
      expect(mockPm2.connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('pm2List', () => {
    it('should return list of processes successfully', async () => {
      const mockProcesses = [
        { name: 'app1', pid: 1234, status: 'online' },
        { name: 'app2', pid: 5678, status: 'stopped' },
      ];

      mockPm2.list.mockImplementation(
        (callback: (err: any, list: any[]) => void) => {
          callback(null, mockProcesses);
        }
      );

      const result = await pm2List();
      expect(result).toEqual(mockProcesses);
      expect(mockPm2.list).toHaveBeenCalledTimes(1);
    });

    it('should reject when pm2 list fails', async () => {
      const error = new Error('Failed to list processes');
      mockPm2.list.mockImplementation(
        (callback: (err: any, list: any[]) => void) => {
          callback(error, []);
        }
      );

      await expect(pm2List()).rejects.toThrow('Failed to list processes');
      expect(mockPm2.list).toHaveBeenCalledTimes(1);
    });
  });

  describe('pm2Restart', () => {
    it('should restart process successfully', async () => {
      const mockProcess = { name: 'app1', pid: 1234, status: 'online' };

      mockPm2.restart.mockImplementation(
        (name: string, callback: (err: any, proc: any) => void) => {
          callback(null, mockProcess);
        }
      );

      const result = await pm2Restart('app1');
      expect(result).toEqual(mockProcess);
      expect(mockPm2.restart).toHaveBeenCalledWith(
        'app1',
        expect.any(Function)
      );
    });

    it('should reject when pm2 restart fails', async () => {
      const error = new Error('Failed to restart process');
      mockPm2.restart.mockImplementation(
        (name: string, callback: (err: any, proc: any) => void) => {
          callback(error, null);
        }
      );

      await expect(pm2Restart('app1')).rejects.toThrow(
        'Failed to restart process'
      );
      expect(mockPm2.restart).toHaveBeenCalledWith(
        'app1',
        expect.any(Function)
      );
    });
  });

  describe('pm2Stop', () => {
    it('should stop process successfully', async () => {
      mockPm2.stop.mockImplementation(
        (name: string, callback: (err: any) => void) => {
          callback(null);
        }
      );

      await expect(pm2Stop('app1')).resolves.toBeUndefined();
      expect(mockPm2.stop).toHaveBeenCalledWith('app1', expect.any(Function));
    });

    it('should reject when pm2 stop fails', async () => {
      const error = new Error('Failed to stop process');
      mockPm2.stop.mockImplementation(
        (name: string, callback: (err: any) => void) => {
          callback(error);
        }
      );

      await expect(pm2Stop('app1')).rejects.toThrow('Failed to stop process');
      expect(mockPm2.stop).toHaveBeenCalledWith('app1', expect.any(Function));
    });
  });

  describe('pm2IsRunning', () => {
    it('should return true when process is running', async () => {
      const mockProcesses = [
        { name: 'app1', pid: 1234, status: 'online' },
        { name: 'app2', pid: 5678, status: 'stopped' },
      ];

      mockPm2.list.mockImplementation(
        (callback: (err: any, list: any[]) => void) => {
          callback(null, mockProcesses);
        }
      );

      const result = await pm2IsRunning('app1');
      expect(result).toBe(true);
    });

    it('should return false when process is not running', async () => {
      const mockProcesses = [
        { name: 'app1', pid: 1234, status: 'online' },
        { name: 'app2', pid: 5678, status: 'stopped' },
      ];

      mockPm2.list.mockImplementation(
        (callback: (err: any, list: any[]) => void) => {
          callback(null, mockProcesses);
        }
      );

      const result = await pm2IsRunning('app3');
      expect(result).toBe(false);
    });

    it('should return false when no processes are running', async () => {
      mockPm2.list.mockImplementation(
        (callback: (err: any, list: any[]) => void) => {
          callback(null, []);
        }
      );

      const result = await pm2IsRunning('app1');
      expect(result).toBe(false);
    });
  });

  describe('pm2Start', () => {
    it('should start process successfully', async () => {
      const mockProcess = { name: 'app1', pid: 1234, status: 'online' };
      const startOptions = { name: 'app1', script: 'index.js' };

      mockPm2.start.mockImplementation(
        (options: any, callback: (err: any, proc: any) => void) => {
          callback(null, mockProcess);
        }
      );

      const result = await pm2Start(startOptions);
      expect(result).toEqual(mockProcess);
      expect(mockPm2.start).toHaveBeenCalledWith(
        startOptions,
        expect.any(Function)
      );
    });

    it('should reject when pm2 start fails', async () => {
      const error = new Error('Failed to start process');
      const startOptions = { name: 'app1', script: 'index.js' };

      mockPm2.start.mockImplementation(
        (options: any, callback: (err: any, proc: any) => void) => {
          callback(error, null);
        }
      );

      await expect(pm2Start(startOptions)).rejects.toThrow(
        'Failed to start process'
      );
      expect(mockPm2.start).toHaveBeenCalledWith(
        startOptions,
        expect.any(Function)
      );
    });
  });
});
