/*
  Galería real de Fiesta Total DJ's — 14 videos.
  
  La orientación se detecta en runtime con onLoadedMetadata (videoWidth vs videoHeight)
  porque desde URL no es posible saber si es vertical/horizontal con certeza.
  Hint inicial usado solo para layout antes de cargar metadata.
*/
export const GALLERY_VIDEOS = [
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/4a7dc05e4_gal1.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/cb55f4367_gal2.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/3a7a0cc4f_gal3.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/077b6f4e6_gal4.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/ce327e57f_gal5.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/750bb9652_gal6.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/3d268a1a0_gal7.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/0b62eb42e_gal8.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/0fa2ae07f_gal9.mp4",  hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/dd678028f_gal10.mp4", hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/b603b8c5c_gal11.mp4", hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/38d91fc8b_gal12.mp4", hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/a7cf31689_gal13.mp4", hint: "vertical", type: "video" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/63ec83da5_gal15.mp4", hint: "vertical", type: "video" },
  // ── Nuevos items galería 1–6 ─────────────────────────────────
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/92cd1e3af_Galeria1.mp4",  hint: "vertical",   type: "video" },
  { url: "/media/images/public/69f263dc709c74ed7d2f8111/dba54658d_Galeria2.jpg",   hint: "horizontal", type: "image" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/4c5739c96_Galeria3.mp4",  hint: "vertical",   type: "video" },
  { url: "/media/images/public/69f263dc709c74ed7d2f8111/10f63a079_Galeria4.jpg",   hint: "horizontal", type: "image" },
  { url: "/media/images/public/69f263dc709c74ed7d2f8111/4c7670b1f_Galeria5.jpg",   hint: "horizontal", type: "image" },
  { url: "/media/videos/public/69f263dc709c74ed7d2f8111/c3c153790_Galeria6.mp4",  hint: "vertical",   type: "video" },
];