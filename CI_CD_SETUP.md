# CI/CD Setup Guide - Build iOS/Android Without a Mac

This guide explains how to build iOS and Android apps using GitHub Actions, **completely free** for public repositories. You don't need a Mac or Android Studio installed locally!

## 🎯 Overview

GitHub Actions provides **free macOS runners** for public repositories, allowing you to:
- ✅ Build iOS apps without owning a Mac
- ✅ Build Android apps without Android Studio
- ✅ Build desktop apps (Windows, macOS, Linux)
- ✅ Automatically build on every push/PR
- ✅ Download build artifacts directly from GitHub

## 🚀 Quick Start

### 1. Push Your Code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
git add .
git commit -m "Add CI/CD workflows"
git push origin feature/tauri-multi-target
```

### 2. Workflows Are Already Configured!

The following workflows are ready to use:
- **`.github/workflows/ios-build.yml`** - Builds iOS apps
- **`.github/workflows/android-build.yml`** - Builds Android apps  
- **`.github/workflows/desktop-build.yml`** - Builds desktop apps

### 3. Trigger Your First Build

**Option A: Automatic (Recommended)**
- Push to `main` or `develop` branch
- Workflows will run automatically

**Option B: Manual**
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select the workflow you want (e.g., "Build iOS App")
4. Click **Run workflow**
5. Choose branch and build type
6. Click **Run workflow**

### 4. Download Build Artifacts

1. Go to **Actions** tab
2. Click on a completed workflow run
3. Scroll down to **Artifacts** section
4. Download the build files (`.ipa` for iOS, `.apk`/`.aab` for Android)

## 📱 iOS Build Setup & TestFlight Deployment

The iOS workflow is configured to automatically deploy to TestFlight! See [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md) for complete instructions.

### Quick TestFlight Setup:

1. **Create App Store Connect API Key** (Recommended)
   - Go to App Store Connect → Users and Access → Keys
   - Create new key with **App Manager** role
   - Download `.p8` file (only once!)

2. **Add GitHub Secrets:**
   - `APPSTORE_API_KEY_ID` - Your Key ID
   - `APPSTORE_ISSUER_ID` - Your Issuer ID  
   - `APPSTORE_API_PRIVATE_KEY` - Contents of `.p8` file

3. **Build and Deploy:**
   - Push to `main` branch with `release` build type
   - Or manually trigger workflow with "Deploy to TestFlight" enabled
   - Build automatically uploads to TestFlight!

See [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md) for detailed instructions.

---

## 📱 iOS Build Setup (Legacy - Using Certificates)

To sign and distribute iOS apps, you need to configure code signing secrets:

### Step 1: Get Apple Developer Credentials

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com/programs/
   - You need this to distribute apps to App Store or TestFlight

2. **Create Certificates and Provisioning Profiles**
   - Use Xcode on a Mac (borrow one, use cloud Mac service, or use GitHub Actions)
   - Or use online tools like [AppStoreConnect API](https://developer.apple.com/app-store-connect/api/)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `APPLE_CERTIFICATE` | Base64 encoded `.p12` certificate | Export from Keychain Access (macOS) |
| `APPLE_CERTIFICATE_PASSWORD` | Password for the certificate | The password you set when exporting |
| `APPLE_TEAM_ID` | Your Apple Team ID | Found in Apple Developer account |
| `APPLE_PROVISIONING_PROFILE` | Base64 encoded `.mobileprovision` file | Download from Apple Developer portal |

**How to Export Certificate (if you have Mac access):**
```bash
# Export certificate from Keychain
security find-identity -v -p codesigning
# Export the certificate, then base64 encode it
base64 -i certificate.p12 -o certificate_base64.txt
```

**Alternative: Use Fastlane Match (Recommended)**
Fastlane Match can manage certificates automatically. See [Fastlane Match documentation](https://docs.fastlane.tools/actions/match/).

### Step 3: Update Workflow (If Needed)

The workflow is already configured to use these secrets. If you don't have them yet, the build will still work but won't be signed (useful for testing).

## 🤖 Android Build Setup (Optional - For Play Store Distribution)

### Step 1: Create Signing Key

**On your local machine:**
```bash
keytool -genkey -v -keystore android-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias release
```

### Step 2: Add GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Description |
|------------|-------------|
| `ANDROID_KEYSTORE_PASSWORD` | Password for your keystore |
| `ANDROID_KEY_PASSWORD` | Password for your key alias |

### Step 3: Store Keystore Securely

**Option A: GitHub Secrets (Small keystores)**
- Base64 encode your keystore: `base64 -i android-release-key.jks`
- Add as secret `ANDROID_KEYSTORE` (base64 encoded)

**Option B: External Storage (Recommended)**
- Store keystore in secure cloud storage (encrypted)
- Download in workflow using secure credentials

## 🔧 Workflow Configuration

### iOS Workflow (`.github/workflows/ios-build.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual trigger via GitHub UI

