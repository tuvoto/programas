// Cambio de una sola vez: web estática (una página por tema y partido, para
// Google). Toca solo dos líneas de app.json y package.json, sin borrar nada más.
import { readFileSync, writeFileSync } from 'node:fs';
const app = JSON.parse(readFileSync('app.json', 'utf8'));
app.expo.web.output = 'static';
writeFileSync('app.json', JSON.stringify(app, null, 2) + '\n');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg.scripts['web:build'] = 'expo export -p web && node scripts/web-final.mjs';
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('app.json y package.json actualizados.');
