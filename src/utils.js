/**
 * Browser Fingerprint Spoofer - Utility Functions
 * Helper functions for fingerprint detection and spoofing
 */

const BrowserUtils = {
    /**
     * Detect current browser fingerprint
     * @returns {Object} Current browser fingerprint data
     */
    detectFingerprint: async function() {
        const fingerprint = {
            // Basic browser info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            
            // Screen info
            screenWidth: screen.width,
            screenHeight: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            
            // Timezone info
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            
            // Canvas fingerprint
            canvasFingerprint: this.getCanvasFingerprint(),
            
            // WebGL info
            webglInfo: this.getWebGLFingerprint(),
            
            // Font detection
            fonts: await this.detectFonts(),
            
            // Storage info
            storage: this.getStorageInfo(),
            
            // Network info
            connection: this.getConnectionInfo(),
            
            // Plugins (deprecated but still used)
            plugins: this.getPluginInfo()
        };
        
        return fingerprint;
    },

    /**
     * Generate canvas fingerprint
     * @returns {string} Canvas fingerprint hash
     */
    getCanvasFingerprint: function() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Draw fingerprint pattern
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Browser fingerprint canvas test 🎨', 2, 2);
            
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillRect(10, 10, 50, 50);
            
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.arc(50, 50, 30, 0, Math.PI * 2);
            ctx.fill();
            
            return canvas.toDataURL();
        } catch (e) {
            return 'Canvas not supported';
        }
    },

    /**
     * Get WebGL fingerprint information
     * @returns {Object} WebGL fingerprint data
     */
    getWebGLFingerprint: function() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) return { supported: false };
            
            const info = {
                supported: true,
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                unmaskedVendor: gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_VENDOR_WEBGL),
                unmaskedRenderer: gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL),
                extensions: gl.getSupportedExtensions()
            };
            
            return info;
        } catch (e) {
            return { supported: false, error: e.message };
        }
    },

    /**
     * Detect available fonts
     * @returns {Promise<Array>} List of detected fonts
     */
    detectFonts: async function() {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
            'Verdana', 'Georgia', 'Palatino', 'Garamond',
            'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
        ];
        
        const detectedFonts = [];
        
        // Create test elements
        const testString = 'mmmmmmmmmmlli';
        const testSize = '72px';
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.textBaseline = 'top';
        context.font = testSize + ' monospace';
        
        // Get baseline measurements
        const baselineWidths = {};
        for (const baseFont of baseFonts) {
            context.font = testSize + ' ' + baseFont;
            baselineWidths[baseFont] = context.measureText(testString).width;
        }
        
        // Test each font
        for (const testFont of testFonts) {
            let detected = false;
            
            for (const baseFont of baseFonts) {
                context.font = testSize + ' ' + testFont + ', ' + baseFont;
                const width = context.measureText(testString).width;
                
                if (width !== baselineWidths[baseFont]) {
                    detected = true;
                    break;
                }
            }
            
            if (detected) {
                detectedFonts.push(testFont);
            }
        }
        
        return detectedFonts;
    },

    /**
     * Get storage information
     * @returns {Object} Storage capabilities and usage
     */
    getStorageInfo: function() {
        const storage = {};
        
        try {
            storage.localStorage = {
                supported: typeof localStorage !== 'undefined',
                length: localStorage ? localStorage.length : 0
            };
        } catch (e) {
            storage.localStorage = { supported: false, error: e.message };
        }
        
        try {
            storage.sessionStorage = {
                supported: typeof sessionStorage !== 'undefined',
                length: sessionStorage ? sessionStorage.length : 0
            };
        } catch (e) {
            storage.sessionStorage = { supported: false, error: e.message };
        }
        
        storage.indexedDB = {
            supported: typeof indexedDB !== 'undefined'
        };
        
        storage.webSQL = {
            supported: typeof openDatabase !== 'undefined'
        };
        
        return storage;
    },

    /**
     * Get network connection information
     * @returns {Object} Network connection details
     */
    getConnectionInfo: function() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) {
            return { supported: false };
        }
        
        return {
            supported: true,
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
        };
    },

    /**
     * Get plugin information (deprecated but still fingerprinted)
     * @returns {Array} List of browser plugins
     */
    getPluginInfo: function() {
        const plugins = [];
        
        if (navigator.plugins) {
            for (let i = 0; i < navigator.plugins.length; i++) {
                const plugin = navigator.plugins[i];
                plugins.push({
                    name: plugin.name,
                    description: plugin.description,
                    filename: plugin.filename,
                    version: plugin.version
                });
            }
        }
        
        return plugins;
    },

    /**
     * Calculate fingerprint entropy/uniqueness
     * @param {Object} fingerprint - Fingerprint data
     * @returns {number} Estimated entropy bits
     */
    calculateEntropy: function(fingerprint) {
        let entropy = 0;
        
        // User agent entropy (estimated 10-15 bits)
        entropy += 12;
        
        // Screen resolution entropy (estimated 6-8 bits)
        entropy += 7;
        
        // Timezone entropy (estimated 4-6 bits)
        entropy += 5;
        
        // Language entropy (estimated 3-5 bits)
        entropy += 4;
        
        // Canvas fingerprint entropy (estimated 8-12 bits)
        if (fingerprint.canvasFingerprint !== 'Canvas not supported') {
            entropy += 10;
        }
        
        // WebGL entropy (estimated 5-8 bits)
        if (fingerprint.webglInfo && fingerprint.webglInfo.supported) {
            entropy += 6;
        }
        
        // Font entropy (estimated 3-8 bits depending on fonts detected)
        if (fingerprint.fonts) {
            entropy += Math.min(8, fingerprint.fonts.length / 2);
        }
        
        // Hardware concurrency entropy (estimated 2-3 bits)
        entropy += 2.5;
        
        // Color depth entropy (estimated 1-2 bits)
        entropy += 1.5;
        
        return Math.round(entropy);
    },

    /**
     * Generate hash of fingerprint data
     * @param {Object} fingerprint - Fingerprint data
     * @returns {string} SHA-256 hash of fingerprint
     */
    hashFingerprint: async function(fingerprint) {
        const fingerprintString = JSON.stringify(fingerprint, Object.keys(fingerprint).sort());
        const encoder = new TextEncoder();
        const data = encoder.encode(fingerprintString);
        
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
            // Fallback simple hash for older browsers
            let hash = 0;
            for (let i = 0; i < fingerprintString.length; i++) {
                const char = fingerprintString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return hash.toString(16);
        }
    },

    /**
     * Check if spoofing is active
     * @returns {Object} Spoofing detection results
     */
    detectSpoofing: function() {
        const results = {
            likelyBrowser: this.detectLikelyBrowser(),
            inconsistencies: [],
            spoofingDetected: false
        };
        
        // Check for common inconsistencies
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        
        // Windows platform but non-Windows user agent
        if (platform.includes('Win') && !ua.includes('Windows')) {
            results.inconsistencies.push('Platform/UserAgent mismatch');
        }
        
        // Mac platform but non-Mac user agent
        if (platform.includes('Mac') && !ua.includes('Mac')) {
            results.inconsistencies.push('Platform/UserAgent mismatch');
        }
        
        // Screen size vs user agent inconsistencies
        if (ua.includes('Mobile') && (screen.width > 1000 || screen.height > 1000)) {
            results.inconsistencies.push('Mobile UA with desktop screen size');
        }
        
        results.spoofingDetected = results.inconsistencies.length > 0;
        
        return results;
    },

    /**
     * Detect likely browser from user agent
     * @returns {string} Detected browser name
     */
    detectLikelyBrowser: function() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Firefox') && !ua.includes('Seamonkey')) {
            return 'Firefox';
        } else if (ua.includes('Seamonkey')) {
            return 'Seamonkey';
        } else if (ua.includes('Chrome') && !ua.includes('Chromium')) {
            return 'Chrome';
        } else if (ua.includes('Chromium')) {
            return 'Chromium';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            return 'Safari';
        } else if (ua.includes('Opera') || ua.includes('OPR')) {
            return 'Opera';
        } else if (ua.includes('Edge')) {
            return 'Edge';
        }
        
        return 'Unknown';
    },

    /**
     * Format fingerprint data for display
     * @param {Object} fingerprint - Fingerprint data
     * @returns {string} Formatted fingerprint string
     */
    formatFingerprint: function(fingerprint) {
        let output = '=== Browser Fingerprint ===\n\n';
        
        output += `🌐 Browser: ${this.detectLikelyBrowser()}\n`;
        output += `💻 Platform: ${fingerprint.platform}\n`;
        output += `🗣️ Language: ${fingerprint.language}\n`;
        output += `📐 Screen: ${fingerprint.screenWidth}x${fingerprint.screenHeight}\n`;
        output += `🎨 Color Depth: ${fingerprint.colorDepth} bits\n`;
        output += `⚡ CPU Cores: ${fingerprint.hardwareConcurrency}\n`;
        output += `💾 Memory: ${fingerprint.deviceMemory || 'Unknown'} GB\n`;
        output += `🌍 Timezone: ${fingerprint.timezone}\n`;
        
        if (fingerprint.webglInfo && fingerprint.webglInfo.supported) {
            output += `🎮 GPU: ${fingerprint.webglInfo.unmaskedRenderer || 'Unknown'}\n`;
        }
        
        output += `🔤 Fonts Detected: ${fingerprint.fonts ? fingerprint.fonts.length : 0}\n`;
        
        const entropy = this.calculateEntropy(fingerprint);
        output += `🔐 Estimated Entropy: ${entropy} bits\n`;
        
        const uniqueness = Math.pow(2, entropy);
        output += `🎯 Estimated Uniqueness: 1 in ${uniqueness.toLocaleString()}\n`;
        
        return output;
    },

    /**
     * Test if spoofing is working
     * @param {Object} expectedConfig - Expected spoofed values
     * @returns {Object} Test results
     */
    testSpoofing: async function(expectedConfig) {
        const current = await this.detectFingerprint();
        const results = {
            passed: 0,
            failed: 0,
            tests: []
        };
        
        // Test user agent
        this.addTest(results, 'User Agent', expectedConfig.userAgent, current.userAgent);
        
        // Test platform
        this.addTest(results, 'Platform', expectedConfig.platform, current.platform);
        
        // Test screen dimensions
        this.addTest(results, 'Screen Width', expectedConfig.screenWidth, current.screenWidth);
        this.addTest(results, 'Screen Height', expectedConfig.screenHeight, current.screenHeight);
        
        // Test language
        this.addTest(results, 'Language', expectedConfig.language, current.language);
        
        // Test hardware concurrency
        this.addTest(results, 'CPU Cores', expectedConfig.hardwareConcurrency, current.hardwareConcurrency);
        
        // Test timezone
        this.addTest(results, 'Timezone', expectedConfig.timezone, current.timezone);
        
        return results;
    },

    /**
     * Helper function to add test result
     * @private
     */
    addTest: function(results, name, expected, actual) {
        const passed = expected === actual;
        results.tests.push({
            name,
            expected,
            actual,
            passed
        });
        
        if (passed) {
            results.passed++;
        } else {
            results.failed++;
        }
    },

    /**
     * Log fingerprint comparison
     * @param {Object} before - Fingerprint before spoofing
     * @param {Object} after - Fingerprint after spoofing
     */
    logComparison: function(before, after) {
        console.log('🛡️ Fingerprint Comparison');
        console.log('========================');
        
        const fields = [
            'userAgent', 'platform', 'language', 'screenWidth', 
            'screenHeight', 'hardwareConcurrency', 'timezone'
        ];
        
        fields.forEach(field => {
            const beforeVal = before[field];
            const afterVal = after[field];
            const changed = beforeVal !== afterVal ? '✅' : '❌';
            
            console.log(`${changed} ${field}:`);
            console.log(`  Before: ${beforeVal}`);
            console.log(`  After:  ${afterVal}`);
        });
    }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserUtils;
} else if (typeof window !== 'undefined') {
    window.BrowserUtils = BrowserUtils;
}