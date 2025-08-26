/**
 * Browser Fingerprint Spoofer - Configuration Module
 * Predefined configurations for different spoofing scenarios
 */

const SpoofConfigs = {
    // Windows 10 Chrome configuration
    windows_chrome: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        platform: "Win32",
        language: "en-US",
        languages: ["en-US", "en"],
        screenWidth: 1920,
        screenHeight: 1080,
        availWidth: 1920,
        availHeight: 1040,
        colorDepth: 24,
        pixelDepth: 24,
        hardwareConcurrency: 8,
        deviceMemory: 8,
        webglVendor: "Google Inc. (NVIDIA)",
        webglRenderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11-31.0.15.1659)",
        timezone: "America/New_York",
        timezoneOffset: -300
    },

    // macOS Safari configuration
    macos_safari: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
        platform: "MacIntel",
        language: "en-US",
        languages: ["en-US", "en"],
        screenWidth: 2560,
        screenHeight: 1600,
        availWidth: 2560,
        availHeight: 1555,
        colorDepth: 30,
        pixelDepth: 30,
        hardwareConcurrency: 10,
        deviceMemory: 8,
        webglVendor: "Apple Inc.",
        webglRenderer: "Apple GPU",
        timezone: "America/Los_Angeles",
        timezoneOffset: -480
    },

    // Linux Firefox configuration
    linux_firefox: {
        userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
        platform: "Linux x86_64",
        language: "en-US",
        languages: ["en-US", "en"],
        screenWidth: 1920,
        screenHeight: 1080,
        availWidth: 1920,
        availHeight: 1050,
        colorDepth: 24,
        pixelDepth: 24,
        hardwareConcurrency: 12,
        deviceMemory: 16,
        webglVendor: "Mesa/X.org",
        webglRenderer: "Mesa DRI Intel(R) UHD Graphics 620 (KBL GT2)",
        timezone: "Europe/London",
        timezoneOffset: 0
    },

    // Mobile Android Chrome configuration
    android_chrome: {
        userAgent: "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        platform: "Linux armv8l",
        language: "en-US",
        languages: ["en-US", "en"],
        screenWidth: 412,
        screenHeight: 915,
        availWidth: 412,
        availHeight: 915,
        colorDepth: 24,
        pixelDepth: 24,
        hardwareConcurrency: 8,
        deviceMemory: 6,
        webglVendor: "Qualcomm",
        webglRenderer: "Adreno (TM) 660",
        timezone: "America/New_York",
        timezoneOffset: -300
    },

    // iOS Safari configuration
    ios_safari: {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
        platform: "iPhone",
        language: "en-US",
        languages: ["en-US", "en"],
        screenWidth: 393,
        screenHeight: 852,
        availWidth: 393,
        availHeight: 852,
        colorDepth: 32,
        pixelDepth: 32,
        hardwareConcurrency: 6,
        deviceMemory: 4,
        webglVendor: "Apple Inc.",
        webglRenderer: "Apple GPU",
        timezone: "America/New_York",
        timezoneOffset: -300
    },

    // Generic/Random configuration
    generic: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        platform: "Win32",
        language: "en-US",
        languages: ["en-US"],
        screenWidth: 1366,
        screenHeight: 768,
        availWidth: 1366,
        availHeight: 728,
        colorDepth: 24,
        pixelDepth: 24,
        hardwareConcurrency: 4,
        deviceMemory: 4,
        webglVendor: "Google Inc.",
        webglRenderer: "ANGLE (Intel)",
        timezone: "UTC",
        timezoneOffset: 0
    }
};

/**
 * Privacy levels configuration
 */
const PrivacyLevels = {
    // Basic protection - minimal spoofing
    basic: {
        spoofNavigator: true,
        spoofScreen: false,
        spoofWebGL: true,
        spoofCanvas: false,
        spoofWebRTC: true,
        spoofSensors: false,
        spoofFonts: false,
        clearStorage: false,
        randomizeValues: false
    },

    // Standard protection - balanced approach
    standard: {
        spoofNavigator: true,
        spoofScreen: true,
        spoofWebGL: true,
        spoofCanvas: true,
        spoofWebRTC: true,
        spoofSensors: true,
        spoofFonts: false,
        clearStorage: false,
        randomizeValues: false
    },

    // Strict protection - maximum privacy
    strict: {
        spoofNavigator: true,
        spoofScreen: true,
        spoofWebGL: true,
        spoofCanvas: true,
        spoofWebRTC: true,
        spoofSensors: true,
        spoofFonts: true,
        clearStorage: true,
        randomizeValues: true
    }
};

/**
 * Common User Agents for randomization
 */
const CommonUserAgents = [
    // Chrome Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    
    // Chrome macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    
    // Firefox Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
    
    // Safari macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
    
    // Edge Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
];

/**
 * Common screen resolutions
 */
const CommonScreenSizes = [
    { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040 },
    { width: 1366, height: 768, availWidth: 1366, availHeight: 728 },
    { width: 1536, height: 864, availWidth: 1536, availHeight: 824 },
    { width: 1440, height: 900, availWidth: 1440, availHeight: 860 },
    { width: 1280, height: 720, availWidth: 1280, availHeight: 680 }
];

/**
 * Timezone mappings
 */
const CommonTimezones = {
    "UTC": 0,
    "America/New_York": -300,  // EST
    "America/Chicago": -360,   // CST
    "America/Denver": -420,    // MST
    "America/Los_Angeles": -480, // PST
    "Europe/London": 0,        // GMT
    "Europe/Berlin": 60,       // CET
    "Asia/Tokyo": 540,         // JST
    "Asia/Shanghai": 480,      // CST
    "Australia/Sydney": 660    // AEDT
};

/**
 * Helper function to get random configuration
 */
function getRandomConfig() {
    const userAgent = CommonUserAgents[Math.floor(Math.random() * CommonUserAgents.length)];
    const screenSize = CommonScreenSizes[Math.floor(Math.random() * CommonScreenSizes.length)];
    const timezones = Object.keys(CommonTimezones);
    const timezone = timezones[Math.floor(Math.random() * timezones.length)];
    
    return {
        userAgent,
        platform: userAgent.includes('Windows') ? 'Win32' : 
                 userAgent.includes('Macintosh') ? 'MacIntel' : 'Linux x86_64',
        language: "en-US",
        languages: ["en-US", "en"],
        screenWidth: screenSize.width,
        screenHeight: screenSize.height,
        availWidth: screenSize.availWidth,
        availHeight: screenSize.availHeight,
        colorDepth: 24,
        pixelDepth: 24,
        hardwareConcurrency: Math.floor(Math.random() * 8) + 2,
        deviceMemory: [4, 8, 16][Math.floor(Math.random() * 3)],
        webglVendor: "Google Inc.",
        webglRenderer: "ANGLE (Intel)",
        timezone,
        timezoneOffset: CommonTimezones[timezone]
    };
}

/**
 * Helper function to merge configuration with privacy level
 */
function createConfig(baseConfig, privacyLevel = 'standard') {
    const privacy = PrivacyLevels[privacyLevel] || PrivacyLevels.standard;
    return { ...baseConfig, ...privacy };
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SpoofConfigs,
        PrivacyLevels,
        CommonUserAgents,
        CommonScreenSizes,
        CommonTimezones,
        getRandomConfig,
        createConfig
    };
} else if (typeof window !== 'undefined') {
    window.SpoofConfigs = SpoofConfigs;
    window.PrivacyLevels = PrivacyLevels;
    window.getRandomConfig = getRandomConfig;
    window.createConfig = createConfig;
}