import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Music, Play } from "lucide-react";
import { useMusicState } from "@/lib/MusicContext";

const PLAYLIST = [
  "/media/videos/public/69f263dc709c74ed7d2f8111/61fc75819_HUGELxTopicxArashfeatDaecolm-IAdoreYouVisualizer.mp4",
];

const VOLUME = 0.38;
const CROSSFADE_DURATION = 800;

/*
  Props:
    revealActive  — true when hero reveal is in progress or done (phase "visible" | "done")
    uiReady       — true only when phase === "done"; enables pointer interaction

  Always mounted — audio elements are pre-created regardless of phase.
  Visibility + interactivity are CSS-only (opacity + pointerEvents on each fixed element).
*/
export default function MusicController({ revealActive, uiReady }) {
  const [status, setStatus] = useState("idle"); // "idle" | "playing" | "paused"
  const [showPrompt, setShowPrompt] = useState(true);
  const { setIsPlaying, registerMusicPauser } = useMusicState();

  const audiosRef = useRef([]);
  const currentRef = useRef(0);
  const fadingRef = useRef(false);
  const statusRef = useRef("idle");

  // Mantener un ref sincronizado con status para callbacks estables
  useEffect(() => { statusRef.current = status; }, [status]);

  // Registrar pauser: el contexto llama esto cuando un video toma/libera audio focus.
  // "pause" silencia la música (sin cambiar el "user intent"); "resume" la reanuda.
  useEffect(() => {
    const pauser = (action) => {
      const audio = audiosRef.current[currentRef.current];
      if (!audio) return;
      if (action === "pause") {
        // Solo si está sonando ahora
        if (statusRef.current === "playing") {
          audio.pause();
          // No tocamos setIsPlaying — el "user intent" sigue siendo música activa,
          // pero el estado local pasa a "paused" para reflejar el silenciado temporal.
          setStatus("paused");
        }
      } else if (action === "resume") {
        audio.play()
          .then(() => setStatus("playing"))
          .catch(() => {});
      }
    };
    const unregister = registerMusicPauser(pauser);
    return unregister;
  }, [registerMusicPauser]);

  // Pre-create hidden <audio> elements
  useEffect(() => {
    const elements = PLAYLIST.map((src, i) => {
      const a = document.createElement("audio");
      a.src = src;
      a.preload = "auto";
      a.volume = i === 0 ? VOLUME : 0;
      a.style.cssText = "position:absolute;width:0;height:0;opacity:0;pointer-events:none;";
      document.body.appendChild(a);
      a.onerror = () => console.warn(`[MusicController] No se pudo cargar: ${src}`);
      return a;
    });
    audiosRef.current = elements;
    return () => {
      elements.forEach((a) => { a.pause(); a.src = ""; a.remove(); });
    };
  }, []);

  const attachEndListener = (index) => {
    const audio = audiosRef.current[index];
    if (!audio) return;
    const onTimeUpdate = () => {
      if (!audio.duration) return;
      if (audio.currentTime >= audio.duration - 1.0 && !fadingRef.current) {
        audio.removeEventListener("timeupdate", onTimeUpdate);
        crossfadeTo((index + 1) % PLAYLIST.length);
      }
    };
    audio.addEventListener("ended", () => crossfadeTo((index + 1) % PLAYLIST.length), { once: true });
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio._onTimeUpdate = onTimeUpdate;
  };

  const crossfadeTo = (nextIndex) => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    const current = audiosRef.current[currentRef.current];
    const next = audiosRef.current[nextIndex];
    if (!next) { fadingRef.current = false; return; }
    if (current?._onTimeUpdate) {
      current.removeEventListener("timeupdate", current._onTimeUpdate);
      current._onTimeUpdate = null;
    }
    next.currentTime = 0;
    next.volume = 0;
    next.play().catch((e) => console.warn("[MusicController] play() error:", e));
    const steps = 20;
    const interval = CROSSFADE_DURATION / steps;
    let step = 0;
    const fade = setInterval(() => {
      step++;
      const ratio = step / steps;
      if (current) current.volume = Math.max(0, VOLUME * (1 - ratio));
      next.volume = Math.min(VOLUME, VOLUME * ratio);
      if (step >= steps) {
        clearInterval(fade);
        if (current) { current.pause(); current.currentTime = 0; current.volume = 0; }
        currentRef.current = nextIndex;
        fadingRef.current = false;
        attachEndListener(nextIndex);
      }
    }, interval);
  };

  const activate = () => {
    const audio = audiosRef.current[0];
    if (!audio) return;
    currentRef.current = 0;
    audio.volume = VOLUME;
    audio.currentTime = 0;
    audio.play()
      .then(() => {
        setStatus("playing");
        setIsPlaying(true);
        setShowPrompt(false);
        attachEndListener(0);
      })
      .catch((e) => {
        console.warn("[MusicController] activate error:", e);
        // Keep prompt visible so user can retry
      });
  };

  const toggle = () => {
    const audio = audiosRef.current[currentRef.current];
    if (!audio) return;
    if (status === "playing") {
      audio.pause();
      setStatus("paused");
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => { setStatus("playing"); setIsPlaying(true); })
        .catch((e) => console.warn("[MusicController] resume error:", e));
    }
  };

  const isPlaying = status === "playing";

  // CSS visibility values — applied directly on each fixed element
  // so no wrapper div opacity issue with position:fixed children
  const elOpacity   = revealActive ? 1 : 0;
  const elTransition = revealActive
    ? "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 800ms"
    : "none";
  const elPointer   = uiReady ? "auto" : "none";

  const baseFixedStyle = {
    opacity: elOpacity,
    pointerEvents: elPointer,
    transition: elTransition,
    willChange: "opacity",
  };

  return (
    <>
      {/* ── "Activar experiencia" prompt ── */}
      {showPrompt && (
        <div
          data-music-controller
          style={{
            position: "fixed",
            top: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9990,
            ...baseFixedStyle,
          }}
          className="flex flex-col items-center gap-1.5"
        >
          <button
            onClick={activate}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white
              bg-black/75 backdrop-blur-xl
              border border-neon-purple/40
              hover:border-neon-purple/70 hover:bg-neon-purple/15
              shadow-[0_0_18px_rgba(168,85,247,0.25)]
              hover:shadow-[0_0_28px_rgba(168,85,247,0.4)]
              transition-all duration-300"
          >
            <Play size={14} className="text-neon-purple fill-neon-purple" />
            <span>Activar experiencia</span>
            <Music size={13} className="text-neon-purple/70" />
          </button>
        </div>
      )}

      {/* ── Music toggle button (after activation) ── */}
      {!showPrompt && (
        <button
          onClick={toggle}
          title={isPlaying ? "Pausar música" : "Reanudar música"}
          aria-label={isPlaying ? "Pausar música" : "Reanudar música"}
          data-music-controller
          style={{
            position: "fixed",
            bottom: "6rem",
            right: "1rem",
            zIndex: 9990,
            ...baseFixedStyle,
          }}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-0.5
            backdrop-blur-md border-2 transition-all duration-300 group
            ${isPlaying
              ? "bg-neon-purple/25 border-neon-purple/70 shadow-[0_0_20px_rgba(168,85,247,0.5),0_0_40px_rgba(168,85,247,0.2)] hover:bg-neon-purple/35 animate-[pulse-glow_2.5s_ease-in-out_infinite]"
              : "bg-black/70 border-white/25 hover:border-neon-purple/50 hover:bg-neon-purple/15 hover:shadow-[0_0_16px_rgba(168,85,247,0.3)]"
            }`}
        >
          {isPlaying
            ? <Volume2 size={20} className="text-neon-purple drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            : <VolumeX size={20} className="text-white/50 group-hover:text-white/70 transition-colors" />
          }
          <span className={`text-[8px] font-semibold tracking-wide leading-none transition-colors ${isPlaying ? "text-neon-purple/80" : "text-white/30 group-hover:text-white/50"}`}>
            {isPlaying ? "MÚSICA" : "MUTED"}
          </span>
        </button>
      )}
    </>
  );
}