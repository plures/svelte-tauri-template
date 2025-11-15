# Auto-Update Feature Setup

This guide explains how to configure and use the auto-update feature in the Microsoft Pay Calculator application.

## 🎯 Overview

The auto-update feature allows the application to:
- ✅ Automatically check for updates (enabled by default)
- ✅ Download and install updates automatically
- ✅ Show update notifications to users
- ✅ Allow users to toggle auto-update on/off via Settings

## 📋 Features

### Settings Page
- **Settings Button**: Ellipses icon (⋯) in the top-right corner of the main app
- **Auto-Update Toggle**: Enable/disable automatic updates
- **Manual Check**: Button to manually check for updates
- **Version Display**: Shows current app version
- **Update Notification**: Displays when updates are available

### Auto-Update Service
- Checks for updates every hour (when enabled)
- Automatically checks on app startup (if enabled)
- Respects user preference (stored persistently)

## ⚙️ Configuration

### Updater Configuration (`src-tauri/tauri.conf.json`)

```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/latest.json"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY_HERE"
    }
  }
}
```

### Using GitHub Releases (Recommended)

The easiest way to host updates is using **GitHub Releases**. The project includes automated workflows to generate update manifests.

#### Quick Setup

1. **Generate Signing Key**
   ```bash
   npx tauri signer generate -w ~/.tauri/myapp.key
   npx tauri signer generate -w ~/.tauri/myapp.key --print-public-key
   ```
   Copy the public key and add it to `tauri.conf.json` as `pubkey`.

2. **Create a GitHub Release**
   - Build your app: `npm run tauri:build`
   - Sign update files: `bash scripts/sign-update-files.sh`
   - Create a new release on GitHub (tag: `v0.1.0`, etc.)
   - Upload signed bundles (.msi, .dmg, .AppImage, etc.) and their .sig files

3. **Generate Update Manifest**
   - The `.github/workflows/update-manifest.yml` workflow will automatically:
     - Generate the manifest JSON
     - Upload it to the release
     - Create/update a GitHub Gist with the manifest
   - Or run manually: `node scripts/generate-update-manifest.js`

4. **Configure Endpoint**
   - After the first release, the workflow will output a Gist URL
   - Add `UPDATE_MANIFEST_GIST_ID` to your GitHub repository secrets
   - Update `tauri.conf.json` endpoints with the Gist URL

#### Update Manifest Format

The generated manifest follows this format:
   ```json
   {
     "version": "0.1.1",
     "notes": "Bug fixes and improvements",
     "pub_date": "2024-01-15T12:00:00Z",
     "platforms": {
       "windows-x86_64": {
         "signature": "signature_from_sig_file",
         "url": "https://github.com/username/repo/releases/download/v0.1.1/Microsoft Pay Calculator_0.1.1_x64_en-US.msi"
       },
       "darwin-x86_64": {
         "signature": "signature_from_sig_file",
         "url": "https://github.com/username/repo/releases/download/v0.1.1/Microsoft Pay Calculator_0.1.1_x64.app.tar.gz"
       },
       "darwin-aarch64": {
         "signature": "signature_from_sig_file",
         "url": "https://github.com/username/repo/releases/download/v0.1.1/Microsoft Pay Calculator_0.1.1_aarch64.app.tar.gz"
       },
       "linux-x86_64": {
         "signature": "signature_from_sig_file",
         "url": "https://github.com/username/repo/releases/download/v0.1.1/Microsoft Pay Calculator_0.1.1_amd64.AppImage.tar.gz"
       }
     }
   }
   ```

#### Manual Setup (Alternative)

If you prefer to host updates elsewhere:

1. **Create Update Endpoint**
   - Host a JSON file with update information
   - Format: `https://your-domain.com/updates/latest.json`
   - Or use GitHub Gist: `https://gist.githubusercontent.com/user/gist_id/raw/latest.json`

2. **Generate Signing Key**
   ```bash
   # Generate keypair
   npx tauri signer generate -w ~/.tauri/myapp.key
   
   # Get public key (add to tauri.conf.json)
   npx tauri signer generate -w ~/.tauri/myapp.key --print-public-key
   ```

3. **Sign Updates**
   ```bash
   # Sign all update files
   bash scripts/sign-update-files.sh
   
   # Or sign individual files
   npx tauri signer sign ~/.tauri/myapp.key path/to/update/file
   ```

## 🔧 Usage

### For Users

