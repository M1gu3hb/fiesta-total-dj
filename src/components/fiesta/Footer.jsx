import React from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { Mail, Phone } from "lucide-react";
import CleanLogo from "@/components/fiesta/Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Logo & brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <CleanLogo imgClassName="w-16 h-16 object-contain" />
            <div className="text-center md:text-left">
              <p className="font-display text-sm font-bold text-white">
                {SITE_CONFIG.brandName}
              </p>
              <p className="text-white/30 text-xs">{SITE_CONFIG.tagline}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start gap-2.5 text-sm">
            <a
              href={`https://wa.me/${SITE_CONFIG.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-neon-purple transition-colors"
            >
              <Phone size={14} />
              {SITE_CONFIG.whatsappNumber}
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2 text-white/50 hover:text-neon-purple transition-colors"
            >
              <Mail size={14} />
              {SITE_CONFIG.email}
            </a>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-neon-purple/40 text-xs font-display tracking-wider">
            "{SITE_CONFIG.mainPhrase}"
          </p>
          <p className="text-white/15 text-xs mt-2">
            © {new Date().getFullYear()} {SITE_CONFIG.brandName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}