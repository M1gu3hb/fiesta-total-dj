import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import SectionTitle from "./SectionTitle";
import { GALLERY_VIDEOS } from "@/lib/galleryVideos";
import GalleryVideoCard from "./GalleryVideoCard";
import GalleryVideoModal from "./GalleryVideoModal";
import useVideoPreloader from "@/lib/useVideoPreloader";

/*
  GallerySection — collage + precarga progresiva por etapas.

  Etapas de precarga:
    Stage 0 — primeros 4 videos. Disparada en idle tras mount (requestIdleCallback)
              o tras 2.5s desde mount como fallback.
    Stage 1 — videos 5 a 8. Disparada cuando el usuario hace su primer scroll
              (señal de que está explorando).
    Stage 2 — videos 9 a 14 (resto). Disparada cuando la sección de galería
              entra a 1200px del viewport (IntersectionObserver con rootMargin).

  Mientras tanto:
    - Cards usan preload="metadata" (descarga mínima inicial).
    - Cards visibles reproducen muted/loop vía IntersectionObserver propio.
    - Modal usa el src ya cacheado por el preloader → abre rápido.
*/
export default function GallerySection() {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);

  // Construir stages SOLO con videos (las imágenes no requieren precarga progresiva).
  const urls = useMemo(
    () => GALLERY_VIDEOS.filter((v) => v.type !== "image").map((v) => v.url),
    []
  );
  const stages = useMemo(
    () => [
      urls.slice(0, 4),   // Stage 0
      urls.slice(4, 8),   // Stage 1
      urls.slice(8),      // Stage 2
    ],
    [urls]
  );

  const { preloadStage, getStatus } = useVideoPreloader(urls, {
    maxConcurrent: 2,
    stages,
  });

  // Stage 0 — al montar, en idle
  useEffect(() => {
    const start = () => preloadStage(0);
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(start, 2500);
    return () => clearTimeout(t);
  }, [preloadStage]);

  // Stage 1 — primer scroll del usuario
  useEffect(() => {
    let triggered = false;
    const onScroll = () => {
      if (triggered) return;
      triggered = true;
      preloadStage(1);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [preloadStage]);

  // Stage 2 — la sección está cerca del viewport (1200px)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            preloadStage(2);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "1200px 0px 1200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [preloadStage]);

  const handleOpen = useCallback((item) => setActive(item), []);
  const handleClose = useCallback(() => setActive(null), []);

  return (
    <section
      ref={sectionRef}
      id="galeria"
      className="relative z-10 py-16 md:py-24 px-3 sm:px-4"
    >
      <SectionTitle
        title="Evidencia visual de nuestros eventos"
        subtitle="Videos reales de nuestros montajes, shows y eventos."
      />

      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          grid-auto-flow: dense;
        }
        @media (min-width: 640px) {
          .gallery-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
          }
        }
        @media (min-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="gallery-grid">
          {GALLERY_VIDEOS.map((item, i) => {
            const isFeature = i > 0 && (i + 1) % 5 === 0;
            return (
              <GalleryVideoCard
                key={i}
                item={item}
                feature={isFeature}
                onOpen={() => handleOpen(item)}
              />
            );
          })}
        </div>
      </div>

      <GalleryVideoModal
        item={active}
        onClose={handleClose}
        getStatus={getStatus}
      />
    </section>
  );
}