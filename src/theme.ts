import { Platform } from 'react-native';

// Sistema visual de TuVoto (estilo "Tarjetas").
//
// Fondo claro, tarjetas blancas con sombra suave y azul marino (#161144) como
// color de acción. El amarillo mostaza solo subraya. Paleta: #161144, #90ABCE,
// #EABF42, #F7F4E6. Ningún color de la interfaz coincide con
// el de un partido: los colores de partido aparecen solo en sus marcas.

export const C = {
  fondo: '#F3F5F9',
  tarjeta: '#FFFFFF',
  tinta: '#161144', // texto principal y botones
  suave: '#5B6273', // texto secundario
  vacia: '#C3C8D2', // marcas vacías, iconos inactivos
  linea: '#E4E7ED',
  relleno: '#F1F3F7', // fondo de iconos y etiquetas neutras
  amarillo: '#EABF42', // subrayado
  fondoPartidos: '#90ABCE', // fondo de la pestaña Partidos
  sobrePartidos: '#161144', // títulos sobre ese fondo
  sobrePartidosSuave: '#2E2A5C',
  avisoFondo: '#FBF0CF',
  avisoTexto: '#6B5300',
  okFondo: '#E5F2E6',
  okTexto: '#2F5A33',
  sobreTinta: '#FFFFFF',
  sobreTintaSuave: '#C9C6E6',
};

// Colores de la paleta para alternar en iconos: fondo del cuadro y color del dibujo.
export const PALETA = [
  { fondo: '#161144', dibujo: '#FFFFFF' },
  { fondo: '#90ABCE', dibujo: '#161144' },
  { fondo: '#EABF42', dibujo: '#161144' },
];

// Familias: una por peso, para que Android no sintetice negritas.
// En la web se añade una lista de respaldo: si las fuentes tardan o fallan,
// se ve una fuente sin serifa del sistema en vez de Times.
const RESPALDO = Platform.OS === 'web' ? ", system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" : '';
export const F = {
  titular: 'BricolageGrotesque_800ExtraBold' + RESPALDO,
  titularSemi: 'BricolageGrotesque_600SemiBold' + RESPALDO,
  texto: 'Figtree_400Regular' + RESPALDO,
  textoMedia: 'Figtree_500Medium' + RESPALDO,
  textoSemi: 'Figtree_600SemiBold' + RESPALDO,
  textoNegrita: 'Figtree_700Bold' + RESPALDO,
};

export const T = {
  portada: { fontFamily: F.titular, fontSize: 36, lineHeight: 38, letterSpacing: -0.9 },
  titulo: { fontFamily: F.titular, fontSize: 32, lineHeight: 35, letterSpacing: -0.8 },
  seccion: { fontFamily: F.titular, fontSize: 21, lineHeight: 26, letterSpacing: -0.2 },
  tarjeta: { fontFamily: F.titularSemi, fontSize: 17, lineHeight: 20, letterSpacing: -0.2 },
  cuerpo: { fontFamily: F.texto, fontSize: 16, lineHeight: 23 },
  cuerpoSemi: { fontFamily: F.textoSemi, fontSize: 16, lineHeight: 23 },
  meta: { fontFamily: F.texto, fontSize: 13.5, lineHeight: 18 },
  etiqueta: { fontFamily: F.textoSemi, fontSize: 12.5, lineHeight: 16 },
} as const;

// Sombras suaves (boxShadow funciona en iOS, Android y web con la Nueva Arquitectura)
export const S = {
  tarjeta: '0px 8px 20px -14px rgba(18, 24, 38, 0.28), 0px 0px 0px 1px rgba(18, 24, 38, 0.05)',
  flotante: '0px 10px 28px -12px rgba(18, 24, 38, 0.30), 0px 0px 0px 1px rgba(18, 24, 38, 0.05)',
  boton: '0px 6px 14px -6px rgba(18, 24, 38, 0.55)',
};

export const R = { tarjeta: 20, boton: 12, pildora: 999 };

export const ESTADO_TEXTO: Record<string, string> = {
  confirmada: 'Candidatura confirmada',
  provisional: 'Pendiente de proclamación (2 nov)',
  'en-negociacion': 'Coalición en negociación',
};

// Ancho máximo del contenido en pantallas grandes (web en ordenador).
export const ANCHO_MAX = 1120;
// Centra el contenido en pantallas anchas. Se aplica dentro del scroll para
// que la barra de desplazamiento quede en el borde de la ventana.
export const CENTRADO = { width: '100%', maxWidth: ANCHO_MAX, alignSelf: 'center' } as const;
// Margen lateral estándar
export const M = 18;
// Espacio que deja libre la barra de pestañas flotante al final de cada pantalla
export const HUECO_BARRA = 110;

export const esWeb = Platform.OS === 'web';

// "1 propuesta", "3 propuestas"
export function plural(n: number, uno: string, varios: string) {
  return `${n.toLocaleString('es-ES')} ${n === 1 ? uno : varios}`;
}

// Color de texto sobre el color de un partido: blanco si alcanza un contraste
// de 3:1 (WCAG para texto grande), si no, tinta.
export function textoSobre(fondo: string): string {
  const h = fondo.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (L + 0.05) >= 3 ? '#FFFFFF' : C.tinta;
}

// Versión suave de un color (mezclado con blanco). cuanto = 0 → el color, 1 → blanco.
export function suave(color: string, cuanto = 0.88): string {
  const h = color.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const m = c.map((v) => Math.round(v + (255 - v) * cuanto));
  return '#' + m.map((v) => v.toString(16).padStart(2, '0')).join('');
}
