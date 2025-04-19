class SkyTheme {
    constructor() {
        this.clouds = [];
        this.birds = [];
        this.stars = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.timeOfDay = 'day';
        this.weather = 'clear';
        this.mousePos = { x: 0, y: 0 };
        this.lastLightning = 0;
        this.raindrops = [];
    }

    async initialize() {
        return new Promise((resolve) => {
            this.setupCanvas();
            this.createClouds();
            this.createBirds();
            this.createStars();
            this.setupEventListeners();
            
            // Start with canvas hidden
            this.canvas.style.opacity = '0';
            
            // Initialize animation and colors
            requestAnimationFrame(() => {
                this.animate();
                this.setThemeColors();
                this.startTimeLoop();
                
                // Fade in canvas smoothly
                setTimeout(() => {
                    this.canvas.style.opacity = '1';
                    resolve();
                }, 100);
            });
        });
    }

    setupCanvas() {
        const existingCanvas = document.getElementById('sky-canvas');
        if (existingCanvas) existingCanvas.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sky-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'auto';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.transition = 'opacity 0.5s';
        document.body.prepend(this.canvas);

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.ctx = this.canvas.getContext('2d');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePos = {
                x: e.clientX,
                y: e.clientY
            };
            
            // Make nearby clouds react to mouse
            this.clouds.forEach(cloud => {
                const dx = cloud.x - this.mousePos.x;
                const dy = cloud.y - this.mousePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const angle = Math.atan2(dy, dx);
                    cloud.x += Math.cos(angle) * 2;
                    cloud.y += Math.sin(angle) * 2;
                }
            });
        });

        this.canvas.addEventListener('click', () => {
            this.toggleWeather();
        });

        // Add double click to toggle time of day
        this.canvas.addEventListener('dblclick', () => {
            this.toggleTimeOfDay();
        });
    }

    toggleWeather() {
        const weathers = ['clear', 'cloudy', 'rain', 'storm'];
        const currentIndex = weathers.indexOf(this.weather);
        this.weather = weathers[(currentIndex + 1) % weathers.length];
        
        if (this.weather === 'cloudy') {
            this.createClouds(true); // More clouds
        } else if (this.weather === 'rain' || this.weather === 'storm') {
            this.raindrops = Array(100).fill().map(() => this.createRaindrop());
        }
    }

    toggleTimeOfDay() {
        const times = ['dawn', 'day', 'dusk', 'night'];
        const currentIndex = times.indexOf(this.timeOfDay);
        const nextTime = times[(currentIndex + 1) % times.length];
        
        // Create temporary overlay for smooth transition
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(overlay);
        
        // Fade in overlay
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            
            // Update time of day
            setTimeout(() => {
                this.timeOfDay = nextTime;
                this.setThemeColors();
                
                // Fade out overlay
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 300);
                }, 100);
            }, 300);
        });
    }

    createRaindrop() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            speed: 10 + Math.random() * 10,
            length: 10 + Math.random() * 20
        };
    }

    createBirds() {
        this.birds = Array(5).fill().map(() => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * (this.canvas.height * 0.5),
            speed: 2 + Math.random() * 2,
            size: 10 + Math.random() * 5,
            wingPhase: Math.random() * Math.PI * 2
        }));
    }

    createStars() {
        this.stars = Array(200).fill().map(() => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2,
            twinkle: Math.random() * Math.PI * 2
        }));
    }

    createClouds(dense = false) {
        const numClouds = dense ? 15 : 8;
        this.clouds = Array(numClouds).fill().map(() => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * (this.canvas.height * 0.6),
            width: 100 + Math.random() * 150,
            speed: 0.2 + Math.random() * 0.3,
            opacity: 0.4 + Math.random() * 0.3,
            segments: Array(5).fill().map(() => ({
                offsetX: Math.random() * 50 - 25,
                offsetY: Math.random() * 20 - 10,
                radius: 30 + Math.random() * 20
            }))
        }));
    }

    drawCloud(cloud) {
        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        
        cloud.segments.forEach(segment => {
            this.ctx.beginPath();
            this.ctx.arc(
                cloud.x + segment.offsetX,
                cloud.y + segment.offsetY,
                segment.radius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    drawBird(bird) {
        this.ctx.save();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        
        bird.wingPhase += 0.1;
        const wingY = Math.sin(bird.wingPhase) * 10;
        
        this.ctx.beginPath();
        this.ctx.moveTo(bird.x - bird.size, bird.y + wingY);
        this.ctx.quadraticCurveTo(bird.x, bird.y - 10, bird.x + bird.size, bird.y + wingY);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawLightning() {
        if (Math.random() < 0.03) {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.lineWidth = 2 + Math.random() * 2;
            
            const startX = Math.random() * this.canvas.width;
            let x = startX;
            let y = 0;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            
            while (y < this.canvas.height * 0.8) {
                x += (Math.random() - 0.5) * 50;
                y += 20;
                this.ctx.lineTo(x, y);
            }
            
            this.ctx.stroke();
            this.ctx.restore();
            
            // Flash effect
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.right = '0';
            flash.style.bottom = '0';
            flash.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            flash.style.zIndex = '9999';
            flash.style.pointerEvents = 'none';
            document.body.appendChild(flash);
            
            setTimeout(() => flash.remove(), 50);
        }
    }

    drawRain() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(200, 200, 255, 0.5)';
        this.ctx.lineWidth = 1;
        
        this.raindrops.forEach(drop => {
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x - 1, drop.y + drop.length);
            this.ctx.stroke();
            
            drop.y += drop.speed;
            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });
        
        this.ctx.restore();
    }

    getTimeColors() {
        const colors = {
            dawn: {
                sky: ['#E6B8A2', '#DBA39A', '#CD8D7B'],
                text: '#2C3E50',
                primary: '#CD8D7B',
                secondary: '#9D8189'
            },
            day: {
                sky: ['#A8C7E5', '#B7D1E7', '#C6DCEA'],
                text: '#2C3E50',
                primary: '#6C91C2',
                secondary: '#B4C7E7'
            },
            dusk: {
                sky: ['#E6A4B4', '#D3869B', '#4A4E69'],
                text: '#ECF0F1',
                primary: '#D3869B',
                secondary: '#4A4E69'
            },
            night: {
                sky: ['#1A2B3C', '#2C3E50'],
                text: '#ECF0F1',
                primary: '#4A6670',
                secondary: '#2C3E50'
            }
        };
        
        return colors[this.timeOfDay];
    }

    drawSkyGradient() {
        const colors = this.getTimeColors();
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        colors.sky.forEach((color, index) => {
            gradient.addColorStop(index / (colors.sky.length - 1), color);
        });
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStars() {
        if (this.timeOfDay === 'night') {
            this.ctx.save();
            this.stars.forEach(star => {
                star.twinkle += 0.05;
                const opacity = (Math.sin(star.twinkle) + 1) / 2;
                
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            this.ctx.restore();
        }
    }

    animate() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const draw = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw sky
            this.drawSkyGradient();
            
            // Draw stars if night
            this.drawStars();
            
            // Update and draw clouds
            this.clouds.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > this.canvas.width + cloud.width) {
                    cloud.x = -cloud.width;
                }
                this.drawCloud(cloud);
            });
            
            // Draw birds during day
            if (this.timeOfDay === 'day' && this.weather === 'clear') {
                this.birds.forEach(bird => {
                    bird.x += bird.speed;
                    if (bird.x > this.canvas.width + bird.size) {
                        bird.x = -bird.size;
                    }
                    this.drawBird(bird);
                });
            }
            
            // Draw weather effects
            if (this.weather === 'rain' || this.weather === 'storm') {
                this.drawRain();
            }
            
            if (this.weather === 'storm') {
                this.drawLightning();
            }

            this.animationFrame = requestAnimationFrame(draw);
        };

        draw();
    }

    setThemeColors() {
        const colors = this.getTimeColors();
        const root = document.documentElement;
        
        // Add transition class
        document.body.classList.add('theme-transitioning');
        
        // Update colors
        root.style.setProperty('--bg-color', colors.sky[0]);
        root.style.setProperty('--text-color', colors.text);
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--secondary-color', colors.secondary);
        
        // Update UI elements
        this.updateUIElements(colors);
        
        // Remove transition class
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    updateUIElements(colors) {
        // Apply glass effect to UI elements
        const elements = {
            '.navbar': { opacity: 0.9, blur: 10 },
            '.search-box': { opacity: 0.8, blur: 8 },
            '.category-btn': { opacity: 0.7, blur: 5 },
            '.footer': { opacity: 0.9, blur: 10 }
        };
        
        Object.entries(elements).forEach(([selector, props]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.background = `rgba(${this.hexToRgb(colors.sky[0])}, ${props.opacity})`;
                element.style.backdropFilter = `blur(${props.blur}px)`;
                element.style.transition = 'all 0.3s ease';
            }
        });
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    }

    startTimeLoop() {
        // Automatically cycle through times of day
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to change time
                this.toggleTimeOfDay();
            }
        }, 30000); // Every 30 seconds
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