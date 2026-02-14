# Package Distribution Strategy

This document outlines our approach to building and distributing proper installer/package formats for all platforms.

## Package Format Priority

We prioritize proper installer/package formats that provide the best user experience for both direct downloads and automatic updates.

### Desktop Platforms

#### Windows
- **Primary**: MSI installer (`.msi`)
  - Standard Windows installer format
  - Supports silent installation
  - Works with Tauri updater
  - Location: `src-tauri/target/release/bundle/msi/`

#### macOS
- **Primary**: DMG disk image (`.dmg`)
  - Standard macOS distribution format
  - User-friendly drag-and-drop installation
  - Works with Tauri updater
  - Location: `src-tauri/target/release/bundle/dmg/`
- **Secondary**: App bundle (`.app`)
  - For direct installation
  - Location: `src-tauri/target/release/bundle/macos/`

#### Linux
- **Primary**: AppImage (`.AppImage.tar.gz`)
  - Portable, no installation required
  - Works across most Linux distributions
  - Works with Tauri updater
  - Location: `src-tauri/target/release/bundle/appimage/`
- **Secondary**: DEB package (`.deb`)
  - For Debian/Ubuntu systems
  - System integration via package manager
  - Location: `src-tauri/target/release/bundle/deb/`
- **Tertiary**: RPM package (`.rpm`)
  - For RedHat/Fedora/CentOS systems
  - System integration via package manager
  - Location: `src-tauri/target/release/bundle/rpm/`

### Mobile Platforms

#### Android
- **APK** (`.apk`)
  - For direct download and installation
  - Location: `src-tauri/android/app/build/outputs/apk/release/`
- **AAB** (`.aab`)
  - For Google Play Store distribution
  - Location: `src-tauri/android/app/build/outputs/bundle/release/`

#### iOS
- **IPA** (`.ipa`)
  - Required for App Store and TestFlight
  - Location: `src-tauri/ios/build/`

## Benefits of Package-Based Distribution

1. **User Experience**
   - Familiar installation process for each platform
   - Proper system integration (desktop shortcuts, uninstallers, etc.)
   - Better security and trust (signed packages)

2. **Automatic Updates**
   - Tauri updater works seamlessly with package formats
   - Users can update directly from the app
   - Update manifest points to proper package files

3. **Distribution Flexibility**
   - Direct downloads from GitHub Releases
   - App Store distribution (when configured)
   - Package repositories (Linux)

4. **Code Signing**
   - Packages can be properly signed
   - Better security and user trust
   - Required for some distribution channels

## Workflow Integration

The release workflow (`release.yml`) automatically:
1. Builds all package formats for each platform
2. Signs packages (when signing certificates are configured)
3. Uploads packages to GitHub Releases
4. Generates update manifest pointing to package files

## Update Manifest

The update manifest (`latest.json`) prioritizes:
- **Windows**: MSI installer
- **macOS**: DMG (with App bundle fallback)
- **Linux**: AppImage (with DEB/RPM fallbacks)

This ensures the Tauri updater uses the best package format for each platform.

## File Locations

All packages are uploaded to GitHub Releases with clear naming:
- `Microsoft Pay Calculator_0.1.3_x64_en-US.msi` (Windows)
- `Microsoft Pay Calculator_0.1.3_aarch64.dmg` (macOS Apple Silicon)
- `Microsoft Pay Calculator_0.1.3_x64.dmg` (macOS Intel)
- `Microsoft Pay Calculator_0.1.3_amd64.AppImage.tar.gz` (Linux AppImage)
- `microsoft-pay-calculator_0.1.3_amd64.deb` (Linux DEB)
- `microsoft-pay-calculator-0.1.3-1.x86_64.rpm` (Linux RPM)
- `app-release.apk` (Android APK)
- `app-release.aab` (Android AAB)
- `app.ipa` (iOS)

## Next Steps

1. ✅ Configure bundle targets in `tauri.conf.json`
2. ✅ Update workflow to prioritize package formats
3. ✅ Update asset detection to find packages in correct locations
4. ✅ Update manifest generator to use package formats
5. 🔄 Configure code signing for all platforms (in progress)
6. ⏳ Test automatic updates with package formats
7. ⏳ Set up App Store distribution (optional)

