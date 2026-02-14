# Cross-Platform Framework Template Architecture

## Overview

This project serves as an extensible template for bootstrapping cross-platform applications using:
- **Svelte 5** - Modern reactive UI framework
- **Tauri 2** - Cross-platform desktop and mobile framework
- **Architectural Discipline Package (ADP)** - Code quality and architecture enforcement
- **Future Integrations**: State-docs, pluresdb, unum, fsm

## Template Structure

```
├── template/                    # Template files with placeholders
│   ├── config/                 # Template configuration
│   │   ├── manifest.json     # Template manifest
│   │   └── placeholders.json    # Placeholder definitions
│   ├── src/                    # Source template files
│   ├── src-tauri/              # Tauri template files
│   └── scripts/                # Build and utility scripts
├── cli/                        # CLI tool for bootstrapping
│   └── bootstrap.js            # Main bootstrap script
├── plugins/                    # Extensible plugin system
│   ├── adp/                    # ADP integration plugin
│   ├── state-docs/             # State-docs plugin (future)
│   ├── pluresdb/               # pluresdb plugin (future)
│   ├── unum/                   # unum plugin (future)
│   └── fsm/                    # FSM plugin (future)
├── examples/                   # Example implementations
│   └── pay-calculator/          # Current app as example
└── docs/                       # Template documentation
```

## Plugin System

Plugins are modular extensions that can be added to projects:

### Plugin Structure
```
plugins/{plugin-name}/
├── manifest.json               # Plugin metadata
├── install.js                  # Installation script
├── config/                     # Plugin configuration templates
├── src/                        # Plugin source code
└── README.md                   # Plugin documentation
```

### Plugin Lifecycle
1. **Discovery**: Plugins are discovered from `plugins/` directory
2. **Installation**: Run `install.js` to integrate plugin
3. **Configuration**: Merge plugin config into project
4. **Integration**: Add dependencies and setup code

## Template Variables

Templates use placeholders that are replaced during bootstrap:

- `{{PROJECT_NAME}}` - Project name
- `{{PROJECT_DESCRIPTION}}` - Project description
- `{{AUTHOR_NAME}}` - Author name
- `{{AUTHOR_EMAIL}}` - Author email
- `{{PACKAGE_IDENTIFIER}}` - Package identifier (e.g., com.example.app)
- `{{VERSION}}` - Initial version
- `{{GITHUB_REPO}}` - GitHub repository URL

## Bootstrap Process

1. **Initialize**: Run `npm run template:create <project-name>`
2. **Configure**: Answer prompts for project details
3. **Select Plugins**: Choose which plugins to include
4. **Generate**: Create new project from template
5. **Install**: Install dependencies and setup

## Extensibility Points

### 1. Plugin Integration
- Add new plugins to `plugins/` directory
- Plugins can add dependencies, config, and code
- Plugins are optional and can be added later

### 2. Template Customization
- Modify template files in `template/` directory
- Add new placeholders in `config/placeholders.json`
- Extend bootstrap CLI with new features

### 3. Build System
- Extend build scripts in `scripts/`
- Add platform-specific build configurations
- Integrate with CI/CD workflows

## Future Integrations

### State-docs
- Documentation generation from state management
- Integration point: `plugins/state-docs/`
- Will generate docs from Svelte stores and state

### pluresdb
- Database integration plugin
- Integration point: `plugins/pluresdb/`
- Will provide database setup and migrations

### unum
- Numeric computation library
- Integration point: `plugins/unum/`
- Will add numeric computation capabilities

### fsm (Future)
- Finite State Machine library (xstate-like)
- Integration point: `plugins/fsm/`
- Will provide state machine functionality

## Configuration Files

### template.config.json
Main template configuration:
```json
{
  "name": "svelte-tauri-template",
  "version": "1.0.0",
  "description": "Cross-platform template with Svelte 5 and Tauri 2",
  "plugins": ["adp"],
  "requiredPlugins": [],
  "optionalPlugins": ["state-docs", "pluresdb", "unum", "fsm"]
}
```

### plugin.manifest.json
Plugin metadata:
```json
{
  "name": "adp",
  "version": "1.0.0",
  "description": "Architectural Discipline Package integration",
  "dependencies": {
    "dev": ["@architectural-discipline/cli"],
    "prod": []
  },
  "configFiles": [".adp-config.json"],
  "scripts": {
    "analyze": "npm run adp:analyze"
  }
}
```

## Usage

### Creating a New Project
```bash
npm run template:create my-new-app
```

### Adding a Plugin
```bash
npm run plugin:add state-docs
```

### Listing Available Plugins
```bash
npm run plugin:list
```

## Migration Strategy

Current app (pay-calculator) will be:
1. Moved to `examples/pay-calculator/`
2. Refactored to use template structure
3. Serve as reference implementation
4. Updated to use plugin system

