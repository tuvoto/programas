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
  // Código de Google Search Console (opcional), para ver cómo aparece la web en
  // Google. Es el valor «content» de la etiqueta que da Google al verificar.
  googleVerificacion: '',
  // Contador de visitas de la web con GoatCounter (sin cookies ni datos
  // personales). Es el nombre de la cuenta: «tuvoto» en tuvoto.goatcounter.com.
  // Vacío = sin contador. La app del móvil no cuenta nada.
  goatcounter: 'tuvoto',
  // Botón «Descárgala en Google Play» en la web. Ponlo en true cuando la app
  // esté publicada para todo el mundo (no en la prueba cerrada).
  googlePlayPublicada: false,
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=es.programaselectorales.app',
};

// Fuentes oficiales. Google Play exige mostrar fuentes verificables en
// apps con información electoral que no son de un organismo público.
export const FUENTES_OFICIALES = [
  { nombre: 'Convocatoria y plazos: Boletín Oficial del Estado', url: 'https://www.boe.es' },
  { nombre: 'Calendario y resultados: Ministerio del Interior (Infoelectoral)', url: 'https://infoelectoral.interior.gob.es' },
  { nombre: 'Junta Electoral Central', url: 'https://www.juntaelectoralcentral.es' },
  { nombre: 'Censo electoral: Instituto Nacional de Estadística', url: 'https://www.ine.es' },
  { nombre: 'Voto desde el extranjero: La Moncloa', url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/paginas/voto-extranjero-elecciones-generales-29n.aspx' },
  { nombre: 'Consulados: Ministerio de Asuntos Exteriores', url: 'https://www.exteriores.gob.es' },
  { nombre: 'Voto por correo: Correos', url: 'https://www.correos.es' },
];
