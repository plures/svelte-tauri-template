/**
 * Shared utilities for plugin CLI commands.
 *
 * Centralises plugin-name validation, path-traversal prevention, and
 * manifest loading so that add / remove / info all enforce the same rules.
 */

import fs from 'fs';
import path from 'path';

// Only allow alphanumeric, hyphens, and underscores — no dots, slashes, etc.
const VALID_PLUGIN_NAME = /^[a-zA-Z0-9_-]+$/;

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

export function log(message, color = 'reset') {
  console.log(`${colors[color] || colors.reset}${message}${colors.reset}`);
}

export function logError(message) {
  log(`❌ Error: ${message}`, 'red');
}

export function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

export function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

export function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Validate a plugin name and return a normalised version (trimmed).
 * Returns `{ valid: true, name }` or `{ valid: false, reason }`.
 */
export function validatePluginName(raw) {
  if (raw === undefined || raw === null) {
    return { valid: false, reason: 'Plugin name is required' };
  }

  const name = String(raw).trim();

  if (name.length === 0) {
    return { valid: false, reason: 'Plugin name must not be empty' };
  }

  if (name.length >= 128) {
    return { valid: false, reason: 'Plugin name must be less than 128 characters' };
  }

  if (!VALID_PLUGIN_NAME.test(name)) {
    return {
      valid: false,
      reason: `Plugin name '${name}' contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed`
    };
  }

  return { valid: true, name };
}

/**
 * Resolve the plugin directory, ensuring it stays within PLUGINS_DIR.
 * Returns the absolute path or null if the path escapes.
 */
export function resolvePluginDir(pluginsDir, pluginName) {
  const resolved = path.resolve(pluginsDir, pluginName);
  // Ensure the resolved path is a direct child of pluginsDir
  if (!resolved.startsWith(pluginsDir + path.sep) && resolved !== pluginsDir) {
    return null;
  }
  return resolved;
}

/**
 * Load and parse a plugin manifest.json.
 * Returns `{ ok: true, manifest }` or `{ ok: false, reason }`.
 */
export function loadManifest(pluginDir) {
  const manifestPath = path.join(pluginDir, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    return { ok: false, reason: 'Plugin has no manifest.json' };
  }

  try {
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(raw);

    if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
      return { ok: false, reason: 'manifest.json must be a JSON object' };
    }

    return { ok: true, manifest };
  } catch (err) {
    return { ok: false, reason: `Failed to parse manifest.json: ${err.message}` };
  }
}

/**
 * Full validation pipeline: name → path → existence → manifest.
 * Returns `{ ok, pluginDir, manifest, reason }`.
 */
export function validateAndLoadPlugin(pluginsDir, rawName) {
  const nameResult = validatePluginName(rawName);
  if (!nameResult.valid) {
    return { ok: false, reason: nameResult.reason };
  }

  const pluginDir = resolvePluginDir(pluginsDir, nameResult.name);
  if (!pluginDir) {
    return { ok: false, reason: 'Invalid plugin path' };
  }

  if (!fs.existsSync(pluginDir)) {
    return { ok: false, reason: `Plugin '${nameResult.name}' not found` };
  }

  const manifestResult = loadManifest(pluginDir);
  if (!manifestResult.ok) {
    return { ok: false, reason: manifestResult.reason, pluginDir };
  }

  return { ok: true, pluginDir, manifest: manifestResult.manifest, name: nameResult.name };
}

/**
 * Parse the plugin name argument from process.argv and exit with usage
 * information when missing.
 */
export function requirePluginArg(command) {
  const raw = process.argv[2];
  if (!raw || raw.trim().length === 0) {
    logError('Missing plugin name');
    log(`\nUsage: npm run plugin:${command} <plugin-name>`, 'cyan');
    log(`Example: npm run plugin:${command} praxis`, 'dim');
    log(`\nRun "npm run plugin:list" to see available plugins`, 'cyan');
    process.exit(1);
  }
  return raw;
}
