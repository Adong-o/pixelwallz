// API and DOM Elements
const apiKey = '9v33NRbeI7fMxBXA84i2OX4naXhDVPHv0JC7CEQMdIFYdfJ6tcYv4Wps';
const gallery = document.getElementById('imageGallery');
const loader = document.getElementById('loader');
const downloadModal = document.getElementById('downloadModal');
const progressBar = document.getElementById('progressBar');
const downloadStatus = document.getElementById('downloadStatus');
const downloadComplete = document.getElementById('downloadComplete');
const uploadModal = document.getElementById('uploadModal');
const galleryModal = document.getElementById('galleryModal');
const uploadBtn = document.getElementById('uploadBtn');
const userGalleryBtn = document.getElementById('userGalleryBtn');
const closeBtns = document.querySelectorAll('.close-btn');
const uploadForm = document.getElementById('imageUploadForm');

// Categories Configuration
const CATEGORIES = [
    'cities', 'wallpapers', 'dark', 'mountains', 'beaches', 'food', 'animals', 'sports', 'cars', 'gaming',
     'Berlin', 'malaysia', 'insects', 'futuristic', 'grafitti', 'lakes'
];

// State Management
let currentPage = 1;
let currentQuery = null;
let isLoading = false;
let hasMore = true;
let scrollCount = 0;
let loadMoreButton = null;

// Get Random Categories Function
function getRandomCategories(count = 3) {
    const shuffled = [...CATEGORIES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Load More Button Implementation
function createLoadMoreButton() {
    loadMoreButton = document.createElement('button');
    loadMoreButton.className = 'load-more-btn';
    loadMoreButton.textContent = 'Load More';
    loadMoreButton.style.display = 'none';
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchImages(currentQuery, currentPage, true);
    });
    document.querySelector('.gallery-container').after(loadMoreButton);
}

// Scroll Handler
function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        scrollCount++;
        
        if (scrollCount < 2) {
            currentPage++;
            fetchImages(currentQuery, currentPage, true);
        } else if (scrollCount === 2) {
            if (loadMoreButton) {
                loadMoreButton.style.display = 'block';
            }
            window.removeEventListener('scroll', handleScroll);
        }
    }
}

// Image Download Function
async function downloadImage(url, id) {
    try {
        downloadModal.style.display = 'flex';
        progressBar.style.width = '0%';
        downloadStatus.textContent = '0%';
        downloadComplete.style.display = 'none';

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        
        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = percentComplete + '%';
                downloadStatus.textContent = Math.round(percentComplete) + '%';
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                progressBar.style.width = '100%';
                downloadStatus.textContent = 'Download Complete!';
                downloadComplete.style.display = 'block';
                
                const blob = xhr.response;
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `wallpaper-${id}.jpg`;
                link.click();
                URL.revokeObjectURL(link.href);
            } else {
                downloadStatus.textContent = 'Download failed. Please try again.';
                downloadComplete.style.display = 'block';
            }
        };

        xhr.onerror = () => {
            downloadStatus.textContent = 'Download failed. Please try again.';
            downloadComplete.style.display = 'block';
        };

        xhr.open('GET', url);
        xhr.send();

    } catch (error) {
        console.error('Error downloading image:', error);
        downloadStatus.textContent = 'Download failed. Please try again.';
        downloadComplete.style.display = 'block';
    }
}

