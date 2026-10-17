// Enlaces que piden las tiendas. Se rellenan con «npm run configurar -- <usuario-github> <correo>».
// Dirección de la web publicada (GitHub Pages). La app del móvil descarga de
// aquí los programas en PDF y las noticias.
const WEB = 'https://tuvoto.github.io/programas';

export const CONFIG = {
  webUrl: WEB,
  // Política de privacidad: obligatoria en App Store y Google Play.
  privacidadUrl: `${WEB}/privacidad.html`,
  // Correo de contacto que aparecerá en la app y en las tiendas.
  contacto: 'tuvotoapp@gmail.com',
};

// Fuentes oficiales. Google Play exige mostrar fuentes verificables en
// apps con información electoral que no son de un organismo público.
export const FUENTES_OFICIALES = [
  { nombre: 'Ministerio del Interior – Infoelectoral', url: 'https://infoelectoral.interior.gob.es' },
  { nombre: 'Junta Electoral Central', url: 'https://www.juntaelectoralcentral.es' },
  { nombre: 'Boletín Oficial del Estado (BOE)', url: 'https://www.boe.es' },
];
