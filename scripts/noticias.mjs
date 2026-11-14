// Genera noticias.json con los titulares recientes de cada partido.
// Uso: node --experimental-strip-types scripts/noticias.mjs [ruta de salida]
// (Node 22.6 o posterior). Lo ejecuta GitHub Actions cada 3 horas.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { PARTIDOS_NOTICIAS as PARTIDOS, fusionar, recopilar } from '../src/lib/noticiasCore.ts';
const salida = process.argv[2] ?? 'public/noticias.json';
// Opcional: carpeta con el histórico de titulares (rama «historico»). Si se
// indica, también se tienen en cuenta, para que ningún partido se quede sin
// noticias aunque hace días que los RSS no hablan de él.
const historico = process.argv[3];

const descargar = async (url) => {
  const r = await fetch(url, {
    headers: {
      // Algunos medios rechazan peticiones sin un navegador conocido.
      'User-Agent': 'Mozilla/5.0 (compatible; TuVoto/1.0; +https://tuvoto.github.io/programas)',
      Accept: '*/*',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
};

const nuevos = await recopilar(descargar, PARTIDOS, (m) => console.log(m), true);
if (nuevos.medios.length === 0) {
  console.error('Ningún medio ha respondido: se mantiene el archivo anterior.');
  process.exit(1);
}
// Se conservan las noticias del archivo anterior (las de los RSS duran poco).
let anterior = null;
try {
  if (existsSync(salida)) anterior = JSON.parse(readFileSync(salida, 'utf8'));
} catch {
  console.log('El archivo anterior no se ha podido leer: se empieza de cero.');
}
if (historico && existsSync(historico)) {
  const guardadas = [];
  for (const f of readdirSync(historico).filter((f) => f.endsWith('.json'))) {
    try {
      for (const { partidos, ...n } of JSON.parse(readFileSync(`${historico}/${f}`, 'utf8'))) guardadas.push(n);
    } catch {
      console.log(`Histórico: no se ha podido leer ${f}.`);
    }
  }
  console.log(`Histórico: ${guardadas.length} titulares.`);
  anterior = { ...nuevos, ...anterior, partidos: { ...anterior?.partidos, _historico: guardadas } };
}
const datos = fusionar(anterior, nuevos, PARTIDOS);
for (const [id, l] of Object.entries(datos.partidos)) console.log(`→ ${id}: ${l.length} noticias`);
writeFileSync(salida, JSON.stringify(datos));
console.log(`Guardado en ${salida}`);
process.exit(0);