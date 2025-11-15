# Template Usage Guide

This guide explains how to use the cross-platform framework template to bootstrap new projects.

## Quick Start

### Creating a New Project

```bash
# From the template repository root
npm run template:create my-new-app
```

The CLI will prompt you for:
- Project name
- Project description
- Package identifier (e.g., `com.example.myapp`)
- Author name and email
- GitHub repository URL (optional)
- Initial version
- Plugins to include

### Example Session

```bash
$ npm run template:create calculator-app

📋 Project Information
==================================================
Project name (e.g., 'My Awesome App') [My App]: Calculator App
Project description: A simple calculator application
Package identifier (e.g., 'com.example.myapp') [com.example.app]: com.example.calculator
Author name: John Doe
Author email: john@example.com
GitHub repository URL (optional) []: https://github.com/johndoe/calculator-app
Initial version [0.1.0]: 0.1.0

🔌 Available Plugins
==================================================
1. state-docs
2. pluresdb
3. unum
4. fsm

Select plugins to include (comma-separated numbers, or press Enter for none): 1,2

✅ Project calculator-app created successfully!

📝 Next Steps:
  cd calculator-app
  npm install
  npm run dev
```

## Project Structure

After bootstrapping, your project will have:

```
my-new-app/
├── src/                    # SvelteKit frontend
│   ├── routes/            # App routes
│   └── lib/               # Shared components
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/               # Rust source code
│   └── tauri.conf.json    # Tauri configuration
├── .github/               # GitHub Actions workflows
├── scripts/                # Build and utility scripts
└── package.json           # Project dependencies
```

## Plugins

### Available Plugins

#### Required Plugins
- **adp**: Architectural Discipline Package (automatically included)

#### Optional Plugins
- **state-docs**: State documentation generation (planned)
- **pluresdb**: Database integration (planned)
- **unum**: Numeric computation library (planned)
- **fsm**: Finite State Machine library (planned)

### Adding Plugins Later

Plugins can be added to existing projects:

```bash
# Add a plugin
npm run plugin:add state-docs

# List available plugins
npm run plugin:list
```

## Template Variables

The template uses placeholders that are replaced during bootstrap:

- `{{PROJECT_NAME}}` - Project name
- `{{PROJECT_NAME_SLUG}}` - Project name as slug (lowercase, hyphens)
- `{{PROJECT_NAME_CAMEL}}` - Project name in camelCase
- `{{PROJECT_DESCRIPTION}}` - Project description
- `{{PROJECT_IDENTIFIER}}` - Package identifier
- `{{AUTHOR_NAME}}` - Author name
- `{{AUTHOR_EMAIL}}` - Author email
- `{{GITHUB_REPO}}` - GitHub repository URL
- `{{VERSION}}` - Initial version
- `{{YEAR}}` - Current year

## Customization

### Modifying the Template

To customize the template for your organization:

1. Edit files in `template/` directory
2. Add new placeholders in `template/config/placeholders.json`
3. Update `template/config/manifest.json` with your defaults

### Creating Custom Plugins

1. Create a new directory in `plugins/`
2. Add `manifest.json` with plugin metadata
3. Create `install.js` for installation logic
4. Add any config files to `config/` subdirectory

Example plugin structure:
```
plugins/my-plugin/
├── manifest.json
├── install.js
├── config/
│   └── my-config.json
└── README.md
```

## Development Workflow

### 1. Bootstrap Project
```bash
npm run template:create my-app
cd my-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development
```bash
# Web development
npm run dev

# Tauri development (Desktop)
npm run tauri:dev

# Android development
npm run tauri:android:dev

# iOS development (requires macOS)
npm run tauri:ios:dev
```

### 4. Build for Production
```bash
# Build for all platforms
npm run tauri:build

# Build for specific platform
npm run tauri:build:windows
npm run tauri:build:macos
npm run tauri:build:linux
```

## CI/CD

The template includes GitHub Actions workflows for:
- Automated releases
- Multi-platform builds
- Code signing
- Package distribution

See `.github/workflows/` for details.

## Documentation

After bootstrapping, your project includes:
- `README.md` - Project overview
- `TAURI_SETUP.md` - Tauri setup guide
- `DISTRIBUTION.md` - Distribution guide
- `CODE_SIGNING.md` - Code signing guide
- `MOBILE_SETUP.md` - Mobile development guide
- `CI_CD_SETUP.md` - CI/CD setup guide

## Troubleshooting

### Bootstrap Fails
- Ensure Node.js 20+ is installed
- Check that template files exist in `template/` directory
- Verify placeholder configuration is valid

### Plugin Installation Fails
- Check plugin manifest is valid JSON
- Ensure install script exists and is executable
- Review plugin documentation for requirements

### Build Errors
- Verify Rust is installed (`rustup --version`)
- Check platform-specific prerequisites
- Review Tauri setup documentation

## Contributing

To contribute to the template:

1. Fork the repository
2. Make changes to template files
3. Test with `npm run template:create test-app`
4. Submit a pull request

## License

MIT

