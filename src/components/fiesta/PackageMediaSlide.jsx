import React, { memo } from "react";
import PackageMediaVideo from "./PackageMediaVideo";

/*
  PackageMediaSlide — un slide grande mobile-first del visor vertical.
  - Una imagen o video por slide, protagonista en pantalla.
  - NO crea observer propio: el viewer decide isActive y near (vecino cercano).
  - Si NO es near → renderiza placeholder ligero (sin <video>, sin descarga).
  - Memoizado: solo re-renderiza si cambian sus props.

  Props:
    item        — { type, url, poster?, caption? }
    modalOpen   — boolean
    isActive    — boolean (slide visible ≥ 60%)
    near        — boolean (índice activo ±1) → solo aquí montamos video real
*/
function PackageMediaSlide({ item, modalOpen, isActive, near }) {
  const isVideo = item.type === "video";

  return (
    <div
      data-pkg-slide
      className="relative w-full flex items-center justify-center"
      style={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        minHeight: "78vh",
        padding: "12px 0",
        // content-visibility ayuda al navegador a saltar pintado de slides fuera de vista
        contentVisibility: "auto",
        containIntrinsicSize: "1px 78vh",
      }}
    >
      <div
        className="relative w-full max-w-[640px] mx-auto rounded-2xl overflow-hidden bg-black"
        style={{
          maxHeight: "74vh",
          aspectRatio: "9 / 14",
          border: "1px solid rgba(168,85,247,0.3)",
          // box-shadow ligero — el glow grande costaba caro al hacer scroll
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        {isVideo ? (
          near ? (
            <PackageMediaVideo
              src={item.url}
              poster={item.poster}
              modalOpen={modalOpen}
              isActive={isActive}
            />
          ) : (
            // Placeholder ligero — no monta <video>, no descarga ni decodifica
            <VideoPlaceholder poster={item.poster} />
          )
        ) : (
          <img
            src={item.url}
            alt={item.caption || ""}
            loading="lazy"
            decoding="async"
            className="w-full h-full"
            style={{
              objectFit: "contain",
              background: "#000",
            }}
          />
        )}

        {item.caption && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/85 to-transparent pointer-events-none">
            <p className="text-white/90 text-sm">{item.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoPlaceholder({ poster }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: poster
          ? `#000 url(${poster}) center/contain no-repeat`
          : "#0a0518",
      }}
    >
      {!poster && (
        <div
          className="w-12 h-12 rounded-full border border-neon-purple/40"
          style={{ background: "rgba(168,85,247,0.12)" }}
        />
      )}
    </div>
  );
}

// Memoize: solo re-renderiza si cambia algo relevante
export default memo(PackageMediaSlide, (prev, next) => {
  return (
    prev.item === next.item &&
    prev.modalOpen === next.modalOpen &&
    prev.isActive === next.isActive &&
    prev.near === next.near
  );
});