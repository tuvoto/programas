// Diputados que elige cada provincia el 29-N (350 en total), según el real
// decreto de convocatoria publicado en el BOE el 6 de octubre de 2026.
// Respecto a 2023: Madrid pasa de 37 a 38 y Cádiz de 9 a 8.
// Las claves son los nombres de data/provincias.

export const DIPUTADOS: Record<string, number> = {
  Madrid: 38, Barcelona: 32, Valencia: 16, Alicante: 12, Sevilla: 12, Málaga: 11, Murcia: 10,
  'A Coruña': 8, Bizkaia: 8, Cádiz: 8, 'Illes Balears': 8, 'Las Palmas': 8,
  Asturias: 7, Granada: 7, Pontevedra: 7, 'Santa Cruz de Tenerife': 7, Zaragoza: 7,
  Almería: 6, Córdoba: 6, Gipuzkoa: 6, Girona: 6, Tarragona: 6, Toledo: 6,
  Badajoz: 5, Cantabria: 5, Castellón: 5, 'Ciudad Real': 5, Huelva: 5, Jaén: 5, Navarra: 5, Valladolid: 5,
  Albacete: 4, Álava: 4, Burgos: 4, Cáceres: 4, 'La Rioja': 4, León: 4, Lleida: 4, Lugo: 4, Ourense: 4, Salamanca: 4,
  Cuenca: 3, Guadalajara: 3, Huesca: 3, Palencia: 3, Segovia: 3, Teruel: 3, Zamora: 3, Ávila: 3,
  Soria: 2, Ceuta: 1, Melilla: 1,
};

// Senado (artículo 69 de la Constitución): 4 senadores por provincia, salvo
// las islas y Ceuta y Melilla. Se puede marcar a uno menos de los que se eligen.
export function senado(provincia: string): string {
  if (provincia === 'Ceuta' || provincia === 'Melilla') return `En ${provincia} se eligen 2 senadores y puedes marcar a 1.`;
  if (provincia === 'Illes Balears')
    return 'En Baleares se vota por islas: Mallorca elige 3 senadores (puedes marcar 2); Menorca e Ibiza-Formentera, 1 cada una.';
  if (provincia === 'Las Palmas')
    return 'En Las Palmas se vota por islas: Gran Canaria elige 3 senadores (puedes marcar 2); Lanzarote y Fuerteventura, 1 cada una.';
  if (provincia === 'Santa Cruz de Tenerife')
    return 'En Santa Cruz de Tenerife se vota por islas: Tenerife elige 3 senadores (puedes marcar 2); La Palma, La Gomera y El Hierro, 1 cada una.';
  return `En ${provincia} se eligen 4 senadores y puedes marcar hasta 3.`;
}
