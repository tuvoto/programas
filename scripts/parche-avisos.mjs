// Añade a app.json el plugin de los avisos (expo-notifications) con el icono
// blanco de la barra de notificaciones de Android. Se ejecuta una vez:
//   node scripts/parche-avisos.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const ruta = 'app.json';
const app = JSON.parse(readFileSync(ruta, 'utf8'));
const plugins = (app.expo.plugins ??= []);
const ya = plugins.some((p) => (Array.isArray(p) ? p[0] : p) === 'expo-notifications');
if (ya) {
  console.log('app.json ya tenía expo-notifications: sin cambios.');
} else {
  plugins.push(['expo-notifications', { icon: './assets/notificacion.png', color: '#161144' }]);
  writeFileSync(ruta, JSON.stringify(app, null, 2) + '\n');
  console.log('app.json: añadido expo-notifications.');
}
