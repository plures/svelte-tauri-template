#!/usr/bin/env node

/**
 * Generate Tauri updater manifest from GitHub Release
 * This script creates a JSON manifest that points to GitHub Releases
 * 
 * Usage: node scripts/generate-update-manifest.js [output-file] [version]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get version from command line or tauri.conf.json
const version = process.argv[3] || (() => {
  const tauriConfigPath = path.join(__dirname, '../src-tauri/tauri.conf.json');
  const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf-8'));
  return tauriConfig.version;
})();

// Get repository info from environment or package.json
const repo = process.env.GITHUB_REPOSITORY || 
  (() => {
    try {
      const packageJsonPath = path.join(__dirname, '../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const repoUrl = packageJson.repository?.url || packageJson.repository;
      if (typeof repoUrl === 'string') {
        const match = repoUrl.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/);
        if (match) return match[1];
      }
    } catch (e) {
      // Ignore errors
    }
    return null;
  })() ||
  'YOUR_USERNAME/YOUR_REPO'; // Fallback - update this

const [owner, repoName] = repo.split('/');

// GitHub Releases base URL
const releasesBaseUrl = `https://github.com/${owner}/${repoName}/releases/download/v${version}`;

// Platform mappings for Tauri updater
// These prioritize proper installer/package formats for distribution
const platformMap = {
  'windows-x86_64': {
    bundle: 'msi',
    extension: 'msi',
    name: `Microsoft Pay Calculator_${version}_x64_en-US.msi`,
    description: 'Windows MSI installer package'
  },
  'darwin-x86_64': {
    bundle: 'dmg',
    extension: 'dmg',
    name: `Microsoft Pay Calculator_${version}_x64.dmg`,
    description: 'macOS DMG disk image (Intel)',
    fallback: {
      bundle: 'app',
      extension: 'app.tar.gz',
      name: `Microsoft Pay Calculator_${version}_x64.app.tar.gz`
    }
  },
  'darwin-aarch64': {
    bundle: 'dmg',
    extension: 'dmg',
    name: `Microsoft Pay Calculator_${version}_aarch64.dmg`,
    description: 'macOS DMG disk image (Apple Silicon)',
    fallback: {
      bundle: 'app',
      extension: 'app.tar.gz',
      name: `Microsoft Pay Calculator_${version}_aarch64.app.tar.gz`
    }
  },
  'linux-x86_64': {
    bundle: 'appimage',
    extension: 'AppImage.tar.gz',
    name: `Microsoft Pay Calculator_${version}_amd64.AppImage.tar.gz`,
    description: 'Linux AppImage (portable package)',
    fallbacks: [
      {
        bundle: 'deb',
        extension: 'deb',
        name: `microsoft-pay-calculator_${version}_amd64.deb`,
        description: 'Linux DEB package (Debian/Ubuntu)'
      },
      {
        bundle: 'rpm',
        extension: 'rpm',
        name: `microsoft-pay-calculator-${version}-1.x86_64.rpm`,
        description: 'Linux RPM package (RedHat/Fedora)'
      }
    ]
  }
};

// Read release notes from environment or use default
const releaseNotes = process.env.RELEASE_NOTES || 
  process.env.GITHUB_EVENT_PATH ? (() => {
    try {
      const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf-8'));
      return event.release?.body || `Release ${version}`;
    } catch (e) {
      return `Release ${version}`;
    }
  })() : 
  `Release ${version}`;

// Generate manifest
const manifest = {
  version: version,
  notes: releaseNotes,
  pub_date: new Date().toISOString(),
  platforms: {}
};

// Add platforms with GitHub Releases URLs
for (const [platform, config] of Object.entries(platformMap)) {
  const fileName = config.name;
  const url = `${releasesBaseUrl}/${fileName}`;
  const sigFileName = `${fileName}.sig`;
  
  // For now, we'll leave signature empty - it should be populated after signing
  // The signature will be in a .sig file next to the bundle
  manifest.platforms[platform] = {
    signature: '', // Will be read from .sig file or populated by CI
    url: url
  };
}

// Try to read signatures if .sig files exist locally
const bundleDir = path.join(__dirname, '../src-tauri/target/release/bundle');
for (const config of Object.values(platformMap)) {
  // Use glob pattern matching (simplified - in production use glob library)
  try {
    // For now, we'll leave it empty and let CI populate it
    // Or read from actual .sig file if it exists
  } catch (e) {
    // Ignore
  }
}

// Output manifest
const outputPath = process.argv[2] || path.join(__dirname, '../latest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Generated update manifest: ${outputPath}`);
console.log(`📦 Version: ${version}`);
console.log(`🔗 Repository: ${owner}/${repoName}`);
console.log(`🌐 Release URL: https://github.com/${owner}/${repoName}/releases/tag/v${version}`);
console.log(`\n📋 Next steps:`);
console.log(`   1. Sign your update files: bash scripts/sign-update-files.sh`);
console.log(`   2. Update signatures in manifest (or let CI do it)`);
console.log(`   3. Upload manifest to GitHub Gist or host it`);
console.log(`   4. Update tauri.conf.json endpoint URL`);
