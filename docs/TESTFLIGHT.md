# TestFlight Deployment Setup

This guide explains how to automatically deploy your iOS app to TestFlight from GitHub Actions, **without needing a Mac**.

## 🎯 Overview

With the configured workflow, you can:
- ✅ Build iOS apps on GitHub Actions (free macOS runners)
- ✅ Automatically upload to TestFlight
- ✅ No Mac required - everything runs in the cloud
- ✅ Works with App Store Connect API (recommended) or certificates

## 📋 Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com/programs/
   - Required for TestFlight and App Store distribution

2. **App Created in App Store Connect**
   - Go to https://appstoreconnect.apple.com/
   - Create a new app if you haven't already
   - Note your **App ID** (e.g., `com.microsoft.paycalculator`)

## 🔑 Option 1: App Store Connect API (Recommended)

This is the **modern and recommended** approach. It's more secure and easier to set up.

### Step 1: Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to **Users and Access** → **Keys** tab
3. Click the **+** button to create a new key
4. Give it a name (e.g., "GitHub Actions")
5. Select role: **App Manager** (minimum required)
6. Click **Generate**
7. **Important**: Download the `.p8` file immediately (you can only download it once!)
8. Note the following:
   - **Key ID** (e.g., `ABC123DEFG`)
   - **Issuer ID** (found at the top of the Keys page, e.g., `12345678-1234-1234-1234-123456789012`)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `APPSTORE_API_KEY_ID` | Your Key ID | The Key ID from Step 1 (e.g., `ABC123DEFG`) |
| `APPSTORE_ISSUER_ID` | Your Issuer ID | The Issuer ID from Step 1 (e.g., `12345678-1234-1234-1234-123456789012`) |
| `APPSTORE_API_PRIVATE_KEY` | Contents of `.p8` file | Open the `.p8` file in a text editor and copy the entire contents (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`) |

**Example `.p8` file format:**
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
(multiple lines of base64 encoded key)
-----END PRIVATE KEY-----
```

### Step 3: That's It!

The workflow is already configured to use App Store Connect API. When you build a release, it will automatically upload to TestFlight if the secrets are set.

## 🔐 Option 2: Code Signing Certificates (Alternative)

If you prefer using certificates (older method), follow these steps:

### Step 1: Create Distribution Certificate

**If you have Mac access:**
1. Open **Keychain Access** on Mac
2. Go to **Keychain Access** → **Certificate Assistant** → **Request a Certificate From a Certificate Authority**
3. Enter your email and name, save to disk
4. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)
5. Click **+** to create a certificate
6. Choose **Apple Distribution**
7. Upload the certificate request
8. Download the certificate
9. Double-click to install in Keychain

**Export the certificate:**
1. In Keychain Access, find your **Apple Distribution** certificate
2. Right-click → **Export**
3. Choose **Personal Information Exchange (.p12)**
4. Set a password (remember this!)
5. Save the file

### Step 2: Create Provisioning Profile

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/profiles/list)
2. Click **+** to create a profile
3. Select **App Store** distribution
4. Select your App ID
5. Select your distribution certificate
6. Name it and download
7. Save the `.mobileprovision` file

### Step 3: Convert to Base64

**On Mac/Linux:**
```bash
# Certificate
base64 -i certificate.p12 -o certificate_base64.txt

# Provisioning Profile
base64 -i profile.mobileprovision -o profile_base64.txt
```

**On Windows (PowerShell):**
```powershell
# Certificate
[Convert]::ToBase64String([IO.File]::ReadAllBytes("certificate.p12")) | Out-File -Encoding ASCII certificate_base64.txt

# Provisioning Profile
[Convert]::ToBase64String([IO.File]::ReadAllBytes("profile.mobileprovision")) | Out-File -Encoding ASCII profile_base64.txt
```

### Step 4: Add GitHub Secrets

Add these secrets to GitHub:

| Secret Name | Value |
|------------|-------|
| `APPLE_CERTIFICATE` | Contents of `certificate_base64.txt` |
| `APPLE_CERTIFICATE_PASSWORD` | Password you set when exporting `.p12` |
| `APPLE_TEAM_ID` | Your Team ID (found in Apple Developer account) |
| `APPLE_PROVISIONING_PROFILE` | Contents of `profile_base64.txt` |
| `KEYCHAIN_PASSWORD` | Any password (used for temporary keychain) |

## 🚀 Using TestFlight Deployment

### Automatic Deployment

