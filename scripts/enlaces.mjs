// Revisa que los enlaces de TuVoto sigan funcionando: programas, BOE, fuentes
// oficiales, canales RSS de los medios y webs que enlaza la app.
// Uso:
//   node scripts/enlaces.mjs              → enlaces del código y PDFs locales
//   node scripts/enlaces.mjs --noticias   → además, los titulares publicados en la web
// Termina con error (código 1) si hay algún enlace roto, para que GitHub
// Actions avise por correo.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const conNoticias = process.argv.includes('--noticias');
const WEB = readFileSync('src/config.ts', 'utf8').match(/const WEB = '([^']+)'/)[1];

// Direcciones que no son páginas (se usan desde el código) o no se pueden abrir sin más.
const IGNORAR = [/\$\{/, /\.\.\.$/, /fonts\.googleapis\.com/, /gc\.zgo\.at/, /goatcounter\.com\/count/, /play\.google\.com/];

// 1. Enlaces escritos en el código y en las páginas estáticas.
function archivos(dir, ext) {
  const r = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) r.push(...archivos(p, ext));
    else if (ext.some((e) => n.endsWith(e))) r.push(p);
  }
  return r;
}
const donde = new Map(); // url → archivos donde aparece
for (const f of [...archivos('src', ['.ts', '.tsx']), ...archivos('public', ['.html'])]) {
  for (const m of readFileSync(f, 'utf8').matchAll(/https?:\/\/[^'"`\s)<>\]]+/g)) {
    const url = m[0].replace(/[.,;]+$/, '');
    if (IGNORAR.some((x) => x.test(url))) continue;
    if (!donde.has(url)) donde.set(url, new Set());
    donde.get(url).add(f);
  }
}

// 2. Los PDF de los programas que la app abre por la página exacta.
const faltan = [];
const partidos = readFileSync('src/data/partidos.ts', 'utf8');
for (const [, a] of partidos.matchAll(/archivo: '([^']+)'/g)) {
  if (!existsSync(join('public', a))) faltan.push(a);
}

// 3. Opcional: los titulares que se están publicando ahora en la web.
if (conNoticias) {
  try {
    const r = await fetch(`${WEB}/noticias.json`, { signal: AbortSignal.timeout(20000) });
    const datos = await r.json();
    for (const lista of Object.values(datos.partidos ?? {})) {
      for (const n of lista) if (n.url) donde.set(n.url, new Set(['noticias.json']));
    }
  } catch (e) {
    console.log(`⚠️  No se ha podido leer ${WEB}/noticias.json: ${e.message}`);
  }
}

const CABECERAS = {
  'User-Agent': 'Mozilla/5.0 (compatible; TuVoto/1.0; +https://tuvoto.github.io/programas)',
  Accept: '*/*',
};
async function comprobar(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const r = await fetch(url, { method, headers: CABECERAS, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      r.body?.cancel?.();
      if (r.ok) return { estado: 'ok', codigo: r.status };
      // Algunos servidores no aceptan HEAD: se prueba con GET antes de decidir.
      if (method === 'HEAD') continue;
      if ([401, 403, 405, 429].includes(r.status)) return { estado: 'bloqueado', codigo: r.status };
      return { estado: 'roto', codigo: r.status };
    } catch (e) {
      if (method === 'HEAD') continue;
      const codigo = e.cause?.code ?? e.name;
      // Webs con el certificado mal instalado (les falta el intermedio): el
      // navegador las abre bien, pero Node no puede comprobarlas.
      if (/CERT|SIGNATURE|ISSUER/.test(codigo)) return { estado: 'bloqueado', codigo };
      return { estado: 'roto', codigo };
    }
  }
}

// Varias a la vez, pero sin saturar a nadie.
const urls = [...donde.keys()].sort();
const resultados = [];
let i = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (i < urls.length) {
      const url = urls[i++];
      resultados.push({ url, ...(await comprobar(url)) });
    }
  }),
);

const rotos = resultados.filter((r) => r.estado === 'roto');
const bloqueados = resultados.filter((r) => r.estado === 'bloqueado');
console.log(`Revisados ${resultados.length} enlaces.\n`);
if (faltan.length) {
  console.log('❌ PDF de programas que no están en public/:');
  for (const a of faltan) console.log(`   ${a}`);
  console.log('');
}
if (rotos.length) {
  console.log('❌ Enlaces rotos:');
  for (const r of rotos) console.log(`   [${r.codigo}] ${r.url}\n         en ${[...donde.get(r.url)].join(', ')}`);
  console.log('');
}
if (bloqueados.length) {
  console.log('⚠️  No dejan comprobarlos automáticamente (ábrelos a mano):');
  for (const r of bloqueados) console.log(`   [${r.codigo}] ${r.url}`);
  console.log('');
}
// En GitHub Actions, además, cada fallo sale como aviso en la página de la
// ejecución (se ve sin abrir el registro y sin iniciar sesión).
if (process.env.GITHUB_ACTIONS) {
  for (const a of faltan) console.log(`::error title=Falta un PDF::${a}`);
  for (const r of rotos) console.log(`::error title=Enlace roto (${r.codigo})::${r.url} — en ${[...donde.get(r.url)].join(', ')}`);
}
if (!rotos.length && !faltan.length) console.log('✅ No hay enlaces rotos.');
process.exit(rotos.length || faltan.length ? 1 : 0);
