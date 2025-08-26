/**
 * Browser Fingerprint Spoofer - Background Script
 * Handles extension lifecycle, settings, and coordination
 */

// Extension state
let extensionEnabled = false;
let currentConfig = 'windows_chrome';
let privacyLevel = 'standard';

// Initialize extension
chrome.runtime.onStartup.addListener(async () => {
    await loadSettings();
    updateIcon();
});

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        // Set default settings on first install
        await chrome.storage.sync.set({
            enabled: false,
            config: 'windows_chrome',
            privacyLevel: 'standard',
            showNotifications: true,
            autoUpdate: true,
            customConfigs: {}
        });
        
        // Open welcome page
        chrome.tabs.create({
            url: chrome.runtime.getURL('welcome.html')
        });
    }
    
    await loadSettings();
    updateIcon();
});

// Load settings from storage
async function loadSettings() {
    try {
        const result = await chrome.storage.sync.get({
            enabled: false,
            config: 'windows_chrome',
            privacyLevel: 'standard'
        });
        
        extensionEnabled = result.enabled;
        currentConfig = result.config;
        privacyLevel = result.privacyLevel;
        
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

// Update extension icon based on state
function updateIcon() {
    const iconPath = extensionEnabled ? {
        "16": "icons/icon-active-16.png",
        "32": "icons/icon-active-32.png",
        "48": "icons/icon-active-48.png",
        "128": "icons/icon-active-128.png"
    } : {
        "16": "icons/icon-16.png",
        "32": "icons/icon-32.png", 
        "48": "icons/icon-48.png",
        "128": "icons/icon-128.png"
    };
    
    chrome.action.setIcon({ path: iconPath });
    
    const badgeText = extensionEnabled ? 'ON' : '';
    const badgeColor = extensionEnabled ? '#4CAF50' : '#F44336';
    
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    
    const title = extensionEnabled ? 
        'Browser Fingerprint Spoofer - Active' : 
        'Browser Fingerprint Spoofer - Disabled';
    chrome.action.setTitle({ title });
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'updateBadge':
            extensionEnabled = request.enabled;
            updateIcon();
            sendResponse({ success: true });
            break;
            
        case 'log':
            // Handle logging from content scripts
            console.log(`[${request.level}] ${request.message}`);
            break;
            
        case 'exportSettings':
            exportSettings(sendResponse);
            return true; // Keep channel open for async response
            
        case 'importSettings':
            importSettings(request.settings, sendResponse);
            return true;
            
        case 'resetSettings':
            resetSettings();
            sendResponse({ success: true });
            break;
            
        case 'getStats':
            getUsageStats(sendResponse);
            return true;
            
        case 'getSettings':
            sendResponse({
                enabled: extensionEnabled,
                config: currentConfig,
                privacyLevel: privacyLevel
            });
            break;
            
        case 'updateSettings':
            updateSettings(request.settings);
            sendResponse({ success: true });
            break;
            
        case 'toggleEnabled':
            toggleEnabled();
            sendResponse({ enabled: extensionEnabled });
            break;
            
        default:
            sendResponse({ error: 'Unknown action' });
    }
});

// Toggle extension enabled state
async function toggleEnabled() {
    extensionEnabled = !extensionEnabled;
    
    await chrome.storage.sync.set({ enabled: extensionEnabled });
    
    // Notify all tabs
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        try {
            await chrome.tabs.sendMessage(tab.id, {
                action: extensionEnabled ? 'enable' : 'disable',
                config: currentConfig,
                privacyLevel: privacyLevel
            });
        } catch (error) {
            // Ignore errors for tabs that can't receive messages
        }
    }
    
    updateIcon();
    
    // Show notification
    if (extensionEnabled) {
        showNotification('Fingerprint spoofing enabled', 'Your browser fingerprint is now being protected.');
    } else {
        showNotification('Fingerprint spoofing disabled', 'Your browser fingerprint is no longer being spoofed.');
    }
}

// Update settings
async function updateSettings(newSettings) {
    const oldEnabled = extensionEnabled;
    
    extensionEnabled = newSettings.enabled !== undefined ? newSettings.enabled : extensionEnabled;
    currentConfig = newSettings.config || currentConfig;
    privacyLevel = newSettings.privacyLevel || privacyLevel;
    
    // Save to storage
    await chrome.storage.sync.set({
        enabled: extensionEnabled,
        config: currentConfig,
        privacyLevel: privacyLevel,
        ...newSettings
    });
    
    // If enabled state changed, notify tabs
    if (oldEnabled !== extensionEnabled) {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    action: extensionEnabled ? 'enable' : 'disable',
                    config: currentConfig,
                    privacyLevel: privacyLevel
                });
            } catch (error) {
                // Ignore errors
            }
        }
    } else if (extensionEnabled) {
        // Update configuration on active tabs
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'updateConfig',
                    config: currentConfig,
                    privacyLevel: privacyLevel
                });
            } catch (error) {
                // Ignore errors
            }
        }
    }
    
    updateIcon();
}

// Show notification
function showNotification(title, message) {
    chrome.storage.sync.get({ showNotifications: true }, (result) => {
        if (result.showNotifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon-48.png',
                title: title,
                message: message
            });
        }
    });
}

