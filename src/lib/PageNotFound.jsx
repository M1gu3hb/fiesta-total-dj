import React from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import CleanLogo from "@/components/fiesta/Logo";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center text-center px-4">
      <CleanLogo imgClassName="w-24 h-24 object-contain mb-6 opacity-50" />
      <h1 className="font-display text-4xl font-bold text-white/80 neon-text">404</h1>
      <p className="text-white/40 mt-2 text-sm">Página no encontrada</p>
      <a
        href="/"
        className="mt-6 px-6 py-2.5 rounded-full border border-neon-purple/30 text-sm text-neon-purple hover:bg-neon-purple/10 transition-all"
      >
        Volver al inicio
      </a>
    </div>
  );
}