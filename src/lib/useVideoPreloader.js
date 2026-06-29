import { useEffect, useRef, useCallback, useState } from "react";

/*
  useVideoPreloader — cola de precarga progresiva de videos.

  Estrategia:
  - Crea elementos <video> ocultos (hidden buffer pool) que descargan
    el video sin reproducirlo, dejándolo en caché del navegador.
  - Concurrencia baja (2 simultáneos por defecto, 1 en redes lentas).
  - Respeta Save-Data y effectiveType (2g/slow-2g → solo metadata).
  - El pool se reutiliza: cuando un video termina canplay/canplaythrough,
    su elemento se libera y se asigna el siguiente.
  - Las URLs ya descargadas quedan en caché HTTP del navegador → cuando
    el modal hace <video src=...> usa la versión cacheada.

  API:
    const { preloadStage, getStatus } = useVideoPreloader(urls, options);

    preloadStage(stageIndex) — dispara la etapa N (0 = primeros, 1 = medios, etc.)
    getStatus(url) → "idle" | "preloading" | "ready" | "error"
*/

const STATUS_IDLE = "idle";
const STATUS_PRELOADING = "preloading";
const STATUS_METADATA = "metadataLoaded";
const STATUS_CAN_PLAY = "canPlay";
const STATUS_READY = "ready";
const STATUS_TIMEOUT = "timeout";
const STATUS_ERROR = "error";

function detectNetworkProfile() {
  if (typeof navigator === "undefined") return { saveData: false, slow: false };
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return { saveData: false, slow: false };
  return {
    saveData: !!conn.saveData,
    slow: conn.effectiveType === "2g" || conn.effectiveType === "slow-2g",
  };
}

export default function useVideoPreloader(urls, options = {}) {
  const { maxConcurrent = 2, stages = null } = options;

  const statusMapRef = useRef(new Map());
  const queueRef = useRef([]);
  const activeRef = useRef(new Set());
  const elementsRef = useRef([]); // pool de <video> ocultos
  const triggeredStagesRef = useRef(new Set());
  const [, setTick] = useState(0);

  const network = useRef(detectNetworkProfile());

  // Inicializar status para cada url
  useEffect(() => {
    urls.forEach((u) => {
      if (!statusMapRef.current.has(u)) {
        statusMapRef.current.set(u, STATUS_IDLE);
      }
    });
  }, [urls]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      elementsRef.current.forEach((el) => {
        try {
          el.removeAttribute("src");
          el.load();
          el.remove();
        } catch {}
      });
      elementsRef.current = [];
      activeRef.current.clear();
      queueRef.current = [];
    };
  }, []);

  const concurrencyLimit = network.current.slow ? 1 : maxConcurrent;

  const processQueue = useCallback(() => {
    while (
      activeRef.current.size < concurrencyLimit &&
      queueRef.current.length > 0
    ) {
      const url = queueRef.current.shift();
      const currentStatus = statusMapRef.current.get(url);
      if (currentStatus === STATUS_READY || currentStatus === STATUS_PRELOADING) {
        continue;
      }

      // Crear elemento oculto.
      // Sin crossOrigin: los videos son same-origin (assets del proyecto / Imgur con CORS abierto);
      // forzar anonymous puede romper la precarga en Safari/iOS sin beneficio aquí.
      const el = document.createElement("video");
      el.muted = true;
      el.playsInline = true;
      el.preload = network.current.saveData ? "metadata" : "auto";
      el.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;";
      el.src = url;

      let timeoutId = null;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        el.removeEventListener("loadedmetadata", onMeta);
        el.removeEventListener("canplay", onCanPlay);
        el.removeEventListener("canplaythrough", onReady);
        el.removeEventListener("error", onError);
        activeRef.current.delete(url);
        const idx = elementsRef.current.indexOf(el);
        if (idx >= 0) elementsRef.current.splice(idx, 1);
        try {
          el.removeAttribute("src");
          el.load();
          el.remove();
        } catch {}
        processQueue();
      };

      const onMeta = () => {
        // Sube de "preloading" → "metadataLoaded" SOLO si no hay algo mejor ya.
        const s = statusMapRef.current.get(url);
        if (s === STATUS_PRELOADING || s === STATUS_IDLE) {
          statusMapRef.current.set(url, STATUS_METADATA);
          setTick((t) => t + 1);
        }
      };

      const onCanPlay = () => {
        const s = statusMapRef.current.get(url);
        if (s !== STATUS_READY) {
          statusMapRef.current.set(url, STATUS_CAN_PLAY);
          setTick((t) => t + 1);
        }
        // No hacemos cleanup aquí: dejamos que canplaythrough llegue si puede.
      };

      const onReady = () => {
        // Solo READY si canplaythrough disparó o readyState alcanzó HAVE_ENOUGH_DATA.
        if (el.readyState >= 4) {
          statusMapRef.current.set(url, STATUS_READY);
        } else {
          statusMapRef.current.set(url, STATUS_CAN_PLAY);
        }
        setTick((t) => t + 1);
        cleanup();
      };

      const onError = () => {
        statusMapRef.current.set(url, STATUS_ERROR);
        setTick((t) => t + 1);
        cleanup();
      };

      el.addEventListener("loadedmetadata", onMeta);
      el.addEventListener("canplay", onCanPlay);
      el.addEventListener("canplaythrough", onReady, { once: true });
      el.addEventListener("error", onError, { once: true });

      // Safety timeout (15s): libera el slot pero NO marca ready falsamente.
      // El estado final depende de qué eventos alcanzaron a dispararse / readyState real.
      timeoutId = setTimeout(() => {
        if (!activeRef.current.has(url)) return;
        const current = statusMapRef.current.get(url);
        // Solo degradar si seguía en preloading/metadata/canPlay (no pisar READY/ERROR).
        if (current === STATUS_PRELOADING) {
          statusMapRef.current.set(url, STATUS_TIMEOUT);
        }
        // Si ya estaba en metadataLoaded o canPlay, lo dejamos como está
        // (esos estados ya son útiles para el modal).
        setTick((t) => t + 1);
        cleanup();
      }, 15000);

      document.body.appendChild(el);
      elementsRef.current.push(el);
      activeRef.current.add(url);
      statusMapRef.current.set(url, STATUS_PRELOADING);
      try {
        el.load();
      } catch {}
    }
  }, [concurrencyLimit]);

  // Dispara una etapa. Stages: array de arrays de URLs.
  const preloadStage = useCallback(
    (stageIndex) => {
      if (!stages || !stages[stageIndex]) return;
      if (triggeredStagesRef.current.has(stageIndex)) return;
      triggeredStagesRef.current.add(stageIndex);

      const stageUrls = stages[stageIndex];
      stageUrls.forEach((u) => {
        const s = statusMapRef.current.get(u);
        if (s !== STATUS_READY && s !== STATUS_PRELOADING) {
          if (!queueRef.current.includes(u)) {
            queueRef.current.push(u);
          }
        }
      });
      processQueue();
    },
    [stages, processQueue]
  );

  const getStatus = useCallback(
    (url) => statusMapRef.current.get(url) || STATUS_IDLE,
    []
  );

  return { preloadStage, getStatus };
}