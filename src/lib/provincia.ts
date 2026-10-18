// Provincia elegida por la persona («¿Dónde votas?»). Se comparte entre
// pantallas y, en la web, se recuerda en el navegador. En el móvil dura
// mientras la app está abierta.
import { useEffect, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

const CLAVE = 'tuvoto:provincia';
let actual: string | null = null;
let leida = false;
const avisos = new Set<() => void>();

function leerGuardada() {
  if (leida) return;
  leida = true;
  if (Platform.OS !== 'web') return;
  try {
    const v = window.localStorage.getItem(CLAVE);
    if (v) cambiar(v);
  } catch {
    // Navegación privada o almacenamiento bloqueado: no pasa nada.
  }
}

function cambiar(id: string | null) {
  actual = id;
  avisos.forEach((f) => f());
}

export function elegirProvincia(id: string | null) {
  cambiar(id);
  if (Platform.OS !== 'web') return;
  try {
    if (id) window.localStorage.setItem(CLAVE, id);
    else window.localStorage.removeItem(CLAVE);
  } catch {
    // Ignorado: la elección sigue funcionando mientras la página esté abierta.
  }
}

export function useProvincia(): string | null {
  const valor = useSyncExternalStore(
    (f) => {
      avisos.add(f);
      return () => avisos.delete(f);
    },
    () => actual,
    () => null, // en la web generada de antemano todavía no hay provincia
  );
  // Se lee lo guardado después de montar, para no descuadrar la página generada.
  useEffect(leerGuardada, []);
  return valor;
}
