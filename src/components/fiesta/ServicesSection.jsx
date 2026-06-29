import React from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import {
  Disc3, Speaker, Lightbulb, LayoutGrid, Monitor,
  Music, Sparkles, Mic, Zap,
} from "lucide-react";

const ICON_MAP = {
  Disc3, Speaker, Lightbulb, LayoutGrid, Monitor,
  Music, Sparkles, Mic, Zap,
};

// AI-generated images — one per service, premium dark neon aesthetic
const SERVICE_BG = [
  // 1. DJ para bodas, XV años y corporativos
  "/media/images/public/69f263dc709c74ed7d2f8111/dfc49c773_generated_image.png",
  // 2. Audio profesional
  "/media/images/public/69f263dc709c74ed7d2f8111/4e2e365d2_generated_image.png",
  // 3. Iluminación robótica y láser RGB
  "/media/images/public/69f263dc709c74ed7d2f8111/0958fa285_generated_image.png",
  // 4. Pistas iluminadas LED pixel — foto real (horizontal)
  "/media/images/public/69f263dc709c74ed7d2f8111/03f0af66c_pista4.jpg",
  // 5. Mega pantallas LED — foto real (horizontal)
  "/media/images/public/69f263dc709c74ed7d2f8111/7afcb79d3_pantalla1.jpg",
  // 6. Cabina DJ iluminada
  "/media/images/public/69f263dc709c74ed7d2f8111/134881daf_generated_image.png",
  // 7. Shows interactivos — foto real (robots LED zancos azul/verde)
  "/media/images/public/69f263dc709c74ed7d2f8111/dccc1d190_Showsinteractivos3.jpeg",
  // 8. Karaoke de cortesía
  "/media/images/public/69f263dc709c74ed7d2f8111/19f1bcee7_generated_image.png",
  // 9. Producción integral de eventos — foto real (iluminación arquitectónica 3)
  "/media/images/public/69f263dc709c74ed7d2f8111/d4b38d783_iluminacionarquitectonica3.jpg",
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="relative z-10 py-16 md:py-24 px-4">
      <SectionTitle
        title="Servicios para hacer de tu evento un show"
        subtitle="Convierte tu evento en un espectáculo."
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {SITE_CONFIG.services.map((service, i) => {
          const IconComp = ICON_MAP[service.icon] || Zap;
          const bgUrl = SERVICE_BG[i] || SERVICE_BG[0];
          // Cards 4 (Pistas LED) y 5 (Pantallas LED) usan fotos reales → filtro morado premium extra
          const isLedReal = i === 3 || i === 4;

          return (
            <motion.div
              key={i}
              className="relative rounded-xl overflow-hidden group cursor-default"
              style={{
                border: "1px solid rgba(168,85,247,0.15)",
                boxShadow: "0 0 0 0 rgba(168,85,247,0)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{
                boxShadow: "0 0 22px rgba(168,85,247,0.2)",
                borderColor: "rgba(168,85,247,0.4)",
              }}
            >
              {/* Background image — brightness boosted for visibility */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${bgUrl})`,
                  filter: isLedReal
                    ? "brightness(0.95) contrast(1.06) saturate(1.15)"
                    : "brightness(1.22) contrast(1.05)",
                }}
              />

              {/* Dark overlay — slightly lighter to let image breathe */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(10,10,20,0.68) 0%, rgba(20,10,40,0.76) 100%)",
                }}
              />
              {/* Extra purple tint layer — más intenso en LED real para armonizar */}
              <div
                className={`absolute inset-0 transition-colors duration-500 ${
                  isLedReal
                    ? "bg-neon-purple/15 group-hover:bg-neon-purple/20"
                    : "bg-neon-purple/5 group-hover:bg-neon-purple/10"
                }`}
              />
              {/* Purple glow blob — solo en LED real */}
              {isLedReal && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.22) 0%, transparent 60%)",
                  }}
                />
              )}

              {/* Content */}
              <div className="relative z-10 p-5 md:p-6">
                <div className="w-10 h-10 rounded-lg bg-neon-purple/15 flex items-center justify-center mb-3 group-hover:bg-neon-purple/25 transition-colors border border-neon-purple/20">
                  <IconComp size={20} className="text-neon-purple drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                </div>
                <h3 className="font-semibold text-white text-base mb-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  {service.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                  {service.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}