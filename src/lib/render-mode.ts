/**
 * Render Mode — Standard tri-mode rendering for Plures Svelte-Tauri apps
 *
 * Three modes:
 * 1. gui (default) — Standard Svelte rendering in Tauri webview
 * 2. tui-css — Same webview with terminal-aesthetic CSS (monospace, no animations)
 * 3. tui-native — svelte-ratatui compiled to ratatui widgets (requires plugin)
 *
 * Detection priority:
 * 1. TAURI_TUI=1 env var → tui-native
 * 2. RENDER_MODE=tui-css env var → tui-css
 * 3. ?render=tui-css URL param → tui-css (dev/testing)
 * 4. Default → gui
 *
 * Usage in +layout.svelte:
 *   import { detectRenderMode, renderModeClass, tuiCssOverrides } from '$lib/render-mode.js';
 *   let mode = $state(detectRenderMode());
 *   // Apply: <div class="app {renderModeClass(mode)}">
 *   // Inject: {#if mode === 'tui-css'}{@html `<style>${tuiCssOverrides}</style>`}{/if}
 */

export type RenderMode = 'gui' | 'tui-css' | 'tui-native';

export function detectRenderMode(): RenderMode {
  if (typeof process !== 'undefined') {
    if (process.env.TAURI_TUI === '1') return 'tui-native';
    if (process.env.RENDER_MODE === 'tui-css') return 'tui-css';
  }
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('render');
    if (mode === 'tui-css' || mode === 'tui-native') return mode;
  }
  return 'gui';
}

export function renderModeClass(mode: RenderMode): string {
  switch (mode) {
    case 'tui-css': return 'render-tui-css';
    case 'tui-native': return 'render-tui-native';
    default: return 'render-gui';
  }
}

export const tuiCssOverrides = `
  .render-tui-css {
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace !important;
    font-size: 14px;
    line-height: 1.4;
    -webkit-font-smoothing: none;
  }
  .render-tui-css * {
    font-family: inherit !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transition: none !important;
  }
  .render-tui-css button:hover,
  .render-tui-css button:focus {
    outline: 1px solid var(--accent, #6366f1) !important;
  }
`;
