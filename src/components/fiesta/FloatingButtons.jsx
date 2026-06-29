import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { ArrowUp, MessageCircle } from "lucide-react";

/*
  Props:
    isDone       — true when phase === "done"
    inScrollAnim — true while user is inside the sticky scroll-anim section
*/
export default function FloatingButtons({ isDone, inScrollAnim }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hidden during splash (isDone=false).
  // Temporarily ghosted during scroll anim (inScrollAnim=true).
  // Fully visible + interactive otherwise.
  const opacity  = !isDone ? 0 : inScrollAnim ? 0.08 : 1;
  const pointer  = isDone && !inScrollAnim ? "auto" : "none";
  const trans    = isDone ? "opacity 0.5s ease" : "none";

  return (
    <>
      {/* WhatsApp — always its own fixed element, never inside a wrapper that could inherit opacity */}
      <a
        href={`${SITE_CONFIG.whatsappLink}?text=${SITE_CONFIG.whatsappDefaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        data-floating-buttons
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1rem",
          zIndex: 9998,          // above everything except splash (10000)
          opacity,
          pointerEvents: pointer,
          transition: trans,
          willChange: "opacity",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#25D366",
          boxShadow: "0 0 15px rgba(37,211,102,0.35)",
          textDecoration: "none",
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 26px rgba(37,211,102,0.6)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 15px rgba(37,211,102,0.35)"}
      >
        <MessageCircle size={24} color="white" fill="white" />
      </a>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Ir arriba"
          data-floating-buttons
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "1rem",
            zIndex: 9998,
            opacity,
            pointerEvents: pointer,
            transition: trans,
            willChange: "opacity",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer",
          }}
        >
          <ArrowUp size={18} color="rgba(255,255,255,0.6)" />
        </button>
      )}
    </>
  );
}