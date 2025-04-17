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