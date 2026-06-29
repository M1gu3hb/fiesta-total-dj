import React, { useState, useRef } from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import PackageMediaButton from "./PackageMediaButton";
import PackageMediaModal from "./PackageMediaModal";

export default function PackageCard({ pkg, index }) {
  const [expanded, setExpanded] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const cardRef = useRef(null);

  const whatsappMsg = encodeURIComponent(
    `Hola, quiero cotizar el ${pkg.name} de Fiesta Total DJ's para mi evento.`
  );

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card rounded-2xl overflow-hidden flex flex-col ${
        pkg.featured
          ? "border-neon-purple/40 shadow-[0_0_25px_rgba(168,85,247,0.2)]"
          : pkg.premium
          ? "border-neon-magenta/30 shadow-[0_0_25px_rgba(217,70,239,0.15)]"
          : ""
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-5 md:p-6 pb-4">
        {(pkg.featured || pkg.premium) && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-neon-purple to-neon-magenta text-white mb-3">
            {pkg.premium ? "★ Premium" : "★ Popular"}
          </span>
        )}
        <h3 className="font-display text-lg md:text-xl font-bold text-white">
          {pkg.name}
        </h3>
        <p className="text-neon-purple/70 text-sm mt-1">{pkg.label}</p>
        <p className="text-white/40 text-xs mt-1">{pkg.range}</p>
        <div className="mt-3">
          <span className="font-display text-3xl md:text-4xl font-bold text-white">
            {pkg.price}
          </span>
          <span className="text-white/30 text-sm ml-1">MXN</span>
        </div>
        {pkg.upgradeText && (
          <p className="text-neon-magenta/50 text-xs mt-2">{pkg.upgradeText}</p>
        )}
      </div>

      {/* Highlights */}
      <div className="px-5 md:px-6 flex-1">
        <div className="border-t border-white/5 pt-4 space-y-2.5">
          {pkg.highlights.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check size={14} className="text-neon-purple mt-0.5 shrink-0" />
              <span className="text-white/60 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* Expandable full details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 text-sm mt-4 transition-all duration-300 font-medium
            ${expanded
              ? "text-neon-purple/70 hover:text-neon-purple"
              : "text-neon-purple hover:text-white animate-[ver-detalle-pulse_2.8s_ease-in-out_infinite]"
            }`}
          style={!expanded ? {
            textShadow: "0 0 10px rgba(168,85,247,0.6), 0 0 20px rgba(168,85,247,0.25)",
          } : {}}
        >
          {expanded ? "Ocultar detalles" : "Ver detalle completo"}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1 space-y-2">
                {pkg.fullDetails.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check size={12} className="text-neon-purple/40 mt-0.5 shrink-0" />
                    <span className="text-white/40 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="p-5 md:p-6 pt-4 mt-auto space-y-3">
        {/* Ver imágenes del paquete — green premium pulsing CTA */}
        <PackageMediaButton onClick={() => setMediaOpen(true)} />

        {/* Cotizar este paquete */}
        <a
          href={`${SITE_CONFIG.whatsappLink}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
        >
          <MessageCircle size={16} />
          Cotizar este paquete
        </a>
      </div>

      {/* Media modal — portal-like, controlled per-card */}
      <PackageMediaModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        pkg={pkg}
        triggerRef={cardRef}
      />
    </motion.div>
  );
}