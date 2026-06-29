import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { Wrench, Volume2, Package, MessageCircle } from "lucide-react";

const TRUST_BLOCKS = [
  {
    icon: Wrench,
    title: "Montaje profesional",
    desc: "Diseño visual y logístico adaptado a cada evento.",
  },
  {
    icon: Volume2,
    title: "Audio e iluminación de alto impacto",
    desc: "Equipo profesional para ambiente y potencia.",
  },
  {
    icon: Package,
    title: "Paquetes para distintos tamaños",
    desc: "Desde 30 hasta 400+ personas.",
  },
  {
    icon: MessageCircle,
    title: "Atención directa por WhatsApp",
    desc: "Respuesta rápida y cotización personalizada.",
  },
];

export default function AboutSection() {
  return (
    <section className="relative z-10 py-16 md:py-24 px-4">
      <SectionTitle
        title="Producción integral para eventos memorables"
      />

      <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
        <motion.p
          className="text-white/50 text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          En Fiesta Total DJ's diseñamos ambientes únicos, elegantes y llenos de energía para eventos sociales y corporativos. Combinamos DJ profesional, audio, iluminación, pantallas, pistas LED y animación para que cada momento se sienta como parte de un verdadero espectáculo.
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {TRUST_BLOCKS.map((block, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-xl p-5 flex items-start gap-4 hover:border-neon-purple/30 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="w-10 h-10 shrink-0 rounded-lg bg-neon-purple/10 flex items-center justify-center">
              <block.icon size={18} className="text-neon-purple" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{block.title}</h3>
              <p className="text-white/40 text-xs mt-1">{block.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}