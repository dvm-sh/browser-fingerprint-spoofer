/**
 * Browser Fingerprint Spoofer - Content Script
 * Injected into all web pages to provide fingerprint spoofing
 */

(function() {
    'use strict';
    
    let spoofer = null;
    let isEnabled = false;
    
    // Inject the spoofing scripts into the page context
    function injectSpoofingScripts() {
        const scripts = [
            'spoof-core.js',
            'spoof-config.js', 
            'utils.js',
            'inject.js'
        ];
        
        scripts.forEach(scriptName => {
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL(scriptName);
            script.onload = function() {
                this.remove();
            };
            (document.head || document.documentElement).appendChild(script);
        });
    }
    
    // Load settings and initialize spoofing
    async function initializeSpoofing() {
        try {
            const result = await chrome.storage.sync.get({
                enabled: false,
                config: 'windows_chrome',
                privacyLevel: 'standard',
                customConfig: null,
                randomize: false
            });
            
            if (result.enabled) {
                // Send configuration to injected script
                window.postMessage({
                    type: 'FINGERPRINT_SPOOFER_INIT',
                    config: result.config,
                    privacyLevel: result.privacyLevel,
                    customConfig: result.customConfig,
                    randomize: result.randomize
                }, '*');
            }
            
        } catch (error) {
            console.error('Fingerprint Spoofer: Failed to initialize:', error);
        }
    }
    
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case 'enable':
                window.postMessage({
                    type: 'FINGERPRINT_SPOOFER_ENABLE',
                    config: request.config,
                    privacyLevel: request.privacyLevel
                }, '*');
                sendResponse({ success: true });
                break;
                
            case 'disable':
                window.postMessage({
                    type: 'FINGERPRINT_SPOOFER_DISABLE'
                }, '*');
                sendResponse({ success: true });
                break;
                
            case 'updateConfig':
                window.postMessage({
                    type: 'FINGERPRINT_SPOOFER_UPDATE',
                    config: request.config,
                    privacyLevel: request.privacyLevel
                }, '*');
                sendResponse({ success: true });
                break;
                
            case 'getFingerprint':
                // Request fingerprint from injected script
                window.postMessage({
                    type: 'FINGERPRINT_SPOOFER_GET_FINGERPRINT'
                }, '*');
                
                // Listen for response
                const messageListener = (event) => {
                    if (event.source === window && 
                        event.data && 
                        event.data.type === 'FINGERPRINT_SPOOFER_FINGERPRINT_RESPONSE') {
                        
                        sendResponse({ fingerprint: event.data.fingerprint });
                        window.removeEventListener('message', messageListener);
                    }
                };
                
                window.addEventListener('message', messageListener);
                return true; // Keep message channel open for async response
                
            case 'testSpoofing':
                window.postMessage({
                    type: 'FINGERPRINT_SPOOFER_TEST'
                }, '*');
                
                const testListener = (event) => {
                    if (event.source === window && 
                        event.data && 
                        event.data.type === 'FINGERPRINT_SPOOFER_TEST_RESPONSE') {
                        
                        sendResponse({ results: event.data.results });
                        window.removeEventListener('message', testListener);
                    }
                };
                
                window.addEventListener('message', testListener);
                return true;
        }
    });
    
    // Listen for responses from injected script
    window.addEventListener('message', (event) => {
        if (event.source === window && event.data && event.data.type) {
            switch (event.data.type) {
                case 'FINGERPRINT_SPOOFER_STATUS':
                    // Update extension badge
                    chrome.runtime.sendMessage({
                        action: 'updateBadge',
                        enabled: event.data.enabled
                    });
                    break;
                    
                case 'FINGERPRINT_SPOOFER_LOG':
                    // Forward logs to background script
                    chrome.runtime.sendMessage({
                        action: 'log',
                        level: event.data.level,
                        message: event.data.message
                    });
                    break;
            }
        }
    });
    
    // Detect if we're in an iframe
    const isInIframe = window !== window.top;
    
    // Only inject in main frame or if explicitly enabled for iframes
    if (!isInIframe || document.querySelector('meta[name="fingerprint-spoof-iframe"]')) {
        // Inject scripts immediately
        injectSpoofingScripts();
        
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSpoofing);
        } else {
            initializeSpoofing();
        }
    }
    
    // Report extension is loaded
    console.log('🛡️ Browser Fingerprint Spoofer: Content script loaded');
    
})();