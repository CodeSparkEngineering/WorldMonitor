import { useEffect, useRef } from 'react';

interface Point {
    x: number;
    y: number;
    z: number;
    x2d: number;
    y2d: number;
}

export default function TacticalGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = 600;
        let height = canvas.height = 600;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 220;

        // Generate points for the sphere
        const points: Point[] = [];
        const pointCount = 600;
        for (let i = 0; i < pointCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / pointCount);
            const theta = Math.sqrt(pointCount * Math.PI) * phi;

            points.push({
                x: radius * Math.cos(theta) * Math.sin(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(phi),
                x2d: 0,
                y2d: 0
            });
        }

        let rotationX = 0;
        let rotationY = 0;
        const rotationSpeedX = 0.002;
        const rotationSpeedY = 0.005;

        function project(p: Point) {
            // Rotate around X axis
            const x1 = p.x;
            const y1 = p.y * Math.cos(rotationX) - p.z * Math.sin(rotationX);
            const z1 = p.y * Math.sin(rotationX) + p.z * Math.cos(rotationX);

            // Rotate around Y axis
            const x2 = x1 * Math.cos(rotationY) + z1 * Math.sin(rotationY);
            const y2 = y1;
            const z2 = -x1 * Math.sin(rotationY) + z1 * Math.cos(rotationY);

            // Perspective projection
            const perspective = 600;
            const scale = perspective / (perspective + z2);
            p.x2d = x2 * scale + centerX;
            p.y2d = y2 * scale + centerY;

            return z2; // Return depth for shading
        }

        function draw() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);

            // Draw Glow
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
            gradient.addColorStop(0, 'rgba(254, 240, 138, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            rotationX += rotationSpeedX;
            rotationY += rotationSpeedY;

            // Sort points by depth for transparency effects (optional but better)
            points.sort((a, b) => project(b) - project(a));

            points.forEach(p => {
                const z = project(p);
                const alpha = Math.max(0.1, (z + radius) / (2 * radius));
                const size = Math.max(0.5, (z + radius) / (radius * 1.5));

                ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x2d, p.y2d, size, 0, Math.PI * 2);
                ctx.fill();

                // Occasional connection lines for "Intelligence Network" feel
                if (Math.random() > 0.99) {
                    const target = points[Math.floor(Math.random() * points.length)];
                    if (target) {
                        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.2})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x2d, p.y2d);
                        ctx.lineTo(target.x2d, target.y2d);
                        ctx.stroke();
                    }
                }
            });

            // Draw Rings/Atmosphere
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
            ctx.setLineDash([5, 15]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Scanlines/HUD overlay
            requestAnimationFrame(draw);
        }

        draw();

        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
            <canvas
                ref={canvasRef}
                className="max-w-full max-h-full"
            />
            {/* Tactical Hexagon Overlay (CSS) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(9,9,11,0.8)_80%)]" />
        </div>
    );
}
