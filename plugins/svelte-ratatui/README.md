# svelte-ratatui Plugin

TUI (Terminal User Interface) rendering capability for Svelte apps. This plugin enables your Svelte components to render in the terminal using [Ratatui](https://ratatui.rs/) via the `svelte-ratatui` compiler.

## Overview

- **Dual-mode rendering** — the same Svelte components work in both GUI (browser/Tauri webview) and TUI (terminal)
- **Widget mappings** — HTML elements are mapped to Ratatui terminal widgets
- **Theme support** — consistent colour palette across GUI and TUI modes
- **Vite integration** — the `svelte-ratatui-compiler` Vite plugin handles compilation

## Installation

```bash
npm run plugin:add svelte-ratatui
npm install
```

Then add `tauri-plugin-tui` to your `src-tauri/Cargo.toml`:

```toml
[dependencies]
tauri-plugin-tui = "0.1.0"
```

And register the plugin in `src-tauri/src/main.rs`:

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_tui::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Usage

### Running in GUI mode (default)

```bash
npm run tauri:dev
```

### Running in TUI / terminal mode

```bash
npm run tui:dev
```

This sets the `TAURI_TUI=1` environment variable, which activates terminal rendering.

### Building for TUI

```bash
npm run tui:build
```

## Configuration

The plugin installs a `tui.config.ts` file in your project root. Edit it to customise widget mappings and theme colours.

### Widget Mappings

Map HTML elements to Ratatui widgets:

```ts
{
  component: 'button',
  widget: 'Button',
  props: { onclick: 'on_click', disabled: 'disabled' },
}
```

### Theme

Customise terminal colours:

```ts
theme: {
  colors: {
    primary: '#ff3e00',
    secondary: '#676778',
    background: '#1a1a2e',
    foreground: '#e0e0e0',
    accent: '#40b3ff',
    error: '#ff4444',
    warning: '#ffbb33',
    success: '#00c851',
  },
  borders: {
    style: 'rounded',  // 'plain' | 'rounded' | 'double' | 'thick'
  },
}
```

### Adding Custom Widget Mappings

To map a custom Svelte component to a Ratatui widget, add an entry to the `widgets` array in `tui.config.ts`:

```ts
{
  component: 'MyChart',
  widget: 'BarChart',
  props: { data: 'data', title: 'title' },
}
```

The `component` field matches the Svelte component or HTML tag name. The `widget` field is the target Ratatui widget. The optional `props` object maps Svelte prop names to widget property names.

## Related

- [plures/svelte-ratatui](https://github.com/plures/svelte-ratatui) — the compiler and runtime
- [Ratatui](https://ratatui.rs/) — Rust TUI framework
