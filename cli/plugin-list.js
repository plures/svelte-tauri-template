#!/usr/bin/env node

/**
 * List available plugins
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
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function listPlugins() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.log('No plugins directory found');
    return;
  }

  const plugins = fs.readdirSync(PLUGINS_DIR)
    .filter(name => {
      const pluginPath = path.join(PLUGINS_DIR, name);
      return fs.statSync(pluginPath).isDirectory();
    })
    .map(name => {
      const manifestPath = path.join(PLUGINS_DIR, name, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        return { name, ...manifest };
      }
      return { name, status: 'unknown' };
    });

  log('\n🔌 Available Plugins', 'bright');
  log('='.repeat(50), 'cyan');

  plugins.forEach((plugin, index) => {
    const status = plugin.status || 'available';
    const statusColor = status === 'available' ? 'green' : status === 'planned' ? 'yellow' : 'reset';
    
    log(`\n${index + 1}. ${plugin.name}`, 'bright');
    if (plugin.description) {
      log(`   ${plugin.description}`, 'reset');
    }
    log(`   Status: ${status}`, statusColor);
    if (plugin.version) {
      log(`   Version: ${plugin.version}`, 'reset');
    }
    if (plugin.notes) {
      log(`   Note: ${plugin.notes}`, 'yellow');
    }
  });

  log('\n');
}

listPlugins();

