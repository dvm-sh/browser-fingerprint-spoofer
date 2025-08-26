/**
 * Browser Fingerprint Spoofer - Popup Script
 * Handles popup UI interactions and communication with background script
 */

class PopupManager {
    constructor() {
        this.elements = {};
        this.currentSettings = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSettings();
        this.loadStats();
    }

    cacheElements() {
        this.elements = {
            enableToggle: document.getElementById('enableToggle'),
            statusIndicator: document.getElementById('statusIndicator'),
            statusText: document.getElementById('statusText'),
            configSelect: document.getElementById('configSelect'),
            privacyOptions: document.querySelectorAll('.privacy-option'),
            sitesVisited: document.getElementById('sitesVisited'),
            sessionsProtected: document.getElementById('sessionsProtected'),
            testBtn: document.getElementById('testBtn'),
            optionsBtn: document.getElementById('optionsBtn'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            notification: document.getElementById('notification')
        };
    }

    bindEvents() {
        // Toggle switch
        this.elements.enableToggle.addEventListener('change', (e) => {
            this.toggleEnabled(e.target.checked);
        });

        // Configuration select
        this.elements.configSelect.addEventListener('change', (e) => {
            this.updateConfig(e.target.value);
        });

        // Privacy level options
        this.elements.privacyOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.updatePrivacyLevel(e.target.dataset.level);
            });
        });

        // Action buttons
        this.elements.testBtn.addEventListener('click', () => {
            this.testProtection();
        });

        this.elements.optionsBtn.addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });

        this.elements.exportBtn.addEventListener('click', () => {
            this.exportSettings();
        });

        this.elements.importBtn.addEventListener('click', () => {
            this.importSettings();
        });

        // Import file input (hidden)
        this.createHiddenFileInput();
    }

    createHiddenFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => {
            this.handleFileImport(e.target.files[0]);
        });
        document.body.appendChild(fileInput);
        this.elements.fileInput = fileInput;
    }

    async loadSettings() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
            if (response) {
                this.currentSettings = response;
                this.updateUI();
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.showNotification('Failed to load settings', 'error');
        }
    }

    async loadStats() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getStats' });
            if (response && response.success) {
                this.updateStats(response.stats);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    updateUI() {
        // Update toggle state
        this.elements.enableToggle.checked = this.currentSettings.enabled;
        
        // Update status indicator
        const statusClass = this.currentSettings.enabled ? 'status-active' : 'status-inactive';
        const statusText = this.currentSettings.enabled ? 'Active' : 'Inactive';
        
        this.elements.statusIndicator.className = `status-indicator ${statusClass}`;
        this.elements.statusText.textContent = statusText;
        
        // Update configuration select
        this.elements.configSelect.value = this.currentSettings.config || 'windows_chrome';
        
        // Update privacy level
        this.updatePrivacyLevelUI(this.currentSettings.privacyLevel || 'standard');
    }

    updatePrivacyLevelUI(level) {
        this.elements.privacyOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.level === level) {
                option.classList.add('active');
            }
        });
    }

    updateStats(stats) {
        this.elements.sitesVisited.textContent = stats.totalSpoofedSites || 0;
        this.elements.sessionsProtected.textContent = stats.sessionsProtected || 0;
    }

    async toggleEnabled(enabled) {
        try {
            const response = await chrome.runtime.sendMessage({ 
                action: 'toggleEnabled' 
            });
            
            if (response) {
                this.currentSettings.enabled = response.enabled;
                this.updateUI();
                this.showNotification(
                    enabled ? 'Protection enabled' : 'Protection disabled'
                );
            }
        } catch (error) {
            console.error('Failed to toggle enabled state:', error);
            this.showNotification('Failed to update settings', 'error');
            // Revert toggle state
            this.elements.enableToggle.checked = !enabled;
        }
    }

    async updateConfig(config) {
        try {
            await chrome.runtime.sendMessage({
                action: 'updateSettings',
                settings: { config: config }
            });
            
            this.currentSettings.config = config;
            this.showNotification('Configuration updated');
        } catch (error) {
            console.error('Failed to update configuration:', error);
            this.showNotification('Failed to update configuration', 'error');
        }
    }

    async updatePrivacyLevel(level) {
        try {
            await chrome.runtime.sendMessage({
                action: 'updateSettings',
                settings: { privacyLevel: level }
            });
            
            this.currentSettings.privacyLevel = level;
            this.updatePrivacyLevelUI(level);
            this.showNotification('Privacy level updated');
        } catch (error) {
            console.error('Failed to update privacy level:', error);
            this.showNotification('Failed to update privacy level', 'error');
        }
    }

    async testProtection() {
        try {
            this.elements.testBtn.classList.add('loading');
            this.elements.testBtn.textContent = 'Testing...';
            
            // Open test page
            await chrome.tabs.create({
                url: 'https://browserleaks.com/canvas'
            });
            
            this.showNotification('Test page opened');
        } catch (error) {
            console.error('Failed to open test page:', error);
            this.showNotification('Failed to open test page', 'error');
        } finally {
            this.elements.testBtn.classList.remove('loading');
            this.elements.testBtn.textContent = 'Test Protection';
        }
    }

    async exportSettings() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'exportSettings' });
            
            if (response && response.success) {
                // Create and download file
                const blob = new Blob([response.data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `fingerprint-spoofer-settings-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(url);
                this.showNotification('Settings exported successfully');
            } else {
                throw new Error(response?.error || 'Export failed');
            }
        } catch (error) {
            console.error('Failed to export settings:', error);
            this.showNotification('Failed to export settings', 'error');
        }
    }

    importSettings() {
        this.elements.fileInput.click();
    }

    async handleFileImport(file) {
        if (!file) return;
        
        try {
            const text = await file.text();
            const settings = JSON.parse(text);
            
            if (!settings.settings) {
                throw new Error('Invalid settings file format');
            }
            
            await chrome.runtime.sendMessage({
                action: 'importSettings',
                settings: text
            });
            
            // Reload settings and stats
            await this.loadSettings();
            await this.loadStats();
            
            this.showNotification('Settings imported successfully');
        } catch (error) {
            console.error('Failed to import settings:', error);
            this.showNotification('Failed to import settings', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = this.elements.notification;
        notification.textContent = message;
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});
