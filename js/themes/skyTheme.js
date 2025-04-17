class SkyTheme {
    constructor() {
        this.clouds = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
    }

    initialize() {
        this.setupCanvas();
        this.createClouds();
        this.animate();
        this.setThemeColors();
    }

    setupCanvas() {
        // Remove existing canvas if any
        const existingCanvas = document.getElementById('sky-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        // Create and setup canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sky-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        document.body.prepend(this.canvas);

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.ctx = this.canvas.getContext('2d');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createClouds() {
        const numClouds = Math.floor(window.innerWidth / 200); // Adjust cloud density
        this.clouds = [];

        for (let i = 0; i < numClouds; i++) {
            this.clouds.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * (window.innerHeight * 0.8),
                width: 100 + Math.random() * 100,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.4 + Math.random() * 0.3
            });
        }
    }

    drawCloud(x, y, width, opacity) {
        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        // Draw cloud shape using multiple circles
        const height = width * 0.6;
        const circles = [
            { x: x + width * 0.3, y: y + height * 0.5, r: height * 0.4 },
            { x: x + width * 0.5, y: y + height * 0.3, r: height * 0.5 },
            { x: x + width * 0.7, y: y + height * 0.5, r: height * 0.4 },
            { x: x + width * 0.5, y: y + height * 0.5, r: height * 0.4 }
        ];

        circles.forEach(circle => {
            this.ctx.beginPath();
            this.ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    animate() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const draw = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.clouds.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > this.canvas.width + cloud.width) {
                    cloud.x = -cloud.width;
                }
                this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.opacity);
            });

            this.animationFrame = requestAnimationFrame(draw);
        };

        draw();
    }

    setThemeColors() {
        document.documentElement.style.setProperty('--bg-color', '#87CEEB');
        document.documentElement.style.setProperty('--text-color', '#2C3E50');
        document.documentElement.style.setProperty('--primary-color', '#3498DB');
        document.documentElement.style.setProperty('--secondary-color', '#BDC3C7');
    }

    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        const canvas = document.getElementById('sky-canvas');
        if (canvas) {
            canvas.remove();
        }
    }
}

export default SkyTheme; 