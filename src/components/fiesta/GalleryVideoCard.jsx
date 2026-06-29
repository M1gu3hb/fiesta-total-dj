import React, { useRef, useEffect, memo } from "react";
import { Play, ImageIcon } from "lucide-react";

/*
  GalleryVideoCard — preview compacto del collage.

  Soporta videos (loop, muted, autoplay cuando visible) e imágenes (estáticas).
  El tipo se determina por item.type ("video" | "image"). Si no está definido,
  se asume video (retrocompatibilidad).

  - feature=false (default): aspect 9/16, ocupa 1 columna.
  - feature=true: aspect 4/5, ocupa 2 columnas → destacado.
  - Para videos: IntersectionObserver → play/pause según visibilidad.
  - object-fit: cover → encuadre inteligente. Las verticales se centran;
    las horizontales se ajustan para no quedar con franjas vacías.
*/
function GalleryVideoCard({ item, feature = false, onOpen }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const isImage = item.type === "image";

  useEffect(() => {
    if (isImage) return;
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.45) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: [0, 0.45, 0.7] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isImage]);

  const aspect = feature ? "4 / 5" : "9 / 16";
  const colSpanClass = feature ? "col-span-2" : "";

  return (
    <button
      ref={wrapRef}
      onClick={onOpen}
      className={`relative w-full rounded-xl overflow-hidden bg-black group block ${colSpanClass}`}
      style={{
        aspectRatio: aspect,
        border: "1px solid rgba(168,85,247,0.22)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
        contentVisibility: "auto",
        containIntrinsicSize: "1px 300px",
      }}
    >
      {isImage ? (
        <img
          src={item.url}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full pointer-events-none"
          style={{
            objectFit: "cover",
            objectPosition: item.imagePosition || "center",
            background: "#000",
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={item.url}
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          disablePictureInPicture
          className="w-full h-full pointer-events-none"
          style={{ objectFit: "cover", background: "#000" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-55 group-hover:opacity-85 transition-opacity pointer-events-none" />
      <div
        className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(168,85,247,0.45)",
          boxShadow: "0 0 8px rgba(168,85,247,0.3)",
        }}
      >
        {isImage
          ? <ImageIcon size={11} className="text-white" />
          : <Play size={11} fill="white" className="text-white" />}
      </div>
    </button>
  );
}

export default memo(GalleryVideoCard);