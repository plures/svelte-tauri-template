# svelte-tauri-template Roadmap

## Role in OASIS
This template is the multi‑arch foundation for OASIS apps. It standardizes Svelte + Tauri 2 scaffolding so Radix, plugins, and tools ship consistently across Linux, Windows, macOS, Android, and iOS.

## Current State
- Template is stable and used for cross‑platform app scaffolding.
- TUI plugin integration exists; VS Code‑style shell layout merged.
- No open issues.

## Phase 1 — Template Maintenance
- Keep Tauri 2 and Svelte 5 versions current.
- Consolidate docs and improve quick‑start guidance.
- Harden plugin CLI (add/remove/info with better validation).

## Phase 2 — Mobile & Multi‑Arch
- Document and validate Android/iOS build paths.
- Add mobile‑specific plugin configuration patterns.
- Provide example apps that run on desktop + mobile.

## Phase 3 — Ecosystem Integration
- PluresDB + Unum plugin templates with local‑first defaults.
- Praxis‑driven component generation templates.
- Optional telemetry hooks for performance diagnostics.

## Phase 4 — Production Readiness
- Security hardening guidance for Tauri permissions.
- Performance benchmarks + bundle optimization recipes.
- Release tooling for signed builds across platforms.