// Export settings
async function exportSettings(sendResponse) {
    try {
        const settings = await chrome.storage.sync.get();
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            settings: settings
        };
        
        sendResponse({ 
            success: true, 
            data: JSON.stringify(exportData, null, 2) 
        });
    } catch (error) {
        sendResponse({ 
            success: false, 
            error: error.message 
        });
    }
}

// Import settings
async function importSettings(settingsData, sendResponse) {
    try {
        const importData = JSON.parse(settingsData);
        
        if (!importData.settings) {
            throw new Error('Invalid settings format');
        }
        
        await chrome.storage.sync.clear();
        await chrome.storage.sync.set(importData.settings);
        
        await loadSettings();
        updateIcon();
        
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ 
            success: false, 
            error: error.message 
        });
    }
}

// Reset settings to defaults
async function resetSettings() {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
        enabled: false,
        config: 'windows_chrome',
        privacyLevel: 'standard',
        showNotifications: true,
        autoUpdate: true,
        customConfigs: {}
    });
    
    await loadSettings();
    updateIcon();
}

// Get usage statistics
async function getUsageStats(sendResponse) {
    try {
        const stats = await chrome.storage.local.get({
            totalSpoofedSites: 0,
            lastEnabled: null,
            fingerprintsSpoofed: 0,
            sessionsProtected: 0
        });
        
        sendResponse({ success: true, stats });
    } catch (error) {
        sendResponse({ 
            success: false, 
            error: error.message 
        });
    }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && extensionEnabled) {
        // Update stats
        try {
            const stats = await chrome.storage.local.get({
                totalSpoofedSites: 0
            });
            
            await chrome.storage.local.set({
                totalSpoofedSites: stats.totalSpoofedSites + 1
            });
        } catch (error) {
            console.error('Failed to update stats:', error);
        }
    }
});

// Handle extension button click
chrome.action.onClicked.addListener(async (tab) => {
    // Quick toggle - enable/disable spoofing
    await toggleEnabled();
});

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'fingerprint-spoofer-toggle',
        title: 'Toggle Fingerprint Spoofing',
        contexts: ['action']
    });
    
    chrome.contextMenus.create({
        id: 'fingerprint-spoofer-options',
        title: 'Open Options',
        contexts: ['action']
    });
    
    chrome.contextMenus.create({
        id: 'fingerprint-spoofer-test',
        title: 'Test Fingerprint Protection',
        contexts: ['action']
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case 'fingerprint-spoofer-toggle':
            await toggleEnabled();
            break;
            
        case 'fingerprint-spoofer-options':
            chrome.runtime.openOptionsPage();
            break;
            
        case 'fingerprint-spoofer-test':
            chrome.tabs.create({
                url: 'https://browserleaks.com/canvas'
            });
            break;
    }
});

// Handle web request modifications (User-Agent spoofing)
chrome.webRequest.onBeforeSendHeaders.addListener(
    async (details) => {
        if (!extensionEnabled) return;
        
        const settings = await chrome.storage.sync.get({
            config: 'windows_chrome',
            spoofHeaders: true
        });
        
        if (!settings.spoofHeaders) return;
        
        // Load configuration
        const configs = {
            windows_chrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            macos_safari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
            linux_firefox: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0"
        };
        
        const spoofedUA = configs[settings.config];
        
        if (spoofedUA) {
            // Find and replace User-Agent header
            const headers = details.requestHeaders;
            for (let i = 0; i < headers.length; i++) {
                if (headers[i].name.toLowerCase() === 'user-agent') {
                    headers[i].value = spoofedUA;
                    break;
                }
            }
            
            return { requestHeaders: headers };
        }
    },
    { urls: ["*://*/*"] },
    ["requestHeaders"]
);

// Alarm handling for periodic tasks
chrome.alarms.onAlarm.addListener((alarm) => {
    switch (alarm.name) {
        case 'updateStats':
            updateDailyStats();
            break;
            
        case 'configUpdate':
            checkForConfigUpdates();
            break;
    }
});

// Set up periodic alarms
chrome.alarms.create('updateStats', { periodInMinutes: 60 });
chrome.alarms.create('configUpdate', { periodInMinutes: 1440 }); // Daily

async function updateDailyStats() {
    try {
        const today = new Date().toDateString();
        const stats = await chrome.storage.local.get({
            dailyStats: {},
            lastStatsUpdate: null
        });
        
        if (!stats.dailyStats[today]) {
            stats.dailyStats[today] = {
                sitesVisited: 0,
                fingerprintsSpoofed: 0,
                protectionActive: extensionEnabled
            };
        }
        
        await chrome.storage.local.set({
            dailyStats: stats.dailyStats,
            lastStatsUpdate: new Date().toISOString()
        });
    } catch (error) {
        console.error('Failed to update daily stats:', error);
    }
}

async function checkForConfigUpdates() {
    try {
        const settings = await chrome.storage.sync.get({
            autoUpdate: true,
            lastConfigUpdate: null
        });
        
        if (!settings.autoUpdate) return;
        
        // Check for configuration updates from repository
        // This would typically fetch from a remote endpoint
        console.log('Checking for configuration updates...');
        
        // Update timestamp
        await chrome.storage.sync.set({
            lastConfigUpdate: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Failed to check for updates:', error);
    }
}

// Initialize extension
loadSettings().then(() => {
    updateIcon();
    console.log('🛡️ Browser Fingerprint Spoofer: Background script initialized');
});
