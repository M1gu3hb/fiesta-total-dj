# Fiesta Total DJ's

Sitio web de **Fiesta Total DJ's** — DJ y producción integral de eventos (bodas, XV años,
eventos sociales y corporativos). Frontend en React + Vite + Tailwind.

Originalmente creado en Base44 y migrado a un proyecto independiente desplegado en Vercel.
No depende de Base44 ni de ningún backend: es una SPA estática. Todas las imágenes y videos
están auto-hospedados en `public/media/`.

## Desarrollo local

**Requisitos:** Node.js 18+ y npm.

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
```

## Build de producción

```bash
npm run build    # genera la carpeta dist/
npm run preview  # sirve el build localmente para verificar
```

## Despliegue

El proyecto está configurado para **Vercel**:

- **Framework:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Rewrites SPA:** definidos en `vercel.json` (todas las rutas sirven `index.html`).

No se requieren variables de entorno.

## Estructura

- `src/pages/Home.jsx` — página principal.
- `src/components/fiesta/` — secciones del sitio (hero, servicios, paquetes, galería, etc.).
- `src/components/ui/` — componentes UI (shadcn/Radix).
- `src/lib/` — configuración del sitio, datos de medios y utilidades.
- `public/media/` — imágenes y videos del sitio (auto-hospedados).
