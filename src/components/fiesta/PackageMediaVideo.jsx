import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMusicState } from "@/lib/MusicContext";

// Evento global: solo un video puede tener audio activo a la vez.
const UNMUTE_EVENT = "pkg-media-video-unmuted";

/*
  Video premium para visor de paquete:
  - Loop, playsInline, SIEMPRE inicia muted
  - SIN controles nativos (no pausar, no buscar, no fullscreen)
  - Solo se reproduce cuando isActive === true (slide visible en viewport)
  - Cuando isActive === false → pause + mute (no consume recursos)
  - preload="metadata" para no descargar todo a la vez
  - Bocinita = único control (mute/unmute)
  - Solo un video con audio a la vez (evento global)
  - Cuando modalOpen → false: pause + mute + reset

  Props:
    src        — url del video
    poster     — opcional
    modalOpen  — boolean, true mientras el modal del paquete está abierto
    isActive   — boolean, true cuando este slide está visible (≥60%)
*/
export default function PackageMediaVideo({ src, poster, modalOpen, isActive }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const idRef = useRef(Math.random().toString(36).slice(2));
  const ownsAudioFocusRef = useRef(false);
  const { requestAudioFocus, releaseAudioFocus } = useMusicState();

  // ── Play/Pause según visibilidad del slide ────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isActive && modalOpen) {
      // Reproducir solo el video visible
      v.play().catch(() => {});
    } else {
      // Fuera de vista o modal cerrado → pausar + silenciar
      v.pause();
      v.muted = true;
      setMuted(true);
    }
  }, [isActive, modalOpen]);

  // ── Reset on close ────────────────────────────────────────────
  useEffect(() => {
    if (!modalOpen) {
      const v = videoRef.current;
      if (v) {
        v.muted = true;
        v.pause();
        try { v.currentTime = 0; } catch (e) { /* ignore */ }
      }
      setMuted(true);
    }
  }, [modalOpen]);

  // ── Solo un video con audio a la vez ──────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.id !== idRef.current) {
        const v = videoRef.current;
        if (v) v.muted = true;
        setMuted(true);
        // Si éramos dueños del audio focus, lo soltamos para que la música general regrese
        if (ownsAudioFocusRef.current) {
          ownsAudioFocusRef.current = false;
          releaseAudioFocus(idRef.current);
        }
      }
    };
    window.addEventListener(UNMUTE_EVENT, handler);
    return () => window.removeEventListener(UNMUTE_EVENT, handler);
  }, [releaseAudioFocus]);

  // ── Liberar audio focus si nos mutean por cualquier motivo ────
  useEffect(() => {
    if (muted && ownsAudioFocusRef.current) {
      ownsAudioFocusRef.current = false;
      releaseAudioFocus(idRef.current);
    }
  }, [muted, releaseAudioFocus]);

  // ── Liberar audio focus al cerrar modal o salir de vista ──────
  useEffect(() => {
    if ((!modalOpen || !isActive) && ownsAudioFocusRef.current) {
      ownsAudioFocusRef.current = false;
      releaseAudioFocus(idRef.current);
    }
  }, [modalOpen, isActive, releaseAudioFocus]);

  // ── Cleanup al desmontar ──────────────────────────────────────
  useEffect(() => {
    return () => {
      if (ownsAudioFocusRef.current) {
        ownsAudioFocusRef.current = false;
        releaseAudioFocus(idRef.current);
      }
    };
  }, [releaseAudioFocus]);

  // Sync mute state con el elemento
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  const toggleMute = (e) => {
    e.stopPropagation();
    // No permitir activar audio si el slide no está activo
    if (!isActive) return;

    setMuted((m) => {
      const next = !m;
      const v = videoRef.current;
      if (v) {
        v.muted = next;
        if (!next && v.paused) v.play().catch(() => {});
      }
      if (!next) {
        // Activamos audio: notificar a otros videos y tomar audio focus (silencia música general)
        window.dispatchEvent(
          new CustomEvent(UNMUTE_EVENT, { detail: { id: idRef.current } })
        );
        if (!ownsAudioFocusRef.current) {
          ownsAudioFocusRef.current = true;
          requestAudioFocus(idRef.current);
        }
      } else {
        // Silenciamos: soltar audio focus para que la música general regrese
        if (ownsAudioFocusRef.current) {
          ownsAudioFocusRef.current = false;
          releaseAudioFocus(idRef.current);
        }
      }
      return next;
    });
  };

  return (
    <div
      className="relative w-full h-full"
      onClick={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate nofullscreen"
        className="w-full h-full pointer-events-none"
        style={{ background: "#000", objectFit: "contain" }}
      />

      {/* Bocinita — único control */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Activar audio" : "Silenciar audio"}
        className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95"
        style={{
          background: muted ? "rgba(0,0,0,0.68)" : "rgba(168,85,247,0.38)",
          border: `1.5px solid ${muted ? "rgba(255,255,255,0.28)" : "rgba(168,85,247,0.85)"}`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: muted
            ? "0 2px 10px rgba(0,0,0,0.55)"
            : "0 0 18px rgba(168,85,247,0.65), 0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        {muted ? (
          <VolumeX size={18} className="text-white/90" />
        ) : (
          <Volume2
            size={18}
            className="text-white"
            style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.95))" }}
          />
        )}
      </button>
    </div>
  );
}