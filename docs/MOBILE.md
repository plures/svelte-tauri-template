# Mobile Setup Guide - Android & iOS

This guide provides step-by-step instructions for setting up Android and iOS builds for the Microsoft Pay Calculator app using Tauri 2.

## 📱 Platform Support

According to the [official Tauri documentation](https://v2.tauri.app/start/prerequisites/):

| Platform | Minimum Version | Status |
|----------|----------------|---------|
| **iOS/iPadOS** | iOS 9+ | ✅ Supported |
| **Android** | Android 8+ | ✅ Supported |

## ⚠️ Important Notes

- **Android**: Can be set up on Windows, macOS, or Linux
- **iOS**: Requires macOS and Xcode (cannot build iOS apps on Windows)
- Mobile support in Tauri 2 is **fully supported** (not experimental)
- Use GitHub Actions for iOS builds without a Mac (see [CI_CD.md](./CI_CD.md))

## Android Setup

### Step 1: Install Prerequisites

1. **Download and Install Android Studio**
   - Visit: https://developer.android.com/studio
   - Install with default settings
   - Launch Android Studio and complete the setup wizard

2. **Install Android SDK Components**
   - Open Android Studio → SDK Manager (Tools → SDK Manager)
   - Install the following:
     - ✅ Android SDK Platform (latest version)
     - ✅ Android SDK Platform-Tools
     - ✅ Android SDK Build-Tools
     - ✅ Android SDK Command-line Tools
     - ✅ NDK (Side by side) - latest version

3. **Set Environment Variables**

   **Windows (PowerShell)**:
   ```powershell
   # Set JAVA_HOME (adjust path if different)
   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
   
   # Set ANDROID_HOME
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   
   # Set NDK_HOME (replace <version> with your NDK version, e.g., "27.0.12077987")
   $env:NDK_HOME = "$env:ANDROID_HOME\ndk\<version>"
   
   # Add to PATH
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   
   # Make permanent (run as Administrator)
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $env:JAVA_HOME, "User")
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $env:ANDROID_HOME, "User")
   [System.Environment]::SetEnvironmentVariable("NDK_HOME", $env:NDK_HOME, "User")
   ```

   **macOS/Linux**:
   ```bash
   export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export NDK_HOME="$ANDROID_HOME/ndk/<version>"
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
   
   # Add to ~/.zshrc or ~/.bashrc for persistence
   echo 'export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"' >> ~/.zshrc
   echo 'export ANDROID_HOME="$HOME/Library/Android/sdk"' >> ~/.zshrc
   echo 'export NDK_HOME="$ANDROID_HOME/ndk/<version>"' >> ~/.zshrc
   echo 'export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"' >> ~/.zshrc
   ```

### Step 2: Install Rust Android Targets

```bash
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android
```

### Step 3: Initialize Android in Project

```bash
npm run tauri android init
```

This will create the `src-tauri/android/` directory with Android project files.

### Step 4: Set Up Android Device/Emulator

**Option A: Physical Device**
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Verify connection: `adb devices`

**Option B: Android Emulator**
1. Open Android Studio → Device Manager
2. Create a new virtual device
3. Start the emulator

### Step 5: Build and Run

```bash
# Development mode
npm run tauri:android:dev

# Build release APK/AAB
npm run tauri:android:build
```

## iOS Setup (macOS Only)

### Step 1: Install Prerequisites

1. **Install Xcode**
   - Download from Mac App Store or [Apple Developer](https://developer.apple.com/xcode/)
   - Open Xcode and accept license: `sudo xcodebuild -license accept`
   - Install Command Line Tools: `xcode-select --install`

2. **Install Homebrew** (if not already installed)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Install CocoaPods**
   ```bash
   brew install cocoapods
   ```

### Step 2: Install Rust iOS Targets

```bash
rustup target add aarch64-apple-ios        # iPhone/iPad (ARM64)
rustup target add x86_64-apple-ios         # iPhone Simulator (Intel)
rustup target add aarch64-apple-ios-sim    # iPhone Simulator (Apple Silicon)
```

### Step 3: Initialize iOS in Project

```bash
npm run tauri ios init
```

This will create the `src-tauri/ios/` directory with iOS project files.

### Step 4: Configure Code Signing

1. Open `src-tauri/ios/Microsoft Pay Calculator.xcodeproj` in Xcode
2. Select the project → Signing & Capabilities
3. Select your Apple Developer Team
4. Ensure "Automatically manage signing" is enabled

### Step 5: Set Up iOS Device/Simulator

**Option A: iOS Simulator**
```bash
# List available simulators
xcrun simctl list devices

# Boot a simulator (replace with your device name)
open -a Simulator
```

**Option B: Physical Device**
1. Connect iPhone/iPad via USB
2. Trust the computer on your device
3. Ensure device is registered in Xcode

### Step 6: Build and Run

```bash
# Development mode (Simulator)
npm run tauri:ios:dev

# Development mode (Physical device - requires IP prompt)
npm run tauri ios dev --force-ip-prompt

# Build release IPA
npm run tauri:ios:build

# Open in Xcode
npm run tauri ios dev --open
```

## Development Server Configuration

The Vite configuration is already set up for mobile development:

- **Host**: Uses `TAURI_DEV_HOST` environment variable when set
- **Port**: Default 5173 (configurable via `TAURI_DEV_PORT`)
- **HMR**: Hot Module Replacement configured for mobile devices

When running `tauri android dev` or `tauri ios dev`, Tauri automatically sets these environment variables.

## Troubleshooting

### Android Issues

**Problem**: `Java not found`
- **Solution**: Verify `JAVA_HOME` points to Android Studio's JBR directory
- Check: `echo $JAVA_HOME` (macOS/Linux) or `$env:JAVA_HOME` (Windows)

**Problem**: `NDK not found`
- **Solution**: Install NDK via Android Studio SDK Manager and set `NDK_HOME`

**Problem**: `adb: command not found`
- **Solution**: Add Android platform-tools to PATH: `$ANDROID_HOME/platform-tools`

**Problem**: Build fails with Rust target errors
- **Solution**: Verify targets are installed: `rustup target list --installed`
- Reinstall if needed: `rustup target add <target>`

### iOS Issues

**Problem**: `ios` command not found (on Windows)
- **Solution**: iOS development requires macOS. Use a Mac or macOS VM.

**Problem**: Code signing errors
- **Solution**: Configure signing in Xcode project settings
- Ensure you have a valid Apple Developer account

**Problem**: Simulator won't start
- **Solution**: Check Xcode is properly installed: `xcodebuild -version`
- Reset simulator: `xcrun simctl erase all`

**Problem**: Device not detected
- **Solution**: Trust the computer on your iOS device
- Check USB connection and try different cable/port

## Project Structure After Mobile Setup

```
src-tauri/
├── android/              # Android project (created by `tauri android init`)
│   ├── app/
│   ├── gradle/
│   └── build.gradle
├── ios/                  # iOS project (created by `tauri ios init`)
│   ├── Microsoft Pay Calculator/
│   └── Microsoft Pay Calculator.xcodeproj
├── src/
│   ├── lib.rs           # Mobile entry point (already configured)
│   └── main.rs          # Desktop entry point
└── Cargo.toml           # Mobile dependencies (already configured)
```

## Next Steps

1. ✅ Complete Android/iOS setup using the steps above
2. ✅ Test the app on a device or emulator
3. ✅ Customize app icons and metadata in mobile project directories
4. ✅ Configure app permissions in `src-tauri/capabilities/`
5. ✅ Build release versions for distribution

## Resources

- [Tauri Mobile Prerequisites](https://v2.tauri.app/start/prerequisites/)
- [Tauri Android Guide](https://v2.tauri.app/develop/)
- [Tauri iOS Guide](https://v2.tauri.app/develop/)
- [Android Studio Documentation](https://developer.android.com/studio)
- [Xcode Documentation](https://developer.apple.com/xcode/)

