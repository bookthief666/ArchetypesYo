// ============================================================================
// SACRED GEOMETRY BACKGROUND - Animated Metatron's Cube
// ============================================================================

import React, { useRef, useEffect, memo } from 'react';
import { prefersReducedMotion } from '../lib/utils';

const SacredGeometry = memo(({ accent = '#ffd700', opacity = 0.4 }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let time = 0;
    
    const reducedMotion = prefersReducedMotion();
    const animationSpeed = reducedMotion ? 0 : 0.005;

    // Draw hexagon
    const drawHex = (x, y, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.stroke();
    };

    // Draw circle
    const drawCircle = (x, y, r) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Main animation loop
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#1a0b2e';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.strokeStyle = accent;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = opacity;

      // Rotating Metatron's Cube
      const baseRadius = 150;
      const pulseRadius = baseRadius + Math.sin(time * 2) * 20;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.2);

      // Central hexagon
      drawHex(0, 0, pulseRadius);

      // Outer circles and connecting lines (Flower of Life pattern)
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const x = pulseRadius * Math.cos(angle);
        const y = pulseRadius * Math.sin(angle);

        // Circle at hexagon vertex
        drawCircle(x, y, 20);

        // Line from center to vertex
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Connect adjacent circles
        const nextAngle = ((i + 1) % 6) * Math.PI / 3;
        const nextX = pulseRadius * Math.cos(nextAngle);
        const nextY = pulseRadius * Math.sin(nextAngle);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();
      }

      // Inner sacred geometry
      ctx.globalAlpha = opacity * 0.5;
      drawHex(0, 0, pulseRadius * 0.5);
      drawCircle(0, 0, pulseRadius * 0.5);

      ctx.restore();

      // Secondary rotating element in corner
      ctx.save();
      ctx.translate(width - 150, height - 150);
      ctx.rotate(-time * 0.3);
      ctx.globalAlpha = opacity * 0.3;
      drawHex(0, 0, 60 + Math.sin(time * 3) * 10);
      ctx.restore();

      // Update time
      time += animationSpeed;

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [accent, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      aria-hidden="true"
    />
  );
});

SacredGeometry.displayName = 'SacredGeometry';

export default SacredGeometry;
