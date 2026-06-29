import React, { useState, useRef, useEffect, useCallback } from "react";
import BackgroundLayer from "@/components/fiesta/BackgroundLayer";
import Navbar from "@/components/fiesta/Navbar";
import HeroSection from "@/components/fiesta/HeroSection";
import SideAudioEqualizer from "@/components/fiesta/SideAudioEqualizer";
import MusicController from "@/components/fiesta/MusicController";
import ScrollAnimationSection from "@/components/fiesta/ScrollAnimationSection";
import ServicesSection from "@/components/fiesta/ServicesSection";
import ShowcaseCarouselSection from "@/components/fiesta/ShowcaseCarouselSection";
import PackagesSection from "@/components/fiesta/PackagesSection";
import ExtrasSection from "@/components/fiesta/ExtrasSection";
import GallerySection from "@/components/fiesta/GallerySection";
import AboutSection from "@/components/fiesta/AboutSection";
import ContactSection from "@/components/fiesta/ContactSection";
import FloatingButtons from "@/components/fiesta/FloatingButtons";
import Footer from "@/components/fiesta/Footer";
import { MusicProvider } from "@/lib/MusicContext";
import { SITE_CONFIG } from "@/lib/siteConfig";

/*
  PHASE MACHINE — single source of truth
  ─────────────────────────────────────────────────────────────────
  "splash"   → video plays full-screen; all UI opacity:0
  "mounted"  → video frozen; overlay/hero pre-painted at opacity:0
               (one double-rAF tick to let browser paint before transition)
  "visible"  → CSS transitions kick in — overlay + hero + navbar + music reveal
  "done"     → all animations complete; scroll + interactions fully unlocked
  ─────────────────────────────────────────────────────────────────
*/

