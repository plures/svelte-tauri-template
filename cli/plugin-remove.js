#!/usr/bin/env node

/**
 * Remove a plugin from the current project
 * 
 * Usage: node cli/plugin-remove.js <plugin-name>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGINS_DIR = path.join(__dirname, '../plugins');
const PROJECT_DIR = process.cwd();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ Error: ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function removePlugin(pluginName) {
  const pluginDir = path.join(PLUGINS_DIR, pluginName);
  
  // Validate plugin exists
  if (!fs.existsSync(pluginDir)) {
    log(`❌ Error: Plugin '${pluginName}' not found`, 'red');
    log(`\nRun 'npm run plugin:list' to see available plugins`, 'cyan');
    process.exit(1);
  }
  
  // Validate manifest exists
  const manifestPath = path.join(pluginDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    log(`❌ Error: Plugin '${pluginName}' has no manifest.json`, 'red');
    log(`Cannot remove plugin without manifest information`, 'yellow');
    process.exit(1);
  }
  
  // Read manifest
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    log(`❌ Error: Failed to parse manifest.json: ${err.message}`, 'red');
    process.exit(1);
  }
  
  info(`Removing plugin: ${pluginName}...`);
  
  // Read package.json
  const packageJsonPath = path.join(PROJECT_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Error: package.json not found in current directory', 'red');
    log('Make sure you are running this command from the project root', 'yellow');
    process.exit(1);
  }
  
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  } catch (err) {
    log(`❌ Error: Failed to parse package.json: ${err.message}`, 'red');
    process.exit(1);
  }
  
  let changesMade = false;
  
  // Remove dependencies
  if (manifest.dependencies) {
    if (manifest.dependencies.dev && manifest.dependencies.dev.length > 0) {
      manifest.dependencies.dev.forEach(dep => {
        if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
          delete packageJson.devDependencies[dep];
          info(`Removed dev dependency: ${dep}`);
          changesMade = true;
        }
      });
    }
    
    if (manifest.dependencies.prod && manifest.dependencies.prod.length > 0) {
      manifest.dependencies.prod.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          delete packageJson.dependencies[dep];
          info(`Removed dependency: ${dep}`);
          changesMade = true;
        }
      });
    }
  }
  
  // Remove scripts
  if (manifest.scripts && Object.keys(manifest.scripts).length > 0) {
    Object.keys(manifest.scripts).forEach(scriptName => {
      if (packageJson.scripts && packageJson.scripts[scriptName]) {
        delete packageJson.scripts[scriptName];
        info(`Removed script: ${scriptName}`);
        changesMade = true;
      }
    });
  }
  
  // Write updated package.json if changes were made
  if (changesMade) {
    try {
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf-8'
      );
      success('Updated package.json');
    } catch (err) {
      log(`❌ Error: Failed to write package.json: ${err.message}`, 'red');
      process.exit(1);
    }
  } else {
    warning('No changes made to package.json (plugin may not have been installed)');
  }
  
  // Remove config files
  if (manifest.configFiles && manifest.configFiles.length > 0) {
    let filesRemoved = 0;
    manifest.configFiles.forEach(configFile => {
      const filePath = path.join(PROJECT_DIR, configFile);
      
      if (fs.existsSync(filePath)) {
        try {
          // Check if it's a file or directory
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
          info(`Removed config file: ${configFile}`);
          filesRemoved++;
        } catch (err) {
          warning(`Failed to remove ${configFile}: ${err.message}`);
        }
      }
    });
    
    if (filesRemoved > 0) {
      success(`Removed ${filesRemoved} configuration file(s)`);
    } else {
      warning('No configuration files found to remove');
    }
  }
  
  log('');
  success(`Plugin '${pluginName}' removed successfully`);
  
  if (changesMade) {
    info('Run "npm install" to update installed packages');
  }
  
  log('');
}

// Main execution
const pluginName = process.argv[2];

if (!pluginName) {
  log('❌ Error: Missing plugin name', 'red');
  log('\nUsage: npm run plugin:remove <plugin-name>', 'cyan');
  log('Example: npm run plugin:remove praxis', 'dim');
  log('\nRun "npm run plugin:list" to see available plugins', 'cyan');
  process.exit(1);
}

removePlugin(pluginName);
