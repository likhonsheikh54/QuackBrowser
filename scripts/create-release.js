#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read package.json to get current version
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Ask for version type
log.info(`Current version: ${currentVersion}`);
log.info('What type of release do you want to create?');
console.log('1. Major (x.0.0)');
console.log('2. Minor (0.x.0)');
console.log('3. Patch (0.0.x)');
console.log('4. Specific version');

rl.question('Enter your choice (1-4): ', (choice) => {
  let newVersion = '';
  
  if (choice === '1' || choice === '2' || choice === '3') {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (choice) {
      case '1':
        newVersion = `${major + 1}.0.0`;
        break;
      case '2':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case '3':
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }
    
    promptForConfirmation(newVersion);
  } else if (choice === '4') {
    rl.question('Enter specific version (e.g., 1.2.3): ', (version) => {
      if (!/^\d+\.\d+\.\d+$/.test(version)) {
        log.error('Invalid version format. Please use format x.y.z');
        rl.close();
        return;
      }
      
      newVersion = version;
      promptForConfirmation(newVersion);
    });
  } else {
    log.error('Invalid choice. Exiting.');
    rl.close();
  }
});

function promptForConfirmation(newVersion) {
  log.info(`You are about to create release v${newVersion}`);
  rl.question('Do you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createRelease(newVersion);
    } else {
      log.info('Release creation cancelled.');
    }
    rl.close();
  });
}

function createRelease(newVersion) {
  try {
    // Update package.json
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    // Commit the change
    execSync('git add package.json', { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
    
    // Create and push tag
    execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { stdio: 'inherit' });
    execSync('git push origin main --tags', { stdio: 'inherit' });
    
    log.success(`Release v${newVersion} created and pushed to GitHub!`);
    log.info('The CI/CD pipeline will now build and publish the release.');
  } catch (error) {
    log.error('Failed to create release:');
    log.error(error.message);
  }
} 