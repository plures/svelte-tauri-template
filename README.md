# Cross-Platform Framework Template

An extensible template for bootstrapping cross-platform applications using **Svelte 5** and **Tauri 2**.

## 🎯 Purpose

This template was created to:
- Explore creating a simple cross-platform framework using Svelte 5 and Tauri 2
- Provide a foundation for future Plures package integrations
- Enable rapid bootstrapping of new cross-platform projects
- Maintain architectural discipline and code quality

## 🚀 Quick Start

### Create a New Project

```bash
npm run template:create my-new-app
```

Follow the prompts to configure your project.

### Start Development

```bash
cd my-new-app
npm install
npm run dev
```

## 📦 Features

- **Cross-Platform**: Desktop (Windows, macOS, Linux), Android, and iOS
- **Modern Stack**: Svelte 5 + Tauri 2
- **Extensible**: Plugin system for adding features
- **CI/CD Ready**: GitHub Actions workflows included
- **Code Quality**: ADP integration for architectural discipline
- **Auto-Updates**: Built-in update system
- **Multi-Platform Builds**: Automated package generation

## 🔌 Plugin System

### Available Plugins

- **adp** (Required): Architectural Discipline Package
- **praxis**: The Full Plures Application Framework - declarative schemas, logic engine, component generation, and local-first data
- **svelte-ratatui**: TUI rendering — render Svelte components in the terminal via Ratatui
- **state-docs** (Planned): State documentation generation
- **pluresdb** (Planned): Database integration
- **unum** (Planned): Numeric computation library
- **fsm** (Planned): Finite State Machine library

### List Plugins

```bash
npm run plugin:list
```

## 🖥️ TUI Mode

The `svelte-ratatui` plugin lets you render Svelte components in the terminal using [Ratatui](https://ratatui.rs/).

### Add the plugin

```bash
npm run plugin:add svelte-ratatui
npm install
```

### Run in terminal mode

```bash
npm run tui:dev
```

### Run in GUI mode (default)

```bash
npm run tauri:dev
```

### Custom widget mappings

Edit `tui.config.ts` in your project root to map Svelte components to Ratatui widgets. See [`plugins/svelte-ratatui/README.md`](./plugins/svelte-ratatui/README.md) for details.

## 📚 Documentation

Comprehensive documentation is available in the [docs/](./docs/) directory:

- **[Usage Guide](./docs/USAGE.md)** - Create projects from this template
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and structure
- **[Setup & Configuration](./docs/README.md#-setup--configuration)** - Tauri, mobile, and CI/CD setup
- **[Distribution](./docs/README.md#-distribution--release)** - Release and distribution guides
- **[Gotchas & Lessons Learned](./docs/GOTCHAS.md)** - Tauri 2 + Svelte 5 pitfalls to avoid

👉 **[View all documentation](./docs/README.md)**

## 🏗️ Structure

```
├── template/           # Template files with placeholders
├── cli/               # Bootstrap CLI tools
├── plugins/           # Extensible plugin system
├── examples/          # Example implementations
└── docs/              # Documentation
```

## 🔮 Future Integrations

This template is designed to integrate with:

- ✅ **plures/ADP** - Architectural Discipline Package (integrated)
- ✅ **plures/praxis** - Application logic engine (integrated)
- ✅ **plures/svelte-ratatui** - TUI rendering for Svelte (integrated)
- 🔜 **plures/State-docs** - State documentation
- 🔜 **plures/pluresdb** - Database system
- 🔜 **plures/unum** - Numeric computation

## 📄 License

MIT

