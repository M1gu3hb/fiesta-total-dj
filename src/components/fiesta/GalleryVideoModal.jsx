import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Maximize2, Minimize2 } from "lucide-react";
import useBodyScrollLock from "@/lib/useBodyScrollLock";
import { useMusicState } from "@/lib/MusicContext";

/*
  GalleryVideoModal — full-screen video player.
  - z-index 100000 → encima del navbar (9999) y floating buttons (9998).
  - Añade body.video-modal-open → CSS global oculta navbar/floating/music controller.
  - Audio ACTIVO al abrir; fallback "Tocar para activar audio" si el navegador lo bloquea.
  - Sin controles nativos. Solo: X + Maximize/Minimize.
  - Bloquea scroll del body.
  - Coordina con la música general (requestAudioFocus / releaseAudioFocus).
  - Cierra con popstate (botón atrás).
  - Orden crítico al abrir: play() PRIMERO, requestAudioFocus después → evita bug
    donde pausar la música mata el media session y bloquea el play del video.
*/
export default function GalleryVideoModal({ item, onClose, getStatus }) {
  const isOpen = !!item;
  const isImage = item?.type === "image";
  const videoRef = useRef(null);
  const ownerIdRef = useRef("gallery-modal");
  const [needsTap, setNeedsTap] = useState(false);
  const [fitMode, setFitMode] = useState("contain");
  const [isLoading, setIsLoading] = useState(false);

  const { requestAudioFocus, releaseAudioFocus } = useMusicState();

  useBodyScrollLock(isOpen);

  // Marker global para ocultar navbar/floating/music
  // useLayoutEffect → se aplica ANTES del paint para evitar flash de header encima.
  useLayoutEffect(() => {
    if (isOpen) {
      document.body.classList.add("video-modal-open");
      return () => document.body.classList.remove("video-modal-open");
    }
  }, [isOpen]);

  // Reset fit mode al abrir
  useEffect(() => {
    if (isOpen) setFitMode("contain");
  }, [isOpen]);

  // Reproducir CON AUDIO al abrir. Orden crítico:
  //   1) video.play() con audio (gracias al gesto del click del usuario)
  //   2) requestAudioFocus → silencia música general
  // Si invertimos el orden, en iOS pausar la música puede romper el media session
  // y el siguiente play() falla, dejando el video muerto.
  useEffect(() => {
    if (!isOpen || isImage) return;
    setNeedsTap(false);
    const v = videoRef.current;
    if (!v) return;

    // Fuente de verdad final = readyState del elemento real del modal.
    // El status del preloader es solo una pista (el video oculto pudo cachear datos).
    const precachedStatus = getStatus?.(item.url);
    const preloaderHint =
      precachedStatus === "ready" || precachedStatus === "canPlay";
    const alreadyReady = v.readyState >= 3 || (preloaderHint && v.readyState >= 2);
    setIsLoading(!alreadyReady);

    const stopLoader = () => setIsLoading(false);
    v.addEventListener("canplay", stopLoader);
    v.addEventListener("playing", stopLoader);
    v.addEventListener("loadeddata", () => {
      if (v.readyState >= 3) stopLoader();
    });

    v.muted = false;
    v.volume = 1;
    try { v.currentTime = 0; } catch {}

    const playPromise = v.play();

    // Tomar audio focus DESPUÉS de iniciar reproducción (microtask siguiente)
    Promise.resolve().then(() => {
      requestAudioFocus(ownerIdRef.current);
    });

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Algunos navegadores bloquean autoplay con audio: caemos a muted + fallback
        setNeedsTap(true);
        v.muted = true;
        v.play().catch(() => {});
      });
    }

    return () => {
      releaseAudioFocus(ownerIdRef.current);
      v.removeEventListener("canplay", stopLoader);
      v.removeEventListener("playing", stopLoader);
      // Pausar y limpiar
      try {
        v.pause();
        v.muted = true;
      } catch {}
    };
  }, [isOpen, isImage, item?.url, requestAudioFocus, releaseAudioFocus, getStatus]);

  // Botón atrás del teléfono
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ galleryModal: true }, "");
    const onPop = () => { onClose(); };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (window.history.state && window.history.state.galleryModal) {
        try { window.history.back(); } catch {}
      }
    };
  }, [isOpen, onClose]);

  // ESC para cerrar
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const activateAudio = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    v.play().then(() => setNeedsTap(false)).catch(() => {});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            background: "rgba(2,0,8,0.98)",
            zIndex: 100000, // ENCIMA de navbar (9999) y floating buttons (9998)
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          {/* X Cerrar — top-right, safe-area aware */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Cerrar"
            className="fixed flex items-center justify-center transition-all active:scale-95"
            style={{
              top: "max(1rem, env(safe-area-inset-top))",
              right: "max(1rem, env(safe-area-inset-right))",
              zIndex: 100002,
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(168,85,247,0.35)",
              border: "1.5px solid rgba(217,70,239,0.8)",
              boxShadow: "0 0 26px rgba(217,70,239,0.65), 0 4px 14px rgba(0,0,0,0.7)",
            }}
          >
            <X size={24} className="text-white" />
          </button>

          {/* Fit/Fill toggle — top-left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFitMode((m) => (m === "contain" ? "cover" : "contain"));
            }}
            aria-label="Cambiar ajuste"
            className="fixed flex items-center justify-center transition-all active:scale-95"
            style={{
              top: "max(1rem, env(safe-area-inset-top))",
              left: "max(1rem, env(safe-area-inset-left))",
              zIndex: 100002,
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.65)",
              border: "1px solid rgba(168,85,247,0.55)",
              boxShadow: "0 0 14px rgba(168,85,247,0.35)",
            }}
          >
            {fitMode === "contain"
              ? <Maximize2 size={18} className="text-white" />
              : <Minimize2 size={18} className="text-white" />}
          </button>

          {/* Video container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-2 md:p-6"
            style={{ zIndex: 100001 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isImage ? (
              <img
                src={item.url}
                alt=""
                className="w-full h-full rounded-xl"
                style={{
                  objectFit: fitMode,
                  background: "#000",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            ) : (
              <video
                ref={videoRef}
                src={item.url}
                loop
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
                className="w-full h-full rounded-xl"
                style={{
                  objectFit: fitMode,
                  background: "#000",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            )}

            {/* Loader premium si el video aún no está listo */}
            {!isImage && isLoading && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                style={{ zIndex: 100002 }}
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
                  style={{
                    borderTopColor: "rgba(217,70,239,0.95)",
                    borderRightColor: "rgba(168,85,247,0.55)",
                    boxShadow: "0 0 22px rgba(168,85,247,0.5)",
                  }}
                />
                <p className="mt-3 text-xs font-display tracking-wide text-white/75">
                  Cargando video…
                </p>
              </div>
            )}

            {needsTap && (
              <button
                onClick={activateAudio}
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-full font-display font-semibold text-sm text-white"
                style={{
                  bottom: "max(2rem, env(safe-area-inset-bottom))",
                  zIndex: 100003,
                  background: "rgba(168,85,247,0.55)",
                  border: "1.5px solid rgba(168,85,247,0.95)",
                  boxShadow: "0 0 26px rgba(168,85,247,0.7)",
                }}
              >
                <Volume2 size={16} />
                Tocar para activar audio
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}