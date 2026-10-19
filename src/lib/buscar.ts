// Buscador de propuestas: busca palabras en los resúmenes de todos los
// programas cargados, sin distinguir mayúsculas ni tildes.
import { Propuesta, vigentes } from '../data/propuestas';
import { TEMAS } from '../data/temas';

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9%€]+/g, ' ')
    .trim();
}

// Palabras que la gente busca de otra forma. Cada grupo cuenta como una sola
// búsqueda: «SMI» encuentra también «salario mínimo».
const SINONIMOS: string[][] = [
  ['smi', 'salario minimo'],
  ['alquiler', 'alquileres', 'arrendamiento', 'inquilino'],
  ['piso', 'pisos', 'vivienda', 'viviendas'],
  ['iva'],
  ['irpf', 'impuesto sobre la renta'],
  ['pension', 'pensiones', 'jubilacion'],
  ['jornada', 'horas semanales', 'semana laboral'],
  ['inmigracion', 'migrantes', 'migratoria', 'migratorias', 'extranjeria'],
  ['sahara', 'saharaui'],
  ['otan', 'gasto militar', 'defensa'],
  ['aborto', 'interrupcion voluntaria del embarazo'],
  ['clima', 'climatico', 'climatica', 'emisiones'],
  ['nuclear', 'nucleares'],
  ['catalan', 'euskera', 'gallego', 'lenguas'],
  ['joven', 'jovenes', 'juventud', 'menores de 30', 'menores de 35'],
  ['mir', 'medicos'],
  ['beca', 'becas'],
];

// Sugerencias para empezar a buscar.
export const SUGERENCIAS = ['alquiler', 'SMI', 'pensiones', 'jornada', 'IVA', 'becas', 'Sáhara', 'renovables', 'MIR', 'autónomos'];

// Raíz sencilla para que «vacíos» encuentre «vacías» o «renovable» encuentre
// «renovables».
function raiz(palabra: string): string {
  if (palabra.length < 5) return palabra;
  return palabra.replace(/(es|s)$/, '').replace(/[oa]$/, '');
}

function variantes(palabra: string): string[] {
  const g = SINONIMOS.find((grupo) => grupo.includes(palabra));
  return g ?? [raiz(palabra)];
}

// Las palabras cortas («IVA», «MIR») tienen que aparecer enteras, para no
// encontrar «iva» dentro de «privativa».
function contiene(texto: string, w: string): boolean {
  return w.length <= 3 ? texto.includes(` ${w} `) : texto.includes(w);
}

const NOMBRE_TEMA = Object.fromEntries(TEMAS.map((t) => [t.id, normalizar(t.nombre)]));

export type Resultado = { propuesta: Propuesta; claves: string[] };

// Devuelve las propuestas que contienen todas las palabras buscadas (o un
// sinónimo de cada una), en el orden de propuestas.ts.
export function buscar(consulta: string): Resultado[] {
  const q = normalizar(consulta);
  if (q.length < 2) return [];
  // Si la búsqueda entera es un sinónimo de varias palabras («salario mínimo»),
  // se trata como un solo grupo.
  const grupos: string[][] = SINONIMOS.some((g) => g.includes(q))
    ? [variantes(q)]
    : q.split(' ').filter((w) => w.length >= 2).map(variantes);
  if (grupos.length === 0) return [];

  const res: Resultado[] = [];
  for (const p of vigentes()) {
    const texto = ` ${normalizar(p.resumen)} `;
    const tema = NOMBRE_TEMA[p.temaId] ?? '';
    const claves: string[] = [];
    const ok = grupos.every((g) => {
      const v = [...g].sort((x, y) => y.length - x.length).find((w) => contiene(texto, w) || (w.length >= 4 && tema.includes(w)));
      if (v) claves.push(v);
      return Boolean(v);
    });
    if (ok) res.push({ propuesta: p, claves });
  }
  return res;
}

// Trocea un texto para resaltar las palabras encontradas, respetando tildes y
// mayúsculas del original.
export function trozos(texto: string, claves: string[]): { t: string; marcado: boolean }[] {
  if (claves.length === 0) return [{ t: texto, marcado: false }];
  // Mapa de posiciones: normalizar letra a letra conserva la longitud.
  const base = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  if (base.length !== texto.length) return [{ t: texto, marcado: false }];
  const marcas = new Array(texto.length).fill(false);
  for (const c of claves) {
    let i = base.indexOf(c);
    while (i >= 0) {
      for (let k = i; k < i + c.length; k++) marcas[k] = true;
      i = base.indexOf(c, i + c.length);
    }
  }
  const res: { t: string; marcado: boolean }[] = [];
  for (let i = 0; i < texto.length; i++) {
    const ultimo = res.at(-1);
    if (ultimo && ultimo.marcado === marcas[i]) ultimo.t += texto[i];
    else res.push({ t: texto[i], marcado: marcas[i] });
  }
  return res;
}
