import React from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import SectionTitle from "./SectionTitle";
import PackageCard from "./PackageCard";

export default function PackagesSection() {
  return (
    <section className="relative z-10 py-16 md:py-24 px-4">
      <SectionTitle
        id="paquetes"
        title="Paquetes Fiesta Total DJ's"
        subtitle="Desde reuniones íntimas hasta eventos de gran escala, cada paquete está diseñado para crear ambiente, presencia y energía en tu evento."
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {SITE_CONFIG.packages.map((pkg, i) => (
          <PackageCard key={i} pkg={pkg} index={i} />
        ))}
      </div>
    </section>
  );
}