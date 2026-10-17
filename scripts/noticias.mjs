// Genera noticias.json con los titulares recientes de cada partido.
// Uso: node --experimental-strip-types scripts/noticias.mjs [ruta de salida]
// (Node 22.6 o posterior). Lo ejecuta GitHub Actions cada 3 horas.
import { writeFileSync } from 'node:fs';
import { PARTIDOS_NOTICIAS as PARTIDOS, recopilar } from '../src/lib/noticiasCore.ts';
const salida = process.argv[2] ?? 'public/noticias.json';

const descargar = async (url) => {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Programas29N/1.0 (+https://github.com)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
};

const datos = await recopilar(descargar, PARTIDOS, (m) => console.log(m));
if (datos.medios.length === 0) {
  console.error('Ningún medio ha respondido: se mantiene el archivo anterior.');
  process.exit(1);
}
for (const [id, l] of Object.entries(datos.partidos)) console.log(`→ ${id}: ${l.length} noticias`);
writeFileSync(salida, JSON.stringify(datos));
console.log(`Guardado en ${salida}`);
