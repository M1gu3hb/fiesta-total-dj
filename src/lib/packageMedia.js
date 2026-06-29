// ============================================================
// PACKAGE MEDIA — Estructura central de imágenes/videos por paquete
// ============================================================
//
// Estructura de cada item:
//   { type: "image", url: "https://...jpg", caption?: "..." }
//   { type: "video", url: "https://...mp4", poster?: "...jpg", caption?: "..." }
//
// El campo `mediaKey` de cada paquete (en siteConfig.js) debe coincidir
// con la key usada aquí.
// ============================================================

export const PACKAGE_MEDIA = {
  basico: [
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/9b11c29e2_wefsdrfgh.jpeg",
    },
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/ccdd90694_WhatsAppImage2026-05-14at120312.jpg",
    },
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/87a7105f8_fwfw.jpeg",
    },
    {
      type: "video",
      url: "/media/videos/public/69f263dc709c74ed7d2f8111/8e5294a9c_jhgfd.mp4",
    },
  ],
  basicoEstelar: [
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/eebab1017_estelar.jpg",
    },
  ],
  medio: [
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/2a0772408_medio.jpg",
    },
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/27dd353c5_WhatsAppImage2026-05-14at120952.jpg",
    },
  ],
  completoDj: [
    {
      type: "video",
      url: "/media/videos/public/69f263dc709c74ed7d2f8111/4bc37dfd6_comple3.mp4",
    },
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/d193dd486_comple5.jpg",
    },
    {
      type: "video",
      url: "/media/videos/public/69f263dc709c74ed7d2f8111/4c77e466c_comple6.mp4",
    },
    {
      type: "video",
      url: "/media/videos/public/69f263dc709c74ed7d2f8111/f8e330421_comple7.mp4",
    },
  ],
  vip: [
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/058865cc8_vip1.jpg",
    },
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/15fce970b_vip2.jpg",
    },
    {
      type: "image",
      url: "/media/images/public/69f263dc709c74ed7d2f8111/91084ee1f_vip3.jpg",
    },
    {
      type: "video",
      url: "/media/videos/public/69f263dc709c74ed7d2f8111/b3d6ccc5e_vip4.mp4",
    },
  ],
};

// Helper para resolver media por key del paquete
export function getPackageMedia(key) {
  if (!key) return [];
  return PACKAGE_MEDIA[key] || [];
}