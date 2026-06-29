import React, { useRef, useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { Disc3, Speaker, Lightbulb, LayoutGrid, Monitor, Sparkles, Zap, Music, Star } from "lucide-react";

const SLIDES = [
  {
    label: "Cabinas DJ",
    icon: Disc3,
    accent: "#a855f7",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/7ecdfd7c9_generated_image.png",
  },
  {
    label: "Pistas LED",
    icon: LayoutGrid,
    accent: "#8b5cf6",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/d108cedd6_pista2.jpg",
  },
  {
    label: "Pantallas LED",
    icon: Monitor,
    accent: "#c026d3",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/090bc0b3f_Pantalla3.jpg",
  },
  {
    label: "Iluminación robótica",
    icon: Lightbulb,
    accent: "#d946ef",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/ddb2d4857_generated_image.png",
  },
  {
    label: "Bodas y XV años",
    icon: Star,
    accent: "#a855f7",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/862449efa_generated_image.png",
  },
  {
    label: "Show de cabezones",
    icon: Sparkles,
    accent: "#d946ef",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/a5f2b2377_Showcabezones2.jpeg",
    bgPosition: "center 20%",
  },
  {
    label: "Shows interactivos",
    icon: Zap,
    accent: "#8b5cf6",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/9c6bdcde1_Showsinteractivos2.jpg",
  },
  {
    label: "Producción integral",
    icon: Speaker,
    accent: "#a855f7",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/d4b38d783_iluminacionarquitectonica3.jpg",
  },
  {
    label: "Eventos sociales",
    icon: Music,
    accent: "#c026d3",
    bg: "/media/images/public/69f263dc709c74ed7d2f8111/f8e4b5616_generated_image.png",
  },
];

const ITEMS = [...SLIDES, ...SLIDES, ...SLIDES];

const CARD_W = 220;
const CARD_H = 300;
const GAP    = 20;
const STEP   = CARD_W + GAP;
const SPEED  = 1.75;

function CarouselCard({ item, offset, total }) {
  const Icon = item.icon;
  const norm    = offset / (total * STEP * 0.5);
  const absNorm = Math.abs(norm);
  const scale   = 1 - absNorm * 0.28;
  const rotateY = norm * 38;
  const z       = (1 - absNorm) * 80;
  const opacity = 1 - absNorm * 0.55;

  return (
    <div
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        left: "50%",
        top: "50%",
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_H / 2,
        transform: `translateX(${offset}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        willChange: "transform, opacity",
        cursor: "grab",
        borderRadius: 16,
        border: `1px solid ${item.accent}55`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        userSelect: "none",
        boxShadow: `0 0 30px ${item.accent}35`,
      }}
    >
      {/* Background — cover fills the whole card */}
      {item.bg && (
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${item.bg})`,
          backgroundSize: "cover",
          backgroundPosition: item.bgPosition || "center",
          filter: "brightness(1.35) contrast(1.08) saturate(1.15)",
        }} />
      )}

      {/* Dark overlay — lighter than before so image is more visible */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(160deg, rgba(8,5,18,0.48) 0%, rgba(15,5,35,0.62) 100%)`,
      }} />

      {/* Accent glow blob */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 20%, ${item.accent}22 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      {/* Corner accents */}
      <div style={{ position:"absolute", top:10, left:10, width:14, height:14,
        borderTop:`1px solid ${item.accent}70`, borderLeft:`1px solid ${item.accent}70`, borderRadius:"4px 0 0 0" }} />
      <div style={{ position:"absolute", top:10, right:10, width:14, height:14,
        borderTop:`1px solid ${item.accent}70`, borderRight:`1px solid ${item.accent}70`, borderRadius:"0 4px 0 0" }} />
      <div style={{ position:"absolute", bottom:10, left:10, width:14, height:14,
        borderBottom:`1px solid ${item.accent}70`, borderLeft:`1px solid ${item.accent}70`, borderRadius:"0 0 0 4px" }} />
      <div style={{ position:"absolute", bottom:10, right:10, width:14, height:14,
        borderBottom:`1px solid ${item.accent}70`, borderRight:`1px solid ${item.accent}70`, borderRadius:"0 0 4px 0" }} />

      {/* Icon */}
      <div style={{
        position: "relative",
        width: 52, height: 52, borderRadius: 13,
        background: `${item.accent}28`,
        border: `1px solid ${item.accent}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 20px ${item.accent}45`,
      }}>
        <Icon size={24} style={{ color: item.accent, filter: `drop-shadow(0 0 8px ${item.accent}99)` }} />
      </div>

      {/* Label */}
      <div style={{ position: "relative", textAlign: "center", padding: "0 16px" }}>
        <p style={{
          color: "rgba(255,255,255,0.97)",
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.04em",
          lineHeight: 1.3,
          marginBottom: 6,
          textShadow: "0 1px 8px rgba(0,0,0,0.9)",
        }}>
          {item.label}
        </p>
      </div>

      {/* Bottom glow line */}
      <div style={{
        position: "absolute", bottom: 0, left: "15%", right: "15%", height: 1,
        background: `linear-gradient(90deg, transparent, ${item.accent}80, transparent)`,
      }} />
    </div>
  );
}

export default function ShowcaseCarouselSection() {
  const offsetRef   = useRef(0);
  const loopRef     = useRef(null);
  const dragRef     = useRef({ dragging: false, lastX: 0, lastY: 0, velocity: 0, isHorizontal: null });
  const [tick, setTick] = useState(0);

  const totalW = SLIDES.length * STEP;

  useEffect(() => {
    let lastTime = null;

    const loop = (ts) => {
      if (!lastTime) lastTime = ts;
      const dt = Math.min(ts - lastTime, 32);
      lastTime = ts;

      const d = dragRef.current;
      if (!d.dragging) {
        d.velocity *= 0.88;
        offsetRef.current -= SPEED * (dt / 16) + d.velocity;
      }

      if (offsetRef.current < -totalW) offsetRef.current += totalW;
      if (offsetRef.current > 0)       offsetRef.current -= totalW;

      setTick(t => (t + 1) & 0xffff);
      loopRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [totalW]);

  // ── Mouse handlers (desktop — no scroll conflict) ──────────────
  const onMouseDown = (e) => {
    dragRef.current.dragging = true;
    dragRef.current.lastX    = e.clientX;
    dragRef.current.velocity = 0;
    dragRef.current.isHorizontal = null;
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.lastX    = e.clientX;
    dragRef.current.velocity = -dx * 0.4;
    offsetRef.current += dx;
  };
  const onMouseUp = () => { dragRef.current.dragging = false; dragRef.current.isHorizontal = null; };

  // ── Touch handlers — direction-aware ───────────────────────────
  const onTouchStart = (e) => {
    const t = e.touches[0];
    dragRef.current.dragging = true;
    dragRef.current.lastX    = t.clientX;
    dragRef.current.lastY    = t.clientY;
    dragRef.current.velocity = 0;
    dragRef.current.isHorizontal = null; // undecided until first move
  };

  const onTouchMove = (e) => {
    if (!dragRef.current.dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.lastX;
    const dy = t.clientY - dragRef.current.lastY;

    // Determine direction on first significant move
    if (dragRef.current.isHorizontal === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      dragRef.current.isHorizontal = Math.abs(dx) > Math.abs(dy);
    }

    if (dragRef.current.isHorizontal) {
      // Horizontal swipe — take control, prevent page scroll
      e.preventDefault();
      dragRef.current.lastX    = t.clientX;
      dragRef.current.lastY    = t.clientY;
      dragRef.current.velocity = -dx * 0.4;
      offsetRef.current += dx;
    } else {
      // Vertical scroll — release drag so page can scroll freely
      dragRef.current.dragging = false;
    }
  };

  const onTouchEnd = () => { dragRef.current.dragging = false; dragRef.current.isHorizontal = null; };

  const visibleRadius = CARD_W * 4.5;

  const visibleItems = ITEMS.map((item, i) => {
    const rawOffset = i * STEP + offsetRef.current;
    let off = ((rawOffset % (totalW * 3)) + totalW * 3) % (totalW * 3) - totalW * 1.5;
    if (Math.abs(off) > visibleRadius) return null;
    return { item, off, i };
  }).filter(Boolean);

  return (
    <section className="relative z-10 py-16 md:py-24" style={{ overflowX: "clip", maxWidth: "100%" }}>
      <SectionTitle
        title="Así se vive la experiencia Fiesta Total"
        subtitle="Montajes, iluminación, energía y producción pensados para impactar."
      />

      <div
        className="relative mx-auto select-none"
        style={{
          height: CARD_H + 40,
          maxWidth: "100vw",
          perspective: "900px",
          perspectiveOrigin: "50% 50%",
          overflow: "hidden",
          // touch-action: pan-y so browser handles vertical scroll by default;
          // we call e.preventDefault() in onTouchMove only when horizontal
          touchAction: "pan-y",
          cursor: dragRef.current.dragging ? "grabbing" : "grab",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Side fade masks */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0a0a14 0%, transparent 100%)" }} />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0a0a14 0%, transparent 100%)" }} />

        {/* 3D stage */}
        <div style={{
          position: "absolute", inset: 0,
          transformStyle: "preserve-3d",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {visibleItems.map(({ item, off, i }) => (
            <CarouselCard key={i} item={item} offset={off} total={ITEMS.length} />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {SLIDES.map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-neon-purple/30" />
        ))}
      </div>
    </section>
  );
}