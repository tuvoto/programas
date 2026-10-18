// Remata la web exportada (dist) para GitHub Pages:
// - 404.html: página «no encontrada» (y respaldo para enlaces antiguos).
// - sitemap.xml y robots.txt: para que Google encuentre todas las páginas.
// - Quita las copias duplicadas que Expo genera para el grupo (tabs).
import { copyFileSync, existsSync, readdirSync, rmSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const web = readFileSync('src/config.ts', 'utf8').match(/const WEB = '([^']+)'/)[1];

copyFileSync(join(DIST, existsSync(join(DIST, '+not-found.html')) ? '+not-found.html' : 'index.html'), join(DIST, '404.html'));
for (const f of ['(tabs)', '_sitemap.html']) rmSync(join(DIST, f), { recursive: true, force: true });

const paginas = [];
(function recorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) {
      if (!['_expo', 'assets', 'programas'].includes(n)) recorrer(p);
    } else if (n.endsWith('.html') && !n.startsWith('+') && !['404.html', 'privacidad.html', 'documento.html'].includes(n) && !n.includes('[')) {
      const ruta = '/' + relative(DIST, p).replace(/\\/g, '/').replace(/(index)?\.html$/, '');
      paginas.push(ruta);
    }
  }
})(DIST);
paginas.sort();
const hoy = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paginas.map((r) => `  <url><loc>${web}${r}</loc><lastmod>${hoy}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`,
);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${web}/sitemap.xml\n`);
console.log(`Web lista: ${paginas.length} páginas en el sitemap.`);
