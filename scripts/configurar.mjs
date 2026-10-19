// Rellena el usuario de GitHub y el correo de contacto en la app y en la
// política de privacidad. Uso:  npm run configurar -- mi-usuario programaselectorales.app@gmail.com
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const [usuario, correo] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/i.test(usuario ?? '') || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo ?? '')) {
  console.error('Uso: npm run configurar -- <usuario-github> <correo>');
  process.exit(1);
}
const archivos = ['src/config.ts', 'public/privacidad.html'].filter((f) => existsSync(f));
for (const f of archivos) {
  const antes = readFileSync(f, 'utf8');
  const despues = antes
    .replace(/__USUARIO__|TU-USUARIO|[a-z0-9-]+(?=\.github\.io\/programas\b)/gi, usuario.toLowerCase())
    .replace(/__CORREO__|tu-correo@ejemplo\.com/g, correo)
    // Si ya se había configurado antes, cambia también el correo anterior.
    .replace(/(contacto: ')[^']*(')/, `$1${correo}$2`)
    .replace(/(mailto:)[^"]+(">)[^<]+(<)/g, `$1${correo}$2${correo}$3`);
  writeFileSync(f, despues);
  console.log(`${f}: ${antes === despues ? 'sin cambios' : 'actualizado'}`);
}