1. **Access Settings**
   - Click the ellipses icon (⋯) in the top-right corner
   - Or navigate to `/settings` route

2. **Toggle Auto-Update**
   - Use the toggle switch to enable/disable auto-updates
   - Setting is saved automatically

3. **Manual Update Check**
   - Click "Check Now" button in settings
   - App will check for available updates

4. **Install Updates**
   - When update is available, click "Install Update"
   - App will download, install, and restart automatically

### For Developers

#### Testing Auto-Update

1. **Local Testing**
   ```bash
   # Build app
   npm run tauri:build
   
   # Serve update manifest locally
   # Update endpoint in tauri.conf.json to point to local server
   ```

2. **Update Flow**
   - Increment version in `src-tauri/tauri.conf.json`
   - Build new version
   - Sign update files
   - Upload to update server
   - Update manifest JSON

#### Disable Auto-Update (Development)

Set in `src-tauri/tauri.conf.json`:
```json
{
  "plugins": {
    "updater": {
      "active": false
    }
  }
}
```

## 📁 File Structure

```
src/
├── lib/
│   ├── stores/
│   │   └── settings.ts          # Settings store with persistence
│   └── services/
│       └── updater.ts            # Auto-update service
├── routes/
│   ├── App.svelte               # Main app with settings button
│   ├── settings/
│   │   ├── +layout.svelte      # Settings page layout
│   │   └── +page.svelte         # Settings page content
│   └── +page.svelte             # Main page (initializes updater)
src-tauri/
├── tauri.conf.json              # Updater configuration
└── capabilities/
    └── desktop.json             # Updater permissions
```

## 🔐 Security

- **Code Signing**: Updates must be signed with your private key
- **Public Key**: Stored in `tauri.conf.json` for verification
- **HTTPS**: Update endpoints should use HTTPS
- **Signature Verification**: Tauri verifies signatures before installing

## 🐛 Troubleshooting

### Auto-Update Not Working

1. **Check Configuration**
   - Verify `updater.active` is `true` in `tauri.conf.json`
   - Check endpoint URL is correct
   - Ensure public key is set

2. **Check Permissions**
   - Verify `updater:default` permission in `desktop.json`
   - Check app has network access

3. **Check Logs**
   - Open DevTools (F12) to see update check logs
   - Check console for errors

### Settings Not Persisting

- Verify `store:default` permission is in `desktop.json`
- Check browser console for store errors
- Settings are stored in `.settings.dat` file

### Update Check Fails

- Verify update server is accessible
- Check endpoint URL format matches expected pattern
- Ensure update manifest JSON is valid
- Check network connectivity

## 🔄 Release Workflow

### Automated Release Process

1. **Build and Sign**
   ```bash
   npm run tauri:build
   bash scripts/sign-update-files.sh
   ```

2. **Create GitHub Release**
   - Tag: `v0.1.0` (matches version in tauri.conf.json)
   - Upload all signed bundles (.msi, .dmg, .AppImage, etc.)
   - Upload corresponding .sig files

3. **Manifest Generation**
   - The `update-manifest.yml` workflow automatically:
     - Generates `latest.json` manifest
     - Points to GitHub Releases download URLs
     - Uploads manifest to release
     - Updates GitHub Gist (if configured)

4. **Update App Configuration**
   - After first release, get Gist URL from workflow output
   - Add `UPDATE_MANIFEST_GIST_ID` to repository secrets
   - Update `tauri.conf.json` endpoints

### Manual Release

```bash
# Generate manifest manually
node scripts/generate-update-manifest.js latest.json v0.1.0

# Upload to GitHub Gist or your hosting
# Update tauri.conf.json endpoint
```

## 📚 Resources

- [Tauri Updater Documentation](https://v2.tauri.app/plugin/updater/)
- [Tauri Signer Documentation](https://v2.tauri.app/cli/signer/)
- [GitHub Releases API](https://docs.github.com/en/rest/releases/releases)
- [Update Server Examples](https://github.com/tauri-apps/tauri/tree/dev/examples/updater)

## ✅ Checklist

- [x] Updater plugin installed
- [x] Settings page created
- [x] Auto-update toggle implemented
- [x] Settings persistence configured
- [x] Update service initialized
- [ ] Update server configured
- [ ] Signing keys generated
- [ ] Update endpoint tested
- [ ] Update flow tested end-to-end

---

**Note**: The updater endpoint URL in `tauri.conf.json` is a placeholder. Update it with your actual update server URL before distribution.

