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
const ARRIBA = 88 * U; // márgenes iguales que en TarjetaResultado
const ABAJO = 116 * U;

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

  // Cabecera: urna y nombre
  rect(ctx, x0, ARRIBA, 30 * U, 30 * U, 8.5 * U, '#F7F4E6');
  rect(ctx, x0 + 7 * U, ARRIBA + 11 * U, 16 * U, 4.5 * U, 1.5 * U, C.amarillo);
  ctx.fillStyle = C.sobreTinta;
  ctx.font = `800 ${15 * U}px ${F.titular}`;
  ctx.fillText('TuVoto', x0 + 40 * U, ARRIBA + 6 * U);

  // Bloque central, centrado en vertical entre cabecera y pie
  ctx.font = `800 ${34 * U}px ${F.titular}`;
  const titulo = lineas(ctx, 'Mi resultado en el test de afinidad', ancho);
  const altoTitulo = titulo.length * 36 * U;
  const altoFilas = resultados.length * (24 * U + 7 * U + 9 * U) + (resultados.length - 1) * 18 * U;
  const altoBloque = altoTitulo + 8 * U + 18 * U + 26 * U + altoFilas;
  const arriba = ARRIBA + 30 * U;
  const abajo = H - ABAJO - 44 * U;
  let y = arriba + (abajo - arriba - altoBloque) / 2;

  ctx.fillStyle = C.sobreTinta;
  for (const l of titulo) {
    ctx.fillText(l, x0, y);
    y += 36 * U;
  }
  y += 8 * U;
  ctx.fillStyle = C.sobreTintaSuave;
  ctx.font = `400 ${13 * U}px ${F.texto}`;
  ctx.fillText(`${contestadas} de ${total} frases respondidas · programas de 2023`, x0, y);
  y += 18 * U + 26 * U;

  for (const r of resultados) {
    const p = partidoPorId(r.partidoId);
    if (!p) continue;
    rect(ctx, x0, y + 7 * U, 11 * U, 11 * U, 3 * U, p.color);
    ctx.fillStyle = C.sobreTinta;
    ctx.font = `600 ${17 * U}px ${F.textoSemi}`;
    ctx.fillText(p.siglas, x0 + 20 * U, y + 3 * U);
    ctx.font = `800 ${22 * U}px ${F.titular}`;
    const pct = r.preguntas ? `${r.porcentaje} %` : '—';
    ctx.fillText(pct, x0 + ancho - ctx.measureText(pct).width, y);
    y += 24 * U + 7 * U;
    rect(ctx, x0, y, ancho, 9 * U, 4.5 * U, 'rgba(255,255,255,0.14)');
    if (r.porcentaje > 0) rect(ctx, x0, y, Math.max(9 * U, (ancho * r.porcentaje) / 100), 9 * U, 4.5 * U, p.color);
    y += 9 * U + 18 * U;
  }

  // Pie
  ctx.fillStyle = C.sobreTinta;
  ctx.font = `600 ${13 * U}px ${F.textoSemi}`;
  ctx.fillText('No es una recomendación de voto.', x0, H - ABAJO - 38 * U);
  ctx.fillStyle = C.sobreTintaSuave;
  ctx.font = `400 ${13 * U}px ${F.texto}`;
  ctx.fillText(`Haz el test en ${webCorta()}`, x0, H - ABAJO - 18 * U);

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
