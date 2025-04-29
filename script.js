// Function to show success message and trigger confetti
function showDownloadSuccess() {
    const modalContent = document.querySelector('.download-modal-content');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h4>Thank You for Using ImageOasis!</h4>
        <p>Your wallpaper has been downloaded. Come back for more stunning wallpapers!</p>
    `;
    
    // Create confetti container
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    // Configure confetti
    const confettiColors = ['#FF3366', '#36D1DC', '#5B86E5', '#FC466B'];
    const confettiConfig = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors,
        disableForReducedMotion: true
    };

    // Show success message and trigger confetti
    modalContent.appendChild(successMessage);
    confetti(confettiConfig);

    // Clean up after animation
    setTimeout(() => {
        confettiContainer.remove();
        successMessage.remove();
    }, 5000);
}

// Function to handle download button click
function handleDownload(event) {
    event.preventDefault();
    const downloadBtn = event.currentTarget;
    const imageUrl = downloadBtn.getAttribute('data-image-url');

    // Create temporary link to download image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'wallpaper-' + Date.now() + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message and confetti
    showDownloadSuccess();
}

// Add click event listeners to download buttons
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', handleDownload);
});

// Creator Modal Functionality
const creatorModal = document.getElementById('creatorModal');
const creatorGallery = document.querySelector('.creator-gallery');
const creatorName = document.querySelector('.creator-name');
const creatorBio = document.querySelector('.creator-bio');
const creatorAvatar = document.querySelector('.creator-avatar');

// Function to open creator modal
function openCreatorModal(creatorId, creatorData) {
    // Update creator info
    creatorName.textContent = creatorData.name;
    creatorBio.textContent = creatorData.bio;
    creatorAvatar.src = creatorData.avatar;

    // Clear previous images
    creatorGallery.innerHTML = '';

    // Load creator's images
    creatorData.images.forEach(image => {
        const imgCard = document.createElement('div');
        imgCard.className = 'creator-img-card';
        imgCard.innerHTML = `
            <img src="${image.url}" alt="${image.title}">
            <div class="creator-img-actions">
                <button class="action-btn download-btn" onclick="downloadImage('${image.url}')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>
            </div>
        `;
        creatorGallery.appendChild(imgCard);
    });

    // Show modal
    creatorModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Function to close creator modal
function closeCreatorModal() {
    creatorModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners for modal
document.querySelector('.close-modal').addEventListener('click', closeCreatorModal);
creatorModal.addEventListener('click', (e) => {
    if (e.target === creatorModal) {
        closeCreatorModal();
    }
});

// Update image card click handler
document.querySelectorAll('.img-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't open modal if clicking on download button
        if (e.target.closest('.download-btn')) {
            return;
        }

        const creatorId = card.dataset.creatorId;
        const creatorData = {
            name: card.dataset.creatorName,
            bio: card.dataset.creatorBio,
            avatar: card.dataset.creatorAvatar,
            images: JSON.parse(card.dataset.creatorImages)
        };
        openCreatorModal(creatorId, creatorData);
    });
});

// Function to download image
function downloadImage(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wallpaper.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Image Details Modal Setup
const imageDetailsModal = document.getElementById('imageDetailsModal');
const zoomedImage = document.querySelector('.zoomed-image');
const imageTitle = document.querySelector('.image-title');
const photographerName = document.querySelector('.meta-item:nth-child(1) span');
const imageDimensions = document.querySelector('.meta-item:nth-child(2) span');
const imageCategory = document.querySelector('.meta-item:nth-child(3) span');
const likeButton = document.querySelector('.action-btn.like');

function openImageDetailsModal(imageData) {
    zoomedImage.src = imageData.src;
    zoomedImage.alt = imageData.title;
    imageTitle.textContent = imageData.title;
    photographerName.textContent = imageData.photographer;
    imageDimensions.textContent = `${imageData.width} x ${imageData.height}`;
    imageCategory.textContent = imageData.category;
    
    // Reset zoom state
    zoomedImage.classList.remove('zoomed');
    
    // Show modal
    imageDetailsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageDetailsModal() {
    imageDetailsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners for Image Details Modal
document.querySelector('.close-image-details').addEventListener('click', closeImageDetailsModal);
imageDetailsModal.addEventListener('click', (e) => {
    if (e.target === imageDetailsModal) {
        closeImageDetailsModal();
    }
});

// Zoom functionality
zoomedImage.addEventListener('click', () => {
    zoomedImage.classList.toggle('zoomed');
});

// Like functionality
let isLiked = false;
likeButton.addEventListener('click', () => {
    isLiked = !isLiked;
    likeButton.classList.toggle('liked');
    likeButton.querySelector('span').textContent = isLiked ? 'Liked' : 'Like';
});

// Update image card click handler
document.querySelectorAll('.img-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent modal from opening if clicking download button
        if (e.target.closest('.download-btn')) {
            return;
        }
        
        const imageData = {
            src: card.querySelector('img').src,
            title: card.dataset.title,
            photographer: card.dataset.photographer,
            width: card.dataset.width,
            height: card.dataset.height,
            category: card.dataset.category
        };
        
        openImageDetailsModal(imageData);
    });
}); 