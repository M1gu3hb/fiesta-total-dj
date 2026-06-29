import React from "react";
import { ImageIcon, Play } from "lucide-react";

/*
  Botón grande y llamativo: "Ver imágenes del paquete"
  - Verde neón premium con glow pulsante
  - Mobile-first: alto generoso, fácil de tocar
  - Animación suave de pulso para llamar la atención
*/
export default function PackageMediaButton({ onClick, label = "Ver imágenes del paquete" }) {
  return (
    <button
      onClick={onClick}
      className="relative w-full flex items-center justify-center gap-2.5 py-4 md:py-3.5 rounded-full font-display font-bold text-sm md:text-base text-white overflow-hidden group transition-all duration-300 active:scale-[0.98]"
      style={{
        background: "linear-gradient(135deg, #14d97a 0%, #0bb866 50%, #14d97a 100%)",
        boxShadow: "0 0 22px rgba(20,217,122,0.45), 0 0 44px rgba(20,217,122,0.18), 0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
        letterSpacing: "0.02em",
        minHeight: 52,
        animation: "pkg-media-pulse 2.4s ease-in-out infinite",
      }}
    >
      {/* Shine sweep on hover */}
      <span
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
        }}
      />
      <ImageIcon size={18} className="relative drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
      <span className="relative drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">{label}</span>
      <Play size={14} fill="currentColor" className="relative drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
    </button>
  );
}