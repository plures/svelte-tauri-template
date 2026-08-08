#!/usr/bin/env node

/**
 * Remove a plugin from the current project
 * 
 * Usage: node cli/plugin-remove.js <plugin-name>
 */

import fs from 'fs';
import path from 'path';
import {
  log, logError, logSuccess, logInfo, logWarning,
  validateAndLoadPlugin, requirePluginArg
} from './plugin-utils.js';

const PROJECT_DIR = process.cwd();

async function removePlugin(rawName) {
  // Use the shared plugins dir derived from this file's location
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const PLUGINS_DIR = path.join(__dirname, '../plugins');

  const result = validateAndLoadPlugin(PLUGINS_DIR, rawName);
  if (!result.ok) {
    logError(result.reason);
    log(`\nRun 'npm run plugin:list' to see available plugins`, 'cyan');
    process.exit(1);
  }

  const { manifest, name: pluginName } = result;
  
  logInfo(`Removing plugin: ${pluginName}...`);
  
  // Read package.json
  const packageJsonPath = path.join(PROJECT_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json not found in current directory');
    log('Make sure you are running this command from the project root', 'yellow');
    process.exit(1);
  }
  
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  } catch (err) {
    logError(`Failed to parse package.json: ${err.message}`);
    process.exit(1);
  }
  
  let changesMade = false;
  
  // Remove dependencies
  if (manifest.dependencies) {
    if (manifest.dependencies.dev && manifest.dependencies.dev.length > 0) {
      manifest.dependencies.dev.forEach(dep => {
        if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
          delete packageJson.devDependencies[dep];
          logInfo(`Removed dev dependency: ${dep}`);
          changesMade = true;
        }
      });
    }
    
    if (manifest.dependencies.prod && manifest.dependencies.prod.length > 0) {
      manifest.dependencies.prod.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          delete packageJson.dependencies[dep];
          logInfo(`Removed dependency: ${dep}`);
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
        logInfo(`Removed script: ${scriptName}`);
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
      logSuccess('Updated package.json');
    } catch (err) {
      logError(`Failed to write package.json: ${err.message}`);
      process.exit(1);
    }
  } else {
    logWarning('No changes made to package.json (plugin may not have been installed)');
  }
  
  // Remove config files
  if (manifest.configFiles && manifest.configFiles.length > 0) {
    let removedCount = 0;
    manifest.configFiles.forEach(configFile => {
      const filePath = path.join(PROJECT_DIR, configFile);
      
      // Prevent path traversal in configFiles entries
      const resolvedConfig = path.resolve(PROJECT_DIR, configFile);
      if (!resolvedConfig.startsWith(PROJECT_DIR + path.sep) && resolvedConfig !== PROJECT_DIR) {
        logWarning(`Skipping suspicious config path: ${configFile}`);
        return;
      }

      if (fs.existsSync(filePath)) {
        try {
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
          logInfo(`Removed config file: ${configFile}`);
          removedCount++;
        } catch (err) {
          logWarning(`Failed to remove ${configFile}: ${err.message}`);
        }
      }
    });
    
    if (removedCount > 0) {
      logSuccess(`Removed ${removedCount} configuration file(s)`);
    } else {
      logWarning('No configuration files found to remove');
    }
  }
  
  log('');
  logSuccess(`Plugin '${pluginName}' removed successfully`);
  
  if (changesMade) {
    logInfo('Run "npm install" to update installed packages');
  }
  
  log('');
}

// Main execution
const rawName = requirePluginArg('remove');
removePlugin(rawName);
