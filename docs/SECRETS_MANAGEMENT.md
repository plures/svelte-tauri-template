# Managing GitHub Secrets Locally

This guide shows you how to manage GitHub repository secrets directly from VS Code and your local terminal.

## 🎯 Methods

### Method 1: GitHub CLI (Recommended)

The easiest way is using **GitHub CLI** (`gh`) from VS Code's integrated terminal.

#### Setup

1. **Install GitHub CLI** (if not already installed):
   ```bash
   # Windows (using winget or chocolatey)
   winget install GitHub.cli
   # or
   choco install gh
   
   # macOS
   brew install gh
   
   # Linux
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   sudo apt update && sudo apt install gh
   ```

2. **Authenticate**:
   ```bash
   gh auth login
   ```
   Follow the prompts to authenticate with GitHub.

#### Managing Secrets

**List all secrets:**
```bash
gh secret list
```

**Set a secret:**
```bash
# From value
gh secret set SECRET_NAME --body "secret-value"

# From file
gh secret set SECRET_NAME < secret-file.txt

# From environment variable
gh secret set SECRET_NAME --env ENV_VAR_NAME

# From stdin (prompts for input)
gh secret set SECRET_NAME
```

**Get secret metadata** (note: you can't retrieve secret values, only see if they exist):
```bash
gh secret list
```

**Delete a secret:**
```bash
gh secret delete SECRET_NAME
```

#### Quick Setup Scripts

**PowerShell (Windows - Recommended):**
```powershell
# Interactive setup
.\scripts\setup-secrets.ps1

# Quick management
.\scripts\manage-secrets.ps1 -Action list
.\scripts\manage-secrets.ps1 -Action set -Name SECRET_NAME -Value "value"
.\scripts\manage-secrets.ps1 -Action set -Name SECRET_NAME -FilePath "path\to\file"
```

**Bash (Linux/macOS):**
```bash
# Interactive setup
bash scripts/setup-secrets.sh
```

### Method 2: VS Code Extensions

#### GitHub CLI Extension

Install the **GitHub CLI** extension for VS Code:
- Extension ID: `github.vscode-pull-request-github`
- Provides GitHub integration, but secret management still uses CLI

#### Secrets Extension

Install the **Secrets** extension for local secret management:
- Extension ID: `pomdtr.secrets`
- Allows you to store secrets locally (not synced to GitHub)
- Useful for local development environment variables

**Setup:**
1. Install extension: `ext install pomdtr.secrets`
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run: `Secrets: Open Secrets`
4. Add secrets that will be injected as environment variables

**Note:** This is for local secrets, not GitHub repository secrets.

### Method 3: VS Code Tasks (Already Configured!)

VS Code tasks are already set up in `.vscode/tasks.json`. Use them via:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Choose from:
   - **GitHub: List Secrets** - View all secrets
   - **GitHub: Setup Secrets (Interactive)** - Run PowerShell setup wizard
   - **GitHub: Set Tauri Signing Key** - Set Tauri key from file
   - **GitHub: Set Windows Certificate** - Set Windows cert from file
   - **GitHub: Manage Secrets (Quick)** - Quick secret operations

## 📋 Required Secrets for This Project

Based on your workflows, here are the secrets you may need:

### Required
- None (workflows work without secrets, but signing won't work)

### Optional (for signing)

#### Tauri Update Signing
- `TAURI_SIGNING_KEY` - Base64-encoded Tauri signing private key

#### Windows Code Signing
- `WINDOWS_SIGNING_CERTIFICATE` - Base64-encoded .pfx certificate
- `WINDOWS_SIGNING_CERTIFICATE_PASSWORD` - Certificate password

#### macOS Code Signing
- `MACOS_SIGNING_CERTIFICATE` - Base64-encoded certificate
- `MACOS_SIGNING_CERTIFICATE_PASSWORD` - Certificate password

#### iOS (App Store Connect API)
- `APPSTORE_API_KEY_ID` - App Store Connect API Key ID
- `APPSTORE_ISSUER_ID` - App Store Connect Issuer ID
- `APPSTORE_API_PRIVATE_KEY` - Contents of .p8 private key file

#### Update Manifest
- `UPDATE_MANIFEST_GIST_ID` - GitHub Gist ID (auto-created on first release)

## 🚀 Quick Commands Reference

### Using GitHub CLI from VS Code Terminal

**PowerShell (Windows):**
```powershell
# List all secrets
gh secret list

# Set a secret (interactive)
gh secret set SECRET_NAME

# Set from file (PowerShell)
$content = [System.IO.File]::ReadAllBytes("path\to\file")
$base64 = [Convert]::ToBase64String($content)
$base64 | gh secret set SECRET_NAME

# Set from secure input
$secure = Read-Host "Enter secret" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
)
$plain | gh secret set SECRET_NAME

# Delete a secret
gh secret delete SECRET_NAME
```

**Bash (Linux/macOS):**
```bash
# List all secrets
gh secret list

# Set a secret (interactive)
gh secret set SECRET_NAME

# Set from file
gh secret set TAURI_SIGNING_KEY < ~/.tauri/myapp.key.base64

# Set from environment variable
export MY_SECRET="value"
gh secret set SECRET_NAME --env MY_SECRET

# Delete a secret
gh secret delete SECRET_NAME
```

### Encoding Files for Secrets

**PowerShell (Windows):**
```powershell
# Encode Tauri signing key
$keyPath = "$env:USERPROFILE\.tauri\myapp.key"
$content = [System.IO.File]::ReadAllBytes($keyPath)
$base64 = [Convert]::ToBase64String($content)
$base64 | gh secret set TAURI_SIGNING_KEY

# Encode Windows certificate
$certBytes = [System.IO.File]::ReadAllBytes("certificate.pfx")
$certBase64 = [Convert]::ToBase64String($certBytes)
$certBase64 | gh secret set WINDOWS_SIGNING_CERTIFICATE
```

**Bash (Linux/macOS):**
```bash
# Encode Tauri signing key
cat ~/.tauri/myapp.key | base64 -w 0 | gh secret set TAURI_SIGNING_KEY

# Encode Windows certificate
cat certificate.pfx | base64 -w 0 | gh secret set WINDOWS_SIGNING_CERTIFICATE
```

## 🔒 Security Best Practices

1. **Never commit secrets** - Use `.gitignore` for secret files
2. **Use GitHub Secrets** - Don't hardcode secrets in workflows
3. **Rotate regularly** - Update secrets periodically
4. **Use least privilege** - Only grant necessary permissions
5. **Audit access** - Regularly review who has access to secrets

## 📝 Example: Setting Up All Secrets

**PowerShell (Windows):**
```powershell
# 1. Authenticate with GitHub
gh auth login

# 2. Run interactive setup script (easiest!)
.\scripts\setup-secrets.ps1

# OR manually:

# 2. Set Tauri signing key
$keyPath = "$env:USERPROFILE\.tauri\myapp.key"
$keyBytes = [System.IO.File]::ReadAllBytes($keyPath)
$keyBase64 = [Convert]::ToBase64String($keyBytes)
$keyBase64 | gh secret set TAURI_SIGNING_KEY

# 3. Set Windows certificate
$certBytes = [System.IO.File]::ReadAllBytes("certificate.pfx")
$certBase64 = [Convert]::ToBase64String($certBytes)
$certBase64 | gh secret set WINDOWS_SIGNING_CERTIFICATE
$winPass = Read-Host "Windows cert password" -AsSecureString
$winPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($winPass)
)
$winPassPlain | gh secret set WINDOWS_SIGNING_CERTIFICATE_PASSWORD

# 4. Set App Store Connect API (for iOS)
$apiKeyId = Read-Host "App Store API Key ID"
$issuerId = Read-Host "App Store Issuer ID"
$apiKeyId | gh secret set APPSTORE_API_KEY_ID
$issuerId | gh secret set APPSTORE_ISSUER_ID
Get-Content "AuthKey_*.p8" -Raw | gh secret set APPSTORE_API_PRIVATE_KEY

# 5. Verify all secrets are set
gh secret list
```

**Bash (Linux/macOS):**
```bash
# 1. Authenticate with GitHub
gh auth login

# 2. Set Tauri signing key
cat ~/.tauri/myapp.key | base64 -w 0 | gh secret set TAURI_SIGNING_KEY

# 3. Set Windows certificate (if you have one)
read -sp "Windows cert password: " WIN_PASS
echo "$WIN_PASS" | gh secret set WINDOWS_SIGNING_CERTIFICATE_PASSWORD
cat certificate.pfx | base64 -w 0 | gh secret set WINDOWS_SIGNING_CERTIFICATE

# 4. Set App Store Connect API (for iOS)
read -p "App Store API Key ID: " API_KEY_ID
read -p "App Store Issuer ID: " ISSUER_ID
echo "$API_KEY_ID" | gh secret set APPSTORE_API_KEY_ID
echo "$ISSUER_ID" | gh secret set APPSTORE_ISSUER_ID
cat AuthKey_*.p8 | gh secret set APPSTORE_API_PRIVATE_KEY

# 5. Verify all secrets are set
gh secret list
```

## 🐛 Troubleshooting

### "gh: command not found"
- Install GitHub CLI (see Setup section above)
- Restart VS Code terminal after installation

### "Authentication required"
- Run `gh auth login` to authenticate
- Choose your preferred authentication method

### "Permission denied"
- Ensure you have admin/owner access to the repository
- Check repository settings → Secrets and variables → Actions

### "Secret not found in workflow"
- Verify secret name matches exactly (case-sensitive)
- Check workflow file uses `${{ secrets.SECRET_NAME }}`
- Ensure secret is set in the correct repository

## 📚 Additional Resources

- [GitHub CLI Documentation](https://cli.github.com/manual/gh_secret)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [VS Code GitHub Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

