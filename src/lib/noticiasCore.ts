// Recopilación de noticias por partido a partir de los RSS públicos de medios
// generalistas de distinta línea editorial. Lo usan:
//   - scripts/noticias.mjs (GitHub Actions) para generar noticias.json
//   - la app en móvil, si noticias.json no está disponible
// No importa nada de React Native para que también funcione en Node.
//
// Criterio neutral: mismos medios y mismo método para todos los partidos.
// Se muestran los titulares que mencionan al partido o a su líder,
// ordenados solo por fecha. La app no elige ni valora noticias.

export type Noticia = {
  titulo: string;
  medio: string;
  url: string;
  fecha: string; // ISO 8601
  imagen?: string; // foto de la noticia, si el medio la incluye en su RSS
};

export type ArchivoNoticias = {
  actualizado: string; // ISO 8601
  medios: string[]; // medios que respondieron
  partidos: Record<string, Noticia[]>;
};

// Secciones de política/España. Si un medio cambia la dirección de su RSS,
// el script lo indica en el registro y sigue con los demás.
// `rss` admite varias direcciones: se prueban en orden y se usa la primera que
// responde (los medios cambian a veces la dirección de su RSS).
export const MEDIOS: { medio: string; corto: string; rss: string | string[] }[] = [
  { medio: 'El País', corto: 'País', rss: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/espana/portada' },
  { medio: 'El Mundo', corto: 'Mundo', rss: 'https://e00-elmundo.uecdn.es/elmundo/rss/espana.xml' },
  { medio: 'ABC', corto: 'ABC', rss: 'https://www.abc.es/rss/2.0/espana/' },
  { medio: 'elDiario.es', corto: 'elD', rss: 'https://www.eldiario.es/rss/politica/' },
  {
    medio: 'La Razón',
    corto: 'Razón',
    rss: ['https://www.larazon.es/rss/espana.xml', 'https://www.larazon.es/rss/portada.xml', 'https://www.larazon.es/arc/outboundfeeds/rss/?outputType=xml'],
  },
  {
    medio: 'Público',
    corto: 'Púb',
    rss: ['https://www.publico.es/rss/', 'https://www.publico.es/rss/politica/', 'https://www.publico.es/rss/espana', 'https://www.publico.es/feed'],
  },
  { medio: 'El Confidencial', corto: 'Conf', rss: 'https://rss.elconfidencial.com/espana/' },
  { medio: 'La Vanguardia', corto: 'Vang', rss: 'https://www.lavanguardia.com/rss/politica.xml' },
  { medio: '20minutos', corto: '20m', rss: 'https://www.20minutos.es/rss/nacional/' },
  { medio: 'RTVE', corto: 'RTVE', rss: 'https://api2.rtve.es/rss/temas_espana.xml' },
  { medio: 'Europa Press', corto: 'EP', rss: 'https://www.europapress.es/rss/rss.aspx?ch=00066' },
];

// Qué cuenta como mención de cada partido en un titular (distingue mayúsculas).
export const BUSQUEDA: Record<string, RegExp[]> = {
  psoe: [/\bPSOE\b/, /\bSánchez\b/],
  pp: [/\bPP\b/, /\bFeijóo\b/, /Partido Popular/],
  vox: [/\bVox\b/, /\bVOX\b/, /\bAbascal\b/],
  'frente-amplio': [/Frente Amplio/i, /\bSumar\b/, /\bColau\b/],
  // «Podemos» también es un verbo: no cuenta si abre el titular (ver mencionaA).
  podemos: [/\bPodemos\b/, /\bBelarra\b/, /Irene Montero/],
  salf: [/Se Acabó La Fiesta/i, /\bSALF\b/, /\bAlvise\b/],
  erc: [/\bERC\b/, /\bEsquerra\b/, /\bRufián\b/],
  junts: [/\bJunts\b/, /\bPuigdemont\b/, /\bNogueras\b/],
  bildu: [/\bBildu\b/, /\bOtegi\b/],
  pnv: [/\bPNV\b/, /\bEAJ\b/],
  bng: [/\bBNG\b/, /Bloque Nacionalista Galego/, /\bPontón\b/],
  cc: [/Coalición Canaria/],
  upn: [/\bUPN\b/, /Unión del Pueblo Navarro/],
  compromis: [/Compromís/, /Àgueda Micó/],
};

// Partidos de los que se buscan noticias.
export const PARTIDOS_NOTICIAS = Object.keys(BUSQUEDA);

export const DIAS = 7; // antigüedad máxima
export const MAX_POR_PARTIDO = 15;

const ENTIDADES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function limpiar(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTIDADES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

function etiqueta(item: string, nombre: string): string | null {
  const m = item.match(new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`, 'i'));
  return m ? limpiar(m[1]) : null;
}

const atributo = (etq: string, nombre: string) =>
  etq.match(new RegExp(`\\s${nombre}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1] ?? null;

// Foto de la noticia: media:thumbnail, media:content, enclosure o la primera
// <img> de la descripción, en ese orden.
function imagenDe(item: string): string | undefined {
  const candidatas: string[] = [];
  for (const etq of item.match(/<media:(?:thumbnail|content)\b[^>]*>/gi) ?? []) {
    const url = atributo(etq, 'url');
    const tipo = (atributo(etq, 'type') ?? atributo(etq, 'medium') ?? '').toLowerCase();
    if (url && (etq.toLowerCase().startsWith('<media:thumbnail') || tipo.startsWith('image') || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url))) candidatas.push(url);
  }
  for (const etq of item.match(/<enclosure\b[^>]*>/gi) ?? []) {
    const url = atributo(etq, 'url');
    if (url && (atributo(etq, 'type') ?? '').toLowerCase().startsWith('image')) candidatas.push(url);
  }
  const html = item.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  const img = html.match(/<img\b[^>]*>/i)?.[0];
  if (img) {
    const url = atributo(img, 'src');
    if (url) candidatas.push(url);
  }
  const url = candidatas
    .map((u) => u.replace(/&amp;/g, '&').trim())
    .map((u) => (u.startsWith('//') ? `https:${u}` : u.replace(/^http:\/\//, 'https://')))
    .find((u) => /^https:\/\//.test(u));
  return url;
}

// Lector mínimo de RSS 2.0 y Atom: título, enlace y fecha de cada entrada.
export function leerRss(xml: string, medio: string): Noticia[] {
  const bloques = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  const salida: Noticia[] = [];
  for (const b of bloques) {
    const titulo = etiqueta(b, 'title');
    let url = etiqueta(b, 'link');
    if (!url) url = b.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? null;
    const fechaTxt = etiqueta(b, 'pubDate') ?? etiqueta(b, 'dc:date') ?? etiqueta(b, 'updated') ?? etiqueta(b, 'published');
    const fecha = fechaTxt ? new Date(fechaTxt) : null;
    if (!titulo || !url || !/^https?:\/\//.test(url) || !fecha || isNaN(fecha.getTime())) continue;
    const imagen = imagenDe(b);
    salida.push({ titulo, medio, url, fecha: fecha.toISOString(), ...(imagen ? { imagen } : {}) });
  }
  return salida;
}

export function mencionaA(titulo: string, partidoId: string): boolean {
  if (partidoId === 'podemos') titulo = titulo.replace(/^[¿¡«"'\s]*Podemos\b/, '');
  return (BUSQUEDA[partidoId] ?? []).some((r) => r.test(titulo));
}

const clave = (t: string) => t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');

// Reparte las noticias entre partidos: recientes, sin repetidas, de más nueva a más antigua.
export function repartir(todas: Noticia[], partidos: string[], ahora = Date.now()): Record<string, Noticia[]> {
  const limite = ahora - DIAS * 864e5;
  const vistas = new Set<string>();
  const unicas = todas
    .filter((n) => {
      const t = Date.parse(n.fecha);
      return t >= limite && t <= ahora + 36e5;
    })
    .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha))
    .filter((n) => {
      const k = clave(n.titulo);
      if (vistas.has(k) || vistas.has(n.url)) return false;
      vistas.add(k);
      vistas.add(n.url);
      return true;
    });
  const res: Record<string, Noticia[]> = {};
  for (const id of partidos) res[id] = unicas.filter((n) => mencionaA(n.titulo, id)).slice(0, MAX_POR_PARTIDO);
  return res;
}

type Descargar = (url: string) => Promise<string>;

// Descarga todos los medios a la vez; los que fallen se ignoran.
export async function recopilar(descargar: Descargar, partidos: string[], aviso?: (m: string) => void): Promise<ArchivoNoticias> {
  const listas = await Promise.all(
    MEDIOS.map(async ({ medio, rss }) => {
      let ultimoError = '';
      for (const url of Array.isArray(rss) ? rss : [rss]) {
        try {
          const n = leerRss(await descargar(url), medio);
          if (!n.length) throw new Error('sin titulares');
          aviso?.(`${medio}: ${n.length} titulares`);
          return { medio, n };
        } catch (e) {
          ultimoError = (e as Error).message;
        }
      }
      aviso?.(`${medio}: no disponible (${ultimoError})`);
      return null;
    }),
  );
  const ok = listas.filter((l): l is { medio: string; n: Noticia[] } => l !== null);
  return {
    actualizado: new Date().toISOString(),
    medios: ok.map((l) => l.medio),
    partidos: repartir(ok.flatMap((l) => l.n), partidos),
  };
}
