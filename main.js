/*
const apiKey = '9v33NRbeI7fMxBXA84i2OX4naXhDVPHv0JC7CEQMdIFYdfJ6tcYv4Wps';
const gallery = document.getElementById('imageGallery');
const loader = document.getElementById('loader');
let currentPage = 1;
let currentQuery = 'wallpaper';
let isLoading = false;
let hasMore = true;

async function fetchImages(query, page = 1, append = false) {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    loader.style.display = 'block';
    
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=40&page=${page}`,
            {
                headers: {
                    Authorization: apiKey
                }
            }
        );
        
        const data = await response.json();
        
        if (!append) {
            gallery.innerHTML = '';
        }
        
        if (data.photos.length === 0) {
            hasMore = false;
            loader.textContent = 'No more images to load';
            return;
        }
        
        displayImages(data.photos, append);
        
    } catch (error) {
        console.error('Error fetching images:', error);
        loader.textContent = 'Error loading images. Please try again.';
    } finally {
        isLoading = false;
        loader.style.display = 'none';
    }
}

function displayImages(photos, append = false) {
    const fragment = document.createDocumentFragment();
    
    photos.forEach(photo => {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-wrapper';
        
        wrapper.innerHTML = `
            <img src="${photo.src.large}" alt="${photo.photographer}" loading="lazy">
            <div class="img-overlay">
                <div class="img-actions">
                    <button class="action-btn like-btn" data-id="${photo.id}">❤</button>
                    <button class="action-btn download-btn" data-url="${photo.src.original}" data-id="${photo.id}">⬇</button>
                </div>
            </div>
        `;
        
        fragment.appendChild(wrapper);
    });
    
    gallery.appendChild(fragment);
    initializeImageActions();
}

function initializeImageActions() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('liked');
        });
    });

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = btn.dataset.url;
            const id = btn.dataset.id;
            
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `wallpaper-${id}.jpg`;
                link.click();
                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error('Error downloading image:', error);
            }
        });
    });
}

// Infinite scroll
function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        currentPage++;
        fetchImages(currentQuery, currentPage, true);
    }
}

// Search functionality
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        hasMore = true;
        fetchImages(query);
    }
});

// Category buttons
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        currentQuery = category;
        currentPage = 1;
        hasMore = true;
        fetchImages(category);
    });
});

// Initial load
window.addEventListener('scroll', handleScroll);
fetchImages('wallpaper');*/

const apiKey = '9v33NRbeI7fMxBXA84i2OX4naXhDVPHv0JC7CEQMdIFYdfJ6tcYv4Wps';
const gallery = document.getElementById('imageGallery');
const loader = document.getElementById('loader');
let currentPage = 1;
let currentQuery = 'wallpaper';
let isLoading = false;
let hasMore = true;

// Function to get a random category
function getRandomCategory() {
    const categories = [
        'wallpaper', 'nature', 'travel', 'animals',
        'architecture', 'art', 'space', 'ocean',
        'forest', 'city', 'mountain', 'sunset'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
}

// Add page load event listener to fetch new images
window.addEventListener('load', () => {
    currentQuery = getRandomCategory();
    currentPage = 1;
    hasMore = true;
    fetchImages(currentQuery);
});

async function fetchImages(query, page = 1, append = false) {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    loader.style.display = 'block';
    
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=40&page=${page}`,
            {
                headers: {
                    Authorization: apiKey
                }
            }
        );
        
        const data = await response.json();
        
        if (!append) {
            gallery.innerHTML = '';
        }
        
        if (data.photos.length === 0) {
            hasMore = false;
            loader.textContent = 'No more images to load';
            return;
        }
        
        displayImages(data.photos, append);
        
    } catch (error) {
        console.error('Error fetching images:', error);
        loader.textContent = 'Error loading images. Please try again.';
    } finally {
        isLoading = false;
        loader.style.display = 'none';
    }
}

function displayImages(photos, append = false) {
    const fragment = document.createDocumentFragment();
    
    photos.forEach(photo => {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-wrapper';
        
        wrapper.innerHTML = `
            <img src="${photo.src.large}" alt="${photo.photographer}" loading="lazy">
            <div class="img-overlay">
                <div class="img-actions">
                    <button class="action-btn like-btn" data-id="${photo.id}">❤</button>
                    <button class="action-btn download-btn" data-url="${photo.src.original}" data-id="${photo.id}">⬇</button>
                </div>
            </div>
        `;
        
        fragment.appendChild(wrapper);
    });
    
    gallery.appendChild(fragment);
    initializeImageActions();
}

function initializeImageActions() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('liked');
        });
    });

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = btn.dataset.url;
            const id = btn.dataset.id;
            
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `wallpaper-${id}.jpg`;
                link.click();
                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error('Error downloading image:', error);
            }
        });
    });
}

// Infinite scroll
function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        currentPage++;
        fetchImages(currentQuery, currentPage, true);
    }
}

// Search functionality
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        hasMore = true;
        fetchImages(query);
    }
});

// Category buttons
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        currentQuery = category;
        currentPage = 1;
        hasMore = true;
        fetchImages(category);
    });
});

// Initial load
window.addEventListener('scroll', handleScroll);
fetchImages('wallpaper');