// Display Images Function
function displayImages(photos, append = false) {
    const fragment = document.createDocumentFragment();
    
    photos.forEach(photo => {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-wrapper';
        
        wrapper.innerHTML = `
            <div class="img-card">
                <img src="${photo.src.large}" alt="${photo.photographer}" loading="lazy">
                <div class="img-overlay">
                    <div class="img-info">
                        <p class="photographer">By ${photo.photographer}</p>
                        <div class="img-actions">
                            <button class="action-btn like-btn" data-id="${photo.id}" title="Like">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                            <button class="action-btn download-btn" data-url="${photo.src.original}" data-id="${photo.id}" title="Download">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        fragment.appendChild(wrapper);
    });
    
    if (!append) {
        gallery.innerHTML = '';
    }
    gallery.appendChild(fragment);
    initializeImageActions();
}

// Initialize Image Actions
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
            downloadImage(url, id);
        });
    });
}

// Fetch Images Function
async function fetchImages(query, page = 1, append = false) {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    loader.style.display = 'block';
    if (loadMoreButton) loadMoreButton.style.display = 'none';
    
    try {
        let photos = [];
        
        // If query is an array, fetch images for each category
        if (Array.isArray(query)) {
            for (const category of query) {
                const response = await fetch(
                    `https://api.pexels.com/v1/search?query=${category}&per_page=15&page=${page}`,
                    {
                        headers: {
                            Authorization: apiKey
                        }
                    }
                );
                const data = await response.json();
                photos = [...photos, ...data.photos];
            }
            // Shuffle the combined results
            photos.sort(() => 0.5 - Math.random());
        } else {
            // Original single category fetch
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${query}&per_page=40&page=${page}`,
                {
                    headers: {
                        Authorization: apiKey
                    }
                }
            );
            const data = await response.json();
            photos = data.photos;
        }
        
        if (!append) {
            gallery.innerHTML = '';
            scrollCount = 0;
            window.addEventListener('scroll', handleScroll);
        }
        
        if (photos.length === 0) {
            hasMore = false;
            loader.textContent = 'No more images to load';
            return;
        }
        
        displayImages(photos, append);
        
    } catch (error) {
        console.error('Error fetching images:', error);
        loader.textContent = 'Error loading images. Please try again.';
    } finally {
        isLoading = false;
        loader.style.display = 'none';
        if (loadMoreButton && scrollCount >= 2) {
            loadMoreButton.style.display = 'block';
        }
    }
}

// Upload Image Functions
async function handleImageUpload(formData) {
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

// Load User Submissions
async function loadUserSubmissions() {
    const galleryContainer = document.getElementById('userGalleryContainer');
    
    try {
        const response = await fetch('/api/submissions');
        const data = await response.json();
        
        galleryContainer.innerHTML = '';
        
        data.forEach(submission => {
            submission.images.forEach(image => {
                const img = document.createElement('img');
                img.src = image.url;
                img.alt = `Submitted by ${submission.name}`;
                galleryContainer.appendChild(img);
            });
        });
    } catch (error) {
        console.error('Error:', error);
        galleryContainer.innerHTML = '<p>Error loading submissions. Please try again.</p>';
    }
}

// Event Listeners
downloadComplete.addEventListener('click', () => {
    downloadModal.style.display = 'none';
});

downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) {
        downloadModal.style.display = 'none';
    }
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        hasMore = true;
        fetchImages(query);
    }
});

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        currentQuery = category;
        currentPage = 1;
        hasMore = true;
        fetchImages(category);
    });
});

uploadBtn?.addEventListener('click', () => {
    uploadModal.style.display = 'block';
});

userGalleryBtn?.addEventListener('click', () => {
    galleryModal.style.display = 'block';
    loadUserSubmissions();
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        uploadModal.style.display = 'none';
        galleryModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === uploadModal || e.target === galleryModal) {
        uploadModal.style.display = 'none';
        galleryModal.style.display = 'none';
    }
});

uploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(uploadForm);
    const submitButton = uploadForm.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Uploading...';
    
    try {
        const result = await handleImageUpload(formData);
        alert('Images uploaded successfully!');
        uploadForm.reset();
        uploadModal.style.display = 'none';
        loadUserSubmissions();
    } catch (error) {
        alert('Error uploading images. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});

// Initialize
createLoadMoreButton();
window.addEventListener('scroll', handleScroll);

// Load random categories on initial page load
const randomCategories = getRandomCategories(3);
currentQuery = randomCategories;
fetchImages(randomCategories);

//active buttons

document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to the clicked button
        button.classList.add('active');
        
        // Optional: You could filter or display wallpapers for the selected category here
        console.log(`Selected category: ${button.dataset.category}`);
      });
    });
  });


