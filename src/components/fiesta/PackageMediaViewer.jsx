import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PackageMediaSlide from "./PackageMediaSlide";

/*
  PackageMediaViewer — visor vertical mobile-first OPTIMIZADO.

  Cambios clave de performance vs versión anterior:
  - UN SOLO IntersectionObserver (antes había uno por slide → mucho overhead).
  - Mantiene activeIndex en estado, los slides reciben isActive/near como props.
  - Solo el slide activo y sus vecinos inmediatos (±1) montan <video> real.
  - Slides lejanos renderizan un placeholder estático (no descarga, no decodificación).
  - Slides memoizados → re-renders mínimos al hacer scroll.
*/
export default function PackageMediaViewer({ media, modalOpen }) {
  const scrollRef = useRef(null);
  const slidesRef = useRef([]); // refs a cada slide DOM node
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Reset scroll + activeIndex cada vez que abre
  useEffect(() => {
    if (!modalOpen) {
      setShowHint(false);
      setActiveIndex(0);
      return;
    }
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = 0;
        setActiveIndex(0);
        setShowHint(media.length > 1);
      });
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, [modalOpen, media.length]);

  // Auto-fade del hint
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => clearTimeout(t);
  }, [showHint]);

  // UN SOLO IntersectionObserver para todos los slides
  useEffect(() => {
    if (!modalOpen) return;
    const root = scrollRef.current;
    if (!root) return;

    // Mapa: slide DOM → índice
    const indexMap = new WeakMap();
    slidesRef.current.forEach((el, i) => {
      if (el) indexMap.set(el, i);
    });

    let bestIndex = 0;
    let bestRatio = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        // Recalcular: encontrar el slide con mayor ratio visible
        for (const entry of entries) {
          const idx = indexMap.get(entry.target);
          if (idx === undefined) continue;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = idx;
          }
        }
        // Solo actualizar si el slide ≥60% es uno nuevo
        if (bestRatio >= 0.6) {
          setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
        }
        // Reset para el siguiente batch
        bestRatio = 0;
      },
      {
        root,
        threshold: [0.5, 0.6, 0.75],
      }
    );

    slidesRef.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [modalOpen, media.length]);

  const setSlideRef = useCallback((i) => (el) => {
    slidesRef.current[i] = el;
  }, []);

  const onScroll = useCallback(() => {
    if (showHint) setShowHint(false);
  }, [showHint]);

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="h-full overflow-y-auto px-2 md:px-4"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {media.map((item, i) => {
          const isActive = i === activeIndex;
          const near = Math.abs(i - activeIndex) <= 1;
          return (
            <div key={i} ref={setSlideRef(i)}>
              <PackageMediaSlide
                item={item}
                modalOpen={modalOpen}
                isActive={isActive}
                near={near}
              />
            </div>
          );
        })}
      </div>

      {/* "Desliza para ver más" — premium neón, mobile-first */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(10,5,22,0.88)",
              border: "1px solid rgba(168,85,247,0.55)",
              boxShadow:
                "0 0 18px rgba(168,85,247,0.4), 0 4px 14px rgba(0,0,0,0.55)",
            }}
          >
            <span
              className="text-[12px] font-display font-semibold tracking-wide text-white"
              style={{ textShadow: "0 0 8px rgba(168,85,247,0.6)" }}
            >
              Desliza para ver fotos y videos
            </span>
            <ChevronDown
              size={15}
              className="text-neon-purple animate-bounce"
              style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.9))" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}