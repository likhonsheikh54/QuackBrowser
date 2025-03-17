#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define colors for console output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

// Print colored messages
const log = {
  info: (msg) => console.log(`${colors.blue}Info:${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}Success:${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}Warning:${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}Error:${colors.reset} ${msg}`)
};

// Run a command in a specific directory
function runCommand(command, cwd = process.cwd()) {
  try {
    log.info(`Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    log.error(`Failed to execute: ${command}`);
    log.error(error.message);
    return false;
  }
}

// Main setup function
async function setup() {
  log.info('Starting QuackBrowser setup...');

  // Install dependencies
  log.info('Installing dependencies...');
  if (!runCommand('yarn install')) {
    log.error('Failed to install dependencies');
    process.exit(1);
  }

  // Check if iOS directory exists and setup iOS
  const iosDir = path.join(process.cwd(), 'ios');
  if (fs.existsSync(iosDir)) {
    log.info('Setting up iOS project...');
    if (!runCommand('pod install', iosDir)) {
      log.warning('Failed to install CocoaPods dependencies. You may need to run "cd ios && pod install" manually.');
    }
  }

  // Set up Android if the directory exists
  const androidDir = path.join(process.cwd(), 'android');
  if (fs.existsSync(androidDir)) {
    log.info('Setting up Android project...');
    // Make gradlew executable
    try {
      fs.chmodSync(path.join(androidDir, 'gradlew'), '755');
      log.success('Made gradlew executable');
    } catch (error) {
      log.warning('Could not make gradlew executable. You may need to run "chmod +x ./gradlew" in the android directory.');
    }
  }

  log.success('Setup complete! You can now run the app:');
  log.info('Start the dev server:  yarn start');
  log.info('Run on iOS simulator:  yarn ios');
  log.info('Run on Android device: yarn android');
}

// Execute the setup
setup().catch(error => {
  log.error('Setup failed with an unexpected error:');
  log.error(error.message);
  process.exit(1);
}); 