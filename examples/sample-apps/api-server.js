const http = require('http');

const port = process.env.PORT || 3001;
const serverName = process.env.PM2_APP_NAME || 'api-server';

const server = http.createServer((req, res) => {
  // Simple API endpoints
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      server: serverName,
      timestamp: new Date().toISOString(),
      pid: process.pid
    }));
  } else if (req.url === '/api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ],
      server: serverName,
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      path: req.url,
      method: req.method,
      server: serverName
    }));
  }
});

server.listen(port, () => {
  console.log(`🚀 ${serverName} API server listening on port ${port} (PID: ${process.pid})`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`👥 Users API: http://localhost:${port}/api/users`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(`🛑 ${serverName} received SIGTERM, shutting down gracefully...`);
  server.close(() => {
    console.log(`✅ ${serverName} server closed`);
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log(`🛑 ${serverName} received SIGINT, shutting down gracefully...`);
  server.close(() => {
    console.log(`✅ ${serverName} server closed`);
    process.exit(0);
  });
});
