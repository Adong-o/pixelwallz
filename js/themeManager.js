// Theme Manager for ImageOasis
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // default theme
        this.isDarkMode = true; // track light/dark mode
        this.activeTheme = null; // track active special theme (sky/desert)
        this.themes = {
            sky: null,
            desert: null
        };
        this.loadingIndicator = this.createLoadingIndicator();
        this.initializeThemeButtons();
        this.loadSavedTheme();
    }

    createLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'theme-loader';
        loader.innerHTML = `
            <div class="theme-loader-content">
                <div class="theme-loader-spinner"></div>
                <p class="theme-loader-text">Loading theme...</p>
            </div>
        `;
        document.body.appendChild(loader);
        return loader;
    }

    showLoading(themeName) {
        this.loadingIndicator.querySelector('.theme-loader-text').textContent = `Loading ${themeName} theme...`;
        this.loadingIndicator.classList.add('active');
        document.body.classList.add('theme-transitioning');
    }

    hideLoading() {
        setTimeout(() => {
            this.loadingIndicator.classList.remove('active');
            document.body.classList.remove('theme-transitioning');
        }, 500);
    }

    initializeThemeButtons() {
        // Default theme button
        const defaultThemeBtn = document.getElementById('defaultThemeBtn');
        if (defaultThemeBtn) {
            defaultThemeBtn.addEventListener('click', () => this.resetToDefault());
        }

        // Light/Dark mode toggle
        const lightThemeBtn = document.getElementById('lightThemeBtn');
        if (lightThemeBtn) {
            lightThemeBtn.addEventListener('click', () => this.toggleLightDark());
        }

        // Sky theme
        const skyThemeBtn = document.getElementById('skyThemeBtn');
        if (skyThemeBtn) {
            skyThemeBtn.addEventListener('click', () => this.activateTheme('sky'));
        }

        // Desert theme
        const desertThemeBtn = document.getElementById('desertThemeBtn');
        if (desertThemeBtn) {
            desertThemeBtn.addEventListener('click', () => this.activateTheme('desert'));
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('imageoasis-theme');
        const savedMode = localStorage.getItem('imageoasis-mode');
        
        if (savedMode) {
            this.isDarkMode = savedMode === 'dark';
            this.applyLightDarkMode();
        }
        
        if (savedTheme && ['sky', 'desert'].includes(savedTheme)) {
            this.activateTheme(savedTheme);
        }
    }

    async toggleLightDark() {
        this.isDarkMode = !this.isDarkMode;
        this.applyLightDarkMode();
        localStorage.setItem('imageoasis-mode', this.isDarkMode ? 'dark' : 'light');
        
        // Update button states
        this.updateButtonStates();
    }

    applyLightDarkMode() {
        // Remove theme classes
        document.body.classList.remove('theme-light', 'theme-dark');
        
        // Apply new theme with transition
        document.documentElement.style.setProperty('--transition-duration', '0.5s');
        document.body.classList.add(this.isDarkMode ? 'theme-dark' : 'theme-light');
        
        // Update colors with modern, eye-catching palette
        if (this.isDarkMode) {
            document.documentElement.style.setProperty('--bg-color', '#121212');
            document.documentElement.style.setProperty('--text-color', '#E0E0E0');
            document.documentElement.style.setProperty('--primary-color', '#7C3AED');
            document.documentElement.style.setProperty('--secondary-color', '#1E1E1E');
            document.documentElement.style.setProperty('--accent-color', '#F472B6');
            document.documentElement.style.setProperty('--hover-color', '#9D4EFF');
            document.documentElement.style.setProperty('--card-bg', '#1E1E1E');
            document.documentElement.style.setProperty('--border-color', '#2D2D2D');
        } else {
            document.documentElement.style.setProperty('--bg-color', '#F8FAFC');
            document.documentElement.style.setProperty('--text-color', '#1E293B');
            document.documentElement.style.setProperty('--primary-color', '#6366F1');
            document.documentElement.style.setProperty('--secondary-color', '#F1F5F9');
            document.documentElement.style.setProperty('--accent-color', '#EC4899');
            document.documentElement.style.setProperty('--hover-color', '#4F46E5');
            document.documentElement.style.setProperty('--card-bg', '#FFFFFF');
            document.documentElement.style.setProperty('--border-color', '#E2E8F0');
        }
    }

    async activateTheme(themeName) {
        this.showLoading(themeName);

        // Clean up any active theme
        if (this.activeTheme) {
            if (this.themes[this.activeTheme]) {
                this.themes[this.activeTheme].cleanup();
            }
            document.body.classList.remove(`theme-${this.activeTheme}`);
        }

        // If clicking the active theme, deactivate it
        if (this.activeTheme === themeName) {
            this.activeTheme = null;
            this.applyLightDarkMode();
            localStorage.removeItem('imageoasis-theme');
            this.updateButtonStates();
            this.hideLoading();
            return;
        }

        // Activate new theme
        this.activeTheme = themeName;
        document.body.classList.add(`theme-${themeName}`);
        localStorage.setItem('imageoasis-theme', themeName);

        // Load and initialize theme
        try {
            if (!this.themes[themeName]) {
                const module = await import(`./themes/${themeName}Theme.js`);
                this.themes[themeName] = new module.default();
            }
            await this.themes[themeName].initialize();
            this.updateButtonStates();
        } catch (error) {
            console.error(`Failed to load ${themeName} theme:`, error);
            this.activeTheme = null;
            this.applyLightDarkMode();
        } finally {
            this.hideLoading();
        }
    }

    updateButtonStates() {
        // Remove active class from all theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to current theme button
        if (this.activeTheme) {
            const activeBtn = document.getElementById(`${this.activeTheme}ThemeBtn`);
            if (activeBtn) activeBtn.classList.add('active');
        } else {
            const lightDarkBtn = document.getElementById('lightThemeBtn');
            if (lightDarkBtn) lightDarkBtn.classList.add('active');
        }
    }

    resetToDefault() {
        // Clean up any active theme
        if (this.activeTheme && this.themes[this.activeTheme]) {
            this.themes[this.activeTheme].cleanup();
        }
        
        // Reset to default state
        this.activeTheme = null;
        document.body.classList.remove('theme-sky', 'theme-desert');
        localStorage.removeItem('imageoasis-theme');
        
        // Apply default light/dark mode
        this.applyLightDarkMode();
        this.updateButtonStates();
        
        // Show brief loading indicator for smooth transition
        this.showLoading('default');
        setTimeout(() => this.hideLoading(), 500);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
}); 