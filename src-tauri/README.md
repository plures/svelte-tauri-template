# Tauri scaffold (built-in GUI)

This `src-tauri/` makes the desktop GUI **built-in**: `npm run tauri:dev` launches a real window.

- **Thin Rust** (`src/lib.rs`): events-not-commands. Commands (`navigate`, `get_window_state`,
  `save_window_state`, `set_tray_menu`) are wrappers that emit events
  (`app-booted`, `window-state-changed`, `user-navigated`). No business logic in Rust.
- **CSP** restrictive (`tauri.conf.json` → `app.security.csp`); never `null`.
- **Capabilities** least-privilege (`capabilities/default.json`).
- **Release profile** size-optimized (opt-level=s, lto, codegen-units=1, panic=abort, strip).

Icons are generated with `npm run tauri -- icon path/to/1024.png`. Mobile dirs (`gen/`) are
created by `tauri android init` / `tauri ios init` and gitignored.
