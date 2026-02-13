# Design Document: Svelte-Tauri Template

## Vision

A production-ready template for bootstrapping cross-platform applications that unifies:
- **Modern Web**: Svelte 5 reactive UI framework
- **Native Runtime**: Tauri 2 for platform-native capabilities
- **Plures Ecosystem**: Seamless integration with Praxis, PluresDB, and other Plures packages

## Architecture

### Core Template System

```
svelte-tauri-template/
├── template/           # Mustache templates with {{placeholders}}
├── cli/               # Bootstrap CLI (npm run template:create)
├── plugins/           # Modular feature system
├── examples/          # Reference implementations
└── scripts/           # Build & deployment automation
```

**Design Principles:**
1. **Template-First**: Everything is templatable — project names, packages, features
2. **Plugin Architecture**: Features are opt-in via `npm run plugin:add <name>`
3. **Multi-Platform**: Single codebase → Desktop (Win/Mac/Linux) + Mobile (iOS/Android)
4. **Zero-Config Production**: CI/CD, code signing, auto-updates work out-of-box

### Plugin System Design

**Core Plugin (`adp`):** Required. Provides architectural discipline, linting, dependency management.

**Feature Plugins:**
- `praxis` — Declarative app logic, component generation, local-first data patterns
- `pluresdb` (planned) — P2P database with sync
- `state-docs` (planned) — Auto-generate FSM documentation
- `unum` (planned) — High-performance numeric computation

**Plugin Contract:**
```typescript
interface Plugin {
  name: string;
  dependencies: string[];
  files: TemplateFile[];
  configure: (answers: ProjectAnswers) => Config;
}
```

### Build System Architecture

**Development:**
- Vite dev server for web UI
- Tauri dev runner for native app shell
- Hot reload across web ↔ native boundary

**Production:**
- GitHub Actions matrix builds (Windows/Mac/Linux/Mobile)
- Code signing automation (certificates in GitHub secrets)
- Auto-updater with delta patches
- Multi-format distribution (MSI, DMG, AppImage, APK, IPA)

### Integration Points

**Tauri Commands:** Rust backend exposes platform APIs to frontend
**Praxis Integration:** Reactive data flows between Svelte stores and Praxis rules engine
**File System:** Template respects user's preferred project structure
**CI/CD:** Template includes complete deployment pipeline

## Current State (Feb 2026)

✅ **Working:**
- Template creation CLI (`npm run template:create`)
- Svelte 5 + Tauri 2 integration
- Plugin system (adp, praxis plugins working)
- Basic E2E testing with Playwright
- Cross-platform build automation

✅ **Recent Fixes:**
- Template build issues resolved (missing SvelteKit files)
- Praxis v1.2.11 integration completed
- E2E smoke tests added to CI

⚠️ **Technical Debt:**
- Multiple README files need consolidation
- Documentation spread across root-level MD files should move to docs/
- Plugin CLI could be more user-friendly

## Design Decisions

### Why Svelte 5 + Tauri 2?
- **Svelte 5**: Runes provide reactive primitives that map well to Praxis event system
- **Tauri 2**: Mobile support, smaller bundles, better security model than Electron
- **Together**: Combines web development ergonomics with native performance

### Why Plugin Architecture?
- **Gradual Adoption**: Start minimal, add Plures features incrementally
- **Maintenance**: Plugins can evolve independently from template core
- **Reusability**: Same plugin system could power other project types

### Why Template-Based vs Framework?
- **Control**: Users get a real codebase they own, not a black box
- **Customization**: Every aspect is modifiable post-generation
- **Learning**: Template reveals the architecture, doesn't hide it