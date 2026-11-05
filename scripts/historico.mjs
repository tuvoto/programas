// Va guardando todos los titulares que publica TuVoto para tener un histórico
// (por ejemplo, para analizar la cobertura de cada partido en el TFG).
// Uso: node scripts/historico.mjs <noticias.json> <carpeta del histórico> [fecha]
// (la fecha opcional es la de «vista»; si no se pone, la de ahora)
// Lo ejecuta GitHub Actions cada vez que actualiza las noticias. El histórico
// vive en la rama «historico» del repositorio, que no se publica en la web.
//
// Un archivo por mes (2026-11.json) con una lista de titulares sin repetir:
//   { titulo, medio, url, fecha, partidos: [ids], vista: primera vez que salió }
// No se guardan las fotos de los medios, solo el enlace a la noticia.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [entrada, carpeta, cuando] = process.argv.slice(2);
if (!entrada || !carpeta) {
  console.error('Uso: node scripts/historico.mjs <noticias.json> <carpeta>');
  process.exit(1);
}
const datos = JSON.parse(readFileSync(entrada, 'utf8'));
const ahora = cuando ? new Date(cuando).toISOString() : new Date().toISOString();
mkdirSync(carpeta, { recursive: true });

// Junta las noticias de todos los partidos (una misma noticia puede salir en varios).
const nuevas = new Map();
for (const [partido, lista] of Object.entries(datos.partidos ?? {})) {
  for (const n of Array.isArray(lista) ? lista : []) {
    if (!n?.url || !n?.fecha) continue;
    const ya = nuevas.get(n.url);
    if (ya) ya.partidos.add(partido);
    else nuevas.set(n.url, { titulo: n.titulo, medio: n.medio, url: n.url, fecha: n.fecha, partidos: new Set([partido]) });
  }
}

// Las reparte por el mes de su fecha y las mezcla con lo que ya había.
const porMes = new Map();
for (const n of nuevas.values()) {
  const mes = n.fecha.slice(0, 7);
  if (!porMes.has(mes)) porMes.set(mes, []);
  porMes.get(mes).push(n);
}
let añadidas = 0;
for (const [mes, lista] of porMes) {
  const ruta = join(carpeta, `${mes}.json`);
  const previas = existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : [];
  const indice = new Map(previas.map((n) => [n.url, n]));
  for (const n of lista) {
    const ya = indice.get(n.url);
    if (ya) {
      ya.partidos = [...new Set([...ya.partidos, ...n.partidos])].sort();
    } else {
      indice.set(n.url, { ...n, partidos: [...n.partidos].sort(), vista: ahora });
      añadidas++;
    }
  }
  const todas = [...indice.values()].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.url.localeCompare(b.url));
  writeFileSync(ruta, JSON.stringify(todas, null, 1) + '\n');
}
console.log(`Histórico: ${añadidas} nuevos de ${nuevas.size} titulares.`);
