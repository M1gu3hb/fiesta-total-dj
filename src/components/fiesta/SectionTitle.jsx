import React from "react";
import { motion } from "framer-motion";

export default function SectionTitle({ title, subtitle, id }) {
  return (
    <motion.div
      id={id}
      className="text-center mb-10 md:mb-14 scroll-mt-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white neon-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-white/50 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
    </motion.div>
  );
}