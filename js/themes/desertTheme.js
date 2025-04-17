class DesertTheme {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.time = 0;
        this.dunes = [];
    }

    initialize() {
        this.setupCanvas();
        this.createDunes();
        this.animate();
        this.setThemeColors();
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
        this.createDunes(); // Recreate dunes when canvas is resized
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

    animate() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const draw = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.time += 0.01;

            // Draw each dune layer
            this.dunes.forEach(dune => {
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.canvas.height);

                // Draw dune curve
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

                // Complete the dune shape
                this.ctx.lineTo(this.canvas.width, this.canvas.height);
                this.ctx.lineTo(0, this.canvas.height);
                
                // Fill the dune
                this.ctx.fillStyle = dune.color;
                this.ctx.fill();
            });

            this.animationFrame = requestAnimationFrame(draw);
        };

        draw();
    }

    setThemeColors() {
        document.documentElement.style.setProperty('--bg-color', '#F4A460');
        document.documentElement.style.setProperty('--text-color', '#8B4513');
        document.documentElement.style.setProperty('--primary-color', '#D2691E');
        document.documentElement.style.setProperty('--secondary-color', '#DEB887');
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