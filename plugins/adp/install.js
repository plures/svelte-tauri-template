/**
 * ADP Plugin Installation Script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function install(projectDir) {
  const pluginDir = __dirname;
  
  // Read plugin manifest
  const manifest = JSON.parse(
    fs.readFileSync(path.join(pluginDir, 'manifest.json'), 'utf-8')
  );
  
  // Read package.json
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  // Add dependencies
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  
  manifest.dependencies.dev.forEach(dep => {
    packageJson.devDependencies[dep] = 'github:plures/adp';
  });
  
  manifest.dependencies.prod.forEach(dep => {
    packageJson.dependencies[dep] = 'github:plures/adp';
  });
  
  // Add scripts
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  Object.entries(manifest.scripts).forEach(([name, script]) => {
    packageJson.scripts[name] = script;
  });
  
  // Write updated package.json
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8'
  );
  
  // Copy config files
  const configFiles = [
    '.adp-config.json',
    'eslint.config.js'
  ];
  
  configFiles.forEach(configFile => {
    const srcPath = path.join(pluginDir, 'config', configFile);
    const destPath = path.join(projectDir, configFile);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  console.log('✅ ADP plugin installed successfully');
}

