#!/usr/bin/env node

/**
 * Add a plugin to the current project
 * 
 * Usage: node cli/plugin-add.js <plugin-name>
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
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

async function addPlugin(pluginName) {
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
    log(`The plugin directory exists but is missing required files`, 'yellow');
    process.exit(1);
  }
  
  // Read and validate manifest
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    log(`❌ Error: Failed to parse manifest.json: ${err.message}`, 'red');
    log(`The manifest file may be corrupted or contain invalid JSON`, 'yellow');
    process.exit(1);
  }
  
  // Check if plugin is planned
  if (manifest.status === 'planned') {
    log(`⚠️  Plugin '${pluginName}' is planned but not yet available`, 'yellow');
    log(`   ${manifest.notes || 'This plugin will be available in a future release'}`, 'yellow');
    log(`\nRun 'npm run plugin:info ${pluginName}' for more details`, 'cyan');
    return;
  }
  
  // Validate package.json exists in project
  const packageJsonPath = path.join(PROJECT_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Error: package.json not found in current directory', 'red');
    log('Make sure you are running this command from the project root', 'yellow');
    process.exit(1);
  }
  
  info(`Installing plugin: ${pluginName}...`);
  
  // Run plugin installation
  const installScript = path.join(pluginDir, 'install.js');
  if (fs.existsSync(installScript)) {
    try {
      const { default: install } = await import(`file://${installScript}`);
      if (typeof install === 'function') {
        await install(PROJECT_DIR);
        success(`Plugin '${pluginName}' installed successfully`);
        info('Run "npm install" to install dependencies');
        log(`\nTo see what was installed, run: npm run plugin:info ${pluginName}`, 'cyan');
      } else {
        log(`❌ Error: Plugin install script does not export a default function`, 'red');
        log(`The install.js file exists but is not properly formatted`, 'yellow');
        process.exit(1);
      }
    } catch (err) {
      log(`❌ Error: Failed to install plugin: ${err.message}`, 'red');
      log(`\nTry running: npm run plugin:info ${pluginName} to verify plugin structure`, 'cyan');
      if (err.stack) {
        log(`\nStack trace:`, 'yellow');
        log(err.stack, 'yellow');
      }
      process.exit(1);
    }
  } else {
    log(`❌ Error: Plugin '${pluginName}' has no install script`, 'red');
    log(`Manual installation may be required`, 'yellow');
    log(`Run 'npm run plugin:info ${pluginName}' for details`, 'cyan');
    process.exit(1);
  }
}

// Main execution
const pluginName = process.argv[2];

if (!pluginName) {
  log('❌ Error: Missing plugin name', 'red');
  log('\nUsage: npm run plugin:add <plugin-name>', 'cyan');
  log('Example: npm run plugin:add praxis', 'dim');
  log('\nRun "npm run plugin:list" to see available plugins', 'cyan');
  process.exit(1);
}

addPlugin(pluginName);

