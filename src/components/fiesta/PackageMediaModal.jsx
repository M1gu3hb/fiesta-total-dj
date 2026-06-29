import React, { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { getPackageMedia } from "@/lib/packageMedia";
import PackageMediaViewer from "./PackageMediaViewer";

/*
  PackageMediaModal — overlay full-screen mobile-first.
  - Antes de abrir, hace scrollIntoView del paquete (triggerRef) para que el
    usuario quede bien posicionado al cerrar.
  - Bloquea scroll del fondo (body fixed, restaura scrollY al cerrar).
  - Cierra con X grande, click en overlay o tecla Escape.
  - Contenido se delega a PackageMediaViewer (visor vertical scroll-snap).

  Props:
    open        — boolean
    onClose     — () => void
    pkg         — objeto paquete (usa pkg.name y pkg.mediaKey)
    triggerRef  — opcional, ref del PackageCard que abrió el modal
*/
export default function PackageMediaModal({ open, onClose, pkg, triggerRef }) {
  const media = pkg ? getPackageMedia(pkg.mediaKey) : [];
  const hasMedia = media.length > 0;
  const savedScrollY = useRef(0);

  // ── Scroll lock + scroll-into-view del paquete ────────────────
  useEffect(() => {
    if (!open) return;

    // 1) Mover la vista al paquete seleccionado ANTES de bloquear el scroll
    //    (así al cerrar, restauramos esa posición — el usuario queda donde lo abrió).
    const trigger = triggerRef?.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const target = window.scrollY + rect.top - 80; // 80px de respiro arriba
      window.scrollTo({ top: Math.max(0, target), behavior: "auto" });
    }

    // 2) Guardar scrollY y bloquear body (iOS-safe)
    const scrollY = window.scrollY;
    savedScrollY.current = scrollY;

    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, savedScrollY.current);
    };
  }, [open, triggerRef]);

  // ── Escape to close ───────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  return (
    <AnimatePresence>
      {open && pkg && (
        <motion.div
          className="fixed inset-0 z-[10001] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            // Sin backdrop-filter blur — era muy caro en móvil
            background: "rgba(3, 1, 10, 0.97)",
          }}
        >
          {/* Inner — full screen mobile, parent stops propagation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full flex flex-col"
          >
            {/* Header — sticky on top of viewer */}
            <div
              className="relative z-10 shrink-0 px-4 md:px-7 py-3.5 md:py-4 flex items-center gap-3 border-b border-white/10"
              style={{
                background: "rgba(12,6,24,0.96)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(168,85,247,0.22)",
                  border: "1px solid rgba(168,85,247,0.5)",
                }}
              >
                <Sparkles size={16} className="text-neon-purple" />
              </div>
              <div className="flex-1 min-w-0 pr-14 md:pr-16">
                <h3 className="font-display text-base md:text-xl font-bold text-white truncate">
                  {pkg.name}
                </h3>
                <p className="text-neon-purple/75 text-xs md:text-sm truncate">
                  Galería del paquete
                </p>
              </div>

              {/* Close button — big, glowing, top-right (sticky in header) */}
              <button
                onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                aria-label="Cerrar"
                className="absolute top-1/2 right-3 md:right-5 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 active:scale-95"
                style={{
                  width: 48,
                  height: 48,
                  background: "rgba(168,85,247,0.28)",
                  border: "1.5px solid rgba(217,70,239,0.7)",
                  boxShadow:
                    "0 0 20px rgba(217,70,239,0.5), 0 0 40px rgba(217,70,239,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  animation: "pkg-media-pulse 2.4s ease-in-out infinite",
                }}
              >
                <X
                  size={24}
                  className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                  strokeWidth={2.4}
                />
              </button>
            </div>

            {/* Body — viewer vertical o placeholder */}
            {hasMedia ? (
              <PackageMediaViewer media={media} modalOpen={open} />
            ) : (
              <EmptyState />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Empty state — discrete + elegant ─────────────────────────────
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{
          background: "rgba(168,85,247,0.12)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 0 24px rgba(168,85,247,0.15)",
        }}
      >
        <Sparkles size={26} className="text-neon-purple/70" />
      </div>
      <h4 className="font-display text-base md:text-lg text-white/85 mb-2">
        Listo para recibir imágenes y videos de este paquete
      </h4>
      <p className="text-white/45 text-sm max-w-sm">
        Pronto encontrarás aquí evidencia visual real de eventos producidos con este paquete.
      </p>
    </div>
  );
}