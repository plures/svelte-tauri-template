# Tauri 2 + Svelte 5 — Gotchas & Lessons Learned

Hard-won lessons from building real apps with this stack. Read this before you waste hours.

---

## Tauri 2 Configuration

### ❌ `app.title` is invalid
Tauri v2 does **not** accept `title` on the `app` object. Title goes on individual window entries only.

```jsonc
// WRONG
{ "app": { "title": "My App" } }

// CORRECT
{ "app": { "windows": [{ "title": "My App" }] } }
```

### ❌ Plugin config maps cause crashes
`fs`, `dialog`, and `shell` plugins do **not** accept configuration objects. They expect empty `{}` in `plugins.*`. All scoping goes in `capabilities/default.json`.

```jsonc
// WRONG — Tauri expects unit type, not map
{ "plugins": { "dialog": { "open": true }, "fs": { "scope": ["$APPDATA/**"] } } }

// CORRECT
{ "plugins": { "dialog": {}, "shell": {}, "fs": {} } }
```

Then in `src-tauri/capabilities/default.json`:
```jsonc
{
  "permissions": [
    "fs:default",
    { "identifier": "fs:allow-read-text-file", "allow": [{ "path": "$APPDATA/**" }] },
    { "identifier": "fs:allow-write-text-file", "allow": [{ "path": "$APPDATA/**" }] },
    "dialog:default",
    "shell:default"
  ]
}
```

### ✅ Enable devtools for debug builds
Add to `src-tauri/Cargo.toml` so F12 works during development:

```toml
[features]
default = ["custom-protocol", "devtools"]
devtools = ["tauri/devtools"]
custom-protocol = ["tauri/custom-protocol"]
```

### ✅ Custom titlebar — use Windows-style controls on Windows
If you set `"decorations": false`, you **must** provide window controls. Don't use mac-style traffic lights on Windows — users won't know what they are.

- Minimize (─), Maximize (□), Close (✕) — right-aligned
- Close button: red hover (`#e81123`)
- Use `getCurrentWindow()` from `@tauri-apps/api/window` for minimize/toggleMaximize/close
- Track maximized state for the restore icon (⧉ vs □)

---

## Svelte 5 Pitfalls

### ❌ `on:click` is deprecated — use `onclick`
Svelte 5 silently ignores the old `on:click` directive. Buttons render but **do nothing** when clicked. No error, no warning.

```svelte
<!-- WRONG — silently broken in Svelte 5 -->
<button on:click={handleSave}>Save</button>

<!-- CORRECT -->
<button onclick={handleSave}>Save</button>
```

This applies to all event handlers: `on:input` → `oninput`, `on:change` → `onchange`, `on:keydown` → `onkeydown`, etc.

### ❌ `{@html}` content is unscoped by CSS
Content injected via `{@html}` doesn't receive Svelte's scoping classes. Your CSS rules won't match.

```svelte
<!-- This CSS WON'T style the h1 inside {@html} -->
<div class="preview">{@html rendered}</div>
<style>
  .preview h1 { color: white; } /* ❌ Never matches */
  .preview :global(h1) { color: white; } /* ✅ Works */
</style>
```

### ❌ `let x = value` in components isn't reactive
Use `$state()` for reactive local state in Svelte 5:

```svelte
<!-- WRONG — not reactive -->
<script>let show = visible;</script>

<!-- CORRECT -->
<script>let show = $state(false);</script>
```

---

## Settings / Store Race Condition

### ❌ Layout `onMount` and child `onMount` run concurrently
If you load settings in layout's `onMount`, child pages may read default (empty) values.

```svelte
<!-- +layout.svelte — WRONG -->
<script>
  onMount(async () => { await settings.load(); });
</script>
{@render children()}

<!-- +layout.svelte — CORRECT -->
<script>
  let ready = $state(false);
  onMount(async () => { await settings.load(); ready = true; });
</script>
{#if ready}{@render children()}{/if}
```

---

## OpenClaw Gateway Integration

### ❌ `client.id` must be a gateway constant
The gateway validates `client.id` against a fixed enum. Arbitrary names are rejected.

Valid values: `webchat-ui`, `webchat`, `cli`, `gateway-client`, `openclaw-control-ui`, `openclaw-macos`, `openclaw-ios`, `openclaw-android`, `node-host`, `test`, `openclaw-probe`

Valid modes: `webchat`, `cli`, `ui`, `backend`, `node`, `probe`

### ❌ Protocol version must match
As of OpenClaw 2026.2.x, the gateway uses **protocol version 3**. Sending version 1 causes a protocol mismatch error.

```typescript
// CORRECT
{ minProtocol: 3, maxProtocol: 3 }
```

---

## General

### ✅ Component-only pages
Keep page files free of raw HTML elements (`<button>`, `<input>`, `<textarea>`, etc.). Wrap everything in `$lib/components/`. This ensures consistent styling and makes the design system swappable.

### ✅ `$schema` in tauri.conf.json
Point to the real Tauri schema, not a custom one:
```jsonc
{ "$schema": "https://raw.githubusercontent.com/tauri-apps/tauri/dev/crates/tauri-cli/schema.json" }
```

### ❌ Don't externalize `@tauri-apps/*` in Vite
Tauri APIs are **regular npm packages** that Vite must bundle. Do NOT add them to `rollupOptions.external` or `optimizeDeps.exclude`. The webview is a browser — it cannot resolve bare module specifiers at runtime.

```typescript
// WRONG — causes "Failed to resolve module specifier" at runtime
build: {
  rollupOptions: {
    external: (id) => id.startsWith('@tauri-apps/')
  }
}

// CORRECT — just don't mention them. Let Vite bundle normally.
```

### ❌ CSP blocks Tauri IPC
If you set a custom CSP, you **must** include Tauri's IPC origins in `connect-src`:

```
connect-src 'self' ipc: http://ipc.localhost ...
```

Without these, all `invoke()` calls, window controls, and plugin commands fail silently or with "violates Content Security Policy."

### ❌ Window and path commands need ACL permissions
Tauri v2 blocks everything by default. If you use custom titlebar controls or `appDataDir()`, add to `capabilities/default.json`:

```jsonc
"core:window:default",
"core:window:allow-is-maximized",
"core:window:allow-minimize",
"core:window:allow-toggle-maximize",
"core:window:allow-close",
"core:path:default"
```
