# Cross-Platform Framework Template

An extensible template for bootstrapping cross-platform applications using **Svelte 5** and **Tauri 2**.

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org/) |
| **Rust** | stable | [rustup.rs](https://rustup.rs/) |
| **Tauri CLI** | 2.x | Installed via `npm install` (uses `@tauri-apps/cli`) |
| **Platform libs** | — | See [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) |

### 1. Create a New Project

```bash
npm run template:create my-new-app
```

The CLI will prompt for project name, description, package identifier, and plugins.

### 2. Install & Run

```bash
cd my-new-app
npm install

# Web only (Vite dev server)
npm run dev

# Desktop app (Tauri)
npm run tauri:dev
```

### 3. Build for Production

```bash
npm run tauri:build            # all desktop platforms
npm run tauri:android:build    # Android
npm run tauri:ios:build        # iOS (requires macOS)
```

## 📦 Features

- **Cross-Platform** — Desktop (Windows, macOS, Linux), Android, and iOS
- **Modern Stack** — Svelte 5 runes + Tauri 2
- **Plugin System** — opt-in features via `npm run plugin:add <name>`
- **GUI + TUI** — render Svelte components in the terminal via the `svelte-ratatui` plugin
- **CI/CD Ready** — GitHub Actions workflows for builds, releases, and code signing
- **Auto-Updates** — built-in Tauri updater with signed manifests

## 🔌 Plugins

| Plugin | Status | Description |
|--------|--------|-------------|
| **adp** | Required | Architectural Discipline Package |
| **praxis** | ✅ Integrated | Declarative schemas, logic engine, component generation, local-first data |
| **svelte-ratatui** | ✅ Integrated | TUI rendering via [Ratatui](https://ratatui.rs/) |
| **pluresdb** | 🔜 Planned | Distributed database with P2P sync |
| **state-docs** | 🔜 Planned | State documentation generation |
| **unum** | 🔜 Planned | Numeric computation library |

```bash
npm run plugin:list            # show available plugins
npm run plugin:add <name>      # add a plugin to your project
npm run plugin:remove <name>   # remove a plugin
npm run plugin:info <name>     # show plugin details
```

## 🖥️ TUI Mode

```bash
npm run plugin:add svelte-ratatui && npm install
npm run tui:dev                # terminal mode
npm run tauri:dev              # GUI mode (default)
```

Edit `tui.config.ts` to map Svelte components to Ratatui widgets. See [`plugins/svelte-ratatui/README.md`](./plugins/svelte-ratatui/README.md) for details.

## 🏗️ Project Structure

```
├── template/           # Template files with {{placeholders}}
├── cli/                # Bootstrap & plugin CLI tools
├── plugins/            # Modular plugin system
├── src/                # SvelteKit frontend source
├── src-tauri/          # Tauri / Rust backend
├── docs/               # Full documentation
└── e2e/                # Playwright E2E tests
```

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Usage Guide](./docs/USAGE.md) | Create projects, add plugins, template variables |
| [Architecture](./docs/ARCHITECTURE.md) | System design, plugin lifecycle, extensibility |
| [Design Decisions](./docs/DESIGN.md) | Why Svelte 5 + Tauri 2, plugin vs framework |
| [Gotchas](./docs/GOTCHAS.md) | Tauri 2 + Svelte 5 pitfalls to avoid |
| [Tauri Setup](./docs/TAURI_SETUP.md) | Platform-specific Tauri configuration |
| [Mobile](./docs/MOBILE.md) | Android & iOS development setup |
| [CI/CD](./docs/CI_CD.md) | GitHub Actions workflows |
| [Distribution](./docs/DISTRIBUTION.md) | Building & distributing for all platforms |
| [Release](./docs/RELEASE.md) | Automated release workflow |
| [Code Signing](./docs/CODE_SIGNING.md) | Signing for Windows, macOS, mobile |
| [Auto-Updates](./docs/AUTO_UPDATES.md) | Tauri updater configuration |
| [Roadmap](./docs/ROADMAP.md) | Project roadmap and phases |

👉 **[Browse all docs](./docs/README.md)**

## 📄 License

MIT

