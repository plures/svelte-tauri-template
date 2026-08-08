#!/usr/bin/env node

/**
 * Add a plugin to the current project
 * 
 * Usage: node cli/plugin-add.js <plugin-name>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  log, logError, logSuccess, logInfo,
  validateAndLoadPlugin, requirePluginArg
} from './plugin-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGINS_DIR = path.join(__dirname, '../plugins');
const PROJECT_DIR = process.cwd();

async function addPlugin(rawName) {
  const result = validateAndLoadPlugin(PLUGINS_DIR, rawName);
  if (!result.ok) {
    logError(result.reason);
    log(`\nRun 'npm run plugin:list' to see available plugins`, 'cyan');
    process.exit(1);
  }

  const { pluginDir, manifest, name: pluginName } = result;

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
    logError('package.json not found in current directory');
    log('Make sure you are running this command from the project root', 'yellow');
    process.exit(1);
  }
  
  logInfo(`Installing plugin: ${pluginName}...`);
  
  // Run plugin installation
  const installScript = path.join(pluginDir, 'install.js');
  if (fs.existsSync(installScript)) {
    try {
      const { default: install } = await import(`file://${installScript}`);
      if (typeof install === 'function') {
        await install(PROJECT_DIR);
        logSuccess(`Plugin '${pluginName}' installed successfully`);
        logInfo('Run "npm install" to install dependencies');
        log(`\nTo see what was installed, run: npm run plugin:info ${pluginName}`, 'cyan');
      } else {
        logError('Plugin install script does not export a default function');
        log('The install.js file exists but is not properly formatted', 'yellow');
        process.exit(1);
      }
    } catch (err) {
      logError(`Failed to install plugin: ${err.message}`);
      log(`\nTry running: npm run plugin:info ${pluginName} to verify plugin structure`, 'cyan');
      if (err.stack) {
        log('\nStack trace:', 'yellow');
        log(err.stack, 'yellow');
      }
      process.exit(1);
    }
  } else {
    logError(`Plugin '${pluginName}' has no install script`);
    log('Manual installation may be required', 'yellow');
    log(`Run 'npm run plugin:info ${pluginName}' for details`, 'cyan');
    process.exit(1);
  }
}

// Main execution
const rawName = requirePluginArg('add');
addPlugin(rawName);

