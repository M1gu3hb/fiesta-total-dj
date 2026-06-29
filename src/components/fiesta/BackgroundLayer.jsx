import React, { useEffect, useRef } from "react";

export default function BackgroundLayer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const count = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fill();

        if (!prefersReduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.15) 0%, rgba(10,10,20,1) 70%)",
        }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Radial glow center */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}