The workflow will automatically deploy to TestFlight when:
- You push to `main` or `develop` branch
- Build type is `release`
- App Store Connect API secrets are configured

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select **Build iOS App** workflow
3. Click **Run workflow**
4. Select:
   - Branch: `main` (or your release branch)
   - Build type: `release`
   - **Deploy to TestFlight**: ✅ Check this box
5. Click **Run workflow**

### Workflow Steps

When the workflow runs, it will:
1. ✅ Build your iOS app
2. ✅ Sign the app (if certificates are configured)
3. ✅ Create the `.ipa` file
4. ✅ Upload to TestFlight (if enabled)
5. ✅ Upload build artifacts to GitHub

## 📱 Accessing Your Build in TestFlight

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to **My Apps** → Your App → **TestFlight** tab
3. Your build will appear under **iOS Builds**
4. Processing usually takes 5-15 minutes
5. Once processed, you can:
   - Add internal testers (up to 100)
   - Add external testers (up to 10,000)
   - Submit for App Store review

## 🧪 Adding TestFlight Testers

### Internal Testers (Immediate)

1. Go to **TestFlight** → **Internal Testing**
2. Click **+** to add testers
3. Add email addresses of team members
4. They'll receive an email invitation

### External Testers (Requires Beta Review)

1. Go to **TestFlight** → **External Testing**
2. Create a new group
3. Add your build
4. Fill out beta information
5. Submit for Beta App Review (usually 24-48 hours)
6. Once approved, add testers

## 🐛 Troubleshooting

### "API key not found" or "Invalid API key"

**Solution:**
- Verify `APPSTORE_API_KEY_ID` matches the Key ID exactly
- Verify `APPSTORE_ISSUER_ID` is correct (check App Store Connect)
- Verify `APPSTORE_API_PRIVATE_KEY` includes the full key with headers

### "Certificate not found" or "Code signing failed"

**Solution:**
- Verify certificate and provisioning profile are valid
- Check that Team ID matches your Apple Developer account
- Ensure provisioning profile matches your App ID
- Certificate might be expired (check expiration date)

### "App not found" or "Invalid app identifier"

**Solution:**
- Verify your app exists in App Store Connect
- Check that Bundle ID in `src-tauri/tauri.conf.json` matches App ID
- Ensure you're using the correct Team ID

### Build succeeds but TestFlight upload fails

**Solution:**
- Check that all App Store Connect API secrets are set
- Verify API key has **App Manager** role or higher
- Check workflow logs for specific error messages
- Ensure app is in correct state in App Store Connect

### "Processing build" takes too long

**Solution:**
- This is normal! Apple processes builds server-side
- Usually takes 5-15 minutes
- Check App Store Connect for status
- The workflow will wait for processing by default

## 📊 Monitoring Builds

### In GitHub Actions

1. Go to **Actions** tab
2. Click on a workflow run
3. Expand **Upload to TestFlight** step
4. View logs for upload status

### In App Store Connect

1. Go to **TestFlight** → **iOS Builds**
2. See build status (Processing, Ready to Submit, etc.)
3. Click on a build for details

## 🔒 Security Best Practices

1. **Never commit** `.p8` files, certificates, or provisioning profiles
2. **Use App Store Connect API** instead of certificates when possible
3. **Rotate API keys** regularly (every 90 days recommended)
4. **Limit API key permissions** to minimum required (App Manager)
5. **Use GitHub Secrets** for all sensitive data
6. **Review access logs** in App Store Connect regularly

## ✅ Checklist

- [ ] Apple Developer account created ($99/year)
- [ ] App created in App Store Connect
- [ ] App Store Connect API key created (Option 1) OR Certificates created (Option 2)
- [ ] GitHub secrets configured
- [ ] Bundle ID matches in `tauri.conf.json` and App Store Connect
- [ ] First build completed successfully
- [ ] Build appears in TestFlight
- [ ] Testers added and can install app

## 🎓 Additional Resources

- [App Store Connect API Documentation](https://developer.apple.com/documentation/appstoreconnectapi)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Apple Developer Portal](https://developer.apple.com/account/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 💡 Tips

1. **Start with App Store Connect API** - It's easier and more secure
2. **Test with internal testers first** - No review required
3. **Use semantic versioning** - Update version in `tauri.conf.json` for each release
4. **Monitor build processing** - Check App Store Connect for status
5. **Keep builds organized** - Use version numbers and build notes

---

**Remember**: TestFlight deployment is **completely automated** and **free** with GitHub Actions! No Mac needed! 🎉

