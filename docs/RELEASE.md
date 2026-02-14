# Automated Release Workflow

This document describes the automated release workflow that handles version bumping, tagging, building, and releasing.

## 🚀 Overview

The release workflow automates the entire release process:

1. **Version Bumping** - Updates version in `package.json`, `tauri.conf.json`, and `Cargo.toml`
2. **Git Tagging** - Creates and pushes a git tag (e.g., `v0.1.0`)
3. **GitHub Release** - Creates a GitHub release with release notes
4. **Building** - Builds the application for all platforms (Windows, macOS, Linux)
5. **Signing** - Signs bundles and update files (if configured)
6. **Asset Upload** - Uploads all build artifacts to the GitHub release
7. **Update Manifest** - Generates and uploads the Tauri updater manifest

## 📋 Prerequisites

### Required Secrets

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions (no setup needed)

### Optional Secrets (for signing)

- `TAURI_SIGNING_KEY` - Base64-encoded Tauri signing private key
- `WINDOWS_SIGNING_CERTIFICATE` - Base64-encoded Windows code signing certificate (.pfx)
- `WINDOWS_SIGNING_CERTIFICATE_PASSWORD` - Password for Windows certificate
- `MACOS_SIGNING_CERTIFICATE` - Base64-encoded macOS code signing certificate
- `MACOS_SIGNING_CERTIFICATE_PASSWORD` - Password for macOS certificate
- `UPDATE_MANIFEST_GIST_ID` - GitHub Gist ID for hosting update manifest (auto-created on first release)

## 🎯 Usage

### Manual Release

1. Go to **Actions** → **Release** workflow
2. Click **Run workflow**
3. Select version bump type:
   - **patch** - Bug fixes (0.1.0 → 0.1.1)
   - **minor** - New features (0.1.0 → 0.2.0)
   - **major** - Breaking changes (0.1.0 → 1.0.0)
4. (Optional) Add release notes (markdown supported)
5. Click **Run workflow**

### Release Notes

If you don't provide release notes, the workflow will automatically generate them from git commits since the last tag:

```
- feat: Add new feature (abc123)
- fix: Fix bug in calculator (def456)
- docs: Update README (ghi789)
```

## 📦 What Gets Released

### Version Files Updated

The workflow updates version numbers in:
- `package.json` → `version` field
- `src-tauri/tauri.conf.json` → `version` field
- `src-tauri/Cargo.toml` → `version` field

### Build Artifacts

For each platform, the following artifacts are built and uploaded:

**Windows:**
- `Microsoft Pay Calculator_X.X.X_x64_en-US.msi`
- `Microsoft Pay Calculator_X.X.X_x64_en-US.msi.sig` (if signed)

**macOS:**
- `Microsoft Pay Calculator_X.X.X_x64.app.tar.gz`
- `Microsoft Pay Calculator_X.X.X_aarch64.app.tar.gz`
- `*.dmg` (if configured)
- `*.sig` files (if signed)

**Linux:**
- `Microsoft Pay Calculator_X.X.X_amd64.deb`
- `Microsoft Pay Calculator_X.X.X_amd64.AppImage.tar.gz`
- `Microsoft Pay Calculator_X.X.X_amd64.rpm`
- `*.sig` files (if signed)

### Update Manifest

- `latest.json` - Tauri updater manifest pointing to GitHub Releases

## 🔄 Workflow Steps

### 1. Prepare Release

- Checks out code
- Bumps version using `scripts/bump-version.js`
- Generates release notes (from git log or provided)
- Commits version changes
- Creates and pushes git tag
- Creates GitHub release

### 2. Build and Release

Runs in parallel for each platform:

- **Windows** (windows-latest)
- **macOS** (macos-latest)
- **Linux** (ubuntu-latest)

Each build job:
- Installs dependencies
- Builds application
- Signs bundles (if configured)
- Signs update files (if configured)
- Uploads artifacts to GitHub release

### 3. Generate Update Manifest

- Generates `latest.json` manifest
- Points to GitHub Releases download URLs
- Uploads manifest to release
- Updates GitHub Gist (for updater endpoint)

## 🛠️ Manual Version Bumping

You can also bump versions manually:

```bash
# Patch version (0.1.0 → 0.1.1)
node scripts/bump-version.js patch

# Minor version (0.1.0 → 0.2.0)
node scripts/bump-version.js minor

# Major version (0.1.0 → 1.0.0)
node scripts/bump-version.js major

# Specific version
node scripts/bump-version.js 0.2.5
```

After manual bumping, commit and tag:

```bash
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "chore: bump version to X.X.X"
git tag -a "vX.X.X" -m "Release vX.X.X"
git push && git push --tags
```

## 🔐 Signing Setup

### Tauri Update Signing

1. Generate signing keypair:
   ```bash
   npx tauri signer generate -w ~/.tauri/myapp.key
   npx tauri signer generate -w ~/.tauri/myapp.key --print-public-key
   ```

2. Add public key to `src-tauri/tauri.conf.json`:
   ```json
   {
     "plugins": {
       "updater": {
         "pubkey": "YOUR_PUBLIC_KEY_HERE"
       }
     }
   }
   ```

3. Encode private key for GitHub secret:
   ```bash
   cat ~/.tauri/myapp.key | base64 -w 0
   ```

4. Add to GitHub secrets as `TAURI_SIGNING_KEY`

### Windows Code Signing

1. Export certificate as `.pfx` file
2. Encode for GitHub secret:
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("cert.pfx"))
   ```
3. Add to GitHub secrets:
   - `WINDOWS_SIGNING_CERTIFICATE` - Base64 certificate
   - `WINDOWS_SIGNING_CERTIFICATE_PASSWORD` - Certificate password

## 📝 Release Notes Format

Release notes support Markdown:

```markdown
# What's New

## Features
- ✨ New feature 1
- ✨ New feature 2

## Fixes
- 🐛 Fixed bug in calculator
- 🐛 Fixed memory leak

## Improvements
- ⚡ Performance improvements
- 🎨 UI updates
```

## 🐛 Troubleshooting

### Version Bump Fails

- Ensure version format is `X.Y.Z` (semantic versioning)
- Check that all version files exist and are valid JSON/TOML

### Build Fails

- Check Rust toolchain is installed correctly
- Verify all dependencies are installed (`npm ci`)
- Check platform-specific build requirements

### Signing Fails

- Verify signing secrets are correctly base64-encoded
- Check certificate passwords are correct
- Ensure signing scripts have execute permissions

### Asset Upload Fails

- Verify GitHub token has `contents: write` permission
- Check file paths are correct
- Ensure files exist before upload

### Manifest Generation Fails

- Verify repository name is correct in `package.json`
- Check GitHub Releases API access
- Ensure Gist permissions are set correctly

## 📚 Related Documentation

- [Auto-Update Setup](./AUTO_UPDATES.md) - Configure auto-updates
- [Distribution Guide](./DISTRIBUTION.md) - Distribution options
- [Tauri Updater Docs](https://v2.tauri.app/plugin/updater/) - Official Tauri updater documentation

## ✅ Checklist

Before your first release:

- [ ] Version files are correctly configured
- [ ] Signing keys are generated and added to secrets (optional)
- [ ] Code signing certificates are added to secrets (optional)
- [ ] Test workflow with a patch release
- [ ] Verify artifacts are uploaded correctly
- [ ] Check update manifest is generated
- [ ] Update `tauri.conf.json` with Gist URL after first release

