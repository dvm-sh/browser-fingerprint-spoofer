/**
 * Browser Fingerprint Spoofer - Core Module
 * Privacy-focused JavaScript tool for blocking browser fingerprinting
 * 
 * @author Your Name
 * @license MIT
 */

class BrowserFingerprintSpoofer {
    constructor(config = {}) {
        this.config = { ...this.getDefaultConfig(), ...config };
        this.originalValues = {};
        this.isEnabled = false;
    }

    getDefaultConfig() {
        return {
            // Navigator spoofing
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            platform: "Win32",
            language: "en-US",
            languages: ["en-US", "en"],
            cookieEnabled: true,
            onLine: true,
            hardwareConcurrency: 8,
            deviceMemory: 8,
            
            // Screen spoofing
            screenWidth: 1920,
            screenHeight: 1080,
            availWidth: 1920,
            availHeight: 1040,
            colorDepth: 24,
            pixelDepth: 24,
            
            // WebGL spoofing
            webglVendor: "Google Inc. (Intel)",
            webglRenderer: "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.8935)",
            
            // Timezone spoofing
            timezone: "America/New_York",
            timezoneOffset: -300,
            
            // Feature flags
            spoofNavigator: true,
            spoofScreen: true,
            spoofWebGL: true,
            spoofCanvas: true,
            spoofWebRTC: true,
            spoofSensors: true,
            spoofFonts: true,
            clearStorage: true,
            randomizeValues: false
        };
    }

    enable() {
        if (this.isEnabled) return;
        
        console.log('🛡️ Browser Fingerprint Spoofer: Enabled');
        
        this.spoofNavigatorProperties();
        this.spoofScreenProperties();
        this.spoofWebGL();
        this.spoofCanvas();
        this.spoofWebRTC();
        this.spoofSensors();
        this.spoofTimezone();
        this.spoofFonts();
        
        if (this.config.clearStorage) {
            this.clearStorage();
        }
        
        this.isEnabled = true;
    }

    disable() {
        if (!this.isEnabled) return;
        
        console.log('🛡️ Browser Fingerprint Spoofer: Disabled');
        // Note: Some spoofing cannot be fully reversed due to browser security
        this.isEnabled = false;
    }

    spoofNavigatorProperties() {
        if (!this.config.spoofNavigator) return;
        
        const navigatorProps = {
            userAgent: this.config.userAgent,
            appVersion: this.config.userAgent.substring(8),
            platform: this.config.platform,
            language: this.config.language,
            languages: this.config.languages,
            cookieEnabled: this.config.cookieEnabled,
            onLine: this.config.onLine,
            hardwareConcurrency: this.config.hardwareConcurrency,
            deviceMemory: this.config.deviceMemory
        };

        for (const [prop, value] of Object.entries(navigatorProps)) {
            if (navigator.hasOwnProperty(prop)) {
                this.originalValues[`navigator.${prop}`] = navigator[prop];
                try {
                    Object.defineProperty(navigator, prop, {
                        value: value,
                        writable: false,
                        configurable: true
                    });
                } catch (e) {
                    console.warn(`Cannot spoof navigator.${prop}:`, e.message);
                }
            }
        }
    }

    spoofScreenProperties() {
        if (!this.config.spoofScreen) return;
        
        const screenProps = {
            width: this.config.screenWidth,
            height: this.config.screenHeight,
            availWidth: this.config.availWidth,
            availHeight: this.config.availHeight,
            colorDepth: this.config.colorDepth,
            pixelDepth: this.config.pixelDepth
        };

        for (const [prop, value] of Object.entries(screenProps)) {
            if (screen.hasOwnProperty(prop)) {
                this.originalValues[`screen.${prop}`] = screen[prop];
                try {
                    Object.defineProperty(screen, prop, {
                        value: value,
                        writable: false,
                        configurable: true
                    });
                } catch (e) {
                    console.warn(`Cannot spoof screen.${prop}:`, e.message);
                }
            }
        }
    }

    spoofWebGL() {
        if (!this.config.spoofWebGL) return;
        
        // WebGL Context spoofing
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            // UNMASKED_VENDOR_WEBGL
            if (parameter === 37445) {
                return this.config?.webglVendor || "Google Inc. (Intel)";
            }
            // UNMASKED_RENDERER_WEBGL  
            if (parameter === 37446) {
                return this.config?.webglRenderer || "ANGLE (Intel, Intel(R) UHD Graphics 620)";
            }
            return getParameter.call(this, parameter);
        }.bind(this);

