// Provincia elegida en Partidos («¿Dónde votas?»). Solo vale mientras estás en
// esa pestaña (y en las fichas de partido que abras desde ella): al pasar a
// Temas o a Vota se borra y Partidos vuelve a mostrar toda España. No se guarda
// entre sesiones: al volver a abrir la app o la web, se pregunta otra vez.
import { useSyncExternalStore } from 'react';

let actual: string | null = null;
const avisos = new Set<() => void>();

function cambiar(id: string | null) {
  if (actual === id) return;
  actual = id;
  avisos.forEach((f) => f());
}

export function elegirProvincia(id: string | null) {
  cambiar(id);
}

export function useProvincia(): string | null {
  return useSyncExternalStore(
    (f) => {
      avisos.add(f);
      return () => avisos.delete(f);
    },
    () => actual,
    () => null,
  );
}

// Se pregunta «¿Dónde votas?» solo la primera vez que se entra en Partidos en
// cada sesión.
let preguntado = false;
export function tocaPreguntar(): boolean {
  if (preguntado || actual) return false;
  preguntado = true;
  return true;
}
