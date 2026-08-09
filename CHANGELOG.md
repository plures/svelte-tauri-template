## [0.4.1] — 2026-08-09

- fix: harden plugin CLI validation (add/remove/info) (#29) (b0bba55)
- chore: update Tauri 2 and Svelte 5 dependencies to latest (#28) (d277472)
- docs: consolidate docs and improve quick-start guidance (#30) (c82179e)
- chore: delegate dependabot-auto-merge.yml to org reusable template (#27) (4fdf16f)

## [0.4.0] — 2026-07-24

- ci(release): trigger release pipeline on merge to main (#26) (9d256df)
- ci: migrate Tech Doc Writer to shared reusable (8bca603)
- ci: add security-aware Dependabot auto-merge workflow (org backfill) (4992084)
- feat: pluresdb plugin delivers full application runtime (#24) (11fcb4a)
- feat: built-in GUI/TUI/MCP foundation (stage 1) (#25) (04736d3)
- ci: change release trigger from push-to-main to tag-only (8d28264)

## [0.3.1] — 2026-05-11

- refactor: replace inline lifecycle with reusable workflow call (789a141)
- docs: refresh ROADMAP.md with OASIS strategic alignment (6c72437)

## [0.3.0] — 2026-04-23

- feat: add render-mode utility for tri-mode rendering (GUI/TUI CSS/TUI native) (ac61985)
- docs: update copilot-instructions with praxis, design-dojo, automation rules (0c29335)

## [0.2.0] — 2026-04-23

- feat(release): add target_version input for milestone-driven releases (620b4fd)
- feat(lifecycle): milestone-close triggers roadmap-aware release (cb3fa14)
- feat(lifecycle v12): auto-release when milestone completes (361fa14)
- feat(lifecycle v11): smart CI failure handling — infra vs code (cd18037)
- fix(lifecycle): label-based retry counter + CI fix priority (b59b747)
- ci: inline lifecycle workflow — fix schedule failures (cc610c9)
- ci: add Design-Dojo UI compliance gate (cf94c8f)
- ci: standardize Node version to lts/* — remove hardcoded versions (03914ff)
- ci: tech-doc-writer triggers on minor prerelease only [actions-optimization] (7ceb955)
- ci: add concurrency group to copilot-pr-lifecycle [actions-optimization] (f147fbc)
- ci: centralize lifecycle — event-driven with schedule guard (743ae0e)
- feat: VS Code-style app shell layout (#20) (3f6da79)
- fix(lifecycle): v9.1 — fix QA dispatch (client_payload as JSON object) (d2599f5)
- fix(lifecycle): rewrite v9 — apply suggestions, merge, no nudges (32d97a2)
- chore: standardize license to MIT (d2aab0a)
- chore: standardize copilot-pr-lifecycle.yml to canonical version (3e18df5)
- fix: add packages:write + id-token:write to release workflow (7e06ea8)
- [WIP] Add svelte-ratatui plugin for TUI capability by default (#18) (82e9bd4)
- chore: apply org-standard automation files (#16) (502c119)
- ci: add PR lane event relay to centralized merge FSM (54b264a)
- docs: Add CSP + ACL gotchas for Tauri v2 (b2bb6e8)
- docs: Add Vite externalize gotcha for Tauri APIs (032668e)
- docs: Add Tauri 2 + Svelte 5 gotchas guide (fadff27)
- fix(ci): fix workflow file issues in desktop-build.yml (#15) (be540b6)
- fix(ci): correct least-privilege permissions across all workflow files (#13) (03f2919)
- fix(ci): add top-level permissions block to release workflow (#11) (3bdd039)
- Add plugin:info and plugin:remove commands with enhanced error handling (#9) (d44cea7)
- Consolidate documentation into docs/ directory (#8) (866c153)
- Add comprehensive design and roadmap documentation (dfb7c32)
- Fix template build: add missing SvelteKit source files (#5) (480c652)
- Add Playwright E2E smoke test + CI workflow (#3) (89a9250)
- Add @plures/praxis v1.2.11 plugin integration (#2) (384b47e)
- Remove fsm entry and add praxis entry in README (3e15d4e)
- Initial commit: Svelte 5 + Tauri 2 cross-platform template (154f6f4)

