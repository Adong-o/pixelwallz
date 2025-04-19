// Theme Button Functionality
function initializeThemeButtons() {
    const defaultThemeBtn = document.createElement('button');
    defaultThemeBtn.id = 'defaultThemeBtn';
    defaultThemeBtn.className = 'theme-btn';
    defaultThemeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
    `;
    defaultThemeBtn.title = "Default Theme";
    
    // Insert the default theme button before the first theme button
    const firstThemeBtn = document.querySelector('.theme-btn');
    if (firstThemeBtn && firstThemeBtn.parentNode) {
        firstThemeBtn.parentNode.insertBefore(defaultThemeBtn, firstThemeBtn);
    }
    
    // Add click handler
    defaultThemeBtn.addEventListener('click', () => {
        if (window.themeManager) {
            window.themeManager.resetToDefault();
        }
    });
}

// Trending Searches Functionality
function initializeTrendingSearches() {
    const trendTags = document.querySelectorAll('.trend-tag');
    
    trendTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchQuery = tag.textContent.trim();
            const searchInput = document.getElementById('searchInput');
            const searchBtn = document.getElementById('searchBtn');
            
            if (searchInput && searchBtn) {
                searchInput.value = searchQuery;
                searchBtn.click(); // Trigger the search
                
                // Scroll to gallery section
                const gallery = document.getElementById('imageGallery');
                if (gallery) {
                    gallery.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        
        // Add hover effect to show it's clickable
        tag.style.cursor = 'pointer';
    });
}

// Initialize features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeThemeButtons();
    initializeTrendingSearches();
}); 