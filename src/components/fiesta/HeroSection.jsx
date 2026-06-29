import React from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { ChevronDown, Facebook, Instagram } from "lucide-react";

// TikTok icon inline (no existe en lucide-react)
function TikTokIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.78a8.16 8.16 0 0 0 4.77 1.52V6.85a4.85 4.85 0 0 1-1.84-.16z" />
    </svg>
  );
}

/**
 * HeroSection — CSS-only reveal (no Framer Motion on reveal path).
 *
 * Props:
 *  overlayVisible  (bool) → dark overlay animates in
 *  contentVisible  (bool) → hero content animates in
 *
 * The key trick: overlayVisible and contentVisible must be set with a
 * requestAnimationFrame gap AFTER the component is mounted so the browser
 * paints the opacity:0 state first and can then transition to opacity:1.
 *
 * The video background lives in Home.jsx at z-index 5.
 */

// Ease curve matching cubic-bezier(0.22, 1, 0.36, 1)
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function HeroSection({ overlayVisible = false, contentVisible = false }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // CSS inline style helper: hidden → revealed via CSS transition
  const layerStyle = (delay, duration = 1000, extraTransform = "") => ({
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible
      ? "translateY(0) scale(1)"
      : `translateY(22px) scale(0.985)${extraTransform ? " " + extraTransform : ""}`,
    transition: contentVisible
      ? `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`
      : "none",
    willChange: "opacity, transform",
  });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-16 pt-8 text-center"
    >
      {/* ── OVERLAY — dark gradient fades in over frozen video ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "linear-gradient(to bottom, rgba(5,0,12,0.35) 0%, rgba(10,0,24,0.62) 55%, rgba(0,0,0,0.72) 100%)",
          opacity: overlayVisible ? 0.58 : 0,
          transition: overlayVisible ? "opacity 1000ms ease-out" : "none",
          willChange: "opacity",
        }}
      />

      {/* ── RADIAL GLOW — static, no animation ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(168,85,247,0.1) 0%, transparent 100%)",
          opacity: overlayVisible ? 1 : 0,
          transition: overlayVisible ? "opacity 1200ms ease-out" : "none",
          willChange: "opacity",
        }}
      />

      {/* ── CONTENT ── */}
      <div
        className="relative flex flex-col items-center w-full max-w-4xl mx-auto"
        style={{ zIndex: 2 }}
      >

        {/* TITLE — delay 120ms */}
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight"
          style={{
            color: "#f8ecff",
            textShadow: [
              "0 0 8px rgba(210,110,255,0.75)",
              "0 0 18px rgba(180,70,255,0.45)",
              "0 0 34px rgba(220,80,255,0.25)",
              "0 2px 20px rgba(0,0,0,0.9)",
            ].join(", "),
            ...layerStyle(120, 1000),
          }}
        >
          {SITE_CONFIG.mainPhrase}
        </h1>

        {/* SUBTITLE — delay 350ms */}
        <p
          className="mt-5 md:mt-6 text-base md:text-lg max-w-2xl leading-relaxed font-medium"
          style={{
            color: "rgba(230, 210, 255, 0.88)",
            textShadow: "0 1px 12px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.6)",
            ...layerStyle(350, 900),
          }}
        >
          DJ, audio profesional, iluminación, pistas LED, pantallas y producción integral para bodas, XV años y eventos corporativos.
        </p>

        {/* BUTTONS — delay 580ms */}
        <div
          className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          style={layerStyle(580, 850)}
        >
          {/* Primary CTA — gradient + glow */}
          <button
            onClick={() => scrollTo("#paquetes")}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta text-white font-semibold text-base transition-all duration-300"
            style={{
              boxShadow: "0 0 20px rgba(168,85,247,0.45), 0 0 40px rgba(168,85,247,0.2), 0 2px 8px rgba(0,0,0,0.5)",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 32px rgba(168,85,247,0.7), 0 0 60px rgba(168,85,247,0.3), 0 2px 8px rgba(0,0,0,0.5)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(168,85,247,0.45), 0 0 40px rgba(168,85,247,0.2), 0 2px 8px rgba(0,0,0,0.5)"}
          >
            Ver paquetes
          </button>

          {/* Glass CTA — WhatsApp */}
          <a
            href={`${SITE_CONFIG.whatsappLink}?text=${SITE_CONFIG.whatsappDefaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full text-white font-semibold text-base transition-all duration-300 text-center"
            style={{
              background: "rgba(10, 4, 24, 0.72)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(168,85,247,0.55)",
              boxShadow: "0 0 14px rgba(168,85,247,0.18), 0 2px 10px rgba(0,0,0,0.55)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(20, 8, 44, 0.82)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.8)"; e.currentTarget.style.boxShadow = "0 0 22px rgba(168,85,247,0.32), 0 2px 10px rgba(0,0,0,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(10, 4, 24, 0.72)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.55)"; e.currentTarget.style.boxShadow = "0 0 14px rgba(168,85,247,0.18), 0 2px 10px rgba(0,0,0,0.55)"; }}
          >
            Cotizar por WhatsApp
          </a>

          {/* Glass CTA — galería */}
          <button
            onClick={() => scrollTo("#galeria")}
            className="px-8 py-3.5 rounded-full text-white font-medium text-base transition-all duration-300"
            style={{
              background: "rgba(8, 4, 18, 0.68)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.55)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(20, 10, 38, 0.78)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.38)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(8, 4, 18, 0.68)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
          >
            Ver galería
          </button>
        </div>

        {/* SOCIAL LINKS — debajo del botón "Ver galería" — delay 720ms */}
        <div
          className="mt-6 flex items-center justify-center gap-4 sm:gap-5"
          style={layerStyle(720, 850)}
        >
          <style>{`
            @keyframes hero-social-pulse {
              0%, 100% {
                box-shadow:
                  0 0 12px rgba(168,85,247,0.35),
                  0 0 24px rgba(168,85,247,0.15),
                  inset 0 0 6px rgba(168,85,247,0.10);
                border-color: rgba(168,85,247,0.45);
              }
              50% {
                box-shadow:
                  0 0 20px rgba(217,70,239,0.55),
                  0 0 38px rgba(168,85,247,0.28),
                  inset 0 0 10px rgba(217,70,239,0.18);
                border-color: rgba(217,70,239,0.7);
              }
            }
            .hero-social-btn {
              animation: hero-social-pulse 2.8s ease-in-out infinite;
            }
            .hero-social-btn:nth-child(2) { animation-delay: 0.4s; }
            .hero-social-btn:nth-child(3) { animation-delay: 0.8s; }
            .hero-social-btn:hover {
              transform: translateY(-2px) scale(1.06);
            }
          `}</style>
          <a
            href={SITE_CONFIG.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hero-social-btn flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/55 backdrop-blur-md border text-white transition-all duration-300"
          >
            <Facebook size={18} />
          </a>
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hero-social-btn flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/55 backdrop-blur-md border text-white transition-all duration-300"
          >
            <Instagram size={18} />
          </a>
          <a
            href={SITE_CONFIG.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hero-social-btn flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/55 backdrop-blur-md border text-white transition-all duration-300"
          >
            <TikTokIcon size={18} />
          </a>
        </div>

        {/* TAGLINE — delay 800ms */}
        <p
          className="mt-10 text-sm font-display tracking-widest"
          style={{
            color: "rgba(168,85,247,0.62)",
            ...layerStyle(800, 750),
          }}
        >
          {SITE_CONFIG.secondaryPhrases[0]}
        </p>
      </div>

      {/* SCROLL INDICATOR — delay 1400ms */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          zIndex: 2,
          opacity: contentVisible ? 1 : 0,
          transition: contentVisible ? "opacity 800ms ease 1400ms" : "none",
          willChange: "opacity",
        }}
      >
        <ChevronDown className="w-6 h-6 text-white/22 animate-bounce" />
      </div>
    </section>
  );
}