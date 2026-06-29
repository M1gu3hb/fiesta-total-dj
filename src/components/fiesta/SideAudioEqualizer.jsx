import React, { useEffect, useRef } from "react";
import { useMusicState } from "@/lib/MusicContext";

// Número de segmentos del barómetro
const SEG_MOBILE = 10;
const SEG_DESKTOP = 16;

export default function SideAudioEqualizer() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const { isPlaying } = useMusicState();
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isMobile = window.innerWidth < 768;
    const segCount = isMobile ? SEG_MOBILE : SEG_DESKTOP;
    const barW = isMobile ? 2 : 3;
    const gap = isMobile ? 3 : 4;

    const createBars = (container) => {
      if (!container) return;
      container.innerHTML = "";
      for (let i = 0; i < segCount; i++) {
        const wrap = document.createElement("div");
        wrap.style.cssText = `
          width: ${barW}px;
          height: ${gap + barW}px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        const dot = document.createElement("div");
        dot.style.cssText = `
          width: ${barW}px;
          height: ${barW}px;
          border-radius: 99px;
          background: rgba(168,85,247,0.5);
          transition: height 0.18s cubic-bezier(.4,0,.2,1), opacity 0.18s ease, box-shadow 0.18s ease;
        `;
        wrap.appendChild(dot);
        container.appendChild(wrap);
      }
    };

    createBars(leftRef.current);
    createBars(rightRef.current);

    let animId;
    const animate = () => {
      const t = Date.now() * 0.0018;
      const active = isPlayingRef.current;

      const containers = [leftRef.current, rightRef.current];
      containers.forEach((cont, ci) => {
        if (!cont) return;
        const wraps = cont.children;
        for (let i = 0; i < wraps.length; i++) {
          const dot = wraps[i].firstChild;
          if (!dot) continue;

          const phase = ci === 0 ? 0 : Math.PI * 0.4;
          // Normalized position 0-1 along the column
          const norm = i / (wraps.length - 1);
          // Bell-curve shape: taller in middle
          const bell = Math.sin(norm * Math.PI);

          let height, opacity;
          if (active) {
            const wave =
              Math.sin(t * 2.2 + i * 0.55 + phase) * 0.35 +
              Math.sin(t * 3.5 + i * 0.9 + phase) * 0.18 +
              Math.random() * 0.12;
            const level = Math.max(0.08, Math.min(1, bell * 0.6 + wave + 0.25));
            height = Math.round(level * (wraps[i].offsetHeight || (gap + barW)));
            opacity = 0.55 + level * 0.45;
          } else {
            // Gentle idle pulse
            const idle =
              Math.sin(t * 0.7 + i * 0.4 + phase) * 0.12 +
              Math.sin(t * 1.1 + i * 0.6 + phase) * 0.07;
            const level = Math.max(0.05, bell * 0.25 + idle + 0.1);
            height = Math.round(level * (wraps[i].offsetHeight || (gap + barW)));
            opacity = 0.2 + level * 0.3;
          }

          const h = Math.max(barW, Math.min(gap + barW, height || barW));
          const glow = active
            ? `0 0 ${4 + opacity * 5}px rgba(168,85,247,${(opacity * 0.7).toFixed(2)})`
            : "none";

          dot.style.height = `${h}px`;
          dot.style.opacity = `${opacity.toFixed(2)}`;
          dot.style.boxShadow = glow;

          // Color shift: purple → magenta when high
          const r = Math.round(168 + (217 - 168) * (opacity - 0.5));
          const g = Math.round(85 + (70 - 85) * (opacity - 0.5));
          const b = Math.round(247 + (239 - 247) * (opacity - 0.5));
          dot.style.background = `rgba(${r},${g},${b},${Math.min(0.9, opacity)})`;
        }
      });

      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const side =
    "fixed top-0 z-30 pointer-events-none flex flex-col items-center justify-center";

  return (
    <>
      <div ref={leftRef}  data-side-equalizer className={`${side} left-0.5 md:left-1 h-full w-2 md:w-3`} />
      <div ref={rightRef} data-side-equalizer className={`${side} right-0.5 md:right-1 h-full w-2 md:w-3`} />
    </>
  );
}