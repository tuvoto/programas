// Cambia «npm run deploy» para que copie las noticias ya publicadas en vez
// de descargar los 20 medios. Uso: node scripts/parche-deploy.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg.scripts.predeploy = 'npm run web:build && node scripts/noticias-actuales.mjs';
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('Listo: npm run deploy ya no descarga las noticias.');
