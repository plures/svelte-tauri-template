# Code Signing Guide

Complete guide for code signing the Microsoft Pay Calculator application across all platforms.

## 📋 Overview

Code signing is **required** for distributing applications through app stores and **highly recommended** for direct distribution to ensure user trust and security.

This guide covers code signing for:
- ✅ **Windows** - MSI installer signing
- ✅ **macOS** - App bundle and DMG signing + notarization
- ✅ **Linux** - DEB and RPM package signing (optional)
- ✅ **Android** - APK/AAB signing with keystore
- ✅ **iOS** - App Store code signing (via App Store Connect API)

## 🔐 Platform-Specific Signing

### Windows Code Signing

#### Requirements
- Code signing certificate (.pfx file)
- Windows SDK (includes signtool.exe)
- Certificate from trusted CA (e.g., DigiCert, Sectigo)

#### Getting a Certificate

1. **Purchase from Certificate Authority**
   - DigiCert, Sectigo, GlobalSign, etc.
   - Cost: ~$200-500/year
   - Required for Microsoft Store distribution

2. **Export Certificate**
   - Export as .pfx file with password
   - Keep certificate and password secure

#### Configuration

**Local Signing:**
```powershell
# Set environment variables
$env:WINDOWS_SIGNING_CERTIFICATE_PATH = "path/to/certificate.pfx"
$env:WINDOWS_SIGNING_CERTIFICATE_PASSWORD = "your-password"

# Sign MSI
.\scripts\signing\windows-sign.ps1 -MsiPath "installer.msi"
```

**GitHub Actions:**
Add secrets:
- `WINDOWS_SIGNING_CERTIFICATE` - Base64 encoded .pfx file
- `WINDOWS_SIGNING_CERTIFICATE_PASSWORD` - Certificate password

**Encode certificate:**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("certificate.pfx")) | Out-File cert_base64.txt
```

#### Verification

```powershell
signtool verify /pa /v installer.msi
```

### macOS Code Signing

#### Requirements
- Apple Developer account ($99/year)
- Code signing certificate installed in Keychain
- App-specific password for notarization

#### Setup

1. **Create Code Signing Certificate**
   - Go to [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)
   - Create "Developer ID Application" certificate
   - Download and install in Keychain Access

2. **Create App-Specific Password**
   - Go to [Apple ID Account](https://appleid.apple.com/)
   - Generate app-specific password for notarization

3. **Get Signing Identity**
   ```bash
   security find-identity -v -p codesigning
   ```

#### Configuration

**Local Signing:**
```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
export APPLE_ID="your@email.com"
export APPLE_APP_SPECIFIC_PASSWORD="app-specific-password"

# Sign app bundle
./scripts/signing/macos-sign.sh "App.app"

# Sign DMG
./scripts/signing/macos-sign.sh "installer.dmg"
```

**GitHub Actions:**
Add secrets:
- `APPLE_SIGNING_IDENTITY` - Full certificate name
- `APPLE_TEAM_ID` - Your Team ID
- `APPLE_ID` - Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD` - App-specific password

#### Notarization

Notarization is **required** for distribution outside the App Store. The signing script automatically:
1. Signs the app/DMG
2. Submits for notarization
3. Waits for approval
4. Staples the notarization ticket

**Check Status:**
```bash
xcrun notarytool history --apple-id "$APPLE_ID" --team-id "$TEAM_ID" --password "$PASSWORD"
```

### Linux Package Signing

#### Requirements
- GPG key pair
- `debsigs` for DEB packages
- `rpm` for RPM packages

#### Setup

1. **Generate GPG Key**
   ```bash
   gpg --full-generate-key
   # Choose: RSA and RSA, 4096 bits, no expiration (or set expiration)
   ```

2. **Get Key ID**
   ```bash
   gpg --list-secret-keys --keyid-format LONG
   # Copy the key ID (after "rsa4096/")
   ```

