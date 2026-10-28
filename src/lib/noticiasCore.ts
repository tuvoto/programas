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
  // Icono de cada medio (el de su web), para mostrarlo junto a su nombre.
  // Se carga desde la web del medio: la app no guarda copia.
  iconos?: Record<string, string>;
  partidos: Record<string, Noticia[]>;
};

// Secciones de política/España. Si un medio cambia la dirección de su RSS,
// el script lo indica en el registro y sigue con los demás.
// `rss` admite varias direcciones: se prueban en orden y se usa la primera que
// responde (los medios cambian a veces la dirección de su RSS).
export const MEDIOS: { medio: string; corto: string; web: string; rss: string | string[]; zona?: string }[] = [
  // Medios estatales
  { medio: 'El País', corto: 'País', web: 'https://elpais.com', rss: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/espana/portada' },
  { medio: 'El Mundo', corto: 'Mundo', web: 'https://www.elmundo.es', rss: 'https://e00-elmundo.uecdn.es/elmundo/rss/espana.xml' },
  { medio: 'ABC', corto: 'ABC', web: 'https://www.abc.es', rss: 'https://www.abc.es/rss/2.0/espana/' },
  { medio: 'elDiario.es', corto: 'elD', web: 'https://www.eldiario.es', rss: 'https://www.eldiario.es/rss/politica/' },
  // La Razón y Público se quitaron en octubre de 2026: sus RSS no responden
  // (403 y 404). Se quitan los dos para no desequilibrar la lista.
  { medio: 'El Confidencial', corto: 'Conf', web: 'https://www.elconfidencial.com', rss: 'https://rss.elconfidencial.com/espana/' },
  { medio: 'La Vanguardia', corto: 'Vang', web: 'https://www.lavanguardia.com', rss: 'https://www.lavanguardia.com/rss/politica.xml' },
  { medio: '20minutos', corto: '20m', web: 'https://www.20minutos.es', rss: 'https://www.20minutos.es/rss/nacional/' },
  { medio: 'RTVE', corto: 'RTVE', web: 'https://www.rtve.es', rss: 'https://api2.rtve.es/rss/temas_espana.xml' },
  { medio: 'Europa Press', corto: 'EP', web: 'https://www.europapress.es', rss: 'https://www.europapress.es/rss/rss.aspx?ch=00066' },

  // Medios regionales: para que los partidos que solo se presentan en una
  // comunidad también tengan noticias. Se prueban varias direcciones por medio.
  // (El Periódico, Levante-EMV y Noticias de Navarra rechazan las peticiones
  // automáticas con error 406: se usan las ediciones regionales de elDiario.es.)
  { medio: 'La Voz de Galicia', corto: 'Voz', web: 'https://www.lavozdegalicia.es', zona: 'Galicia', rss: ['https://www.lavozdegalicia.es/galicia/index.xml', 'https://www.lavozdegalicia.es/index.xml'] },
  { medio: 'elDiario.es Galicia', corto: 'elDG', web: 'https://www.eldiario.es', zona: 'Galicia', rss: ['https://www.eldiario.es/rss/galicia/'] },
  { medio: 'Canarias7', corto: 'C7', web: 'https://www.canarias7.es', zona: 'Canarias', rss: ['https://www.canarias7.es/rss/2.0/portada', 'https://www.canarias7.es/rss/2.0/?section=politica'] },
  { medio: 'Canarias Ahora', corto: 'CanA', web: 'https://www.eldiario.es', zona: 'Canarias', rss: ['https://www.eldiario.es/rss/canariasahora/'] },
  { medio: 'Diario de Navarra', corto: 'DNav', web: 'https://www.diariodenavarra.es', zona: 'Navarra', rss: ['https://www.diariodenavarra.es/rss/portada.xml', 'https://www.diariodenavarra.es/rss/navarra.xml'] },
  { medio: 'elDiario.es Navarra', corto: 'elDN', web: 'https://www.eldiario.es', zona: 'Navarra', rss: ['https://www.eldiario.es/rss/navarra/'] },
  { medio: 'El Correo', corto: 'Corr', web: 'https://www.elcorreo.com', zona: 'País Vasco', rss: ['https://www.elcorreo.com/rss/atom/?section=politica', 'https://www.elcorreo.com/rss/2.0/portada/'] },
  { medio: 'elDiario.es Catalunya', corto: 'elDC', web: 'https://www.eldiario.es', zona: 'Cataluña', rss: ['https://www.eldiario.es/rss/catalunya/'] },
  { medio: 'Ara', corto: 'Ara', web: 'https://www.ara.cat', zona: 'Cataluña', rss: ['https://www.ara.cat/rss/'] },
  { medio: 'elDiario.es Comunitat Valenciana', corto: 'elDV', web: 'https://www.eldiario.es', zona: 'Comunitat Valenciana', rss: ['https://www.eldiario.es/rss/comunitat-valenciana/'] },
  { medio: 'Las Provincias', corto: 'LasP', web: 'https://www.lasprovincias.es', zona: 'Comunitat Valenciana', rss: ['https://www.lasprovincias.es/rss/2.0/portada'] },
];

// Medios cuyas fotos no se muestran (por ejemplo, porque lo han pedido). Basta
// con añadir aquí su nombre, tal cual está en MEDIOS: la app deja de enseñarlas
// en cuanto se publica el cambio, sin esperar a la siguiente descarga.
export const SIN_FOTOS: string[] = [];

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
  bildu: [/\bBildu\b/, /\bOtegi\b/, /Oskar Matute/],
  pnv: [/\bPNV\b/, /\bEAJ\b/, /Aitor Esteban/, /Maribel Vaquero/],
  bng: [/\bBNG\b/, /Bloque Nacionalista Galego/, /\bPontón\b/, /Néstor Rego/],
  // «CC» sola, pero no «CC.OO.» ni «CCOO»
  cc: [/Coalición Canaria/, /Cristina Valido/, /Primero Canarias/, /\bCC\b(?!\.?\s?OO)/],
  upn: [/\bUPN\b/, /Unión del Pueblo Navarro/, /Javier Esparza/],
  compromis: [/Compromís/, /Àgueda Micó/],
  upc: [/Unidad del Pueblo Canario/, /Nueva Canarias/, /\bUPC\b/],
  'ara-mes': [/Ara Més/, /Més per Mallorca/, /Més per Menorca/, /Vicenç Vidal/],
  adelante: [/Adelante Andalucía/i, /José Ignacio García/],
  existe: [/Teruel Existe/, /Aragón Existe/],
  'geroa-bai': [/Geroa Bai/i, /Uxue Barkos/],
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
    // La foto se enlaza desde la web del medio (no se copia). Los medios de
    // SIN_FOTOS no la llevan.
    const imagen = SIN_FOTOS.includes(medio) ? undefined : imagenDe(b);
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

// Icono de la web de un medio, a partir del HTML de su portada. Se prefiere
// el «apple-touch-icon» (PNG grande); los .ico y .svg no se usan porque el
// móvil no siempre los muestra.
export function iconoDeHtml(html: string, base: string): string | undefined {
  const enlaces = html.match(/<link\b[^>]*>/gi) ?? [];
  const candidatos: { href: string; puntos: number }[] = [];
  for (const etq of enlaces) {
    const rel = (etq.match(/\srel\s*=\s*["']([^"']+)["']/i)?.[1] ?? '').toLowerCase();
    const href = etq.match(/\shref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href || !rel.includes('icon')) continue;
    const ruta = href.toLowerCase().split('?')[0];
    if (ruta.endsWith('.ico') || ruta.endsWith('.svg') || /image\/(svg|x-icon|vnd)/i.test(etq)) continue;
    const tam = Number(etq.match(/\ssizes\s*=\s*["'](\d+)x\d+["']/i)?.[1] ?? 0);
    candidatos.push({ href, puntos: (rel.includes('apple-touch-icon') ? 1000 : 0) + Math.min(tam, 512) });
  }
  candidatos.sort((a, b) => b.puntos - a.puntos);
  try {
    return candidatos[0] ? new URL(candidatos[0].href, base).toString() : undefined;
  } catch {
    return undefined;
  }
}

async function iconos(descargar: Descargar, aviso?: (m: string) => void): Promise<Record<string, string>> {
  const webs = [...new Set(MEDIOS.map((m) => m.web))];
  const porWeb: Record<string, string> = {};
  await Promise.all(
    webs.map(async (web) => {
      try {
        let icono = iconoDeHtml(await descargar(web), web);
        if (!icono) {
          // Muchas webs lo tienen en esta ruta aunque no lo enlacen.
          const directo = `${web}/apple-touch-icon.png`;
          icono = await descargar(directo).then(() => directo, () => undefined);
        }
        if (icono) porWeb[web] = icono;
        else aviso?.(`${web}: sin icono PNG`);
      } catch (e) {
        aviso?.(`${web}: icono no disponible (${(e as Error).message})`);
      }
    }),
  );
  const res: Record<string, string> = {};
  for (const m of MEDIOS) if (porWeb[m.web]) res[m.medio] = porWeb[m.web];
  return res;
}

// Descarga todos los medios a la vez; los que fallen se ignoran.
export async function recopilar(
  descargar: Descargar,
  partidos: string[],
  aviso?: (m: string) => void,
  conIconos = false,
): Promise<ArchivoNoticias> {
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
    ...(conIconos ? { iconos: await iconos(descargar, aviso) } : {}),
  };
}
