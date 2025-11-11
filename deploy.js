#!/usr/bin/env node

/**
 * SON1KVERS3 - Deployment Script
 * Deploy to multiple platforms from terminal
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SON1KVERS3 Deployment Script');
console.log('==============================\n');

// Check if we're in the right directory
if (!fs.existsSync('apps/web-classic/package.json')) {
  console.error('❌ Error: Run this script from the project root directory');
  process.exit(1);
}

const platforms = {
  netlify: {
    name: 'Netlify',
    command: 'npx netlify-cli deploy --prod --dir=apps/web-classic/dist',
    description: 'Deploy to Netlify (requires netlify-cli)'
  },
  vercel: {
    name: 'Vercel',
    command: 'cd apps/web-classic && npx vercel --prod',
    description: 'Deploy to Vercel (requires vercel-cli)'
  },
  surge: {
    name: 'Surge',
    command: 'cd apps/web-classic/dist && npx surge',
    description: 'Deploy to Surge.sh (requires surge-cli)'
  },
  local: {
    name: 'Local Server',
    command: 'cd apps/web-classic && npx serve dist -p 3000',
    description: 'Run local server for testing'
  }
};

function showMenu() {
  console.log('Available deployment options:');
  Object.keys(platforms).forEach((key, index) => {
    console.log(`${index + 1}. ${platforms[key].name} - ${platforms[key].description}`);
  });
  console.log('0. Build project first');
  console.log('q. Quit\n');
}

function buildProject() {
  console.log('🔨 Building project...');
  try {
    execSync('cd apps/web-classic && npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

function deployTo(platform) {
  const config = platforms[platform];
  if (!config) {
    console.error('❌ Invalid platform selected');
    return;
  }

  console.log(`🚀 Deploying to ${config.name}...`);
  console.log(`Command: ${config.command}\n`);

  try {
    execSync(config.command, { stdio: 'inherit' });
    console.log(`✅ Successfully deployed to ${config.name}!`);
  } catch (error) {
    console.error(`❌ Deployment to ${config.name} failed:`, error.message);
    console.log('\n💡 Make sure you have the required CLI tools installed:');
    console.log('   npm install -g netlify-cli vercel surge');
  }
}

// Main execution
const args = process.argv.slice(2);
const platform = args[0];

if (platform === 'build') {
  buildProject();
} else if (platform && platforms[platform]) {
  if (!fs.existsSync('apps/web-classic/dist')) {
    console.log('📦 Build directory not found. Building project first...');
    if (!buildProject()) {
      process.exit(1);
    }
  }
  deployTo(platform);
} else {
  showMenu();
  console.log('Usage:');
  console.log('  node deploy.js build          # Build the project');
  console.log('  node deploy.js netlify        # Deploy to Netlify');
  console.log('  node deploy.js vercel         # Deploy to Vercel');
  console.log('  node deploy.js surge          # Deploy to Surge');
  console.log('  node deploy.js local          # Run local server');
  console.log('\nExample:');
  console.log('  node deploy.js build && node deploy.js vercel');
}
