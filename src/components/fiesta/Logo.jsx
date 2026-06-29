import React, { useEffect, useRef, useState } from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";

/**
 * CleanLogo — loads the logo PNG, strips the white/grey
 * checkerboard background via canvas pixel manipulation,
 * and renders the clean logo with true transparency.
 */
export default function CleanLogo({ className = "", imgClassName = "", alt }) {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove checkerboard: pixels that are light grey or white
      // Checkerboard is typically #ffffff (255,255,255) and #cccccc / #c0c0c0 range
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Detect near-white or light-grey pixels (the checkerboard squares)
        // These are achromatic (r≈g≈b) and bright (value > 180)
        const isAchromatic = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20;
        const isBright = r > 180 && g > 180 && b > 180;

        if (isAchromatic && isBright && a > 200) {
          // Make transparent
          data[i + 3] = 0;
        } else if (isAchromatic && isBright && a > 100) {
          // Partial transparency for anti-aliased edges
          data[i + 3] = Math.round(((255 - r) / 255) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      // Fallback: use original src
      setDataUrl(SITE_CONFIG.logoUrl);
    };
    img.src = SITE_CONFIG.logoUrl;
  }, []);

  if (!dataUrl) {
    // While processing, show nothing (avoids flash of checkerboard)
    return <div className={className} />;
  }

  return (
    <img
      src={dataUrl}
      alt={alt || SITE_CONFIG.brandName}
      className={imgClassName || className}
    />
  );
}