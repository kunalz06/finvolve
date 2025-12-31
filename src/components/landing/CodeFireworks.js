"use client";

import { useEffect, useRef } from 'react';

export default function CodeFireworks() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const symbols = ['{', '}', '<', '>', '/', ';', '0', '1', 'WAIT', 'CODE'];
        const colors = ['#6366F1', '#A855F7', '#EC4899', '#10B981', '#F59E0B'];

        let particles = [];

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                const angle = Math.random() * Math.PI * 2;
                // Flower petal shape calculation could be complex, simple radial burst for now with trailing
                const velocity = Math.random() * 4 + 2;
                this.vx = Math.cos(angle) * velocity;
                this.vy = Math.sin(angle) * velocity;
                this.alpha = 1;
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.size = Math.random() * 14 + 10;
                this.decay = Math.random() * 0.015 + 0.005;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.05; // gravity
                this.vx *= 0.98; // air resistance
                this.vy *= 0.98;
                this.alpha -= this.decay;
            }

            draw(ctx) {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.font = `bold ${this.size}px monospace`;
                ctx.fillText(this.symbol, this.x, this.y);
            }
        }

        const createFirework = (x, y) => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            // Create a "flower" burst
            for (let i = 0; i < 40; i++) {
                particles.push(new Particle(x, y, color));
            }
        };

        // Auto launch some fireworks
        let timer = 0;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Random launch
            if (timer % 40 === 0 && Math.random() > 0.5) {
                createFirework(
                    Math.random() * width,
                    height / 2 + (Math.random() * height / 3)
                );
            }
            timer++;

            particles = particles.filter(p => p.alpha > 0);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
