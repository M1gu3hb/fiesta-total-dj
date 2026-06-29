import React, { useState, useEffect, useRef } from "react";
import { Disc3, Speaker, Lightbulb, LayoutGrid, Monitor, Zap, Music } from "lucide-react";

const TOTAL_FRAMES = 211;
// px of scroll travel per frame — controls how fast the animation scrubs
const PX_PER_FRAME = 8;
// Total extra height beyond 100vh that creates the scroll range
const SCROLL_TRAVEL = TOTAL_FRAMES * PX_PER_FRAME; // 1688px

const FRAME_URLS = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const n = String(i + 1).padStart(3, "0");
  const fileKeys = [
    "91a47921c","497605a0c","69285cdcc","6ab95da34","b89cc8588","b9d5f8013","7a9faa894","805022c1a","02836dbb3","ae97a04cb",
    "69f4683e5","ebd2afdc5","641f75e48","9ddabf74d","7983ee0b2","ae34e3878","7a456bdc8","6546d7bc0","367e1c096","830954ef7",
    "dc1b8f5d5","e3368bfa4","6910118cb","5954f6405","887c7aafc","bd4e5db47","cc3bb5e73","6a9bd5af3","329a619b7","5d084d746",
    "3f2e3cf76","fb2d947eb","8503eb4b1","fcba8e263","327a46183","4cfb93713","8bdd25758","e4b986782","d14f858bd","3656a32a9",
    "cf96a0aac","26dd82cf7","9a9a43803","1e55b15f1","e877bf729","7f7760788","365cd52c2","3ea5283a0","4dde8cbf5","9822d05fe",
    "045e7eeca","e70c49d52","ee8d01598","a067b3bfa","8097f1d76","7b99fb0b7","b54c1af90","9976ee074","3c9bcc35f","8499b2877",
    "e9438937c","b36f9c52c","debeafab7","840e5de47","f297cf643","f172ed7e9","c4e10bd01","626402148","cc91068e6","c17fbe3d8",
    "d51624a5f","9400310a8","2c12a3eb5","4b5b1f26d","969504251","beb0535b9","0b37347d8","fd0409c6c","04bf1ce8e","4516a1816",
    "9ad736b5a","df0ccd926","4b08e0cfc","d10be59df","2f51bb9fc","abd740660","8469a44b1","0fb4842f4","3fe163e08","8f92095fa",
    "030e16a44","1e3cda28f","432476461","4785c722a","8369b12c0","f2c23dd9d","907cdbbc2","3d96abf55","05112d87a","40e16f876",
    "d2805ab64","4f05b7361","4fc85690c","2a1ab6431","858f1105b","09f08394b","6c11a616d","b4a357f55","befe51495","fe2fe0315",
    "8184580c1","aa5ea6c25","1300db8d6","ca8c9ec07","9aea0cca1","0e5e8985f","b5eee3ce4","12ac98b1b","298db2a97","7fc6850d4",
    "74ef3e611","c98e5fecb","1c2da8cbe","7ca279323","7ab635a6f","330babbe9","2251833d0","dd3d5ab5f","af663968e","e38a4d7d8",
    "6d8a2ebf8","2a3c6b131","1dcfe0c60","78691498f","52c8541be","fd26bbe99","4e22cc023","c18b85954","00a6b3a3e","a9cead1b5",
    "c210bf844","598229752","b774d32d8","3f1429261","208387781","0b5fc9f60","7dafc1397","e9e9d15fc","aae365391","f4acb34ec",
    "43390ada3","a8fc7943e","bbfb1011d","2ea673a1c","f1f7248fb","2ca9492ba","145758c45","36ee7810e","aa601c2f2","d9e648b84",
    "3ba3f2b53","3879f3b50","ee75a4911","f842bb3b5","4fdb3b57d","07f826f5b","d96a75e94","a47b2872d","fd59385df","c867dec6d",
    "cb7370437","66cbd511d","f0f71b3d8","6f770bdae","915da0803","719253b73","e01d3e8a7","bf44058f6","17c5069f3","5e70ffb69",
    "13d2fcbbe","a945485cc","fb3bae7d7","568608cee","2da2d471e","9c91e0d77","276bd55a4","e28560bff","765256478","9b2011ac0",
    "1eb26724c","95fc993f2","9929846d3","4b202d5e0","b91dc73a4","453f959c8","38a696382","467cffe5c","81dff6d58","35bcfbe75",
    "f3a61b0ce","695ef63ac","5b7ce5399","58b0d330f","42a433001","e8da34240","6b39b53f8","f47648475","33a474796","0a5a7509c",
    "f78cf2acc"
  ];
  return `/media/images/public/69f263dc709c74ed7d2f8111/${fileKeys[i]}_ezgif-frame-${n}.jpg`;
});

