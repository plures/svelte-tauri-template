#!/usr/bin/env node

/**
 * Display detailed information about a plugin
 * 
 * Usage: node cli/plugin-info.js <plugin-name>
 */

import fs from 'fs';
import path from 'path';
import {
  log, logError,
  validateAndLoadPlugin, requirePluginArg
} from './plugin-utils.js';

function displayPluginInfo(rawName) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const PLUGINS_DIR = path.join(__dirname, '../plugins');

  const result = validateAndLoadPlugin(PLUGINS_DIR, rawName);
  if (!result.ok) {
    logError(result.reason);
    log(`\nRun 'npm run plugin:list' to see available plugins`, 'cyan');
    process.exit(1);
  }

  const { pluginDir, manifest, name: pluginName } = result;
  
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
        const displayName = feature.replace(/([A-Z])/g, ' $1').trim();
        log(`  ✓ ${displayName}`, 'green');
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
const rawName = requirePluginArg('info');
displayPluginInfo(rawName);