3. **Export Public Key**
   ```bash
   gpg --armor --export YOUR_KEY_ID > public-key.asc
   # Distribute this key to users for verification
   ```

#### Configuration

**Local Signing:**
```bash
export GPG_KEY_ID="YOUR_KEY_ID"
export GPG_PASSPHRASE="your-passphrase"

# Sign DEB
./scripts/signing/linux-sign.sh package.deb

# Sign RPM
./scripts/signing/linux-sign.sh package.rpm
```

**GitHub Actions:**
Add secrets:
- `GPG_KEY_ID` - Your GPG key ID
- `GPG_PRIVATE_KEY` - Base64 encoded private key
- `GPG_PASSPHRASE` - GPG key passphrase

**Export private key:**
```bash
gpg --export-secret-keys --armor YOUR_KEY_ID | base64 > private_key_base64.txt
```

#### Verification

**DEB:**
```bash
debsigs --verify package.deb
```

**RPM:**
```bash
rpm --checksig package.rpm
```

### Android Code Signing

#### Requirements
- Java JDK (for keytool)
- Keystore file (.jks)

#### Setup

1. **Create Keystore**
   ```bash
   ./scripts/signing/android-keystore.sh create
   ```

   Or manually:
   ```bash
   keytool -genkey -v \
     -keystore android-release-key.jks \
     -alias release \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000
   ```

2. **Store Credentials Securely**
   - Keystore password
   - Key alias
   - Key password
   - **Never commit keystore to git!**

#### Configuration

**Local Build:**
```bash
export ANDROID_KEYSTORE_PATH="android-release-key.jks"
export ANDROID_KEYSTORE_PASSWORD="your-password"
export ANDROID_KEY_ALIAS="release"
export ANDROID_KEY_PASSWORD="your-password"

npm run tauri:android:build
```

**GitHub Actions:**
Add secrets:
- `ANDROID_KEYSTORE` - Base64 encoded .jks file
- `ANDROID_KEYSTORE_PASSWORD` - Keystore password
- `ANDROID_KEY_PASSWORD` - Key password
- `ANDROID_KEY_ALIAS` - Key alias (default: release)

**Encode keystore:**
```bash
base64 -i android-release-key.jks > keystore_base64.txt
```

#### Verification

```bash
keytool -list -v -keystore android-release-key.jks
jarsigner -verify -verbose -certs app-release.apk
```

### iOS Code Signing

iOS signing is handled automatically via **App Store Connect API**. See [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md) for complete setup.

#### Quick Setup

1. **Create App Store Connect API Key**
   - Go to App Store Connect → Users and Access → Keys
   - Create key with "App Manager" role
   - Download .p8 file

2. **Add GitHub Secrets**
   - `APPSTORE_API_KEY_ID` - Key ID
   - `APPSTORE_ISSUER_ID` - Issuer ID
   - `APPSTORE_API_PRIVATE_KEY` - Contents of .p8 file

3. **Build and Deploy**
   - GitHub Actions automatically signs and uploads to TestFlight
   - No manual signing required

## 🔧 GitHub Secrets Configuration

### Required Secrets

Add these to your GitHub repository: **Settings → Secrets and variables → Actions**

#### Windows
- `WINDOWS_SIGNING_CERTIFICATE` (base64 encoded .pfx)
- `WINDOWS_SIGNING_CERTIFICATE_PASSWORD`

#### macOS
- `APPLE_SIGNING_IDENTITY` (full certificate name)
- `APPLE_TEAM_ID`
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`

#### Linux
- `GPG_KEY_ID`
- `GPG_PRIVATE_KEY` (base64 encoded)
- `GPG_PASSPHRASE`

#### Android
- `ANDROID_KEYSTORE` (base64 encoded .jks)
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_KEY_ALIAS` (optional, default: release)

#### iOS
- `APPSTORE_API_KEY_ID`
- `APPSTORE_ISSUER_ID`
- `APPSTORE_API_PRIVATE_KEY`

