const apiKey = '9v33NRbeI7fMxBXA84i2OX4naXhDVPHv0JC7CEQMdIFYdfJ6tcYv4Wps';
const gallery = document.getElementById('imageGallery');
const loader = document.getElementById('loader');
const downloadModal = document.getElementById('downloadModal');
const progressBar = document.getElementById('progressBar');
const downloadStatus = document.getElementById('downloadStatus');
const downloadComplete = document.getElementById('downloadComplete');

let currentPage = 1;
let currentQuery = 'wallpaper';
let isLoading = false;
let hasMore = true;

async function downloadImage(url, id) {
    try {
        // Show the download modal
        downloadModal.style.display = 'flex';
        progressBar.style.width = '0%';
        downloadStatus.textContent = '0%';
        downloadComplete.style.display = 'none';

        // Create XHR request to track progress
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        
        // Setup progress handling
        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = percentComplete + '%';
                downloadStatus.textContent = Math.round(percentComplete) + '%';
            }
        };

        // Handle completion
        xhr.onload = () => {
            if (xhr.status === 200) {
                progressBar.style.width = '100%';
                downloadStatus.textContent = 'Download Complete!';
                downloadComplete.style.display = 'block';
                
                // Create download link
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

        // Handle errors
        xhr.onerror = () => {
            downloadStatus.textContent = 'Download failed. Please try again.';
            downloadComplete.style.display = 'block';
        };

        // Start the download
        xhr.open('GET', url);
        xhr.send();

    } catch (error) {
        console.error('Error downloading image:', error);
        downloadStatus.textContent = 'Download failed. Please try again.';
        downloadComplete.style.display = 'block';
    }
}

// Close modal when clicking OK
downloadComplete.addEventListener('click', () => {
    downloadModal.style.display = 'none';
});

// Close modal when clicking outside
downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) {
        downloadModal.style.display = 'none';
    }
});

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
            downloadImage(url, id);
        });
    });
}

// Keep your existing fetch and scroll handling code
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

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        currentPage++;
        fetchImages(currentQuery, currentPage, true);
    }
}

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

window.addEventListener('scroll', handleScroll);
fetchImages('wallpaper');
