#!/usr/bin/env node

/**
 * Bump version across all project files
 * Updates: package.json, src-tauri/tauri.conf.json, src-tauri/Cargo.toml
 * 
 * Usage: node scripts/bump-version.js [patch|minor|major|version]
 * Examples:
 *   node scripts/bump-version.js patch  # 0.1.0 -> 0.1.1
 *   node scripts/bump-version.js minor  # 0.1.0 -> 0.2.0
 *   node scripts/bump-version.js major   # 0.1.0 -> 1.0.0
 *   node scripts/bump-version.js 0.2.5  # Set to specific version
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    toString() {
      return `${this.major}.${this.minor}.${this.patch}`;
    }
  };
}

function bumpVersion(currentVersion, type) {
  const version = parseVersion(currentVersion);
  
  switch (type) {
    case 'major':
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor++;
      version.patch = 0;
      break;
    case 'patch':
      version.patch++;
      break;
    default:
      // Assume it's a specific version string
      if (/^\d+\.\d+\.\d+$/.test(type)) {
        return type;
      }
      throw new Error(`Invalid version type: ${type}. Use 'patch', 'minor', 'major', or 'x.y.z'`);
  }
  
  return version.toString();
}

function updateJsonFile(filePath, updater) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  updater(json);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
  console.log(`✅ Updated ${filePath}`);
}

function updateCargoToml(filePath, newVersion) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Update version = "x.y.z"
  const updated = content.replace(
    /^version\s*=\s*"[^"]+"/m,
    `version = "${newVersion}"`
  );
  fs.writeFileSync(filePath, updated);
  console.log(`✅ Updated ${filePath}`);
}

function getCurrentVersion() {
  // Try to get version from tauri.conf.json first
  const tauriConfigPath = path.join(__dirname, '../src-tauri/tauri.conf.json');
  if (fs.existsSync(tauriConfigPath)) {
    const config = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf-8'));
    if (config.version) {
      return config.version;
    }
  }
  
  // Fallback to package.json
  const packageJsonPath = path.join(__dirname, '../package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    if (pkg.version) {
      return pkg.version;
    }
  }
  
  throw new Error('Could not determine current version');
}

// Main execution
const bumpType = process.argv[2];

if (!bumpType) {
  console.error('Usage: node scripts/bump-version.js [patch|minor|major|version]');
  process.exit(1);
}

try {
  const currentVersion = getCurrentVersion();
  console.log(`Current version: ${currentVersion}`);
  
  const newVersion = bumpVersion(currentVersion, bumpType);
  console.log(`New version: ${newVersion}`);
  
  // Update package.json
  const packageJsonPath = path.join(__dirname, '../package.json');
  updateJsonFile(packageJsonPath, (pkg) => {
    pkg.version = newVersion;
  });
  
  // Update tauri.conf.json
  const tauriConfigPath = path.join(__dirname, '../src-tauri/tauri.conf.json');
  updateJsonFile(tauriConfigPath, (config) => {
    config.version = newVersion;
  });
  
  // Update Cargo.toml
  const cargoTomlPath = path.join(__dirname, '../src-tauri/Cargo.toml');
  updateCargoToml(cargoTomlPath, newVersion);
  
  console.log(`\n✅ Version bumped from ${currentVersion} to ${newVersion}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review changes: git diff`);
  console.log(`  2. Commit: git commit -am "chore: bump version to ${newVersion}"`);
  console.log(`  3. Tag: git tag v${newVersion}`);
  console.log(`  4. Push: git push && git push --tags`);
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}

