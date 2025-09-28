const http = require('http');

const port = process.env.PORT || 3000;
const serverName = process.env.PM2_APP_NAME || 'web-server';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: `Hello from ${serverName}!`,
    timestamp: new Date().toISOString(),
    pid: process.pid,
    port: port,
    env: process.env.NODE_ENV || 'development'
  }));
});

server.listen(port, () => {
  console.log(`🌐 ${serverName} listening on port ${port} (PID: ${process.pid})`);
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