// Decorative labels for sides
const LEFT_LABELS = [
  { icon: Speaker, text: "Audio HD" },
  { icon: Lightbulb, text: "Iluminación" },
  { icon: Music, text: "DJ en vivo" },
  { icon: Zap, text: "Show" },
];

const RIGHT_LABELS = [
  { icon: LayoutGrid, text: "Pista LED" },
  { icon: Monitor, text: "Pantallas" },
  { icon: Disc3, text: "Producción" },
  { icon: Zap, text: "Efectos" },
];

function EqBars({ count = 8, className = "" }) {
  return (
    <div className={`flex items-end gap-[2px] ${className}`} style={{ height: 32 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            background: "linear-gradient(to top, rgba(168,85,247,0.7), rgba(217,70,239,0.3))",
            animation: `eq-bar ${0.8 + (i % 4) * 0.15}s ease-in-out infinite`,
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingLabel({ icon: Icon, text, style }) {
  return (
    <div
      className="glass-card rounded-lg px-2.5 py-2 flex items-center gap-2 text-xs text-white/70 select-none"
      style={{
        animation: "float 5s ease-in-out infinite",
        border: "1px solid rgba(168,85,247,0.2)",
        backdropFilter: "blur(8px)",
        ...style,
      }}
    >
      <Icon size={12} className="text-neon-purple flex-shrink-0" />
      <span className="font-medium whitespace-nowrap">{text}</span>
    </div>
  );
}

function LaserLines({ side }) {
  const lines = [20, 40, 60, 75];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {lines.map((top, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${top}%`,
            [side === "left" ? "right" : "left"]: 0,
            width: "60%",
            height: 1,
            background: `linear-gradient(${side === "left" ? "to left" : "to right"}, transparent, rgba(168,85,247,${0.08 + i * 0.03}))`,
            opacity: 0.6,
            animation: `pulse-glow ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ScrollAnimationSection() {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const loadedRef = useRef(new Set());
  const imagesRef = useRef([]);
  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  // Real pixel height set after mount so it reflects actual viewport height
  const [sectionHeight, setSectionHeight] = useState(0);

  // Set section height in px (not CSS calc) so offsetHeight is accurate
  useEffect(() => {
    const setHeight = () => {
      setSectionHeight(window.innerHeight + SCROLL_TRAVEL);
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  // Preload frames progressively
  useEffect(() => {
    imagesRef.current = Array(TOTAL_FRAMES).fill(null);
    let loaded = 0;

    const loadFrame = (index) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        imagesRef.current[index] = img;
        loadedRef.current.add(index);
        loaded++;
        setLoadedCount(loaded);
        if (loaded === 1 && imgRef.current) {
          imgRef.current.src = img.src;
          setIsReady(true);
        }
      };
      img.onerror = () => { loaded++; setLoadedCount(loaded); };
      img.src = FRAME_URLS[index];
    };

    // Load first 30 eagerly
    for (let i = 0; i < Math.min(30, TOTAL_FRAMES); i++) loadFrame(i);

    // Load rest in batches
    let batch = 30;
    const loadBatch = () => {
      const end = Math.min(batch + 40, TOTAL_FRAMES);
      for (let i = batch; i < end; i++) loadFrame(i);
      batch = end;
      if (batch < TOTAL_FRAMES) setTimeout(loadBatch, 150);
    };
    setTimeout(loadBatch, 300);
  }, []);

  // Scroll-driven frame update
  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // How many px the section top has traveled above viewport top (0 at entry)
      const scrolled = -rect.top;
      // Total scrollable distance = section height − viewport height = SCROLL_TRAVEL
      const totalScrollable = el.offsetHeight - window.innerHeight;
      const prog = totalScrollable > 0
        ? Math.max(0, Math.min(1, scrolled / totalScrollable))
        : 0;

      setProgress(prog);

      const frameIndex = Math.round(prog * (TOTAL_FRAMES - 1));

      // Find nearest loaded frame
      let bestFrame = frameIndex;
      if (!loadedRef.current.has(frameIndex)) {
        for (let d = 1; d < 15; d++) {
          if (loadedRef.current.has(frameIndex - d)) { bestFrame = frameIndex - d; break; }
          if (loadedRef.current.has(frameIndex + d)) { bestFrame = frameIndex + d; break; }
        }
      }

      const img = imagesRef.current[bestFrame];
      if (img && imgRef.current) {
        imgRef.current.src = img.src;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /*
      OUTER WRAPPER: real pixel height = 100vh + SCROLL_TRAVEL
      This is the scroll track. The sticky child stays pinned to top:0
      for the entire SCROLL_TRAVEL distance, then releases naturally.
    */
    <section
      ref={wrapperRef}
      data-scroll-anim-section
      style={{ position: "relative", height: sectionHeight || `calc(100vh + ${SCROLL_TRAVEL}px)` }}
    >
      {/* STICKY INNER: stays fixed at top:0 while inside the outer wrapper */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "#0a0a14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        {/* Ambient background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(88,28,135,0.12) 0%, transparent 65%)",
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        {/* ============================
            DESKTOP/TABLET SIDE PANELS
            ============================ */}

        {/* LEFT SIDE PANEL */}
        <div className="hidden md:flex absolute left-0 top-0 bottom-0 flex-col items-center justify-center gap-6 pointer-events-none"
          style={{ width: "clamp(100px, 18vw, 220px)", padding: "0 12px" }}
        >
          <LaserLines side="left" />

          {/* Equalizer top */}
          <EqBars count={6} className="opacity-60" />

          {/* Floating labels left */}
          <div className="flex flex-col gap-3 w-full">
            {LEFT_LABELS.map(({ icon, text }, i) => (
              <FloatingLabel
                key={text}
                icon={icon}
                text={text}
                style={{ animationDelay: `${i * 0.7}s` }}
              />
            ))}
          </div>

          {/* Vertical glow line */}
          <div
            className="absolute right-0 top-1/4 bottom-1/4 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(168,85,247,0.3), transparent)" }}
          />

          {/* Equalizer bottom */}
          <EqBars count={5} className="opacity-40" />

          {/* Progress indicator */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] text-neon-purple/50 font-mono uppercase tracking-widest">Scroll</span>
            <div className="w-0.5 h-16 bg-white/10 rounded-full overflow-hidden">
              <div
                className="w-full bg-neon-purple/70 rounded-full transition-all duration-100"
                style={{ height: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 flex-col items-center justify-center gap-6 pointer-events-none"
          style={{ width: "clamp(100px, 18vw, 220px)", padding: "0 12px" }}
        >
          <LaserLines side="right" />

          {/* Equalizer top */}
          <EqBars count={6} className="opacity-60" />

          {/* Floating labels right */}
          <div className="flex flex-col gap-3 w-full">
            {RIGHT_LABELS.map(({ icon, text }, i) => (
              <FloatingLabel
                key={text}
                icon={icon}
                text={text}
                style={{ animationDelay: `${i * 0.9 + 0.3}s` }}
              />
            ))}
          </div>

          {/* Vertical glow line */}
          <div
            className="absolute left-0 top-1/4 bottom-1/4 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(168,85,247,0.3), transparent)" }}
          />

          {/* Equalizer bottom */}
          <EqBars count={5} className="opacity-40" />

          {/* Frame counter */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-neon-purple/40 font-mono uppercase tracking-widest">Frame</span>
            <span className="text-xs text-neon-purple/60 font-mono">
              {String(Math.round(progress * (TOTAL_FRAMES - 1)) + 1).padStart(3, "0")}
            </span>
          </div>
        </div>

        {/* ============================
            MAIN ANIMATION CONTAINER
            ============================ */}
        <div className="relative flex items-center justify-center h-full">
          {/* Outer glow ring */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-12px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(217,70,239,0.06) 100%)",
              filter: "blur(16px)",
            }}
          />

          {/* Frame container — strict 9:16 */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "min(100vh, 100svh)",
              aspectRatio: "9 / 16",
              maxHeight: "100vh",
              maxWidth: "100vw",
              borderRadius: 12,
              boxShadow: "0 0 40px rgba(168,85,247,0.2), 0 0 80px rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.15)",
            }}
          >
            {/* Loading spinner */}
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a14]">
                <div className="w-8 h-8 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
              </div>
            )}

            {/* The actual frame */}
            <img
              ref={imgRef}
              alt="Fiesta Total DJs scroll animation"
              className="w-full h-full object-cover"
              style={{
                display: isReady ? "block" : "none",
                imageRendering: "high-quality",
              }}
              draggable={false}
            />

            {/* Subtle corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-neon-purple/40 rounded-tl pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-neon-purple/40 rounded-tr pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-neon-purple/40 rounded-bl pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-neon-purple/40 rounded-br pointer-events-none" />
          </div>
        </div>

        {/* Loading bar (mobile / general) */}
        {loadedCount < TOTAL_FRAMES && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-purple/50 rounded-full transition-all duration-200"
                style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Mobile scroll hint */}
        {progress < 0.05 && isReady && (
          <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
            <div className="w-px h-6 bg-neon-purple/40" />
            <span className="text-[10px] text-neon-purple/50 font-mono uppercase tracking-widest">Scroll</span>
          </div>
        )}
      </div>
    </section>
  );
}