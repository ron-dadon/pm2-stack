# PM2Stack

A powerful TypeScript library for managing PM2 processes with ease. Create, start, stop, and monitor multiple Node.js applications using PM2.

> ⚠️ **Development Notice:** This project is currently under active development and is not production ready. Use with caution and expect breaking changes.

[![npm version](https://badge.fury.io/js/pm2-stack.svg)](https://www.npmjs.com/package/pm2-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📚 Documentation

📖 **[View Full Documentation](https://ron-dadon.github.io/pm2-stack)** - Complete API reference, examples, and guides

## 🚀 Quick Start

```bash
npm install pm2-stack
```

```typescript
import { PM2Stack, PM2App } from 'pm2-stack';

const stack = new PM2Stack({ verbose: true });

const app = new PM2App({
  id: 'my-app',
  entryPoint: './app.js',
  instances: 2,
  env: { PORT: '3000' }
});

stack.registerApp(app);
await stack.start();
```

## Development

### Prerequisites
- Node.js 18+ 
- npm
- PM2 daemon installed and running

### Setup
```bash
npm install
```

### Available Scripts
- `npm run check` - Run type checking, linting, and tests
- `npm run build` - Build the library
- `npm run build:prod` - Build the library for production (no source maps)
- `npm run test` - Run tests in watch mode
- `npm run lint` - Check code quality
- `npm run fix` - Fix linting and formatting issues
- `npm run docs:serve` - Serve documentation locally (Python)
- `npm run docs:serve:node` - Serve documentation locally (Node.js)
- `npm run docs:dev` - Build library and serve documentation
- `npm run docs:sync-version` - Sync version from package.json to docs
- `npm run docs:build` - Sync version and build library for production

### Examples
Check the `examples/` directory for usage examples:
- `basic-example.js` - JavaScript example with 2 sample apps
- `basic-example.ts` - TypeScript example
- `sample-apps/` - Sample Node.js applications

Run an example:
```bash
npm run build
node examples/basic-example.js
```

### Documentation Site

The project includes a comprehensive documentation site built with HTML, CSS, and JavaScript:

- **Location**: `docs/` directory
- **Deployment**: Automatically deployed to GitHub Pages
- **URL**: https://ron-dadon.github.io/pm2-stack
- **Features**:
  - Responsive design for all devices
  - Interactive code examples
  - Syntax highlighting
  - Copy-to-clipboard functionality
  - Smooth navigation and animations

To view locally:
```bash
# Using npm scripts (recommended)
npm run docs:serve        # Python server
npm run docs:serve:node   # Node.js server  
npm run docs:dev          # Build + serve

# Or manually
npx serve docs
python -m http.server 8000 -d docs
```

### Version Synchronization

The documentation automatically stays in sync with the package version:

- **Automatic Sync**: Version is synced before building and publishing
- **Manual Sync**: Run `npm run docs:sync-version` to update docs with current version
- **CI Integration**: Version sync runs automatically in GitHub Actions
- **Script Location**: `scripts/sync-version.js` handles the synchronization

### CI/CD
This project uses GitHub Actions for continuous integration. The workflow runs on:
- Push to `master`/`main` branch
- Pull requests to `master`/`main` branch

The CI pipeline includes:
- Type checking
- Linting
- Testing
- Building
- Documentation deployment to GitHub Pages
- Verification that PM2 is properly externalized
