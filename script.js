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