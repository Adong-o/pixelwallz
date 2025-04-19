class DesertTheme {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.time = 0;
        this.dunes = [];
        this.sandParticles = [];
        this.timeOfDay = 'day'; // day, sunset, night, sunrise
        this.lastTimeChange = Date.now();
        this.mirages = [];
        this.oasisElements = [];
        this.mousePos = { x: 0, y: 0 };
    }

    initialize() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createDunes();
        this.createSandParticles();
        this.createMirages();
        this.createOasis();
        this.startTimeLoop();
        this.animate();
        this.setThemeColors();
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            // Affect nearby sand particles
            this.sandParticles.forEach(particle => {
                const dx = particle.x - this.mousePos.x;
                const dy = particle.y - this.mousePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    particle.vx += dx / distance * 0.5;
                    particle.vy += dy / distance * 0.5;
                }
            });
        });
    }

    setupCanvas() {
        // Remove existing canvas if any
        const existingCanvas = document.getElementById('desert-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        // Create and setup canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'desert-canvas';
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
        this.createDunes();
        this.createSandParticles();
        this.createMirages();
        this.createOasis();
    }

    createDunes() {
        this.dunes = [];
        const numDunes = 3; // Number of dune layers
        
        for (let i = 0; i < numDunes; i++) {
            const points = [];
            const segments = 10;
            const height = this.canvas.height * (0.3 + (i * 0.2));
            const amplitude = 50 - (i * 10);
            const speed = 0.001 - (i * 0.0002);
            
            for (let j = 0; j <= segments; j++) {
                points.push({
                    x: (this.canvas.width * j) / segments,
                    y: height,
                    amplitude: amplitude,
                    speed: speed
                });
            }
            
            this.dunes.push({
                points: points,
                color: `rgba(194, 178, 128, ${0.6 - i * 0.15})`
            });
        }
    }

    createSandParticles() {
        this.sandParticles = [];
        const numParticles = Math.floor(this.canvas.width * this.canvas.height / 10000);
        
        for (let i = 0; i < numParticles; i++) {
            this.sandParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    createMirages() {
        this.mirages = [];
        const numMirages = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numMirages; i++) {
            this.mirages.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height * 0.7 + Math.random() * 100,
                width: Math.random() * 200 + 100,
                height: Math.random() * 50 + 25,
                alpha: 0,
                targetAlpha: Math.random() * 0.3 + 0.1
            });
        }
    }

    createOasis() {
        this.oasisElements = [];
        const centerX = this.canvas.width * 0.8;
        const centerY = this.canvas.height * 0.6;
        
        // Add palm trees
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            this.oasisElements.push({
                type: 'palm',
                x: centerX + Math.cos(angle) * 50,
                y: centerY + Math.sin(angle) * 50,
                swayOffset: Math.random() * Math.PI * 2
            });
        }
        
        // Add water pool
        this.oasisElements.push({
            type: 'pool',
            x: centerX,
            y: centerY,
            radius: 30,
            ripples: []
        });
    }

    startTimeLoop() {
        setInterval(() => {
            const times = ['day', 'sunset', 'night', 'sunrise'];
            const currentIndex = times.indexOf(this.timeOfDay);
            this.timeOfDay = times[(currentIndex + 1) % times.length];
            this.setThemeColors();
        }, 30000); // Change every 30 seconds
    }

    getSkyGradient() {
        const gradients = {
            day: ['#87CEEB', '#E6F3FF'],
            sunset: ['#FF7F50', '#FFB6C1'],
            night: ['#000033', '#191970'],
            sunrise: ['#FF8C00', '#FFE4B5']
        };
        return gradients[this.timeOfDay];
    }

    animate() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const draw = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.time += 0.01;

            // Draw sky gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            const colors = this.getSkyGradient();
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1]);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw dunes
            this.dunes.forEach(dune => {
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.canvas.height);

                dune.points.forEach((point, index) => {
                    point.y = point.y + Math.sin(this.time * point.speed + index) * point.amplitude;
                    
                    if (index === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        const xc = (point.x + dune.points[index - 1].x) / 2;
                        const yc = (point.y + dune.points[index - 1].y) / 2;
                        this.ctx.quadraticCurveTo(dune.points[index - 1].x, dune.points[index - 1].y, xc, yc);
                    }
                });

                this.ctx.lineTo(this.canvas.width, this.canvas.height);
                this.ctx.lineTo(0, this.canvas.height);
                this.ctx.fillStyle = dune.color;
                this.ctx.fill();
            });

            // Update and draw sand particles
            this.sandParticles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;

                // Apply drag
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(194, 178, 128, ${particle.alpha})`;
                this.ctx.fill();
            });

            // Draw mirages
            this.mirages.forEach(mirage => {
                mirage.alpha += (mirage.targetAlpha - mirage.alpha) * 0.01;
                const gradient = this.ctx.createLinearGradient(
                    mirage.x, mirage.y - mirage.height,
                    mirage.x, mirage.y + mirage.height
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${mirage.alpha})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(
                    mirage.x - mirage.width / 2,
                    mirage.y - mirage.height,
                    mirage.width,
                    mirage.height * 2
                );
            });

            // Draw oasis
            this.oasisElements.forEach(element => {
                if (element.type === 'palm') {
                    this.drawPalmTree(element);
                } else if (element.type === 'pool') {
                    this.drawWaterPool(element);
                }
            });

            this.animationFrame = requestAnimationFrame(draw);
        };

        draw();
    }

    drawPalmTree(palm) {
        const sway = Math.sin(this.time + palm.swayOffset) * 10;
        
        // Draw trunk
        this.ctx.beginPath();
        this.ctx.moveTo(palm.x, palm.y);
        this.ctx.quadraticCurveTo(
            palm.x + sway, palm.y - 30,
            palm.x + sway, palm.y - 60
        );
        this.ctx.strokeStyle = '#4B3621';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();

        // Draw leaves
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + this.time * 0.1;
            const leafLength = 30;
            
            this.ctx.beginPath();
            this.ctx.moveTo(palm.x + sway, palm.y - 60);
            this.ctx.quadraticCurveTo(
                palm.x + sway + Math.cos(angle) * leafLength,
                palm.y - 60 + Math.sin(angle) * leafLength,
                palm.x + sway + Math.cos(angle) * leafLength * 2,
                palm.y - 60 + Math.sin(angle) * leafLength * 2
            );
            this.ctx.strokeStyle = '#228B22';
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }
    }

    drawWaterPool(pool) {
        // Add new ripples occasionally
        if (Math.random() < 0.05) {
            pool.ripples.push({
                radius: 0,
                alpha: 0.5
            });
        }

        // Draw base pool
        this.ctx.beginPath();
        this.ctx.arc(pool.x, pool.y, pool.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4B9CD3';
        this.ctx.fill();

        // Update and draw ripples
        pool.ripples = pool.ripples.filter(ripple => {
            ripple.radius += 0.5;
            ripple.alpha *= 0.95;

            this.ctx.beginPath();
            this.ctx.arc(pool.x, pool.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha})`;
            this.ctx.stroke();

            return ripple.alpha > 0.01;
        });
    }

    setThemeColors() {
        const themes = {
            day: {
                bg: '#F4A460',
                text: '#8B4513',
                primary: '#D2691E',
                secondary: '#DEB887'
            },
            sunset: {
                bg: '#FF8C69',
                text: '#8B3626',
                primary: '#CD6839',
                secondary: '#EE9A49'
            },
            night: {
                bg: '#4A4A4A',
                text: '#E6E6FA',
                primary: '#483D8B',
                secondary: '#6A5ACD'
            },
            sunrise: {
                bg: '#FFA07A',
                text: '#8B3E2F',
                primary: '#CD6839',
                secondary: '#EE9A49'
            }
        };

        const colors = themes[this.timeOfDay];
        document.documentElement.style.setProperty('--bg-color', colors.bg);
        document.documentElement.style.setProperty('--text-color', colors.text);
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    }

    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        const canvas = document.getElementById('desert-canvas');
        if (canvas) {
            canvas.remove();
        }
    }
}

export default DesertTheme; 