        // WebGL2 Context spoofing
        if (typeof WebGL2RenderingContext !== 'undefined') {
            const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
            WebGL2RenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) return this.config?.webglVendor || "Google Inc. (Intel)";
                if (parameter === 37446) return this.config?.webglRenderer || "ANGLE (Intel, Intel(R) UHD Graphics 620)";
                return getParameter2.call(this, parameter);
            }.bind(this);
        }
    }

    spoofCanvas() {
        if (!this.config.spoofCanvas) return;
        
        // Canvas fingerprint randomization
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
            // Add noise to canvas
            const ctx = this.getContext('2d');
            if (ctx) {
                const imageData = ctx.getImageData(0, 0, 1, 1);
                const data = imageData.data;
                // Add minimal noise
                for (let i = 0; i < data.length; i += 4) {
                    data[i] += Math.random() < 0.5 ? 1 : -1;     // Red
                    data[i + 1] += Math.random() < 0.5 ? 1 : -1; // Green  
                    data[i + 2] += Math.random() < 0.5 ? 1 : -1; // Blue
                }
                ctx.putImageData(imageData, 0, 0);
            }
            return originalToDataURL.call(this, type, quality);
        };

        // Canvas getImageData spoofing
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
            const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
            // Add minimal noise to prevent fingerprinting
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] += Math.random() < 0.1 ? Math.random() > 0.5 ? 1 : -1 : 0;
            }
            return imageData;
        };
    }

    spoofWebRTC() {
        if (!this.config.spoofWebRTC) return;
        
        // Block WebRTC IP leak
        if (typeof RTCPeerConnection !== 'undefined') {
            const originalCreateDataChannel = RTCPeerConnection.prototype.createDataChannel;
            RTCPeerConnection.prototype.createDataChannel = function() {
                console.warn('🛡️ WebRTC connection blocked for privacy');
                return null;
            };
        }

        // Block getUserMedia to prevent device enumeration
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia = function() {
                return Promise.reject(new Error('getUserMedia blocked for privacy'));
            };
        }
    }

    spoofSensors() {
        if (!this.config.spoofSensors) return;
        
        // Block device orientation
        if (typeof DeviceOrientationEvent !== 'undefined') {
            window.addEventListener = (function(originalAddEventListener) {
                return function(type, listener, options) {
                    if (type === 'deviceorientation' || type === 'devicemotion') {
                        console.warn(`🛡️ ${type} event blocked for privacy`);
                        return;
                    }
                    return originalAddEventListener.call(this, type, listener, options);
                };
            })(window.addEventListener);
        }
    }

    spoofTimezone() {
        // Override timezone offset
        const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
        Date.prototype.getTimezoneOffset = function() {
            return this.config?.timezoneOffset || -300;
        }.bind(this);

        // Override Intl.DateTimeFormat
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
            Intl.DateTimeFormat.prototype.resolvedOptions = function() {
                const options = originalResolvedOptions.call(this);
                options.timeZone = this.config?.timezone || 'America/New_York';
                return options;
            }.bind(this);
        }
    }

    spoofFonts() {
        if (!this.config.spoofFonts) return;
        
        // Limit font detection
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'SpoofFont';
                src: url('data:font/woff2;base64,');
            }
        `;
        document.head.appendChild(style);
    }

    clearStorage() {
        try {
            // Clear localStorage
            if (typeof localStorage !== 'undefined') {
                localStorage.clear();
            }
            
            // Clear sessionStorage  
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.clear();
            }
            
            // Clear IndexedDB (basic approach)
            if (typeof indexedDB !== 'undefined') {
                indexedDB.databases().then(databases => {
                    databases.forEach(db => {
                        indexedDB.deleteDatabase(db.name);
                    });
                }).catch(() => {}); // Ignore errors
            }
            
            console.log('🧹 Browser storage cleared');
        } catch (e) {
            console.warn('⚠️ Could not clear all storage:', e.message);
        }
    }

    randomizeConfig() {
        const randomUserAgents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        ];
        
        const randomScreenSizes = [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
            { width: 1536, height: 864 }
        ];
        
        this.config.userAgent = randomUserAgents[Math.floor(Math.random() * randomUserAgents.length)];
        const screenSize = randomScreenSizes[Math.floor(Math.random() * randomScreenSizes.length)];
        this.config.screenWidth = screenSize.width;
        this.config.screenHeight = screenSize.height;
        this.config.hardwareConcurrency = Math.floor(Math.random() * 8) + 2;
    }

    getFingerprint() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hardwareConcurrency: navigator.hardwareConcurrency
        };
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserFingerprintSpoofer;
} else if (typeof window !== 'undefined') {
    window.BrowserFingerprintSpoofer = BrowserFingerprintSpoofer;
}