export default function Home() {
  const [phase, setPhase] = useState("splash");
  // Controls frozen video background visibility based on scroll position
  // "hero"   → in hero/before scroll anim → video fully visible
  // "anim"   → inside scroll anim section → video visible
  // "past"   → scrolled past scroll anim → video faded out
  const [videoZone, setVideoZone] = useState("hero");
  const videoRef = useRef(null);
  const timersRef = useRef([]);
  const revealCalledRef = useRef(false);

  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  // Lock body scroll during splash/reveal; unlock cleanly once done
  useEffect(() => {
    if (phase === "done") {
      const id = setTimeout(() => { document.body.style.overflow = ""; }, 60);
      return () => clearTimeout(id);
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  // Clear all timers on unmount
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Track scroll position to show/hide frozen video background
  useEffect(() => {
    if (phase !== "done") return;
    const onScroll = () => {
      const el = document.querySelector("[data-scroll-anim-section]");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top > 0) {
        // Above the scroll anim section → hero area
        setVideoZone("hero");
      } else if (rect.bottom > vh * 0.1) {
        // Inside the scroll anim section
        setVideoZone("anim");
      } else {
        // Scrolled past the scroll anim section
        setVideoZone("past");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [phase]);

  const freezeAndReveal = useCallback(() => {
    if (revealCalledRef.current) return;
    revealCalledRef.current = true;

    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      if (vid.duration && isFinite(vid.duration)) {
        vid.currentTime = Math.max(vid.duration - 0.08, 0);
      }
    }

    setPhase("mounted");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("visible");
      });
    });
    addTimer(() => setPhase("done"), 1900);
  }, []);

  const handleSkip = useCallback(() => {
    if (phase !== "splash") return;
    const vid = videoRef.current;
    if (vid && vid.duration && isFinite(vid.duration)) {
      vid.currentTime = Math.max(vid.duration - 0.08, 0);
    }
    freezeAndReveal();
  }, [phase, freezeAndReveal]);

  // Auto-fallback if video never fires onEnded
  useEffect(() => {
    const id = setTimeout(() => {
      if (!revealCalledRef.current) freezeAndReveal();
    }, 14000);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived state ──────────────────────────────────────────────
  const isSplash     = phase === "splash";
  const isDone       = phase === "done";
  const revealActive = phase === "visible" || phase === "done";
  // uiReady: UI is interactive (isDone). Used for pointer-events on interactive elements.
  const uiReady      = isDone;

  // Frozen video opacity:
  // - During splash: controlled by z-index (9999), opacity irrelevant
  // - After reveal:
  //   "hero" or "anim" zone → opacity 1 (visible as background)
  //   "past" zone → opacity 0 (faded out, page has its own bg)
  const frozenVideoOpacity = isSplash ? 1 : (videoZone === "past" ? 0 : 1);

  // Page content below hero
  const pageContentStyle = {
    opacity: isDone ? 1 : 0,
    pointerEvents: isDone ? "auto" : "none",
    transition: isDone ? "opacity 0.6s ease 0.1s" : "none",
    willChange: "opacity",
  };

  return (
    <MusicProvider>
      <div className="min-h-screen bg-[#0a0a14] text-white" style={{ overflowX: "clip", maxWidth: "100vw" }}>

        {/* ── FROZEN VIDEO BACKGROUND ──────────────────────────────────
            During splash: z-index 9999 (covers everything)
            After splash:  z-index 4 (behind all content), fades when past scroll anim
            pointer-events ALWAYS none — never intercepts clicks
        ──────────────────────────────────────────────────────────── */}
        <video
          ref={videoRef}
          src={SITE_CONFIG.splashVideoUrl}
          autoPlay
          muted
          playsInline
          onEnded={freezeAndReveal}
          onError={freezeAndReveal}
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: isSplash ? 9999 : 4,
            pointerEvents: "none",
            opacity: frozenVideoOpacity,
            transition: isSplash ? "none" : "opacity 800ms ease",
            willChange: "opacity",
          }}
        />

        {/* ── SKIP BUTTON (splash only) ── */}
        <button
          onClick={handleSkip}
          style={{
            position: "fixed",
            zIndex: 10000,
            opacity: isSplash ? 1 : 0,
            pointerEvents: isSplash ? "auto" : "none",
            transition: "opacity 0.4s ease",
            bottom: "2rem",
            right: "1.5rem",
          }}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-white/80 border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-colors duration-300"
        >
          Omitir intro
        </button>

        {/* ── BACKGROUND LAYER (particles/grid — always visible under content) ── */}
        <BackgroundLayer />

        {/* ── HERO — always mounted; reveals via CSS transitions ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            opacity: isSplash ? 0 : 1,
            transition: isSplash ? "none" : "opacity 0.01ms",
          }}
        >
          <HeroSection
            overlayVisible={revealActive}
            contentVisible={revealActive}
          />
        </div>

        {/* ── PAGE CONTENT — scroll animation + all sections below hero ── */}
        <div style={{ position: "relative", zIndex: 10, ...pageContentStyle }}>
          <ScrollAnimationSection />
          <div className="w-full flex justify-center py-4">
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
          </div>
          <ServicesSection />
          <ShowcaseCarouselSection />
          <PackagesSection />
          <ExtrasSection />
          <GallerySection />
          <AboutSection />
          <ContactSection />
          <Footer />
        </div>

        {/* ── NAVBAR — fixed; manages its own visibility ── */}
        <Navbar phase={phase} revealActive={revealActive} isDone={isDone} />

        {/* ── AUDIO EQUALIZER — fixed side bars ── */}
        <SideAudioEqualizer />

        {/* ── MUSIC CONTROLLER — "Activar experiencia" + music toggle ──
            Always mounted. Visible from revealActive onward.
            Pointer-events active from uiReady (isDone) onward.
            z-index 9990 on its fixed children — above everything except splash.
        ── */}
        <MusicController revealActive={revealActive} uiReady={uiReady} />

        {/* ── FLOATING BUTTONS — WhatsApp + back to top ── */}
        <FloatingButtons isDone={isDone} inScrollAnim={videoZone === "anim"} />

      </div>
    </MusicProvider>
  );
}