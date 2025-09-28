# Scripts

This directory contains utility scripts for the PM2Stack project.

## sync-version.js

Automatically synchronizes the version from `package.json` to all documentation files.

### Usage

```bash
# Run the version sync script
npm run docs:sync-version

# Or run directly
node scripts/sync-version.js
```

### What it does

1. Reads the version from `package.json`
2. Updates all HTML files in the `docs/` directory
3. Replaces version spans with the current package version
4. Provides feedback on which files were updated

### Files Updated

- `docs/index.html`
- `docs/api.html`
- `docs/examples.html`
- `docs/404.html`

### Integration

The script is automatically run:
- Before building documentation (`npm run docs:build`)
- Before publishing (`npm run prepublishOnly`)
- In CI/CD pipeline before deploying docs

### Error Handling

- Validates that `package.json` exists and is readable
- Checks that target HTML files exist
- Provides clear error messages if files can't be updated
- Exits with error code if no files are updated

### Example Output

```
🔄 Syncing version from package.json to documentation...
📦 Package version: 0.1.0
✅ Updated version in index.html
✅ Updated version in api.html
✅ Updated version in examples.html
✅ Updated version in 404.html

🎉 Version sync complete! Updated 4 files.
```
