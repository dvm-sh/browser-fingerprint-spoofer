# 📥 Installation Guide

This guide will walk you through installing the Browser Fingerprint Spoofer extension on your browser.

## 🌐 Supported Browsers

- **Google Chrome** (Version 88 or higher)
- **Microsoft Edge** (Version 88 or higher)
- **Other Chromium-based browsers** (Brave, Opera, etc.)

## 🚀 Installation Steps

### Method 1: Load Unpacked (Recommended for Development/Testing)

1. **Download the Extension**
   - Clone or download this repository
   - Extract the files to a folder on your computer

2. **Open Chrome/Edge Extensions Page**
   - Open your browser
   - Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   - Or click the three dots menu → More tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner
   - This will reveal additional options

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the `extension` folder in the downloaded repository
   - Select the folder and click "Select Folder"

5. **Verify Installation**
   - The extension should now appear in your extensions list
   - You should see the Browser Fingerprint Spoofer extension with a shield icon
   - The extension icon should appear in your browser toolbar

### Method 2: Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store
2. Search for "Browser Fingerprint Spoofer"
3. Click "Add to Chrome"
4. Confirm the installation

## ⚠️ Important Notes

### Developer Mode Warning
When you load an unpacked extension, Chrome/Edge will show a warning about developer mode. This is normal and expected for extensions loaded from source code.

### Extension Updates
Extensions loaded in developer mode don't update automatically. To get updates:
1. Pull the latest changes from the repository
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Browser Fingerprint Spoofer extension

## 🔧 First-Time Setup

After installation:

1. **Click the Extension Icon**
   - Look for the shield icon in your browser toolbar
   - Click it to open the popup

2. **Enable Protection**
   - Toggle the switch to "ON"
   - Choose your preferred browser profile
   - Select your privacy level

3. **Test the Extension**
   - Visit a fingerprinting test site like [BrowserLeaks](https://browserleaks.com/)
   - Verify that your fingerprint is being spoofed

## 🐛 Troubleshooting

### Extension Not Loading

- **Check file structure**: Ensure the `extension` folder contains all required files
- **Verify manifest.json**: Make sure the manifest file is valid JSON
- **Check console errors**: Open Developer Tools and look for error messages
- **Restart browser**: Sometimes a browser restart is needed

### Extension Not Working

- **Check permissions**: Ensure the extension has necessary permissions
- **Verify content scripts**: Check if content scripts are being injected
- **Test on different sites**: Some sites may have additional protections

### Icon Not Visible

- **Check toolbar**: The icon might be hidden in the toolbar overflow menu
- **Pin the extension**: Right-click the extension icon and select "Pin to toolbar"
- **Check extension settings**: Ensure the extension is enabled

## 📱 Mobile Browsers

**Note**: This extension is designed for desktop browsers. Mobile browsers have different extension systems and may not support this extension.

## 🔒 Security Considerations

- **Source code**: You're running code from the source repository
- **Permissions**: Review the permissions requested by the extension
- **Updates**: Keep the extension updated for security patches

## 📞 Getting Help

If you encounter issues:

1. **Check the README**: Review the main documentation
2. **Check Issues**: Look for similar problems in the GitHub issues
3. **Create an Issue**: Report bugs or request help
4. **Community**: Ask questions in GitHub discussions

## ✅ Verification

To verify the extension is working correctly:

1. **Check Extension Status**
   - Go to `chrome://extensions/`
   - Ensure the extension shows as "Enabled"
   - No error messages should be displayed

2. **Test Functionality**
   - Open the extension popup
   - Toggle protection on/off
   - Change configuration profiles
   - Test on fingerprinting sites

3. **Check Console**
   - Open Developer Tools (F12)
   - Look for extension-related messages
   - No errors should appear

---

**🎉 Congratulations!** You've successfully installed the Browser Fingerprint Spoofer extension. Your browser fingerprint is now protected from tracking!
