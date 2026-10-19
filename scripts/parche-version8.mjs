// Prepara app.json para la versión 8. Se ejecuta una vez:
//   node scripts/parche-version8.mjs
// - Avisos de fechas (expo-notifications) con su icono.
// - Enlaces de la web que abren la app en Android.
// Al final enseña cómo están configuradas las actualizaciones de Expo.
import { readFileSync, writeFileSync } from 'node:fs';

const ruta = 'app.json';
const app = JSON.parse(readFileSync(ruta, 'utf8'));
const e = app.expo;
let cambios = 0;

const plugins = (e.plugins ??= []);
if (!plugins.some((p) => (Array.isArray(p) ? p[0] : p) === 'expo-notifications')) {
  plugins.push(['expo-notifications', { icon: './assets/notificacion.png', color: '#161144' }]);
  cambios++;
  console.log('+ Avisos de fechas (expo-notifications)');
}

const RUTAS = ['tema', 'partido', 'ficha', 'buscar', 'cara-a-cara', 'test', 'vota', 'partidos', 'voto-correo', 'documento'];
const android = (e.android ??= {});
const filtros = (android.intentFilters ??= []);
if (!filtros.some((f) => JSON.stringify(f).includes('tuvoto.github.io'))) {
  filtros.push({
    action: 'VIEW',
    autoVerify: true,
    data: [
      { scheme: 'https', host: 'tuvoto.github.io', path: '/programas' },
      { scheme: 'https', host: 'tuvoto.github.io', path: '/programas/' },
      ...RUTAS.map((r) => ({ scheme: 'https', host: 'tuvoto.github.io', pathPrefix: `/programas/${r}` })),
    ],
    category: ['BROWSABLE', 'DEFAULT'],
  });
  cambios++;
  console.log('+ Enlaces de tuvoto.github.io que abren la app');
}

// Permisos bloqueados repetidos: se dejan una sola vez.
if (Array.isArray(android.blockedPermissions)) {
  const unicos = [...new Set(android.blockedPermissions)];
  if (unicos.length !== android.blockedPermissions.length) {
    android.blockedPermissions = unicos;
    cambios++;
    console.log('+ Permisos bloqueados sin repetir');
  }
}

// La versión 8 trae módulos nativos nuevos (avisos y valoración). Con
// runtimeVersion «appVersion», subir la versión a 1.1.0 hace que las
// actualizaciones de Expo de ahora en adelante solo lleguen a apps que ya
// tienen esos módulos, y nunca a una compilación anterior.
if (e.version === '1.0.0') {
  e.version = '1.1.0';
  cambios++;
  console.log('+ Versión 1.1.0');
}

if (cambios) writeFileSync(ruta, JSON.stringify(app, null, 2) + '\n');
else console.log('app.json ya estaba preparado: sin cambios.');

console.log('\nActualizaciones de Expo:');
console.log('  updates.url     =', e.updates?.url ?? '(no hay)');
console.log('  runtimeVersion  =', JSON.stringify(e.runtimeVersion ?? '(no hay)'));
console.log('  version         =', e.version);
console.log('  extra.eas       =', JSON.stringify(e.extra?.eas ?? '(no hay)'));
