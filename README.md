# 🛡️ Browser Fingerprint Spoofer

A comprehensive browser extension that protects your privacy by spoofing browser fingerprints and blocking various tracking techniques used by websites.

## ✨ Features

- **Multi-Profile Support**: Choose from Windows Chrome, macOS Safari, Linux Firefox, or create custom profiles
- **Privacy Levels**: Basic, Standard, and Maximum protection modes
- **Real-time Protection**: Active fingerprint spoofing as you browse
- **Comprehensive Coverage**: Protects against multiple fingerprinting methods:
  - Navigator properties (User-Agent, Platform, Language)
  - Screen properties (Resolution, Color depth)
  - WebGL fingerprinting
  - Canvas fingerprinting
  - WebRTC IP leaks
  - Device sensors
  - Font detection
  - Hardware information

## 🚀 Installation

### From Source (Development)

1. Clone this repository:
```bash
git clone https://github.com/dvm-sh/browser-fingerprint-spoofer.git
cd browser-fingerprint-spoofer
```

2. Open Chrome/Edge and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the `extension` folder

5. The extension should now appear in your extensions list

### From Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store
2. Search for "Browser Fingerprint Spoofer"
3. Click "Add to Chrome"

## 🎯 Quick Start

1. **Enable Protection**: Click the extension icon and toggle the switch to "ON"
2. **Choose Profile**: Select a browser profile that matches your needs
3. **Set Privacy Level**: Choose between Basic, Standard, or Maximum protection
4. **Browse Safely**: Your browser fingerprint is now protected!

## ⚙️ Configuration

### Privacy Levels

- **Basic**: Essential protection (Navigator + Screen spoofing)
- **Standard**: Balanced protection (Most features enabled)
- **Maximum**: Full protection (All features + storage clearing)

### Browser Profiles

- **Windows Chrome**: Modern Windows 10/11 Chrome profile
- **macOS Safari**: macOS Safari profile
- **Linux Firefox**: Ubuntu Linux Firefox profile
- **Custom**: Create your own profile with specific values

### Advanced Settings

Access advanced configuration through the Options page:
- Enable/disable specific protection features
- Custom User-Agent strings
- Screen resolution settings
- Hardware information spoofing
- Storage management options

## 🛠️ Development

### Project Structure

```
browser-fingerprint-spoofer/
├── extension/                 # Chrome extension files
│   ├── background.js         # Background service worker
│   ├── content.js           # Content script
│   ├── popup.html           # Extension popup UI
│   ├── popup.js             # Popup functionality
│   ├── options.html         # Options page
│   ├── options.js           # Options functionality
│   ├── welcome.html         # Welcome page for new users
│   ├── inject.js            # Injected script for fingerprinting
│   ├── manifest.json        # Extension manifest
│   └── rules.json           # Network request rules
├── src/                     # Source files
│   ├── spoof-core.js        # Core spoofing logic
│   ├── spoof-config.js      # Configuration management
│   └── utils.js             # Utility functions
├── demo/                    # Demo and testing
│   └── index.html           # Demo page
└── README.md                # This file
```

### Building

The extension is ready to use as-is. For development:

1. Make changes to the source files
2. Copy updated files to the `extension/` folder
3. Reload the extension in Chrome

### Testing

1. Load the extension in developer mode
2. Visit fingerprinting test sites:
   - [BrowserLeaks](https://browserleaks.com/)
   - [AmIUnique](https://amiunique.org/)
   - [FingerprintJS](https://fingerprintjs.com/demo/)

## 🔧 Technical Details

### How It Works

1. **Content Script Injection**: The extension injects scripts into web pages
2. **Property Overriding**: Browser APIs are overridden to return spoofed values
3. **Real-time Protection**: Protection is active as long as the extension is enabled
4. **Message Passing**: Communication between content script and injected script

### Security Features

- **Object.defineProperty**: Uses non-configurable properties to prevent tampering
- **Function Overriding**: Overrides native functions to intercept calls
- **Storage Protection**: Clears tracking data when requested
- **Network Rules**: Blocks known fingerprinting domains

### Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## 📊 Privacy & Security

### What We Protect

- **Browser Fingerprinting**: Prevents unique identification
- **Canvas Fingerprinting**: Blocks image-based tracking
- **WebGL Fingerprinting**: Protects graphics card information
- **WebRTC Leaks**: Prevents IP address exposure
- **Device Sensors**: Blocks motion/orientation access
- **Font Detection**: Prevents font-based identification

### What We Don't Protect

- **Cookies**: Use a cookie manager for this
- **IP Address**: Use a VPN for this
- **DNS Leaks**: Use secure DNS for this
- **Browser Extensions**: Other extensions may still leak information

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Test your changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by various privacy-focused browser extensions
- Built with modern web technologies
- Community feedback and testing

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/dvm-sh/browser-fingerprint-spoofer/issues)


## 🔄 Changelog

### Version 1.0.0
- Initial release
- Basic fingerprint spoofing
- Multiple browser profiles
- Privacy level configuration
- Real-time protection

## ⚠️ Disclaimer

This extension is provided for educational and privacy protection purposes. While it significantly improves privacy, no solution is 100% foolproof. Always use additional privacy tools and practice good security habits.

---

**Made with ❤️ for privacy-conscious users**

