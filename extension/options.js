/**
 * Browser Fingerprint Spoofer - Options Script
 * Handles options page functionality and settings management
 */

class OptionsManager {
    constructor() {
        this.elements = {};
        this.currentSettings = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSettings();
        this.setupCustomConfigToggle();
    }

    cacheElements() {
        this.elements = {
            form: document.getElementById('optionsForm'),
            enabled: document.getElementById('enabled'),
            showNotifications: document.getElementById('showNotifications'),
            autoUpdate: document.getElementById('autoUpdate'),
            config: document.getElementById('config'),
            privacyBasic: document.getElementById('privacyBasic'),
            privacyStandard: document.getElementById('privacyStandard'),
            privacyMaximum: document.getElementById('privacyMaximum'),
            randomize: document.getElementById('randomize'),
            spoofNavigator: document.getElementById('spoofNavigator'),
            spoofScreen: document.getElementById('spoofScreen'),
            spoofWebGL: document.getElementById('spoofWebGL'),
            spoofCanvas: document.getElementById('spoofCanvas'),
            spoofWebRTC: document.getElementById('spoofWebRTC'),
            spoofSensors: document.getElementById('spoofSensors'),
            spoofFonts: document.getElementById('spoofFonts'),
            clearStorage: document.getElementById('clearStorage'),
            sessionProtection: document.getElementById('sessionProtection'),
            customUserAgent: document.getElementById('customUserAgent'),
            customPlatform: document.getElementById('customPlatform'),
            customLanguage: document.getElementById('customLanguage'),
            customScreenWidth: document.getElementById('customScreenWidth'),
            customScreenHeight: document.getElementById('customScreenHeight'),
            resetBtn: document.getElementById('resetBtn'),
            clearDataBtn: document.getElementById('clearDataBtn'),
            notification: document.getElementById('notification'),
            customConfigToggle: document.getElementById('customConfigToggle'),
            customConfigSettings: document.getElementById('customConfigSettings')
        };
    }

