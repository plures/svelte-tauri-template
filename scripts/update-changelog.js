#!/usr/bin/env node

/**
 * Update CHANGELOG.md with new release entry
 * 
 * Usage: node scripts/update-changelog.js [version] [release-notes-file]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = process.argv[2];
const releaseNotesPath = process.argv[3];

if (!version) {
  console.error('Usage: node scripts/update-changelog.js [version] [release-notes-file]');
  process.exit(1);
}

const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const today = new Date().toISOString().split('T')[0];

// Read release notes if provided
let releaseNotes = '';
if (releaseNotesPath && fs.existsSync(releaseNotesPath)) {
  releaseNotes = fs.readFileSync(releaseNotesPath, 'utf-8');
  // Remove the header if present
  releaseNotes = releaseNotes.replace(/^# Release.*?\n\n/, '');
} else {
  releaseNotes = `## Changes\n\n- See git log for details`;
}

// Create new changelog entry
const newEntry = `## [${version}] - ${today}\n\n${releaseNotes}\n\n`;

// Read existing changelog or create new one
let changelog = '';
if (fs.existsSync(changelogPath)) {
  changelog = fs.readFileSync(changelogPath, 'utf-8');
  
  // Check if there's already an "Unreleased" section
  if (changelog.includes('## [Unreleased]')) {
    // Replace Unreleased with the new version
    changelog = changelog.replace(/## \[Unreleased\].*?(?=## |$)/s, newEntry + '\n## [Unreleased]\n\n### Added\n\n### Changed\n\n### Fixed\n\n');
  } else {
    // Prepend new entry
    changelog = newEntry + changelog;
  }
} else {
  // Create new changelog
  changelog = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n${newEntry}## [Unreleased]\n\n### Added\n\n### Changed\n\n### Fixed\n\n`;
}

// Write updated changelog
fs.writeFileSync(changelogPath, changelog);
console.log(`✅ Updated CHANGELOG.md with version ${version}`);

