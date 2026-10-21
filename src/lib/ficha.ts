// Ficha de un partido sobre un tema: datos comunes a la pantalla y al PDF.
import { Partido } from '../data/partidos';
import { Propuesta, edicionVigente, propuestasDe } from '../data/propuestas';
import { Tema } from '../data/temas';

// Las primeras de cada partido y tema en propuestas.ts son las principales.
export const PRINCIPALES = 3;

export type Ficha = {
  partido: Partido;
  tema: Tema;
  edicion: 2023 | 2026 | null;
  fuente: string | null;
  principales: Propuesta[];
  otras: Propuesta[];
};

export function crearFicha(partido: Partido, tema: Tema): Ficha {
  const props = propuestasDe(partido.id, tema.id);
  const edicion = edicionVigente(partido.id);
  return {
    partido,
    tema,
    edicion,
    fuente: edicion === 2023 ? partido.anterior?.documento ?? null : edicion === 2026 ? `Programa de ${partido.siglas} para el 29-N (2026)` : null,
    principales: props.slice(0, PRINCIPALES),
    otras: props.slice(PRINCIPALES),
  };
}

export function fechaHoy() {
  return new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Documento con las propuestas de un partido sobre uno o varios temas, en A4.
export type Documento = { partido: Partido; temas: Tema[]; html: string; nombre: string };

export function crearDocumento(partido: Partido, temas: Tema[]): Documento {
  const unico = temas.length === 1;
  const nombre = unico
    ? `${temas[0].nombre} - ${partido.siglas} - TuVoto`
    : `Propuestas de ${partido.siglas} - TuVoto`;
  return { partido, temas, nombre, html: documentoHtml(partido, temas, nombre) };
}

export function crearDocumentoFicha(f: Ficha): Documento {
  return crearDocumento(f.partido, [f.tema]);
}

function documentoHtml(p: Partido, temas: Tema[], titulo: string): string {
  const unico = temas.length === 1;
  const fuente = crearFicha(p, temas[0]).fuente;
  const item = (pr: Propuesta, n: number) =>
    `<p class="p"><span class="n">${n}</span>${esc(pr.resumen)}${pr.pagina != null ? `<span class="pag">Página ${pr.pagina} del programa</span>` : ''}</p>`;
  const lista = (ps: Propuesta[]) => `<div class="cols">${ps.map((pr, i) => item(pr, i + 1)).join('')}</div>`;
  const secciones = temas.map((t) => ({ t, ps: propuestasDe(p.id, t.id) }));

  const cuerpo = unico
    ? secciones[0].ps.length === 0
      ? '<p class="vacio">No hay propuestas sobre este tema.</p>'
      : lista(secciones[0].ps)
    : secciones
        .map(({ t, ps }) => `<h2>${esc(t.nombre)}</h2>${ps.length ? lista(ps) : '<p class="vacio">Sin propuestas sobre este tema.</p>'}`)
        .join('');

  const sobre = unico ? `sobre ${temas[0].nombre.toLowerCase()}` : `sobre ${temas.length} temas`;
  const segun = fuente ? `, según el <b>${esc(fuente.charAt(0).toLowerCase() + fuente.slice(1))}</b>` : '';
  const quien = p.candidato ? ` ${p.candidata ? 'Candidata' : 'Candidato'}: <b>${esc(p.candidato)}</b>.` : '';

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>${esc(titulo)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;600&display=swap">
<style>
  @page { size: A4; margin: 16mm 18mm 16mm; }
  * { box-sizing: border-box; }
  @media screen { html, body { background: #FFFFFF; } }
  body { margin: 0; color: #161144; font: 10pt/1.6 Figtree, 'Helvetica Neue', Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cab { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; border-bottom: 1.5pt solid #161144; padding-bottom: 7pt; font-size: 8pt; font-weight: 600; color: #5B6273; }
  .cab b { font-family: 'Bricolage Grotesque', Figtree, sans-serif; font-weight: 800; font-size: 10.5pt; color: #161144; white-space: nowrap; }
  .partido { display: flex; align-items: center; gap: 7pt; margin-top: 24pt; font-weight: 600; font-size: 10pt; }
  .cuadro { flex: none; width: 9pt; height: 9pt; border-radius: 2pt; background: ${p.color}; }
  h1 { font-family: 'Bricolage Grotesque', Figtree, sans-serif; font-weight: 800; font-size: ${unico ? 54 : 40}pt; line-height: 0.95; letter-spacing: -0.03em; margin: 5pt 0 0; text-wrap: balance; }
  .sub { font-size: 12pt; line-height: 1.45; color: #5B6273; margin: 11pt 0 0; max-width: 420pt; }
  .sub b { color: #161144; font-weight: 600; }
  h2 { font-family: 'Bricolage Grotesque', Figtree, sans-serif; font-weight: 800; font-size: 20pt; letter-spacing: -0.02em; margin: 26pt 0 0; break-after: avoid; }
  .cols { columns: 2; column-gap: 26pt; margin-top: ${unico ? 22 : 8}pt; border-top: 1px solid #D9DCE3; padding-top: 14pt; }
  .p { break-inside: avoid; margin: 0 0 13pt; padding-left: 22pt; position: relative; }
  .p .n { position: absolute; left: 0; top: -1pt; font-family: 'Bricolage Grotesque', Figtree, sans-serif; font-weight: 800; font-size: 15pt; color: #D9A92A; }
  .p .pag { display: block; font-size: 8pt; font-weight: 600; color: #5B6273; margin-top: 2pt; }
  .vacio { color: #5B6273; margin-top: 18pt; }
  footer { margin-top: 10pt; break-inside: avoid; border-top: 1px solid #D9DCE3; padding-top: 8pt; font-size: 7.5pt; color: #5B6273; }
</style></head>
<body>
  <div class="cab"><b>TuVoto</b><span>Elecciones generales · 29 de noviembre de 2026</span></div>
  <div class="partido"><span class="cuadro"></span>${esc(p.siglas !== p.nombre ? `${p.siglas} · ${p.nombre}` : p.siglas)}</div>
  <h1>${esc(unico ? temas[0].nombre : `Propuestas de ${p.siglas}`)}</h1>
  <p class="sub">Lo que propone ${esc(p.siglas)} ${esc(sobre)}${segun}.${quien}</p>
  ${cuerpo}
  <footer>
    Resúmenes de TuVoto a partir del programa oficial del partido. La página indicada es la del PDF del programa.
    Generado el ${fechaHoy()}.
  </footer>
</body></html>`;
}

// El mismo documento preparado para verlo en pantalla antes de descargarlo:
// una hoja blanca centrada sobre fondo gris, que se adapta al ancho del móvil.
export function htmlVista(d: Documento): string {
  const css = `<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  @media screen {
    html { background: #E9ECF2 !important; }
    body { max-width: 794px; margin: 16px auto 40px; padding: 48px 56px; background: #FFFFFF; border-radius: 10px;
           box-shadow: 0 10px 28px -12px rgba(18,24,38,.30), 0 0 0 1px rgba(18,24,38,.05); }
  }
  @media screen and (max-width: 600px) {
    body { margin: 12px; padding: 24px 20px; font-size: 15px; }
    h1 { font-size: 40px; }
    .cols { columns: 1; }
  }
</style>`;
  return d.html.replace('</head>', `${css}</head>`);
}
