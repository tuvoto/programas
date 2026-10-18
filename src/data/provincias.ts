// Las 52 circunscripciones del Congreso (50 provincias más Ceuta y Melilla),
// agrupadas por comunidad autónoma.
export type Provincia = { id: string; nombre: string; comunidad: string };

export const COMUNIDADES: { id: string; nombre: string; provincias: string[] }[] = [
  { id: 'andalucia', nombre: 'Andalucía', provincias: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'] },
  { id: 'aragon', nombre: 'Aragón', provincias: ['Huesca', 'Teruel', 'Zaragoza'] },
  { id: 'asturias', nombre: 'Asturias', provincias: ['Asturias'] },
  { id: 'baleares', nombre: 'Illes Balears', provincias: ['Illes Balears'] },
  { id: 'canarias', nombre: 'Canarias', provincias: ['Las Palmas', 'Santa Cruz de Tenerife'] },
  { id: 'cantabria', nombre: 'Cantabria', provincias: ['Cantabria'] },
  { id: 'castilla-la-mancha', nombre: 'Castilla-La Mancha', provincias: ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'] },
  { id: 'castilla-y-leon', nombre: 'Castilla y León', provincias: ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'] },
  { id: 'cataluna', nombre: 'Cataluña', provincias: ['Barcelona', 'Girona', 'Lleida', 'Tarragona'] },
  { id: 'valenciana', nombre: 'Comunitat Valenciana', provincias: ['Alicante', 'Castellón', 'Valencia'] },
  { id: 'extremadura', nombre: 'Extremadura', provincias: ['Badajoz', 'Cáceres'] },
  { id: 'galicia', nombre: 'Galicia', provincias: ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'] },
  { id: 'madrid', nombre: 'Comunidad de Madrid', provincias: ['Madrid'] },
  { id: 'murcia', nombre: 'Región de Murcia', provincias: ['Murcia'] },
  { id: 'navarra', nombre: 'Navarra', provincias: ['Navarra'] },
  { id: 'pais-vasco', nombre: 'País Vasco', provincias: ['Álava', 'Bizkaia', 'Gipuzkoa'] },
  { id: 'la-rioja', nombre: 'La Rioja', provincias: ['La Rioja'] },
  { id: 'ceuta', nombre: 'Ceuta', provincias: ['Ceuta'] },
  { id: 'melilla', nombre: 'Melilla', provincias: ['Melilla'] },
];

const idDe = (nombre: string) =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const PROVINCIAS: Provincia[] = COMUNIDADES.flatMap((c) =>
  c.provincias.map((nombre) => ({ id: idDe(nombre), nombre, comunidad: c.id })),
);

export const provinciaPorId = (id: string | null) => PROVINCIAS.find((p) => p.id === id);
export const comunidadPorId = (id: string) => COMUNIDADES.find((c) => c.id === id);
