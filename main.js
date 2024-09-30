const pexelsApiKey = '9v33NRbeI7fMxBXA84i2OX4naXhDVPHv0JC7CEQMdIFYdfJ6tcYv4Wps';
const pexelsImageContainer = document.getElementById('pexelsImageContainer');
const toggleButton = document.getElementById('imgToggleSection');
const galleryWrapper = document.querySelector('.img-gallery-wrapper');
let currentSection = 'pexels';

// Function to fetch images from Pexels
async function fetchPexelsImages(query) {
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=15`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: pexelsApiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        displayPexelsImages(data.photos);
    } catch (error) {
        console.error('Error fetching Pexels data:', error);
    }
}

// Function to display Pexels images
function displayPexelsImages(photos) {
    pexelsImageContainer.innerHTML = ''; // Clear previous images
    const likes = getLikes();
    const likedImages = getLikedImages();

    photos.forEach(photo => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-wrapper';

        const imgElement = document.createElement('img');
        imgElement.src = photo.src.medium;
        imgElement.alt = photo.photographer;

        const overlay = document.createElement('div');
        overlay.className = 'img-overlay';

        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        likeBtn.innerHTML = `❤ ${likes[photo.id] || 0}`;
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            likeImage(photo.id, likeBtn);
        });

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '⬇';
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadImage(photo.src.original, photo.id);
        });

        overlay.appendChild(likeBtn);
        overlay.appendChild(downloadBtn);
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(overlay);
        pexelsImageContainer.appendChild(imgContainer);

        // If the image has been liked, update the button style
        if (likedImages.includes(photo.id)) {
            likeBtn.classList.add('liked');
        }
    });
}

// Like image functionality with toggling
function likeImage(imageId, likeBtn) {
    let likes = getLikes();
    let likedImages = getLikedImages();

    if (likedImages.includes(imageId)) {
        // If already liked, remove the like
        likes[imageId] = (likes[imageId] || 1) - 1;
        likedImages = likedImages.filter(id => id !== imageId);
        likeBtn.classList.remove('liked');
    } else {
        // If not liked yet, add the like
        likes[imageId] = (likes[imageId] || 0) + 1;
        likedImages.push(imageId);
        likeBtn.classList.add('liked');
    }

    // Update the like button text
    likeBtn.innerHTML = `❤ ${likes[imageId] || 0}`;
    saveLikes(likes);
    saveLikedImages(likedImages);
}

// Function to get likes from local storage
function getLikes() {
    return JSON.parse(localStorage.getItem('imageLikes')) || {};
}

// Function to save likes to local storage
function saveLikes(likes) {
    localStorage.setItem('imageLikes', JSON.stringify(likes));
}

// Function to get liked images from local storage
function getLikedImages() {
    return JSON.parse(localStorage.getItem('likedImages')) || [];
}

// Function to save liked images to local storage
function saveLikedImages(likedImages) {
    localStorage.setItem('likedImages', JSON.stringify(likedImages));
}

// Function to download the image
function downloadImage(imageUrl, fileName) {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `image-${fileName}.jpg`;
            link.click();
            URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
}

// Toggle between Pexels and DALL·E galleries
toggleButton.addEventListener('click', () => {
    if (currentSection === 'pexels') {
        galleryWrapper.style.transform = 'translateX(-100%)';
        toggleButton.textContent = 'Switch to Pexels';
        currentSection = 'dalle';
    } else {
        galleryWrapper.style.transform = 'translateX(0)';
        toggleButton.textContent = 'Switch to DALL-E';
        currentSection = 'pexels';
    }
});

// Initial load of Pexels images
fetchPexelsImages('nature');

// Handle Pexels search
document.getElementById('pexelsSearchBtn').addEventListener('click', () => {
    const query = document.getElementById('pexelsSearch').value;
    if (query) {
        fetchPexelsImages(query);
    } else {
        alert('Please enter a search query.');
    }
});

// Category selection functionality
document.querySelectorAll('.img-category-button').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        fetchPexelsImages(category);
    });
});
