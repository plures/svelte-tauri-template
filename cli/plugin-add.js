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
  
  if (!fs.existsSync(pluginDir)) {
    error(`Plugin '${pluginName}' not found`);
  }
  
  const manifestPath = path.join(pluginDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    error(`Plugin '${pluginName}' has no manifest.json`);
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  if (manifest.status === 'planned') {
    log(`⚠️  Plugin '${pluginName}' is planned but not yet available`, 'yellow');
    log(`   ${manifest.notes || 'This plugin will be available in a future release'}`, 'yellow');
    return;
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
      } else {
        error(`Plugin install script does not export a default function`);
      }
    } catch (err) {
      error(`Failed to install plugin: ${err.message}`);
    }
  } else {
    error(`Plugin '${pluginName}' has no install script`);
  }
}

// Main execution
const pluginName = process.argv[2];

if (!pluginName) {
  error('Usage: node cli/plugin-add.js <plugin-name>');
}

addPlugin(pluginName);

