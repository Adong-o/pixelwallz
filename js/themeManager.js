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
        this.initializeThemeButtons();
        this.loadSavedTheme();
    }

    initializeThemeButtons() {
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
        
        // Apply new theme
        document.body.classList.add(this.isDarkMode ? 'theme-dark' : 'theme-light');
        
        // Update colors
        if (this.isDarkMode) {
            document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--primary-color', '#6c63ff');
            document.documentElement.style.setProperty('--secondary-color', '#2d2d2d');
        } else {
        document.documentElement.style.setProperty('--bg-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#333333');
        document.documentElement.style.setProperty('--primary-color', '#4a90e2');
        document.documentElement.style.setProperty('--secondary-color', '#f5f5f5');
    }
    }

    async activateTheme(themeName) {
        // Clean up any active theme
        if (this.activeTheme) {
            if (this.themes[this.activeTheme]) {
                this.themes[this.activeTheme].cleanup();
            }
            document.body.classList.remove(`theme-${this.activeTheme}`);
        }

        // If clicking the active theme, deactivate it and return to light/dark mode
        if (this.activeTheme === themeName) {
            this.activeTheme = null;
            this.applyLightDarkMode();
            localStorage.removeItem('imageoasis-theme');
            this.updateButtonStates();
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
            this.themes[themeName].initialize();
        } catch (error) {
            console.error(`Failed to load ${themeName} theme:`, error);
            this.activeTheme = null;
            this.applyLightDarkMode();
        }

        // Update button states
        this.updateButtonStates();
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
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
}); 