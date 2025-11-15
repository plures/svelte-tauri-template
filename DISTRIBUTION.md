# Distribution Guide

This guide covers how to distribute the Microsoft Pay Calculator app to all major platforms using Tauri's distribution capabilities.

Based on the [official Tauri distribution documentation](https://tauri.app/distribute/).

## 📦 Building and Bundling

### Standard Build (Build + Bundle)

```bash
# Build and bundle for all configured platforms
npm run tauri:build
```

This command:
1. Builds the Rust backend
2. Builds the frontend (SvelteKit)
3. Automatically bundles for all configured formats

### Separate Build and Bundle Steps

For more control over the bundling process:

```bash
# Build without bundling
npm run tauri:build:no-bundle

# Bundle for specific platforms
npm run tauri:bundle:windows  # MSI installer
npm run tauri:bundle:macos    # App bundle + DMG
npm run tauri:bundle:linux    # DEB + AppImage + RPM
```

### Custom Bundle Targets

You can also specify exact bundle formats:

```bash
# Bundle for distribution outside macOS App Store
npm run tauri bundle -- --bundles app,dmg

# Bundle for App Store distribution (macOS/iOS)
npm run tauri bundle -- --bundles app --config src-tauri/tauri.appstore.conf.json
```

## 🏷️ Versioning

Version is managed in `src-tauri/tauri.conf.json`:

```json
{
  "version": "0.1.0"
}
```

If not set in `tauri.conf.json`, Tauri falls back to `src-tauri/Cargo.toml` > `package.version`.

**Note**: Some platforms have version string limitations:
- **Windows**: Follows semantic versioning (major.minor.patch)
- **macOS/iOS**: Follows Apple's versioning guidelines
- **Android**: Uses versionCode (integer) and versionName (string)

## 🔐 Code Signing

Code signing is **required** for most distribution methods. See platform-specific guides:

- [macOS Code Signing](./TESTFLIGHT_SETUP.md#code-signing) - Required for App Store and DMG distribution
- [Windows Code Signing](https://v2.tauri.app/distribute/sign/windows/) - Required for Microsoft Store
- [Linux Code Signing](https://v2.tauri.app/distribute/sign/linux/) - Optional but recommended
- [Android Code Signing](./MOBILE_SETUP.md#android-build-setup) - Required for Google Play
- [iOS Code Signing](./TESTFLIGHT_SETUP.md#app-store-connect-api-recommended) - Required for App Store

## 🪟 Windows Distribution

### Windows Installer (MSI)

**Current Configuration**: ✅ Configured

```bash
# Build MSI installer
npm run tauri:build:windows
```

**Output**: `src-tauri/target/release/bundle/msi/Microsoft Pay Calculator_0.1.0_x64_en-US.msi`

**Distribution Options**:
1. **Direct Download**: Host MSI file on your website/CDN
2. **Microsoft Store**: See [Microsoft Store Distribution](https://v2.tauri.app/distribute/microsoft-store/)

**Requirements**:
- Code signing recommended for user trust
- Windows 7+ support

### Microsoft Store

To distribute via Microsoft Store:

1. Create a Microsoft Partner Center account
2. Prepare app metadata and screenshots
3. Build with Microsoft Store configuration
4. Submit through Partner Center

See: [Tauri Microsoft Store Guide](https://v2.tauri.app/distribute/microsoft-store/)

## 🍎 macOS Distribution

### App Bundle and DMG

**Current Configuration**: ✅ Configured

```bash
# Build macOS bundles
npm run tauri:build:macos
```

**Output**:
- App Bundle: `src-tauri/target/release/bundle/macos/Microsoft Pay Calculator.app`
- DMG: `src-tauri/target/release/bundle/dmg/Microsoft Pay Calculator_0.1.0_x64.dmg`

**Distribution Options**:
1. **Direct Download**: Host DMG on your website
2. **macOS App Store**: See [App Store Distribution](#app-store-distribution)

**Requirements**:
- Code signing **required**
- Notarization **required** for distribution outside App Store
- macOS 10.15+ support

### App Store Distribution

To distribute via macOS App Store:

1. Create App Store Connect API key (see [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md))
2. Configure code signing
3. Build with App Store configuration
4. Upload via App Store Connect or GitHub Actions

See: [Tauri App Store Guide](https://v2.tauri.app/distribute/app-store/)

## 🐧 Linux Distribution

### Supported Formats

**Current Configuration**: ✅ Configured (DEB, AppImage, RPM)

```bash
# Build Linux bundles
npm run tauri:build:linux
```

**Output**:
- DEB: `src-tauri/target/release/bundle/deb/microsoft-pay-calculator_0.1.0_amd64.deb`
- AppImage: `src-tauri/target/release/bundle/appimage/microsoft-pay-calculator_0.1.0_amd64.AppImage`
- RPM: `src-tauri/target/release/bundle/rpm/microsoft-pay-calculator-0.1.0-1.x86_64.rpm`

### Distribution Methods

#### 1. Debian Package (DEB)
- **Target**: Debian, Ubuntu, and derivatives
- **Distribution**: Host on your website or PPA
- **Installation**: `sudo dpkg -i package.deb`

#### 2. AppImage
- **Target**: All Linux distributions
- **Distribution**: Host on your website
- **Installation**: Make executable and run directly
- **Advantage**: No installation required, portable

#### 3. RPM Package
- **Target**: Fedora, RHEL, CentOS, openSUSE
- **Distribution**: Host on your website or repository
- **Installation**: `sudo rpm -i package.rpm` or `sudo dnf install package.rpm`

#### 4. Snapcraft (Not Currently Configured)
To add Snap support:

```bash
# Add to bundle targets in tauri.conf.json
"targets": [..., "snap"]
```

Then distribute via [Snapcraft.io](https://snapcraft.io/)

See: [Tauri Snapcraft Guide](https://v2.tauri.app/distribute/snapcraft/)

#### 5. Arch User Repository (AUR) (Not Currently Configured)
For Arch Linux users, create an AUR package.

See: [Tauri AUR Guide](https://v2.tauri.app/distribute/aur/)

**Requirements**:
- Linux with webkit2gtk 4.1 (Ubuntu 22.04+)
- Code signing optional but recommended

## 🤖 Android Distribution

### Google Play Store

**Current Configuration**: ✅ Configured for builds

```bash
# Build Android release
npm run tauri:android:build
```

**Output**:
- APK: `src-tauri/android/app/build/outputs/apk/release/app-release.apk`
- AAB: `src-tauri/android/app/build/outputs/bundle/release/app-release.aab` (recommended for Play Store)

**Distribution Steps**:

1. **Create Google Play Developer Account** ($25 one-time fee)
2. **Configure Signing**: Set up keystore (see [MOBILE_SETUP.md](./MOBILE_SETUP.md))
3. **Build Release AAB**: `npm run tauri:android:build`
4. **Upload to Play Console**: Use Google Play Console to upload AAB
5. **Complete Store Listing**: Add screenshots, description, etc.
6. **Submit for Review**

See: [Tauri Google Play Guide](https://v2.tauri.app/distribute/google-play/)

**Requirements**:
- Android 8+ support
- Code signing **required**
- Google Play Developer account

### Direct Distribution (APK)

For distribution outside Google Play:

1. Build APK: `npm run tauri:android:build`
2. Host APK on your website
3. Users enable "Install from unknown sources"
4. Download and install APK

**Note**: Direct APK distribution has limitations and security warnings.

## 🍎 iOS Distribution

### App Store

**Current Configuration**: ✅ Configured with GitHub Actions

```bash
# Build iOS release (requires macOS)
npm run tauri:ios:build

# Or use GitHub Actions (no Mac needed!)
# See CI_CD_SETUP.md
```

**Output**: `src-tauri/ios/build/*.ipa`

**Distribution Steps**:

1. **Create Apple Developer Account** ($99/year)
2. **Configure App Store Connect API** (see [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md))
3. **Build IPA**: Via GitHub Actions or local macOS
4. **Upload to App Store Connect**: Automatic via GitHub Actions or manually
5. **Submit for Review**: Via App Store Connect

See: [Tauri App Store Guide](https://v2.tauri.app/distribute/app-store/)

**Requirements**:
- iOS 9+ support
- Code signing **required**
- Apple Developer account
- TestFlight for beta testing (included)

### TestFlight Distribution

TestFlight is automatically configured via GitHub Actions. See [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md) for details.

## ☁️ Cloud Distribution Services

### CrabNebula Cloud

CrabNebula Cloud provides global distribution with auto-updates:

1. Sign up at [CrabNebula Cloud](https://crabnebula.dev/)
2. Configure your app
3. Build and upload
4. Distribute globally with automatic updates

See: [Tauri CrabNebula Cloud Guide](https://v2.tauri.app/distribute/crabnebula-cloud/)

## 📋 Distribution Checklist

### Pre-Distribution

- [ ] Version number updated in `tauri.conf.json`
- [ ] App icons configured for all platforms
- [ ] App metadata (description, copyright) filled in
- [ ] Code signing certificates obtained
- [ ] Platform-specific accounts created:
  - [ ] Apple Developer (iOS/macOS)
  - [ ] Google Play Developer (Android)
  - [ ] Microsoft Partner Center (Windows Store, optional)

### Windows

- [ ] MSI installer builds successfully
- [ ] Code signing configured (recommended)
- [ ] Tested on Windows 7+
- [ ] Microsoft Store account ready (if distributing via Store)

### macOS

- [ ] App bundle and DMG build successfully
- [ ] Code signing configured
- [ ] Notarization configured (for direct distribution)
- [ ] Tested on macOS 10.15+
- [ ] App Store Connect API configured (if distributing via App Store)

### Linux

- [ ] DEB, AppImage, and RPM build successfully
- [ ] Tested on Ubuntu 22.04+ (webkit2gtk 4.1)
- [ ] Consider adding Snap support
- [ ] Consider AUR package for Arch Linux

### Android

- [ ] APK and AAB build successfully
- [ ] Keystore configured for signing
- [ ] Tested on Android 8+
- [ ] Google Play Developer account created
- [ ] Store listing prepared (screenshots, description)

### iOS

- [ ] IPA builds successfully
- [ ] App Store Connect API configured
- [ ] Code signing configured
- [ ] Tested on iOS 9+
- [ ] TestFlight testers added (optional)
- [ ] App Store listing prepared

## 🚀 Quick Reference

### Build Commands

```bash
# All platforms (desktop)
npm run tauri:build

# Specific platforms
npm run tauri:build:windows
npm run tauri:build:macos
npm run tauri:build:linux
npm run tauri:android:build
npm run tauri:ios:build

# Bundle only (after build)
npm run tauri:bundle
npm run tauri:bundle:windows
npm run tauri:bundle:macos
npm run tauri:bundle:linux
```

### Distribution Output Locations

- **Windows MSI**: `src-tauri/target/release/bundle/msi/`
- **macOS App**: `src-tauri/target/release/bundle/macos/`
- **macOS DMG**: `src-tauri/target/release/bundle/dmg/`
- **Linux DEB**: `src-tauri/target/release/bundle/deb/`
- **Linux AppImage**: `src-tauri/target/release/bundle/appimage/`
- **Linux RPM**: `src-tauri/target/release/bundle/rpm/`
- **Android APK**: `src-tauri/android/app/build/outputs/apk/release/`
- **Android AAB**: `src-tauri/android/app/build/outputs/bundle/release/`
- **iOS IPA**: `src-tauri/ios/build/`

## 📚 Additional Resources

- [Tauri Distribution Documentation](https://tauri.app/distribute/)
- [Tauri Signing Guide](https://v2.tauri.app/distribute/sign/)
- [App Store Distribution](./TESTFLIGHT_SETUP.md)
- [Mobile Setup](./MOBILE_SETUP.md)
- [CI/CD Setup](./CI_CD_SETUP.md)

---

**Last Updated**: Based on Tauri 2.9.4 distribution capabilities

