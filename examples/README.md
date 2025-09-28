# PM2Stack Examples

This directory contains examples demonstrating how to use the PM2Stack library.

## Prerequisites

- Node.js 18+
- PM2 daemon installed and running
- PM2Stack library built (`npm run build`)

## Basic Example

The `basic-example.js` demonstrates:

- Creating a PM2Stack instance
- Registering multiple PM2App instances
- Starting the stack with different configurations
- Using environment variables and cluster mode

### Running the Example

1. Build the library:
   ```bash
   npm run build
   ```

2. Run the example:
   ```bash
   node examples/basic-example.js
   ```

3. Check running processes:
   ```bash
   pm2 list
   ```

4. Monitor logs:
   ```bash
   pm2 logs
   ```

5. Stop all processes:
   ```bash
   pm2 stop all
   ```

### What the Example Does

- **Web Server**: Runs 2 instances in cluster mode on port 3000
- **API Server**: Runs 1 instance in fork mode on port 3001
- Both servers include graceful shutdown handling
- Environment variables are passed to each app

### Testing the Apps

- Web Server: `curl http://localhost:3000`
- API Health: `curl http://localhost:3001/health`
- API Users: `curl http://localhost:3001/api/users`

## Sample Apps

The `sample-apps/` directory contains simple Node.js applications used by the examples:

- `web-server.js`: A basic HTTP server that returns JSON responses
- `api-server.js`: A simple API with health check and users endpoints

These apps demonstrate:
- Environment variable usage
- Graceful shutdown handling
- PM2 process naming
- Basic HTTP routing
