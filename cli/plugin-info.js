#!/usr/bin/env node

/**
 * Display detailed information about a plugin
 * 
 * Usage: node cli/plugin-info.js <plugin-name>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGINS_DIR = path.join(__dirname, '../plugins');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ Error: ${message}`, 'red');
  process.exit(1);
}

function displayPluginInfo(pluginName) {
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
  
  // Read and parse manifest
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    log(`❌ Error: Failed to parse manifest.json: ${err.message}`, 'red');
    log(`The manifest file may be corrupted or contain invalid JSON`, 'yellow');
    process.exit(1);
  }
  
  // Display header
  log('\n' + '='.repeat(60), 'cyan');
  log(`  Plugin: ${pluginName}`, 'bright');
  log('='.repeat(60), 'cyan');
  
  // Basic info
  log(`\n📦 Basic Information`, 'bright');
  log(`  Name:        ${manifest.name || pluginName}`);
  log(`  Version:     ${manifest.version || 'N/A'}`);
  log(`  Author:      ${manifest.author || 'N/A'}`);
  
  // Description
  if (manifest.description) {
    log(`\n📝 Description`, 'bright');
    log(`  ${manifest.description}`);
  }
  
  // Status
  const status = manifest.status || 'available';
  const statusColor = status === 'available' ? 'green' : status === 'planned' ? 'yellow' : 'reset';
  log(`\n🔍 Status`, 'bright');
  log(`  ${status}`, statusColor);
  
  if (manifest.notes) {
    log(`  Note: ${manifest.notes}`, 'yellow');
  }
  
  // Dependencies
  if (manifest.dependencies) {
    log(`\n📚 Dependencies`, 'bright');
    
    if (manifest.dependencies.dev && manifest.dependencies.dev.length > 0) {
      log(`  Development Dependencies:`, 'cyan');
      manifest.dependencies.dev.forEach(dep => {
        log(`    - ${dep}`, 'dim');
      });
    } else {
      log(`  Development Dependencies: None`, 'dim');
    }
    
    if (manifest.dependencies.prod && manifest.dependencies.prod.length > 0) {
      log(`  Production Dependencies:`, 'cyan');
      manifest.dependencies.prod.forEach(dep => {
        log(`    - ${dep}`, 'dim');
      });
    } else {
      log(`  Production Dependencies: None`, 'dim');
    }
  }
  
  // Peer dependencies
  if (manifest.peerDependencies && Object.keys(manifest.peerDependencies).length > 0) {
    log(`  Peer Dependencies:`, 'cyan');
    Object.entries(manifest.peerDependencies).forEach(([dep, version]) => {
      log(`    - ${dep}@${version}`, 'dim');
    });
  }
  
  // Configuration files
  log(`\n⚙️  Configuration Files`, 'bright');
  if (manifest.configFiles && manifest.configFiles.length > 0) {
    log(`  The following files will be added to your project:`, 'cyan');
    manifest.configFiles.forEach(file => {
      const configPath = path.join(pluginDir, 'config', file);
      const exists = fs.existsSync(configPath);
      const marker = exists ? '✓' : '✗';
      const markerColor = exists ? 'green' : 'red';
      log(`    ${marker} ${file}`, markerColor);
    });
  } else {
    log(`  No configuration files`, 'dim');
  }
  
  // Scripts
  log(`\n🔧 NPM Scripts`, 'bright');
  if (manifest.scripts && Object.keys(manifest.scripts).length > 0) {
    log(`  The following scripts will be added to package.json:`, 'cyan');
    Object.entries(manifest.scripts).forEach(([name, command]) => {
      log(`    ${name}:`, 'green');
      log(`      ${command}`, 'dim');
    });
  } else {
    log(`  No NPM scripts`, 'dim');
  }
  
  // Features
  if (manifest.features && Object.keys(manifest.features).length > 0) {
    log(`\n✨ Features`, 'bright');
    Object.entries(manifest.features).forEach(([feature, enabled]) => {
      if (enabled) {
        const displayFeatureName = feature.replace(/([A-Z])/g, ' $1').trim();
        log(`  ✓ ${displayFeatureName}`, 'green');
      }
    });
  }
  
  // Installation check
  const hasInstallScript = fs.existsSync(path.join(pluginDir, 'install.js'));
  
  log(`\n📥 Installation`, 'bright');
  if (status === 'planned') {
    log(`  ⚠️  This plugin is not yet available`, 'yellow');
    log(`  ${manifest.notes || 'Coming soon'}`, 'yellow');
  } else if (!hasInstallScript) {
    log(`  ⚠️  This plugin has no install script`, 'yellow');
    log(`  Manual installation may be required`, 'dim');
  } else {
    log(`  ✓ Ready to install`, 'green');
    log(`  Run: npm run plugin:add ${pluginName}`, 'cyan');
  }
  
  log('\n' + '='.repeat(60), 'cyan');
  log('');
}

// Main execution
const pluginName = process.argv[2];

if (!pluginName) {
  log('❌ Error: Missing plugin name', 'red');
  log('\nUsage: npm run plugin:info <plugin-name>', 'cyan');
  log('Example: npm run plugin:info praxis', 'dim');
  log('\nRun "npm run plugin:list" to see available plugins', 'cyan');
  process.exit(1);
}

displayPluginInfo(pluginName);
