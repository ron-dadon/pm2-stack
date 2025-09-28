#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to sync version from package.json to documentation files
 * This ensures the version displayed in docs is always up-to-date
 */

function getPackageVersion() {
  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    process.exit(1);
  }
}

function updateVersionInFile(filePath, version) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace version in HTML files (look for version span)
    const versionRegex = /<span class="version">v[^<]+<\/span>/g;
    const newVersionSpan = `<span class="version">v${version}</span>`;

    if (content.match(versionRegex)) {
      content = content.replace(versionRegex, newVersionSpan);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated version in ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`⚠️  No version found in ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Syncing version from package.json to documentation...');

  const version = getPackageVersion();
  console.log(`📦 Package version: ${version}`);

  const docsDir = path.join(__dirname, '..', 'docs');
  const htmlFiles = [
    'index.html',
    'api.html',
    'examples.html',
    '404.html'
  ];

  let updatedFiles = 0;

  htmlFiles.forEach(file => {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
      if (updateVersionInFile(filePath, version)) {
        updatedFiles++;
      }
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  });

  console.log(`\n🎉 Version sync complete! Updated ${updatedFiles} files.`);

  if (updatedFiles === 0) {
    console.log('⚠️  No files were updated. Check if version spans exist in HTML files.');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { getPackageVersion, updateVersionInFile };
