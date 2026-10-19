// Copia en dist/ las noticias que ya están publicadas en la web, para que
// «npm run deploy» no tenga que descargar los 20 medios (tarda mucho).
// Las noticias se siguen actualizando solas cada 3 horas con GitHub Actions.
// Si quieres descargarlas de nuevo a mano: npm run noticias -- dist/noticias.json
import { writeFileSync } from 'node:fs';

const URL_NOTICIAS = 'https://tuvoto.github.io/programas/noticias.json';
try {
  const r = await fetch(URL_NOTICIAS, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const texto = await r.text();
  JSON.parse(texto); // comprueba que el archivo está bien
  writeFileSync('dist/noticias.json', texto);
  console.log('Noticias copiadas de la web publicada.');
} catch (e) {
  console.log(`No se han podido copiar las noticias (${e.message}). Se publicarán con GitHub Actions.`);
}
