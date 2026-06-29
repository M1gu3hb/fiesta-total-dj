import React, { useState, useRef, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { MessageCircle, Phone, Mail, ChevronDown, Check } from "lucide-react";

// ── Custom Select ──────────────────────────────────────────────
function NeonSelect({ placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-left
          bg-white/5 border
          ${open
            ? "border-neon-purple/60 ring-1 ring-neon-purple/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
            : "border-white/10 hover:border-neon-purple/30"
          }
        `}
      >
        <span className={value ? "text-white" : "text-white/30"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 text-neon-purple/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1.5 rounded-lg border border-neon-purple/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-y-auto"
            style={{
              background: "rgba(12, 8, 28, 0.97)",
              backdropFilter: "blur(16px)",
              transformOrigin: "top",
              maxHeight: "220px",
            }}
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-all duration-150
                    ${value === opt.value
                      ? "bg-neon-purple/20 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  {opt.label}
                  {value === opt.value && <Check size={12} className="text-neon-purple flex-shrink-0" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Options ────────────────────────────────────────────────────
const TIPO_OPTIONS = [
  { value: "Boda", label: "Boda" },
  { value: "XV años", label: "XV años" },
  { value: "Cumpleaños", label: "Cumpleaños" },
  { value: "Evento corporativo", label: "Evento corporativo" },
  { value: "Graduación", label: "Graduación" },
  { value: "Bautizo / Primera comunión", label: "Bautizo / Primera comunión" },
  { value: "Fiesta privada", label: "Fiesta privada" },
  { value: "Evento escolar", label: "Evento escolar" },
  { value: "Posada", label: "Posada" },
  { value: "Otro", label: "Otro" },
];

const EXTRA_PAQUETE_OPTIONS = [
  { value: "No estoy seguro, quiero recomendación", label: "No estoy seguro, quiero recomendación" },
  { value: "Solo quiero cotizar extras", label: "Solo quiero cotizar extras" },
];

// ── ContactSection ─────────────────────────────────────────────
const INITIAL_FORM = {
  nombre: "",
  tipo: "",
  tipoPersonalizado: "",
  fecha: "",
  lugar: "",
  invitados: "",
  paquete: "",
  mensaje: "",
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/30 focus:shadow-[0_0_12px_rgba(168,85,247,0.2)] transition-all duration-200";

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM);

  const paqueteOptions = [
    ...SITE_CONFIG.packages.map((p) => ({
      value: p.name,
      label: `${p.name} — ${p.price}`,
    })),
    ...EXTRA_PAQUETE_OPTIONS,
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendWhatsApp = () => {
    const tipoFinal =
      form.tipo === "Otro" && form.tipoPersonalizado
        ? `Otro: ${form.tipoPersonalizado}`
        : form.tipo;

    const lines = [
      "Hola, quiero cotizar Fiesta Total DJ's.",
      "",
      `Nombre: ${form.nombre}`,
      `Tipo de evento: ${tipoFinal}`,
      `Fecha: ${form.fecha}`,
      `Lugar: ${form.lugar}`,
      `Número de invitados: ${form.invitados}`,
      `Paquete de interés: ${form.paquete}`,
      `Mensaje: ${form.mensaje}`,
    ].join("\n");

    const url = `${SITE_CONFIG.whatsappLink}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="contacto" className="relative z-10 py-16 md:py-24 px-4">
      <SectionTitle
        title="¿Listo para llevar tu evento al siguiente nivel?"
        subtitle="Cuéntanos la fecha, tipo de evento y número de invitados. Te ayudamos a elegir el paquete ideal."
      />

      <div className="max-w-4xl mx-auto">
        {/* Quick buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={`${SITE_CONFIG.whatsappLink}?text=${SITE_CONFIG.whatsappDefaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
          >
            <MessageCircle size={18} />
            Cotizar por WhatsApp
          </a>
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-neon-purple/30 text-white font-medium text-sm hover:bg-neon-purple/10 transition-all"
          >
            <Phone size={18} />
            Llamar ahora
          </a>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/10 text-white/70 font-medium text-sm hover:bg-white/5 transition-all"
          >
            <Mail size={18} />
            Enviar correo
          </a>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="glass-card rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <input
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              className={inputClass}
            />

            {/* Tipo de evento — custom select */}
            <NeonSelect
              placeholder="Tipo de evento"
              options={TIPO_OPTIONS}
              value={form.tipo}
              onChange={(v) => setForm({ ...form, tipo: v, tipoPersonalizado: "" })}
            />

            {/* Campo condicional "Otro" — ocupa ambas columnas */}
            <AnimatePresence>
              {form.tipo === "Otro" && (
                <motion.div
                  className="sm:col-span-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    name="tipoPersonalizado"
                    placeholder="Especifica tu tipo de evento"
                    value={form.tipoPersonalizado}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fecha */}
            <div className="relative w-full">
              {!form.fecha && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30 pointer-events-none select-none">
                  Fecha del evento
                </span>
              )}
              <input
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                className={`${inputClass} [color-scheme:dark] ${!form.fecha ? "text-transparent" : "text-white"}`}
              />
            </div>

            {/* Lugar */}
            <input
              name="lugar"
              placeholder="Lugar del evento"
              value={form.lugar}
              onChange={handleChange}
              className={inputClass}
            />

            {/* Invitados */}
            <input
              name="invitados"
              placeholder="Número de invitados"
              value={form.invitados}
              onChange={handleChange}
              className={inputClass}
            />

            {/* Paquete de interés — custom select */}
            <NeonSelect
              placeholder="Paquete de interés"
              options={paqueteOptions}
              value={form.paquete}
              onChange={(v) => setForm({ ...form, paquete: v })}
            />
          </div>

          {/* Mensaje */}
          <textarea
            name="mensaje"
            placeholder="Mensaje o detalles adicionales..."
            value={form.mensaje}
            onChange={handleChange}
            rows={3}
            className={`${inputClass} mt-4 resize-none`}
          />

          {/* Submit */}
          <button
            onClick={sendWhatsApp}
            className="mt-5 w-full py-3.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
          >
            <MessageCircle size={18} />
            Enviar por WhatsApp
          </button>
        </motion.div>

        {/* Cobertura */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <h3
            className="font-display font-extrabold tracking-[0.08em] uppercase text-2xl sm:text-3xl md:text-4xl text-white"
            style={{
              textShadow:
                "0 0 14px rgba(168,85,247,0.55), 0 0 28px rgba(217,70,239,0.35), 0 0 48px rgba(168,85,247,0.18)",
            }}
          >
            CDMX y Área Metropolitana
          </h3>
          <p className="mt-2 text-sm sm:text-base font-medium text-neon-purple/90 tracking-wide">
            ¡Pregunta cobertura y disponibilidad!
          </p>
        </motion.div>
      </div>
    </section>
  );
}