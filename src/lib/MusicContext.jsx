import React, { createContext, useContext, useState, useRef, useCallback } from "react";

/*
  MusicContext — controla la música general "Activar experiencia".
  Expone:
    - isPlaying            : si la música general está reproduciéndose
    - setIsPlaying         : usado por MusicController para actualizar el estado
    - registerMusicPauser  : MusicController registra aquí una función que silencia/reanuda
                             el audio sin tocar el estado isPlaying (que sigue siendo el "user intent")
    - requestAudioFocus    : un video lo llama cuando va a sonar → silencia la música si está activa
                             y guarda que estaba activa para restaurarla luego.
    - releaseAudioFocus    : el video lo llama cuando se mutea/cierra → restaura música si estaba activa.

  Lógica:
    - Cuando un video toma "audio focus", la música se silencia temporalmente.
    - Cuando lo suelta, si estaba sonando antes, se restaura.
    - Solo un "owner" puede tener el foco a la vez. Si llega otro, el anterior pierde.
*/

const MusicContext = createContext({
  isPlaying: false,
  setIsPlaying: () => {},
  registerMusicPauser: () => () => {},
  requestAudioFocus: () => {},
  releaseAudioFocus: () => {},
});

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Función registrada por MusicController para silenciar/reanudar la música general
  // sin cambiar el estado isPlaying (queremos "recordar" que el usuario activó música).
  const pauserRef = useRef(null);

  // Quien está dueño del foco de audio (un id de video) y si la música estaba activa al tomarlo
  const focusOwnerRef = useRef(null);
  const wasPlayingBeforeFocusRef = useRef(false);

  const registerMusicPauser = useCallback((fn) => {
    pauserRef.current = fn;
    return () => {
      if (pauserRef.current === fn) pauserRef.current = null;
    };
  }, []);

  const requestAudioFocus = useCallback((ownerId) => {
    // Si ya había un dueño distinto, lo registramos como "perdido" (su video debería mutearse;
    // los componentes que escuchan UNMUTE_EVENT global ya lo manejan en su lógica local).
    focusOwnerRef.current = ownerId;
    // Capturar SOLO la primera vez que tomamos el foco si no estaba ya tomado
    if (wasPlayingBeforeFocusRef.current === false) {
      wasPlayingBeforeFocusRef.current = isPlaying;
    }
    // Silenciar/pausar música general si está sonando
    if (isPlaying && pauserRef.current) {
      pauserRef.current("pause");
    }
  }, [isPlaying]);

  const releaseAudioFocus = useCallback((ownerId) => {
    // Solo el dueño actual puede liberar el foco
    if (focusOwnerRef.current !== ownerId) return;
    focusOwnerRef.current = null;
    const shouldResume = wasPlayingBeforeFocusRef.current;
    wasPlayingBeforeFocusRef.current = false;
    if (shouldResume && pauserRef.current) {
      pauserRef.current("resume");
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        registerMusicPauser,
        requestAudioFocus,
        releaseAudioFocus,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicState() {
  return useContext(MusicContext);
}