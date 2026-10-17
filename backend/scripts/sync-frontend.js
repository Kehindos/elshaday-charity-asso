const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const publicDirectory = path.resolve(__dirname, '..', 'public');
const frontendFiles = ['index.html', 'admin.html', 'style.css', 'script.js'];

for (const file of frontendFiles) {
  const source = path.join(projectRoot, file);
  const destination = path.join(publicDirectory, file);

  if (!fs.existsSync(source)) {
    throw new Error(`Frontend source file is missing: ${source}`);
  }

  fs.copyFileSync(source, destination);
}

const sourceAssets = path.join(projectRoot, 'assets');
const destinationAssets = path.join(publicDirectory, 'assets');

if (!fs.existsSync(sourceAssets)) {
  throw new Error(`Frontend assets directory is missing: ${sourceAssets}`);
}

fs.cpSync(sourceAssets, destinationAssets, { recursive: true, force: true });
console.log('Synchronized project-root frontend files to backend/public.');