## 📝 Signing Scripts

All signing scripts are located in `scripts/signing/`:

- `windows-sign.ps1` - Windows MSI signing
- `macos-sign.sh` - macOS signing and notarization
- `linux-sign.sh` - Linux DEB/RPM signing
- `android-keystore.sh` - Android keystore management
- `ios-sign.sh` - iOS signing helper (mostly informational)

See [scripts/signing/README.md](./scripts/signing/README.md) for detailed usage.

## 🚀 CI/CD Integration

Code signing is automatically integrated into GitHub Actions workflows:

- **Desktop builds**: Signing occurs when `build_type: release` is selected
- **Android builds**: Automatic signing with keystore from secrets
- **iOS builds**: Automatic signing via App Store Connect API

### Manual Trigger

To build signed releases:

1. Go to **Actions** tab
2. Select workflow (e.g., "Build Desktop Apps")
3. Click **Run workflow**
4. Select:
   - Branch: `main`
   - Build type: `release`
5. Click **Run workflow**

## 🔒 Security Best Practices

1. **Never commit certificates or keystores**
   - Add to `.gitignore`
   - Use GitHub Secrets for CI/CD
   - Store in secure password manager

2. **Use app-specific passwords**
   - For Apple services, use app-specific passwords
   - Revoke if compromised

3. **Rotate keys regularly**
   - Update certificates before expiration
   - Keep backups of old keys for app updates

4. **Limit access**
   - Only grant signing access to trusted team members
   - Use separate certificates for development and production

5. **Monitor and audit**
   - Review signing logs regularly
   - Monitor for unauthorized signing attempts

## 🐛 Troubleshooting

### Windows
- **signtool not found**: Install Windows SDK
- **Certificate expired**: Renew certificate from CA
- **Timestamp server error**: Try alternative servers

### macOS
- **Codesign fails**: Check certificate is in Keychain
- **Notarization timeout**: Check Apple Developer status
- **Stapling fails**: Ensure notarization completed

### Linux
- **GPG key not found**: Import key with `gpg --import`
- **Signing fails**: Check GPG key ID and passphrase
- **Verification fails**: Ensure public key is distributed

### Android
- **Keystore error**: Verify path and password
- **Build fails**: Check keystore is configured in build.gradle
- **Key alias error**: Verify alias matches keystore

### iOS
- **API key error**: Verify key ID, issuer ID, and private key
- **Upload fails**: Check App Store Connect API permissions
- **Build fails**: Ensure iOS project is initialized

## 📚 Additional Resources

- [Tauri Signing Documentation](https://v2.tauri.app/distribute/sign/)
- [Windows Code Signing](https://v2.tauri.app/distribute/sign/windows/)
- [macOS Code Signing](https://v2.tauri.app/distribute/sign/macos/)
- [Linux Code Signing](https://v2.tauri.app/distribute/sign/linux/)
- [Android Code Signing](https://v2.tauri.app/distribute/sign/android/)
- [iOS Code Signing](https://v2.tauri.app/distribute/sign/ios/)

## ✅ Checklist

### Setup
- [ ] Windows certificate obtained and configured
- [ ] macOS certificate created and installed
- [ ] GPG key generated for Linux (optional)
- [ ] Android keystore created
- [ ] App Store Connect API key created (iOS)

### GitHub Secrets
- [ ] All platform secrets added to GitHub
- [ ] Secrets verified and tested
- [ ] Access restricted to authorized users

### Testing
- [ ] Windows MSI signs successfully
- [ ] macOS app signs and notarizes
- [ ] Linux packages sign (if configured)
- [ ] Android APK/AAB signs
- [ ] iOS builds and uploads to TestFlight

### Documentation
- [ ] Team members have access to signing documentation
- [ ] Backup procedures documented
- [ ] Key rotation schedule established

---

**Remember**: Code signing is essential for user trust and app store distribution. Keep all certificates and keys secure!

