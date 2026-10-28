import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { PARTIDOS } from '../data/partidos';
import { ArchivoNoticias, Noticia, recopilar } from './noticiasCore';
import { urlPublica } from './web';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'ok'; noticias: Noticia[]; actualizado: string; medios: string[]; iconos: Record<string, string> }
  | { tipo: 'error' }
  | { tipo: 'sin-archivo' }; // la web aún no tiene noticias.json

let cache: Promise<ArchivoNoticias> | null = null;

class SinArchivo extends Error {}

async function descargarTexto(url: string) {
  const r = await fetch(url);
  if (r.status === 404) throw new SinArchivo('404');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

// 1) noticias.json de la web, que GitHub Actions actualiza cada 3 horas.
// 2) En el móvil, si no está disponible, se leen los RSS directamente
//    (en el navegador no se puede: los medios no lo permiten desde otra web).
async function cargar(): Promise<ArchivoNoticias> {
  try {
    const hora = Math.floor(Date.now() / 36e5);
    const texto = await descargarTexto(urlPublica(`noticias.json?h=${hora}`));
    // En local, si no existe el archivo, el servidor devuelve la propia app (HTML).
    if (texto.trimStart().startsWith('<')) throw new SinArchivo('html');
    const datos = JSON.parse(texto) as ArchivoNoticias;
    if (!datos?.partidos) throw new Error('formato');
    return datos;
  } catch (e) {
    if (Platform.OS === 'web') throw e;
    const datos = await recopilar(descargarTexto, PARTIDOS.map((p) => p.id));
    if (datos.medios.length === 0) throw new Error('sin medios');
    return datos;
  }
}

export function useNoticias(partidoId: string) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vivo = true;
    setEstado({ tipo: 'cargando' });
    if (!cache || intento > 0) cache = cargar();
    cache
      .then((d) => vivo && setEstado({ tipo: 'ok', noticias: d.partidos[partidoId] ?? [], actualizado: d.actualizado, medios: d.medios ?? [], iconos: d.iconos ?? {} }))
      .catch((e) => {
        cache = null;
        if (vivo) setEstado({ tipo: e instanceof SinArchivo ? 'sin-archivo' : 'error' });
      });
    return () => {
      vivo = false;
    };
  }, [partidoId, intento]);

  return { estado, reintentar: () => setIntento((i) => i + 1) };
}

// «hace 5 min», «hace 3 h», «hace 2 días»
export function haceCuanto(iso: string, ahora = Date.now()): string {
  const min = Math.max(0, Math.round((ahora - Date.parse(iso)) / 6e4));
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}
