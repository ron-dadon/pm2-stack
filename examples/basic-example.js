const { PM2Stack, PM2App } = require('../dist/index.cjs.js');

// Create a PM2Stack instance with verbose logging
const stack = new PM2Stack({
  verbose: true,
  exitOnStart: false // Keep the process running to see the apps
});

// Create two sample apps
const webApp = new PM2App({
  id: 'web-server',
  entryPoint: './examples/sample-apps/web-server.js',
  instances: 2, // Run 2 instances in cluster mode
  env: {
    NODE_ENV: 'production',
    PORT: '3000'
  }
});

const apiApp = new PM2App({
  id: 'api-server',
  entryPoint: './examples/sample-apps/api-server.js',
  instances: 1, // Run 1 instance in fork mode
  env: {
    NODE_ENV: 'production',
    PORT: '3001',
    API_KEY: 'your-api-key-here'
  }
});

// Register the apps with the stack
console.log('Registering apps...');
stack.registerApp(webApp);
stack.registerApp(apiApp);

// Start the stack
console.log('Starting PM2 Stack...');
stack.start()
  .then(() => {
    console.log('✅ PM2 Stack started successfully!');
    console.log('Check running processes with: pm2 list');
    console.log('Monitor logs with: pm2 logs');
    console.log('Stop all processes with: pm2 stop all');
  })
  .catch((error) => {
    console.error('❌ Failed to start PM2 Stack:', error.message);
    process.exit(1);
  });
