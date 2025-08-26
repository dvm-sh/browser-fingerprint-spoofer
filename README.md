# 🛡️ Browser Fingerprint Spoofer

A privacy-focused JavaScript tool that helps users spoof or block the data that websites can collect for fingerprinting and tracking. It allows customization of browser properties, device info, and other detectable values to protect user privacy.

![Demo Screenshot](https://img.shields.io/badge/demo-available-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow)

## 🌟 Features

### Core Anti-Fingerprinting Protection
- **🌐 Navigator Properties Spoofing**: User Agent, Platform, Language, Hardware specs
- **📐 Screen Information Spoofing**: Resolution, color depth, available screen space
- **🎮 WebGL Spoofing**: GPU vendor and renderer information
- **🎨 Canvas Fingerprint Randomization**: Adds noise to prevent canvas-based tracking
- **📡 WebRTC IP Leak Prevention**: Blocks WebRTC connections that can expose real IP
- **📱 Device Sensor Blocking**: Prevents access to orientation and motion sensors
- **🌍 Timezone & Locale Spoofing**: Masks real geographical location
- **🔤 Font Detection Limiting**: Reduces font-based fingerprinting
- **🧹 Automatic Storage Clearing**: Clears cookies, localStorage, and other storage

### Privacy Levels
- **Basic**: Minimal spoofing for users who want some protection without breaking websites
- **Standard**: Balanced protection suitable for most privacy-conscious users
- **Strict**: Maximum protection for users who prioritize privacy above functionality

### Predefined Configurations
- Windows Chrome
- macOS Safari
- Linux Firefox
- Android Chrome
- iOS Safari
- Custom/Random configurations

## 🚀 Quick Start

### Method 1: Browser Console (Instant Use)
1. Open your browser's developer console (`F12` → Console)
2. Copy and paste the spoofing script
3. Configure and enable spoofing

```javascript
// Load the spoofer
fetch('https://your-cdn.com/spoof-core.js')
  .then(response => response.text())
  .then(code => eval(code))
  .then(() => {
    // Create spoofer with Windows Chrome config
    const spoofer = new BrowserFingerprintSpoofer(SpoofConfigs.windows_chrome);
    spoofer.enable();
    console.log('🛡️ Spoofing enabled!');
  });
```

### Method 2: UserScript (Tampermonkey/Greasemonkey)
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Create new userscript and paste the provided script
3. Configure to run on desired websites

### Method 3: Bookmarklet
Save this as a browser bookmark for one-click activation:
```javascript
javascript:(function(){fetch('https://your-cdn.com/browser-fingerprint-spoofer.min.js').then(r=>r.text()).then(code=>{eval(code);const s=new BrowserFingerprintSpoofer(SpoofConfigs.windows_chrome);s.enable();alert('🛡️ Spoofing enabled!')})})();
```

### Method 4: Direct Integration
Include the scripts in your HTML:
```html
<script src="src/spoof-core.js"></script>
<script src="src/spoof-config.js"></script>
<script src="src/utils.js"></script>
<script>
  const spoofer = new BrowserFingerprintSpoofer({
    ...SpoofConfigs.windows_chrome,
    ...PrivacyLevels.standard
  });
  spoofer.enable();
</script>
```

## 📖 Usage Examples

### Basic Usage
```javascript
// Create spoofer with default config
const spoofer = new BrowserFingerprintSpoofer();
spoofer.enable();
```

### Custom Configuration
```javascript
const customConfig = {
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  platform: "Win32",
  screenWidth: 1920,
  screenHeight: 1080,
  spoofCanvas: true,
  spoofWebRTC: true,
  clearStorage: true
};

const spoofer = new BrowserFingerprintSpoofer(customConfig);
spoofer.enable();
```

### Random Configuration
```javascript
// Generate random fingerprint on each page load
const randomConfig = getRandomConfig();
const spoofer = new BrowserFingerprintSpoofer({
  ...randomConfig,
  randomizeValues: true
});
spoofer.enable();
```

### Detect Current Fingerprint
```javascript
// See what information your browser exposes
BrowserUtils.detectFingerprint().then(fingerprint => {
  console.log('Your browser fingerprint:', fingerprint);
  console.log('Formatted output:', BrowserUtils.formatFingerprint(fingerprint));
  console.log('Entropy:', BrowserUtils.calculateEntropy(fingerprint), 'bits');
});
```

### Test Spoofing Effectiveness
```javascript
const originalFingerprint = await BrowserUtils.detectFingerprint();

// Enable spoofing
const spoofer = new BrowserFingerprintSpoofer(SpoofConfigs.macos_safari);
spoofer.enable();

const spoofedFingerprint = await BrowserUtils.detectFingerprint();

// Compare results
BrowserUtils.logComparison(originalFingerprint, spoofedFingerprint);
```

## 🎛️ Configuration Options

### Navigator Spoofing
```javascript
{
  spoofNavigator: true,
  userAgent: "Custom User Agent String",
  platform: "Win32",
  language: "en-US",
  languages: ["en-US", "en"],
  hardwareConcurrency: 8,
  deviceMemory: 8
}
```

### Screen Spoofing
```javascript
{
  spoofScreen: true,
  screenWidth: 1920,
  screenHeight: 1080,
  availWidth: 1920,
  availHeight: 1040,
  colorDepth: 24,
  pixelDepth: 24
}
```

### WebGL Spoofing
```javascript
{
  spoofWebGL: true,
  webglVendor: "Google Inc. (Intel)",
  webglRenderer: "ANGLE (Intel, Intel(R) UHD Graphics 620)"
}
```

### Privacy Features
```javascript
{
  spoofCanvas: true,        // Randomize canvas fingerprints
  spoofWebRTC: true,        // Block WebRTC IP leaks
  spoofSensors: true,       // Block device sensors
  spoofFonts: true,         // Limit font detection
  clearStorage: true,       // Clear browser storage
  randomizeValues: false    // Randomize on each load
}
```

## 📁 Project Structure

```
browser-fingerprint-spoofer/
│
├── src/
│   ├── spoof-core.js        # Main spoofing engine
│   ├── spoof-config.js      # Predefined configurations
│   └── utils.js             # Helper functions and fingerprint detection
│
├── demo/
│   └── index.html           # Interactive demo and testing page
│
├── extension/               # Browser extension (future)
│   ├── manifest.json
│   ├── background.js
│   └── content.js
│
├── userscripts/
│   ├── tampermonkey.js      # Tampermonkey userscript
│   └── greasemonkey.js      # Greasemonkey userscript
│
├── examples/
│   ├── basic-usage.html
│   ├── advanced-config.html
│   └── integration-example.html
│
├── docs/
│   ├── API.md               # Detailed API documentation
│   ├── PRIVACY.md           # Privacy implications and considerations
│   └── CONTRIBUTING.md      # How to contribute
│
├── tests/
│   ├── fingerprint-tests.js
│   └── spoofing-tests.js
│
├── README.md
├── LICENSE
├── CHANGELOG.md
└── package.json
```

## 🧪 Demo

Try the interactive demo to see how browser fingerprinting works and test the spoofing capabilities:

1. Open `demo/index.html` in your browser
2. Click "Detect Current Fingerprint" to see what information your browser exposes
3. Select a configuration preset and privacy level
4. Enable spoofing and compare the before/after results

**Live Demo**: [View Demo](https://your-username.github.io/browser-fingerprint-spoofer/)

## 🔬 How It Works

### Browser Fingerprinting Basics
Browser fingerprinting is a technique used by websites to collect information about your browser and device to create a unique identifier. This can include:

- User Agent string (browser type and version)
- Screen resolution and color depth
- Installed plugins and fonts
- Canvas rendering variations
- WebGL renderer information
- CPU and memory specifications
- Timezone and language settings

### Spoofing Techniques
This tool combats fingerprinting by:

1. **Property Overriding**: Uses `Object.defineProperty()` to change browser properties
2. **Function Hooking**: Intercepts API calls and returns fake data
3. **Canvas Noise Injection**: Adds minimal noise to canvas operations
4. **WebGL Context Manipulation**: Overrides GPU information
5. **Event Blocking**: Prevents access to sensitive APIs
6. **Storage Clearing**: Removes tracking data from browser storage

### Effectiveness
- **High**: Against basic fingerprinting scripts
- **Medium**: Against advanced commercial trackers
- **Variable**: Some techniques may be detected by sophisticated systems

## 📊 Privacy Impact

### Fingerprint Entropy Reduction
The tool aims to reduce your browser's uniqueness by:
- Spoofing to common configurations (Windows Chrome, etc.)
- Randomizing detectable values
- Blocking fingerprinting vectors entirely

### Before vs After Example
```
Before Spoofing:
- Entropy: 17.3 bits
- Uniqueness: 1 in 159,744
- Detectable Properties: 23

After Spoofing:
- Entropy: 8.7 bits  
- Uniqueness: 1 in 416
- Detectable Properties: 12
```

## ⚠️ Limitations & Considerations

### Technical Limitations
- **Cannot spoof all properties**: Some browser properties are read-only
- **JavaScript execution timing**: Must load before tracking scripts
- **Browser security restrictions**: Some APIs cannot be fully overridden
- **Website functionality**: Aggressive spoofing may break some sites

### Detection Possibilities
- **Inconsistencies**: Mismatched user agent and platform combinations
- **Behavioral patterns**: Suspicious API response patterns
- **Timing analysis**: Execution delays from spoofing overhead
- **Advanced techniques**: Machine learning-based detection systems

### Privacy Trade-offs
- **Functionality vs Privacy**: Stricter spoofing may break website features
- **Anonymity vs Usability**: Some spoofing makes browsing less convenient
- **False Security**: May provide false sense of complete anonymity

## 🛠️ Development

### Setup
```bash
git clone https://github.com/your-username/browser-fingerprint-spoofer.git
cd browser-fingerprint-spoofer
npm install  # If using npm for development tools
```

### Testing
```bash
# Open test suite in browser
open tests/index.html

# Or run with a local server
python -m http.server 8000
# Visit http://localhost:8000/tests/
```

### Building
```bash
# Minify for production
npm run build

# Create browser extension
npm run build:extension
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## 🔒 Security & Privacy

### Data Collection
This tool:
- ✅ **Does NOT** collect any personal data
- ✅ **Does NOT** send data to external servers
- ✅ **Does NOT** track users in any way
- ✅ **Runs entirely client-side**

### Security Practices
- All code is open source and auditable
- No external dependencies for core functionality
- Minimal permission requirements
- Regular security reviews

### Responsible Use
Please use this tool responsibly:
- Respect website terms of service
- Don't use for illegal activities
- Consider supporting websites that respect privacy
- Understand local privacy laws

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🤝 Acknowledgments

- Privacy researchers and advocates
- Open source privacy tools community
- Browser security research papers
- Electronic Frontier Foundation (EFF)

## 📚 Further Reading

### Privacy Resources
- [Electronic Frontier Foundation - Privacy](https://www.eff.org/issues/privacy)
- [Mozilla Privacy Not Included](https://foundation.mozilla.org/en/privacynotincluded/)
- [Privacy International](https://privacyinternational.org/)

### Technical References
- [Browser Fingerprinting: A survey](https://arxiv.org/abs/1905.01051)
- [FingerprintJS Research](https://fingerprintjs.com/blog/)
- [AmIUnique - Browser Uniqueness](https://amiunique.org/)

### Alternative Tools
- [uBlock Origin](https://github.com/gorhill/uBlock) - Ad/tracker blocker
- [Privacy Badger](https://privacybadger.org/) - EFF's tracker blocker
- [DuckDuckGo Privacy Essentials](https://duckduckgo.com/app)

## 📞 Support

### Getting Help
- 🐛 **Bug Reports**: [Open an issue](https://github.com/your-username/browser-fingerprint-spoofer/issues)
- 💡 **Feature Requests**: [Request a feature](https://github.com/your-username/browser-fingerprint-spoofer/issues)
- 💬 **Discussions**: [Join the discussion](https://github.com/your-username/browser-fingerprint-spoofer/discussions)
- 📧 **Email**: privacy@your-domain.com

### FAQ

**Q: Will this completely hide my identity online?**
A: No. This tool reduces browser fingerprinting but cannot provide complete anonymity. Use in combination with other privacy tools.

**Q: Can websites detect that I'm using this tool?**
A: Possibly. Advanced fingerprinting systems may detect inconsistencies or behavioral patterns.

**Q: Does this work on mobile browsers?**
A: Limited support. Mobile browsers have different security restrictions that may prevent some spoofing techniques.

**Q: Will this break websites?**
A: Some websites may not function properly with aggressive spoofing enabled. Use "Basic" privacy level for better compatibility.

**Q: Is this legal?**
A: Generally yes, but check your local laws and website terms of service. This tool is for legitimate privacy protection.

---

<p align="center">
  <strong>🛡️ Protect Your Privacy • 🌐 Browse Freely • 🔒 Stay Anonymous</strong>
</p>

<p align="center">
  Made with ❤️ for privacy advocates everywhere
</p>
