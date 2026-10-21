// Resto de candidaturas al Congreso en cada provincia, según la publicación
// oficial en el BOE. Son las que no tienen ficha en la app (ver el criterio de
// inclusión en data/partidos.ts): aquí solo va el nombre, tal cual aparece en
// el BOE, sin programa ni análisis.
//
// Las claves son los ids de data/provincias (p. ej. 'granada', 'a-coruna').
// Mientras no se publique el BOE (28 de octubre de 2026), queda vacío y la app
// avisa de que la lista llegará ese día.

export const BOE_CANDIDATURAS: { fecha: string | null; url: string | null } = {
  fecha: null, // AAAA-MM-DD de la publicación en el BOE
  url: null, // enlace al BOE con las candidaturas proclamadas
};

export const OTRAS_CANDIDATURAS: Record<string, string[]> = {};
