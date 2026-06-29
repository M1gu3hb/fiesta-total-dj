import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CleanLogo from "@/components/fiesta/Logo";

const NAV_ITEMS = [
  { label: "Inicio", href: "#hero" },
  { label: "Servicios", href: "#servicios" },
  { label: "Paquetes", href: "#paquetes" },
  { label: "Extras", href: "#extras" },
  { label: "Galería", href: "#galeria" },
  { label: "Contacto", href: "#contacto" },
];

/*
  Props:
    phase        — "splash" | "mounted" | "visible" | "done"
    revealActive — true when phase is "visible" or "done"
    isDone       — true only when phase === "done"
*/
export default function Navbar({ phase, revealActive, isDone }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inScrollAnim, setInScrollAnim] = useState(false);

  const isSplash = phase === "splash";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Fade out during sticky scroll animation section
      const animSection = document.querySelector("[data-scroll-anim-section]");
      if (animSection) {
        const rect = animSection.getBoundingClientRect();
        const inside = rect.top <= 0 && rect.bottom > window.innerHeight * 0.1;
        setInScrollAnim(inside);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Visibility logic:
  // - splash        → fully hidden (opacity 0, no pointer events)
  // - revealActive  → fading in (opacity 1, no pointer events yet)
  // - isDone        → fully visible and interactive
  // - inScrollAnim  → ghosted (opacity 0.08, no pointer events)
  let navOpacity;
  let navPointer;
  let navTransition;

  if (isSplash) {
    navOpacity = 0;
    navPointer = "none";
    navTransition = "none";
  } else if (!revealActive) {
    // "mounted" phase — pre-paint invisible
    navOpacity = 0;
    navPointer = "none";
    navTransition = "none";
  } else if (inScrollAnim) {
    navOpacity = 0.08;
    navPointer = "none";
    navTransition = "opacity 0.5s ease";
  } else {
    // revealActive or isDone, not in scroll anim
    navOpacity = 1;
    navPointer = isDone ? "auto" : "none";
    navTransition = "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 600ms";
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        opacity: navOpacity,
        pointerEvents: navPointer,
        transition: navTransition,
        willChange: "opacity",
      }}
      className={`transition-[background,padding,border] duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2">
          <CleanLogo imgClassName="w-14 h-14 md:w-16 md:h-16 object-contain" />
          <span className="hidden sm:block font-display text-sm font-bold text-white tracking-wider">
            {SITE_CONFIG.brandName}
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              {item.label}
            </button>
          ))}
          <a
            href={`${SITE_CONFIG.whatsappLink}?text=${SITE_CONFIG.whatsappDefaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
          >
            Cotizar
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white/80"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="text-left text-base py-3 text-white/80 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={`${SITE_CONFIG.whatsappLink}?text=${SITE_CONFIG.whatsappDefaultMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center py-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta text-white font-semibold"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}