    bindEvents() {
        // Form submission
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // Configuration change
        this.elements.config.addEventListener('change', (e) => {
            this.handleConfigChange(e.target.value);
        });

        // Reset button
        this.elements.resetBtn.addEventListener('click', () => {
            this.resetToDefaults();
        });

        // Clear data button
        this.elements.clearDataBtn.addEventListener('click', () => {
            this.clearAllData();
        });

        // Privacy level radio buttons
        [this.elements.privacyBasic, this.elements.privacyStandard, this.elements.privacyMaximum].forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updatePrivacyLevel(e.target.value);
            });
        });
    }

    setupCustomConfigToggle() {
        this.elements.customConfigToggle.addEventListener('click', () => {
            const settings = this.elements.customConfigSettings;
            const isVisible = settings.classList.contains('show');
            
            if (isVisible) {
                settings.classList.remove('show');
                this.elements.customConfigToggle.textContent = 'Show Custom Configuration';
            } else {
                settings.classList.add('show');
                this.elements.customConfigToggle.textContent = 'Hide Custom Configuration';
            }
        });
    }

    async loadSettings() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
            if (response) {
                this.currentSettings = response;
                this.populateForm();
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.showNotification('Failed to load settings', 'error');
        }
    }

    populateForm() {
        // General settings
        this.elements.enabled.checked = this.currentSettings.enabled || false;
        this.elements.showNotifications.checked = this.currentSettings.showNotifications !== false;
        this.elements.autoUpdate.checked = this.currentSettings.autoUpdate !== false;

        // Configuration
        this.elements.config.value = this.currentSettings.config || 'windows_chrome';
        
        // Privacy level
        const privacyLevel = this.currentSettings.privacyLevel || 'standard';
        if (privacyLevel === 'basic') this.elements.privacyBasic.checked = true;
        else if (privacyLevel === 'maximum') this.elements.privacyMaximum.checked = true;
        else this.elements.privacyStandard.checked = true;

        // Features
        this.elements.randomize.checked = this.currentSettings.randomize || false;
        this.elements.spoofNavigator.checked = this.currentSettings.spoofNavigator !== false;
        this.elements.spoofScreen.checked = this.currentSettings.spoofScreen !== false;
        this.elements.spoofWebGL.checked = this.currentSettings.spoofWebGL !== false;
        this.elements.spoofCanvas.checked = this.currentSettings.spoofCanvas !== false;
        this.elements.spoofWebRTC.checked = this.currentSettings.spoofWebRTC !== false;
        this.elements.spoofSensors.checked = this.currentSettings.spoofSensors || false;
        this.elements.spoofFonts.checked = this.currentSettings.spoofFonts !== false;
        this.elements.clearStorage.checked = this.currentSettings.clearStorage || false;
        this.elements.sessionProtection.checked = this.currentSettings.sessionProtection !== false;

        // Custom configuration
        if (this.currentSettings.customConfig) {
            this.elements.customUserAgent.value = this.currentSettings.customConfig.userAgent || '';
            this.elements.customPlatform.value = this.currentSettings.customConfig.platform || '';
            this.elements.customLanguage.value = this.currentSettings.customConfig.language || '';
            this.elements.customScreenWidth.value = this.currentSettings.customConfig.screenWidth || '';
            this.elements.customScreenHeight.value = this.currentSettings.customConfig.screenHeight || '';
        }

        this.handleConfigChange(this.elements.config.value);
    }

    handleConfigChange(configValue) {
        if (configValue === 'custom') {
            this.elements.customConfigSettings.classList.add('show');
            this.elements.customConfigToggle.textContent = 'Hide Custom Configuration';
        } else {
            this.elements.customConfigSettings.classList.remove('show');
            this.elements.customConfigToggle.textContent = 'Show Custom Configuration';
        }
    }

    async saveSettings() {
        try {
            const formData = new FormData(this.elements.form);
            const settings = {
                enabled: this.elements.enabled.checked,
                showNotifications: this.elements.showNotifications.checked,
                autoUpdate: this.elements.autoUpdate.checked,
                config: this.elements.config.value,
                privacyLevel: this.getSelectedPrivacyLevel(),
                randomize: this.elements.randomize.checked,
                spoofNavigator: this.elements.spoofNavigator.checked,
                spoofScreen: this.elements.spoofScreen.checked,
                spoofWebGL: this.elements.spoofWebGL.checked,
                spoofCanvas: this.elements.spoofCanvas.checked,
                spoofWebRTC: this.elements.spoofWebRTC.checked,
                spoofSensors: this.elements.spoofSensors.checked,
                spoofFonts: this.elements.spoofFonts.checked,
                clearStorage: this.elements.clearStorage.checked,
                sessionProtection: this.elements.sessionProtection.checked
            };

            // Add custom configuration if selected
            if (this.elements.config.value === 'custom') {
                settings.customConfig = {
                    userAgent: this.elements.customUserAgent.value,
                    platform: this.elements.customPlatform.value,
                    language: this.elements.customLanguage.value,
                    screenWidth: parseInt(this.elements.customScreenWidth.value) || 1920,
                    screenHeight: parseInt(this.elements.customScreenHeight.value) || 1080
                };
            }

            await chrome.runtime.sendMessage({
                action: 'updateSettings',
                settings: settings
            });

            this.currentSettings = { ...this.currentSettings, ...settings };
            this.showNotification('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('Failed to save settings', 'error');
        }
    }

    getSelectedPrivacyLevel() {
        if (this.elements.privacyBasic.checked) return 'basic';
        if (this.elements.privacyMaximum.checked) return 'maximum';
        return 'standard';
    }

    async resetToDefaults() {
        if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
            return;
        }

        try {
            await chrome.runtime.sendMessage({ action: 'resetSettings' });
            await this.loadSettings();
            this.showNotification('Settings reset to defaults', 'warning');
        } catch (error) {
            console.error('Failed to reset settings:', error);
            this.showNotification('Failed to reset settings', 'error');
        }
    }

    async clearAllData() {
        if (!confirm('Are you sure you want to clear all extension data? This will remove all settings, statistics, and custom configurations. This action cannot be undone.')) {
            return;
        }

        try {
            // Clear sync storage
            await chrome.storage.sync.clear();
            
            // Clear local storage
            await chrome.storage.local.clear();
            
            // Reset form
            await this.loadSettings();
            
            this.showNotification('All data cleared successfully', 'warning');
        } catch (error) {
            console.error('Failed to clear data:', error);
            this.showNotification('Failed to clear data', 'error');
        }
    }

    updatePrivacyLevel(level) {
        // This method can be used for real-time privacy level updates if needed
        console.log('Privacy level updated to:', level);
    }

    showNotification(message, type = 'success') {
        const notification = this.elements.notification;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OptionsManager();
});
