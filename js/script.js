// Function to trigger confetti with a professional spread
function triggerConfetti() {
    const end = Date.now() + 1000; // Duration of 1 second
    
    // Professional color scheme
    const colors = ['#FF007A', '#6C63FF', '#36D1DC', '#5B86E5'];
    
    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 100,
            origin: { x: 0, y: 0.5 },
            colors: colors,
            shapes: ['circle'],
            scalar: 2,
            disableForReducedMotion: true
        });
        
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 100,
            origin: { x: 1, y: 0.5 },
            colors: colors,
            shapes: ['circle'],
            scalar: 2,
            disableForReducedMotion: true
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Add confetti effect to hero section interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add confetti to primary action buttons
    const primaryButtons = document.querySelectorAll('.primary-btn');
    primaryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            triggerConfetti();
        });
    });

    // Add confetti effect when scrolling to the stats section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerConfetti();
                observer.unobserve(entry.target); // Only trigger once per session
            }
        });
    }, { 
        threshold: 0.7,
        rootMargin: '0px'
    });

    // Observe the statistics section
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});

// Trending Section Animation
function animateNumbers() {
    const downloadCount = document.getElementById('downloadCount');
    const activeUsers = document.getElementById('activeUsers');
    const communityMembers = document.getElementById('communityMembers');
    
    let downloads = 0;
    let users = 0;
    let members = 0;
    
    const downloadTarget = Math.floor(Math.random() * 5000) + 10000;
    const usersTarget = Math.floor(Math.random() * 1000) + 2000;
    
    const downloadInterval = setInterval(() => {
        downloads += Math.floor(downloadTarget / 100);
        if (downloads >= downloadTarget) {
            downloads = downloadTarget;
            clearInterval(downloadInterval);
        }
        downloadCount.textContent = downloads.toLocaleString();
    }, 20);
    
    const usersInterval = setInterval(() => {
        users += Math.floor(usersTarget / 100);
        if (users >= usersTarget) {
            users = usersTarget;
            clearInterval(usersInterval);
        }
        activeUsers.textContent = users.toLocaleString();
    }, 20);
}

// Social Share Functionality
function initializeSocialSharing() {
    const twitterBtn = document.querySelector('.share-twitter');
    const discordBtn = document.querySelector('.join-discord');
    
    twitterBtn?.addEventListener('click', () => {
        const text = "I just discovered ImageOasis.Art - Amazing free HD & 4K wallpapers! 🎨✨ Check it out:";
        const url = "https://imageoasis.art";
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    });
    
    discordBtn?.addEventListener('click', () => {
        window.open('https://discord.gg/your-discord-invite', '_blank');
    });
}

// Trending Wallpapers Grid
async function loadTrendingWallpapers() {
    const trendingGrid = document.getElementById('trendingGrid');
    if (!trendingGrid) return;
    
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=trending&per_page=8`,
            {
                headers: {
                    Authorization: apiKey
                }
            }
        );
        const data = await response.json();
        
        data.photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'img-card';
            card.innerHTML = `
                <img src="${photo.src.medium}" alt="${photo.photographer}" loading="lazy">
                <div class="img-overlay">
                    <div class="img-info">
                        <p class="photographer">By ${photo.photographer}</p>
                        <div class="img-actions">
                            <button class="action-btn download-btn" data-url="${photo.src.original}" data-id="${photo.id}">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            trendingGrid.appendChild(card);
        });
        
        initializeImageActions();
    } catch (error) {
        console.error('Error loading trending wallpapers:', error);
    }
}

// Initialize all new features
document.addEventListener('DOMContentLoaded', () => {
    animateNumbers();
    initializeSocialSharing();
    loadTrendingWallpapers();
    
    // Intersection Observer for animation triggers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.feature-card, .community-stat').forEach(el => {
        observer.observe(el);
    });
});

// Add SEO-friendly meta tags dynamically
function updateMetaTags() {
    const metaTags = {
        'og:title': 'ImageOasis.Art - Free HD & 4K Wallpapers',
        'og:description': 'Download stunning HD & 4K wallpapers for free. New wallpapers added daily!',
        'og:image': 'https://imageoasis.art/preview.jpg',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@ImageOasisArt',
        'keywords': 'wallpapers, HD wallpapers, 4K wallpapers, free wallpapers, desktop backgrounds, mobile wallpapers',
        'author': 'ImageOasis.Art Team',
        'robots': 'index, follow, max-image-preview:large'
    };
    
    Object.entries(metaTags).forEach(([name, content]) => {
        let meta = document.querySelector(`meta[name="${name}"]`) || 
                   document.querySelector(`meta[property="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(name.includes('og:') ? 'property' : 'name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    });
}

updateMetaTags(); 