**Build Types:**
- **Dev**: Development build (faster, unsigned)
- **Release**: Release build (signed, for distribution)

**What it does:**
1. Sets up macOS runner
2. Installs Node.js, Rust, CocoaPods
3. Adds iOS Rust targets
4. Installs dependencies
5. Initializes iOS project (if needed)
6. Builds the app
7. Uploads artifacts

### Android Workflow (`.github/workflows/android-build.yml`)

**Triggers:**
- Same as iOS workflow

**Build Types:**
- **Dev**: Development build (unsigned)
- **Release**: Release build (signed with keystore)

**What it does:**
1. Sets up Ubuntu runner
2. Installs Node.js, Java, Android SDK
3. Adds Android Rust targets
4. Installs dependencies
5. Initializes Android project (if needed)
6. Builds the app
7. Uploads artifacts

### Desktop Workflow (`.github/workflows/desktop-build.yml`)

Builds for Windows, macOS, and Linux automatically.

## 📥 Downloading Builds

### From GitHub Actions

1. Go to **Actions** tab
2. Click on a completed workflow
3. Scroll to **Artifacts** section
4. Download the build file

### Installing on Devices

**iOS (.ipa file):**
- Use [AltStore](https://altstore.io/) or [Sideloadly](https://sideloadly.io/) to install on your iPhone
- Or upload to TestFlight for easier distribution

**Android (.apk file):**
- Transfer to your Android device
- Enable "Install from unknown sources"
- Tap the APK file to install

## 🐛 Troubleshooting

### iOS Build Fails

**Problem**: "iOS directory not found"
- **Solution**: The workflow will auto-initialize, but you can manually run `npm run tauri ios init` locally first

**Problem**: "Code signing failed"
- **Solution**: Ensure all Apple Developer secrets are set correctly
- For testing, you can build unsigned (dev mode)

**Problem**: "CocoaPods error"
- **Solution**: The workflow installs CocoaPods automatically, but if issues persist, check the logs

### Android Build Fails

**Problem**: "Android directory not found"
- **Solution**: The workflow will auto-initialize, but you can manually run `npm run tauri android init` locally first

**Problem**: "NDK not found"
- **Solution**: The workflow sets up Android SDK automatically

**Problem**: "Keystore not found" (Release builds)
- **Solution**: Ensure keystore secrets are configured, or build in dev mode first

### General Issues

**Problem**: Workflow doesn't trigger
- **Solution**: Check that files changed are in the `paths` filter, or use manual trigger

**Problem**: Build takes too long
- **Solution**: This is normal for first build. Subsequent builds are faster due to caching

**Problem**: Out of storage/bandwidth
- **Solution**: GitHub Actions has limits. For public repos: 2,000 minutes/month free (usually enough)

## 💡 Tips & Best Practices

1. **Use Manual Triggers for Releases**
   - Don't build releases on every push
   - Use `workflow_dispatch` for production builds

2. **Cache Dependencies**
   - Workflows cache npm and Rust dependencies automatically
   - First build is slower, subsequent builds are faster

3. **Test Before Releasing**
   - Always test dev builds before creating release builds
   - Use TestFlight (iOS) or internal testing (Android)

4. **Monitor Build Times**
   - iOS builds: ~10-15 minutes
   - Android builds: ~8-12 minutes
   - Desktop builds: ~5-10 minutes each

5. **Security**
   - Never commit certificates or keystores to git
   - Use GitHub Secrets for sensitive data
   - Rotate keys regularly

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Tauri Mobile Guide](https://v2.tauri.app/develop/)
- [Apple Developer Portal](https://developer.apple.com/)
- [Google Play Console](https://play.google.com/console/)

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Workflows visible in Actions tab
- [ ] First build completed successfully
- [ ] Build artifacts downloaded
- [ ] (Optional) Apple Developer account created
- [ ] (Optional) GitHub secrets configured for signing
- [ ] (Optional) App tested on physical device
- [ ] (Optional) App submitted to App Store/Play Store

## 🆘 Need Help?

- Check workflow logs in GitHub Actions
- Review Tauri documentation: https://v2.tauri.app/
- GitHub Actions community: https://github.com/actions

---

**Remember**: GitHub Actions provides **free macOS runners** for public repositories. This is the easiest way to build iOS apps without a Mac! 🎉

