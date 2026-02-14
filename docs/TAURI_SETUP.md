# Tauri Multi-Target Setup

This project has been configured to use Tauri 2.9.4 for cross-platform desktop application development with Svelte 5.

## Current Configuration

### Desktop Targets
The application is configured to build for the following desktop platforms:

| Platform | Minimum Version | Bundle Formats | Distribution |
|----------|----------------|-----------------|-------------|
| **Windows** | Windows 7+ | MSI installer | Direct download, Microsoft Store |
| **macOS** | macOS 10.15+ | App bundle, DMG | Direct download, App Store |
| **Linux** | Ubuntu 22.04+ (webkit2gtk 4.1) | DEB, AppImage, RPM | Direct download, repositories |

### Mobile Targets
Tauri 2 supports mobile platforms with the following requirements:

| Platform | Minimum Version | Bundle Formats | Distribution |
|----------|----------------|-----------------|-------------|
| **iOS/iPadOS** | iOS 9+ | IPA | App Store, TestFlight |
| **Android** | Android 8+ | APK, AAB | Google Play, Direct download |

The project has been configured for mobile builds. See the [Mobile Setup](#mobile-setup) section below for detailed instructions.

**Distribution**: See [DISTRIBUTION.md](./DISTRIBUTION.md) for complete distribution guide covering all platforms and app stores.

## Development

### Prerequisites

#### Required for All Platforms
- **Rust**: Install from [rustup.rs](https://rustup.rs/)
- **Node.js**: Required for frontend dependencies

#### Platform-Specific Requirements

**Windows (Windows 7+)**:
- Visual Studio with "Desktop development with C++" workload
- WebView2 runtime (usually pre-installed on Windows 10+)

**macOS (macOS 10.15+)**:
- Xcode Command Line Tools
- For iOS builds: Full Xcode installation

**Linux (webkit2gtk 4.1, e.g., Ubuntu 22.04+)**:
- Build essentials: `gcc`, `libwebkit2gtk-4.1-dev`, `libssl-dev`
- Additional dependencies: `libayatana-appindicator3-dev`, `librsvg2-dev`

### Development Commands

```bash
# Run development server (Svelte + Tauri)
npm run tauri:dev

# Build for all platforms
npm run tauri:build

# Build for specific platform
npm run tauri:build:windows
npm run tauri:build:macos
npm run tauri:build:linux
```

### Frontend Development

The frontend uses SvelteKit configured for static site generation (SSG):
- **Adapter**: `@sveltejs/adapter-static`
- **SSR**: Disabled (required for Tauri)
- **Build output**: `build/` directory

## Project Structure

```
├── src/                    # SvelteKit frontend
│   ├── routes/            # SvelteKit routes
│   └── lib/               # Shared components/utilities
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/               # Rust source code
│   ├── Cargo.toml         # Rust dependencies
│   ├── tauri.conf.json    # Tauri configuration
│   └── capabilities/      # Tauri permissions
└── build/                  # Frontend build output (generated)
```

## Configuration Files

### `src-tauri/tauri.conf.json`
Main Tauri configuration file containing:
- App metadata (name, version, identifier)
- Build settings (frontend dist, dev URL)
- Window configuration
- Bundle settings (targets, icons, descriptions)
- Security policies (CSP)

### `svelte.config.js`
SvelteKit configuration:
- Static adapter for Tauri compatibility
- Prerendering enabled
- SSR disabled

## Best Practices

1. **Security**: Content Security Policy (CSP) is configured in `tauri.conf.json`. Review and adjust as needed for your use case.

2. **Performance**: The app uses Tauri's multi-process architecture for security and performance.

3. **Icons**: App icons are located in `src-tauri/icons/`. Update these for production.

4. **Permissions**: Tauri capabilities are defined in `src-tauri/capabilities/default.json`. Add new permissions as needed.

## Mobile Setup

### Prerequisites

#### Android Development

1. **Install Android Studio**
   - Download from [Android Studio](https://developer.android.com/studio)
   - Install Android SDK Platform, Platform-Tools, NDK, Build-Tools, and Command-line Tools via SDK Manager

2. **Set Environment Variables** (Windows PowerShell):
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   $env:NDK_HOME = "$env:ANDROID_HOME\ndk\<version>"  # Replace <version> with installed NDK version
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

3. **Add Android Rust Targets**:
   ```bash
   rustup target add aarch64-linux-android
   rustup target add armv7-linux-androideabi
   rustup target add i686-linux-android
   rustup target add x86_64-linux-android
   ```

4. **Initialize Android Target**:
   ```bash
   npm run tauri android init
   ```

#### iOS Development (macOS Only)

1. **Install Xcode**
   - Download from [Apple Developer](https://developer.apple.com/xcode/)
   - Accept license: `sudo xcodebuild -license accept`

2. **Install CocoaPods**:
   ```bash
   brew install cocoapods
   ```

3. **Add iOS Rust Targets**:
   ```bash
   rustup target add aarch64-apple-ios
   rustup target add x86_64-apple-ios
   rustup target add aarch64-apple-ios-sim
   ```

4. **Initialize iOS Target** (Note: iOS commands may not be available on Windows):
   ```bash
   npm run tauri ios init
   ```

### Mobile Development Commands

#### Android

```bash
# Development mode (connects to device/emulator)
npm run tauri:android:dev

# Build release APK/AAB
npm run tauri:android:build

# Open in Android Studio
npm run tauri android dev --open
```

#### iOS (macOS Only)

```bash
# Development mode (iOS Simulator or device)
npm run tauri:ios:dev

# Build release IPA
npm run tauri:ios:build

# Open in Xcode
npm run tauri ios dev --open

# Force IP prompt for physical device
npm run tauri ios dev --force-ip-prompt
```

### Mobile Configuration

The project is already configured for mobile:
- ✅ Rust mobile entry point in `src-tauri/src/lib.rs`
- ✅ Mobile dependencies in `src-tauri/Cargo.toml`
- ✅ Vite configured for mobile dev server (`vite.config.ts`)
- ✅ Mobile build scripts in `package.json`

### Mobile Development Server

The Vite configuration automatically handles mobile development:
- Uses `TAURI_DEV_HOST` environment variable when set
- Configures HMR (Hot Module Replacement) for mobile devices
- Default port: 5173 (configurable via `TAURI_DEV_PORT`)

### Troubleshooting Mobile Builds

1. **Android: Java not found**
   - Ensure `JAVA_HOME` is set to Android Studio's JBR directory
   - Verify Java is in PATH

2. **Android: NDK not found**
   - Install NDK via Android Studio SDK Manager
   - Set `NDK_HOME` environment variable

3. **iOS: Command not found** (Windows)
   - iOS development requires macOS and Xcode
   - Use a Mac or macOS VM for iOS builds

4. **Mobile: Build fails**
   - Ensure all Rust targets are installed: `rustup target list --installed`
   - Verify mobile directories exist: `src-tauri/android/` and `src-tauri/ios/`
   - Run `npm run tauri android init` or `npm run tauri ios init` if directories are missing

## Resources

- [Tauri Documentation](https://v2.tauri.app/)
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Tauri + SvelteKit Guide](https://v1.tauri.app/v1/guides/getting-started/setup/sveltekit/)

