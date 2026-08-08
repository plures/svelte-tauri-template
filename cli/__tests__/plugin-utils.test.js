import { describe, it, expect } from 'vitest';
import path from 'path';
import { validatePluginName, resolvePluginDir, loadManifest } from '../plugin-utils.js';

describe('validatePluginName', () => {
  it('accepts valid names', () => {
    expect(validatePluginName('praxis')).toEqual({ valid: true, name: 'praxis' });
    expect(validatePluginName('my-plugin')).toEqual({ valid: true, name: 'my-plugin' });
    expect(validatePluginName('plugin_v2')).toEqual({ valid: true, name: 'plugin_v2' });
  });

  it('trims whitespace', () => {
    expect(validatePluginName('  praxis  ')).toEqual({ valid: true, name: 'praxis' });
  });

  it('rejects null/undefined/empty', () => {
    expect(validatePluginName(undefined).valid).toBe(false);
    expect(validatePluginName(null).valid).toBe(false);
    expect(validatePluginName('').valid).toBe(false);
    expect(validatePluginName('   ').valid).toBe(false);
  });

  it('rejects path traversal characters', () => {
    expect(validatePluginName('../etc').valid).toBe(false);
    expect(validatePluginName('foo/bar').valid).toBe(false);
    expect(validatePluginName('foo\\bar').valid).toBe(false);
    expect(validatePluginName('.hidden').valid).toBe(false);
  });

  it('rejects names exceeding 128 characters', () => {
    const longName = 'a'.repeat(129);
    expect(validatePluginName(longName).valid).toBe(false);
  });

  it('rejects special characters', () => {
    expect(validatePluginName('foo@bar').valid).toBe(false);
    expect(validatePluginName('foo bar').valid).toBe(false);
    expect(validatePluginName('foo!').valid).toBe(false);
  });
});

describe('resolvePluginDir', () => {
  const pluginsDir = '/project/plugins';

  it('resolves valid child paths', () => {
    expect(resolvePluginDir(pluginsDir, 'praxis')).toBe(path.resolve(pluginsDir, 'praxis'));
  });

  it('rejects traversal attempts', () => {
    expect(resolvePluginDir(pluginsDir, '..')).toBeNull();
    expect(resolvePluginDir(pluginsDir, '../etc')).toBeNull();
  });
});

describe('loadManifest', () => {
  it('returns error for missing manifest', () => {
    const result = loadManifest('/nonexistent/path');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('no manifest.json');
  });
});
