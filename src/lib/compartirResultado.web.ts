// Web: dibuja la misma tarjeta del resultado en un canvas de 1080 × 1920 y la
// comparte con el menú del sistema (móvil) o la descarga como imagen (ordenador).
import { RefObject } from 'react';
import { View } from 'react-native';
import { partidoPorId } from '../data/partidos';
import { Resultado } from '../data/test';
import { webCorta } from '../components/TarjetaResultado';
import { C, F } from '../theme';

const W = 1080;
const H = 1920;
const U = 3; // misma escala que la tarjeta en pantalla (360 → 1080)

function lineas(ctx: CanvasRenderingContext2D, texto: string, ancho: number): string[] {
  const palabras = texto.split(' ');
  const res: string[] = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (ctx.measureText(prueba).width > ancho && actual) {
      res.push(actual);
      actual = p;
    } else actual = prueba;
  }
  if (actual) res.push(actual);
  return res;
}

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

async function dibujar(resultados: Resultado[], contestadas: number, total: number): Promise<Blob> {
  await Promise.all(
    [`800 60px ${F.titular}`, `400 40px ${F.texto}`, `600 40px ${F.textoSemi}`].map((f) => document.fonts?.load(f).catch(() => null)),
  );
  const lienzo = document.createElement('canvas');
  lienzo.width = W;
  lienzo.height = H;
  const ctx = lienzo.getContext('2d')!;
  ctx.textBaseline = 'top';
  const x0 = 28 * U;
  const ancho = W - 2 * x0;

  rect(ctx, 0, 0, W, H, 0, C.tinta);

  // Mismas medidas que TarjetaResultado: con más de 4 partidos, más compacto.
  // Como mucho, los 6 primeros (igual que TarjetaResultado).
  const total_ = resultados.length;
  resultados = resultados.slice(0, 6);
  const n = resultados.length;
  const k = n <= 4 ? 1 : n === 5 ? 0.85 : 0.7;
  const m = Math.max(k, 0.9);
  const arribaPx = (n <= 4 ? 88 : 72) * U;
  const abajoPx = (n <= 4 ? 116 : 100) * U;

  // Cabecera: urna y nombre
  rect(ctx, x0, arribaPx, 30 * U, 30 * U, 8.5 * U, '#F7F4E6');
  rect(ctx, x0 + 7 * U, arribaPx + 11 * U, 16 * U, 4.5 * U, 1.5 * U, C.amarillo);
  ctx.fillStyle = C.sobreTinta;
  ctx.font = `800 ${15 * U}px ${F.titular}`;
  ctx.fillText('TuVoto', x0 + 40 * U, arribaPx + 6 * U);

  // Pie, pegado abajo
  const altoPie = (18 + 6 + 18) * U;
  const piePx = H - abajoPx - altoPie;
  ctx.fillStyle = C.sobreTinta;
  ctx.font = `600 ${13 * U}px ${F.textoSemi}`;
  ctx.fillText('No es una recomendación de voto.', x0, piePx + 2 * U);
  ctx.fillStyle = C.sobreTintaSuave;
  ctx.font = `400 ${13 * U}px ${F.texto}`;
  ctx.fillText(`Haz el test en ${webCorta()}`, x0, piePx + 26 * U);

  // Bloque central, centrado entre cabecera y pie (sin pisar ninguno)
  const tamTitulo = (n <= 4 ? 34 : 30) * U;
  const altoLinea = (n <= 4 ? 36 : 32) * U;
  ctx.font = `800 ${tamTitulo}px ${F.titular}`;
  const titulo = lineas(ctx, 'Mi resultado en el test de afinidad', ancho);
  const altoFila = 26 * m * U;
  const desde = arribaPx + 30 * U + 10 * U;
  const hasta = piePx - 20 * U;
  const fijo = titulo.length * altoLinea + 8 * U + 18 * U + (total_ > n ? 18 * U : 0) + 26 * k * U + n * (altoFila + 7 * k * U + 9 * U);
  // Hueco entre partidos: el normal si cabe; si no, el que quepa.
  const hueco = n > 1 ? Math.max(6 * U, Math.min(18 * k * U, (hasta - desde - fijo) / (n - 1))) : 0;
  const altoBloque = fijo + (n - 1) * hueco;
  let y = desde + Math.max(0, (hasta - desde - altoBloque) / 2);

  ctx.fillStyle = C.sobreTinta;
  for (const l of titulo) {
    ctx.fillText(l, x0, y);
    y += altoLinea;
  }
  y += 8 * U;
  ctx.fillStyle = C.sobreTintaSuave;
  ctx.font = `400 ${13 * U}px ${F.texto}`;
  ctx.fillText(`${contestadas} de ${total} frases respondidas · programas de 2023`, x0, y);
  if (total_ > n) {
    y += 18 * U;
    ctx.fillText(`Los ${n} primeros de ${total_} partidos`, x0, y);
  }
  y += 18 * U + 26 * k * U;

  for (const r of resultados) {
    const p = partidoPorId(r.partidoId);
    if (!p) continue;
    rect(ctx, x0, y + (altoFila - 11 * U) / 2, 11 * U, 11 * U, 3 * U, p.color);
    ctx.fillStyle = C.sobreTinta;
    ctx.font = `600 ${17 * m * U}px ${F.textoSemi}`;
    ctx.fillText(p.siglas, x0 + 20 * U, y + (altoFila - 17 * m * U) / 2);
    ctx.font = `800 ${22 * m * U}px ${F.titular}`;
    const pct = r.preguntas ? `${r.porcentaje} %` : '—';
    ctx.fillText(pct, x0 + ancho - ctx.measureText(pct).width, y + (altoFila - 22 * m * U) / 2);
    y += altoFila + 7 * k * U;
    rect(ctx, x0, y, ancho, 9 * U, 4.5 * U, 'rgba(255,255,255,0.14)');
    if (r.porcentaje > 0) rect(ctx, x0, y, Math.max(9 * U, (ancho * r.porcentaje) / 100), 9 * U, 4.5 * U, p.color);
    y += 9 * U + hueco;
  }

  return new Promise((ok, mal) => lienzo.toBlob((b) => (b ? ok(b) : mal(new Error('Sin imagen'))), 'image/png'));
}

export async function compartirResultado(
  _vista: RefObject<View | null>,
  { resultados, contestadas, total }: { resultados: Resultado[]; contestadas: number; total: number },
) {
  const blob = await dibujar(resultados, contestadas, total);
  const archivo = new File([blob], 'resultado-tuvoto.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo], title: 'Mi resultado en TuVoto' });
      return;
    } catch (e) {
      // Si la persona cierra el menú no es un error; si falla, se descarga.
      if ((e as Error).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = archivo.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
