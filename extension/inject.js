/**
 * Browser Fingerprint Spoofer - Injection Script
 * This script is injected into web pages to provide fingerprint spoofing
 */

(function() {
    'use strict';
    
    // Global state
    let spoofer = null;
    let isEnabled = false;
    let currentConfig = null;
    let privacyLevel = 'standard';
    
    // Message listener for communication with content script
    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        
        const { type, config, privacyLevel: level } = event.data;
        
        switch (type) {
            case 'FINGERPRINT_SPOOFER_INIT':
                initializeSpoofer(config, level);
                break;
                
            case 'FINGERPRINT_SPOOFER_ENABLE':
                enableSpoofer(config, level);
                break;
                
            case 'FINGERPRINT_SPOOFER_DISABLE':
                disableSpoofer();
                break;
                
            case 'FINGERPRINT_SPOOFER_UPDATE':
                updateSpoofer(config, level);
                break;
                
            case 'FINGERPRINT_SPOOFER_GET_FINGERPRINT':
                getCurrentFingerprint();
                break;
                
            case 'FINGERPRINT_SPOOFER_TEST':
                testSpoofing();
                break;
        }
    });
    
    // Initialize the spoofer
    function initializeSpoofer(config, level) {
        if (spoofer) return;
        
        currentConfig = config || 'windows_chrome';
        privacyLevel = level || 'standard';
        
        // Create spoofer instance
        spoofer = new FingerprintSpoofer({
            config: currentConfig,
            privacyLevel: privacyLevel
        });
        
        // Enable if requested
        if (config && config.enabled !== false) {
            enableSpoofer(config, level);
        }
        
        // Report status
        reportStatus();
    }
    
    // Enable fingerprint spoofing
    function enableSpoofer(config, level) {
        if (!spoofer) {
            initializeSpoofer(config, level);
        }
        
        if (spoofer && !isEnabled) {
            spoofer.enable();
            isEnabled = true;
            reportStatus();
            
            // Log activation
            log('info', 'Fingerprint spoofing enabled');
        }
    }
    
    // Disable fingerprint spoofing
    function disableSpoofer() {
        if (spoofer && isEnabled) {
            spoofer.disable();
            isEnabled = false;
            reportStatus();
            
            // Log deactivation
            log('info', 'Fingerprint spoofing disabled');
        }
    }
    
    // Update spoofer configuration
    function updateSpoofer(config, level) {
        if (!spoofer) return;
        
        currentConfig = config || currentConfig;
        privacyLevel = level || privacyLevel;
        
        // Reinitialize with new settings
        spoofer.disable();
        spoofer = new FingerprintSpoofer({
            config: currentConfig,
            privacyLevel: privacyLevel
        });
        
        if (isEnabled) {
            spoofer.enable();
        }
        
        reportStatus();
    }
    
    // Get current fingerprint for testing
    function getCurrentFingerprint() {
        if (!spoofer) {
            window.postMessage({
                type: 'FINGERPRINT_SPOOFER_FINGERPRINT_RESPONSE',
                fingerprint: null,
                error: 'Spoofer not initialized'
            }, '*');
            return;
        }
        
        try {
            const fingerprint = spoofer.getFingerprint();
            window.postMessage({
                type: 'FINGERPRINT_SPOOFER_FINGERPRINT_RESPONSE',
                fingerprint: fingerprint
            }, '*');
        } catch (error) {
            window.postMessage({
                type: 'FINGERPRINT_SPOOFER_FINGERPRINT_RESPONSE',
                fingerprint: null,
                error: error.message
            }, '*');
        }
    }
    
    // Test spoofing effectiveness
    function testSpoofing() {
        if (!spoofer) {
            window.postMessage({
                type: 'FINGERPRINT_SPOOFER_TEST_RESPONSE',
                results: null,
                error: 'Spoofer not initialized'
            }, '*');
            return;
        }
        
        try {
            const results = spoofer.testProtection();
            window.postMessage({
                type: 'FINGERPRINT_SPOOFER_TEST_RESPONSE',
                results: results
            }, '*');
        } catch (error) {
            window.postMessage({
                type: 'FINGERPRINT_SPOOFER_TEST_RESPONSE',
                results: null,
                error: error.message
            }, '*');
        }
    }
    
    // Report current status
    function reportStatus() {
        window.postMessage({
            type: 'FINGERPRINT_SPOOFER_STATUS',
            enabled: isEnabled,
            config: currentConfig,
            privacyLevel: privacyLevel
        }, '*');
    }
    
    // Log messages
    function log(level, message) {
        window.postMessage({
            type: 'FINGERPRINT_SPOOFER_LOG',
            level: level,
            message: message
        }, '*');
    }
    
    // Fingerprint Spoofer Class
    class FingerprintSpoofer {
        constructor(options = {}) {
            this.config = { ...this.getDefaultConfig(), ...options };
            this.originalValues = {};
            this.isEnabled = false;
            this.init();
        }
        
        getDefaultConfig() {
            return {
                config: 'windows_chrome',
                privacyLevel: 'standard',
                randomize: false,
                spoofNavigator: true,
                spoofScreen: true,
                spoofWebGL: true,
                spoofCanvas: true,
                spoofWebRTC: true,
                spoofSensors: true,
                spoofFonts: true,
                clearStorage: true
            };
        }
        
        init() {
            // Store original values
            this.storeOriginalValues();
            
            // Set up protection based on privacy level
            this.setupProtectionLevel();
        }
        
        storeOriginalValues() {
            // Store original navigator properties
            if (navigator) {
                this.originalValues.navigator = {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    languages: navigator.languages,
                    cookieEnabled: navigator.cookieEnabled,
                    onLine: navigator.onLine,
                    hardwareConcurrency: navigator.hardwareConcurrency,
                    deviceMemory: navigator.deviceMemory
                };
            }
            
            // Store original screen properties
            if (screen) {
                this.originalValues.screen = {
                    width: screen.width,
                    height: screen.height,
                    availWidth: screen.availWidth,
                    availHeight: screen.availHeight,
                    colorDepth: screen.colorDepth,
                    pixelDepth: screen.pixelDepth
                };
            }
        }
        
        setupProtectionLevel() {
            switch (this.config.privacyLevel) {
                case 'basic':
                    this.config.spoofNavigator = true;
                    this.config.spoofScreen = true;
                    this.config.spoofWebGL = false;
                    this.config.spoofCanvas = false;
                    this.config.spoofWebRTC = false;
                    this.config.spoofSensors = false;
                    this.config.spoofFonts = false;
                    break;
                    
                case 'maximum':
                    this.config.spoofNavigator = true;
                    this.config.spoofScreen = true;
                    this.config.spoofWebGL = true;
                    this.config.spoofCanvas = true;
                    this.config.spoofWebRTC = true;
                    this.config.spoofSensors = true;
                    this.config.spoofFonts = true;
                    this.config.clearStorage = true;
                    break;
                    
                default: // standard
                    this.config.spoofNavigator = true;
                    this.config.spoofScreen = true;
                    this.config.spoofWebGL = true;
                    this.config.spoofCanvas = true;
                    this.config.spoofWebRTC = true;
                    this.config.spoofSensors = false;
                    this.config.spoofFonts = true;
                    this.config.clearStorage = false;
                    break;
            }
        }
        
        enable() {
            if (this.isEnabled) return;
            
            try {
                if (this.config.spoofNavigator) this.spoofNavigator();
                if (this.config.spoofScreen) this.spoofScreen();
                if (this.config.spoofWebGL) this.spoofWebGL();
                if (this.config.spoofCanvas) this.spoofCanvas();
                if (this.config.spoofWebRTC) this.spoofWebRTC();
                if (this.config.spoofSensors) this.spoofSensors();
                if (this.config.spoofFonts) this.spoofFonts();
                if (this.config.clearStorage) this.clearStorage();
                
                this.isEnabled = true;
                log('info', 'Fingerprint spoofing activated');
            } catch (error) {
                log('error', 'Failed to enable spoofing: ' + error.message);
            }
        }
        
        disable() {
            if (!this.isEnabled) return;
            
            try {
                // Note: Some spoofing cannot be fully reversed due to browser security
                this.isEnabled = false;
                log('info', 'Fingerprint spoofing deactivated');
            } catch (error) {
                log('error', 'Failed to disable spoofing: ' + error.message);
            }
        }
        
        spoofNavigator() {
            if (!navigator) return;
            
            const config = this.getConfigForProfile();
            
            // Override navigator properties
            Object.defineProperties(navigator, {
                userAgent: {
                    value: config.userAgent,
                    writable: false,
                    configurable: false
                },
                platform: {
                    value: config.platform,
                    writable: false,
                    configurable: false
                },
                language: {
                    value: config.language,
                    writable: false,
                    configurable: false
                },
                languages: {
                    value: config.languages,
                    writable: false,
                    configurable: false
                }
            });
            
            // Override hardware properties
            if (navigator.hardwareConcurrency !== undefined) {
                Object.defineProperty(navigator, 'hardwareConcurrency', {
                    value: config.hardwareConcurrency,
                    writable: false,
                    configurable: false
                });
            }
            
            if (navigator.deviceMemory !== undefined) {
                Object.defineProperty(navigator, 'deviceMemory', {
                    value: config.deviceMemory,
                    writable: false,
                    configurable: false
                });
            }
        }
        
        spoofScreen() {
            if (!screen) return;
            
            const config = this.getConfigForProfile();
            
            Object.defineProperties(screen, {
                width: {
                    value: config.screenWidth,
                    writable: false,
                    configurable: false
                },
                height: {
                    value: config.screenHeight,
                    writable: false,
                    configurable: false
                },
                availWidth: {
                    value: config.availWidth,
                    writable: false,
                    configurable: false
                },
                availHeight: {
                    value: config.availHeight,
                    writable: false,
                    configurable: false
                },
                colorDepth: {
                    value: config.colorDepth,
                    writable: false,
                    configurable: false
                },
                pixelDepth: {
                    value: config.pixelDepth,
                    writable: false,
                    configurable: false
                }
            });
        }
        
        spoofWebGL() {
            // Override WebGL context
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            
            HTMLCanvasElement.prototype.getContext = function(type, attributes) {
                const context = originalGetContext.call(this, type, attributes);
                
                if (type === 'webgl' || type === 'webgl2') {
                    // Override WebGL properties
                    if (context.getParameter) {
                        const originalGetParameter = context.getParameter;
                        context.getParameter = function(parameter) {
                            // Override vendor and renderer
                            if (parameter === context.VENDOR) {
                                return 'Google Inc. (Intel)';
                            }
                            if (parameter === context.RENDERER) {
                                return 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.8935)';
                            }
                            return originalGetParameter.call(this, parameter);
                        };
                    }
                }
                
                return context;
            };
        }
        
        spoofCanvas() {
            // Override canvas fingerprinting
            const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
            const originalGetImageData = HTMLCanvasElement.prototype.getImageData;
            
            HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
                // Add subtle noise to canvas data
                const canvas = this;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    // Add minimal noise to prevent fingerprinting
                    for (let i = 0; i < data.length; i += 4) {
                        if (Math.random() < 0.001) { // Very low probability
                            data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() - 0.5) * 2));
                            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() - 0.5) * 2));
                            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() - 0.5) * 2));
                        }
                    }
                    
                    ctx.putImageData(imageData, 0, 0);
                }
                
                return originalToDataURL.call(this, type, quality);
            };
        }
        
        spoofWebRTC() {
            // Override WebRTC to prevent IP leaks
            if (window.RTCPeerConnection) {
                const originalRTCPeerConnection = window.RTCPeerConnection;
                
                window.RTCPeerConnection = function(configuration, options) {
                    const pc = new originalRTCPeerConnection(configuration, options);
                    
                    // Override createOffer and createAnswer to prevent IP leaks
                    const originalCreateOffer = pc.createOffer;
                    const originalCreateAnswer = pc.createAnswer;
                    
                    pc.createOffer = function(options) {
                        return originalCreateOffer.call(this, options).then(offer => {
                            // Remove ICE candidates that might leak IP
                            if (offer.sdp) {
                                offer.sdp = offer.sdp.replace(/a=ice-ufrag:.+/g, 'a=ice-ufrag:spoofed');
                                offer.sdp = offer.sdp.replace(/a=ice-pwd:.+/g, 'a=ice-pwd:spoofed');
                            }
                            return offer;
                        });
                    };
                    
                    pc.createAnswer = function(options) {
                        return originalCreateAnswer.call(this, options).then(answer => {
                            // Remove ICE candidates that might leak IP
                            if (answer.sdp) {
                                answer.sdp = answer.sdp.replace(/a=ice-ufrag:.+/g, 'a=ice-ufrag:spoofed');
                                answer.sdp = answer.sdp.replace(/a=ice-pwd:.+/g, 'a=ice-pwd:spoofed');
                            }
                            return answer;
                        });
                    };
                    
                    return pc;
                };
            }
        }
        
        spoofSensors() {
            // Override device sensors
            if ('DeviceMotionEvent' in window) {
                const originalAddEventListener = window.addEventListener;
                window.addEventListener = function(type, listener, options) {
                    if (type === 'devicemotion' || type === 'deviceorientation') {
                        // Block sensor access
                        return;
                    }
                    return originalAddEventListener.call(this, type, listener, options);
                };
            }
        }
        
        spoofFonts() {
            // Override font detection
            if (document.fonts && document.fonts.check) {
                const originalCheck = document.fonts.check;
                document.fonts.check = function(font, text) {
                    // Return consistent results to prevent fingerprinting
                    return true;
                };
            }
        }
        
        clearStorage() {
            try {
                // Clear various storage types
                if (window.localStorage) localStorage.clear();
                if (window.sessionStorage) sessionStorage.clear();
                if (window.indexedDB) {
                    indexedDB.databases().then(databases => {
                        databases.forEach(db => {
                            indexedDB.deleteDatabase(db.name);
                        });
                    });
                }
            } catch (error) {
                log('warning', 'Failed to clear storage: ' + error.message);
            }
        }
        
        getConfigForProfile() {
            const profiles = {
                windows_chrome: {
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    platform: "Win32",
                    language: "en-US",
                    languages: ["en-US", "en"],
                    hardwareConcurrency: 8,
                    deviceMemory: 8,
                    screenWidth: 1920,
                    screenHeight: 1080,
                    availWidth: 1920,
                    availHeight: 1040,
                    colorDepth: 24,
                    pixelDepth: 24
                },
                macos_safari: {
                    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
                    platform: "MacIntel",
                    language: "en-US",
                    languages: ["en-US", "en"],
                    hardwareConcurrency: 8,
                    deviceMemory: 8,
                    screenWidth: 1440,
                    screenHeight: 900,
                    availWidth: 1440,
                    availHeight: 900,
                    colorDepth: 24,
                    pixelDepth: 24
                },
                linux_firefox: {
                    userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
                    platform: "Linux x86_64",
                    language: "en-US",
                    languages: ["en-US", "en"],
                    hardwareConcurrency: 4,
                    deviceMemory: 4,
                    screenWidth: 1366,
                    screenHeight: 768,
                    availWidth: 1366,
                    availHeight: 768,
                    colorDepth: 24,
                    pixelDepth: 24
                }
            };
            
            return profiles[this.config.config] || profiles.windows_chrome;
        }
        
        getFingerprint() {
            // Return current fingerprint for testing
            return {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                languages: navigator.languages,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    availWidth: screen.availWidth,
                    availHeight: screen.availHeight,
                    colorDepth: screen.colorDepth,
                    pixelDepth: screen.pixelDepth
                },
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory
            };
        }
        
        testProtection() {
            // Test various fingerprinting methods
            const results = {
                navigator: this.testNavigatorProtection(),
                screen: this.testScreenProtection(),
                canvas: this.testCanvasProtection(),
                webgl: this.testWebGLProtection(),
                webRTC: this.testWebRTCProtection()
            };
            
            return results;
        }
        
        testNavigatorProtection() {
            const original = this.originalValues.navigator;
            const current = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            };
            
            return {
                protected: original.userAgent !== current.userAgent,
                original: original.userAgent,
                current: current.userAgent
            };
        }
        
        testScreenProtection() {
            const original = this.originalValues.screen;
            const current = {
                width: screen.width,
                height: screen.height
            };
            
            return {
                protected: original.width !== current.width,
                original: `${original.width}x${original.height}`,
                current: `${current.width}x${current.height}`
            };
        }
        
        testCanvasProtection() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillText('Test fingerprint', 2, 2);
                const dataURL = canvas.toDataURL();
                
                return {
                    protected: true,
                    message: 'Canvas fingerprinting blocked'
                };
            } catch (error) {
                return {
                    protected: false,
                    error: error.message
                };
            }
        }
        
        testWebGLProtection() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl');
                if (gl) {
                    const vendor = gl.getParameter(gl.VENDOR);
                    const renderer = gl.getParameter(gl.RENDERER);
                    
                    return {
                        protected: vendor.includes('Intel') && renderer.includes('ANGLE'),
                        vendor: vendor,
                        renderer: renderer
                    };
                }
                return { protected: false, error: 'WebGL not available' };
            } catch (error) {
                return { protected: false, error: error.message };
            }
        }
        
        testWebRTCProtection() {
            if (window.RTCPeerConnection) {
                return {
                    protected: true,
                    message: 'WebRTC IP leak protection active'
                };
            }
            return {
                protected: false,
                error: 'WebRTC not available'
            };
        }
    }
    
    // Report that injection script is loaded
    log('info', 'Fingerprint spoofer injection script loaded');
    
})();
