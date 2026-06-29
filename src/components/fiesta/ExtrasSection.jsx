import React from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { Monitor, LayoutGrid, Sparkles, Lightbulb, Image, PartyPopper, ExternalLink } from "lucide-react";

const ICONS = [Monitor, LayoutGrid, Sparkles, Lightbulb, Image, PartyPopper];

/*
  Extras — layout clásico: imagen arriba + información abajo.
  - Imagen ocupa el ancho completo de la card, visible y clara.
  - Overlay muy suave para integrarse con el tema, sin oscurecerla.
  - Información debajo: título, precio, descripción, chips.
*/
export default function ExtrasSection() {
  return (
    <section id="extras" className="relative z-10 py-16 md:py-24 px-4">
      <SectionTitle
        title="Extras para elevar tu evento"
        subtitle="Complementos premium para hacer tu evento aún más espectacular."
      />

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {SITE_CONFIG.extras.map((extra, i) => {
          const IconComp = ICONS[i] || Sparkles;
          const waLink = extra.whatsappMsg
            ? `${SITE_CONFIG.whatsappLink}?text=${extra.whatsappMsg}`
            : null;

          return (
            <motion.div
              key={i}
              className="relative rounded-2xl overflow-hidden flex flex-col group glass-card"
              style={{
                border: "1px solid rgba(168,85,247,0.18)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{
                boxShadow: "0 0 22px rgba(168,85,247,0.22)",
                borderColor: "rgba(168,85,247,0.4)",
              }}
            >
              {/* ── IMAGE ON TOP — full width, clearly visible ── */}
              {extra.image && (
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <img
                    src={extra.image}
                    alt={extra.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: extra.imagePosition || "center" }}
                  />
                  {/* Suave overlay para integrar con el tema, no oscurecer */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(10,5,22,0.55) 100%)",
                    }}
                  />
                </div>
              )}

              {/* ── CONTENT BELOW ── */}
              <div className="relative flex flex-col flex-1 p-5 md:p-6">
                {/* Icon badge */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(168,85,247,0.22)",
                    border: "1px solid rgba(168,85,247,0.5)",
                  }}
                >
                  <IconComp
                    size={20}
                    className="text-neon-purple"
                    style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.7))" }}
                  />
                </div>

                {/* Title + price */}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2.5">
                  <h3 className="font-display font-semibold text-white text-lg leading-snug">
                    {extra.title}
                  </h3>
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-display font-semibold text-neon-magenta hover:text-white transition-colors"
                      title="Cotizar por WhatsApp"
                    >
                      {extra.price}
                      <ExternalLink size={10} className="opacity-70" />
                    </a>
                  ) : (
                    <span className="text-sm font-display font-semibold text-neon-magenta">
                      {extra.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed flex-1">
                  {extra.description}
                </p>

                {/* Size chips */}
                {extra.sizes && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {extra.sizes.map((s, j) => (
                      <span
                        key={j}
                        className="inline-block px-2.5 py-1 rounded-full text-xs border border-white/15 text-white/70 bg-black/30"
                      >
                        {s.label}:{" "}
                        <span className="text-neon-purple font-medium">{s.price}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Variant chips */}
                {extra.variants && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {extra.variants.map((v, j) => (
                      <span
                        key={j}
                        className="inline-block px-2.5 py-1 rounded-full text-xs border border-neon-purple/35 text-neon-purple/90 bg-black/30"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom neon line */}
                <div
                  className="mt-4 h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(168,85,247,0.35), transparent)",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}