const { execSync } = require('child_process');
const path = require('path');

console.log('Starting custom build script...');

// Change to admin directory
process.chdir(path.join(__dirname, 'admin'));

console.log('Changed to admin directory:', process.cwd());

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Build the app
console.log('Building the app...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!');
