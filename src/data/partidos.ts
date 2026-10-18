// Partidos para las elecciones generales del 29 de noviembre de 2026.
//
// Coaliciones revisadas tras el registro ante la Junta Electoral Central
// (plazo hasta el 16 de octubre de 2026). Las candidaturas se proclaman el
// 2 de noviembre y se publican en el BOE el 3: entonces hay que revisar los
// candidatos.
//
// `estadoCandidatura`:
//   - "confirmada": ya registrada / proclamada oficialmente
//   - "provisional": se espera que se presente, pendiente de confirmar
//   - "en-negociacion": coalición todavía sin cerrar
//
// `programa.url` y `programa.fechaPublicacion` se rellenan cuando el
// partido publique su programa oficial. No pongas enlaces que no sean
// de la web oficial del partido.
//
// `anterior` describe el programa de las elecciones del 23-J de 2023, que se
// muestra mientras no esté el nuevo. `documento` es cómo se cita en la app.

export type EstadoCandidatura = 'confirmada' | 'provisional' | 'en-negociacion';

export type Partido = {
  id: string;
  siglas: string;
  nombre: string;
  candidato?: string;
  candidata?: boolean; // para escribir «Candidata»
  color: string; // color para la interfaz
  ambito: 'estatal' | 'autonomico';
  // Solo partidos autonómicos: dónde se presentan (p. ej. «Cataluña»).
  territorio?: string;
  // Comunidades (ids de data/provincias) en las que se presenta. Los partidos
  // estatales se presentan en todas salvo las de `noSePresentaEn`.
  comunidades?: string[];
  noSePresentaEn?: string[];
  estadoCandidatura: EstadoCandidatura;
  nota?: string;
  programa: {
    url?: string;
    fechaPublicacion?: string; // AAAA-MM-DD
  };
  anterior?: {
    documento: string; // p. ej. "Programa del PSOE para el 23-J (2023)"
    url?: string;
    // Copia del PDF dentro de la web (carpeta public/programas). Es el mismo
    // archivo del que salen las páginas que cita la app.
    archivo?: string;
    nota?: string;
  };
};

export const PARTIDOS: Partido[] = [
  {
    id: 'psoe',
    siglas: 'PSOE',
    nombre: 'Partido Socialista Obrero Español',
    candidato: 'Pedro Sánchez',
    color: '#E1251B',
    ambito: 'estatal',
    estadoCandidatura: 'provisional',
    programa: {},
    anterior: { documento: 'Programa del PSOE para el 23-J (2023)', archivo: 'programas/psoe-2023.pdf' },
  },
  {
    id: 'pp',
    siglas: 'PP',
    nombre: 'Partido Popular',
    candidato: 'Alberto Núñez Feijóo',
    color: '#1D84CE',
    ambito: 'estatal',
    estadoCandidatura: 'provisional',
    programa: {},
    anterior: { documento: 'Programa del PP para el 23-J (2023)', archivo: 'programas/pp-2023.pdf' },
  },
  {
    id: 'vox',
    siglas: 'Vox',
    nombre: 'Vox',
    candidato: 'Santiago Abascal',
    color: '#5AC035',
    ambito: 'estatal',
    estadoCandidatura: 'provisional',
    programa: {},
    anterior: { documento: 'Programa de Vox para el 23-J (2023)', archivo: 'programas/vox-2023.pdf' },
  },
  {
    id: 'frente-amplio',
    siglas: 'Frente Amplio',
    nombre: 'Frente Amplio (Sumar, IU, Más Madrid, Comuns…)',
    color: '#E5007E',
    ambito: 'estatal',
    // En Canarias, Baleares y la Comunitat Valenciana sus partidos van en otras coaliciones.
    noSePresentaEn: ['canarias', 'baleares', 'valenciana'],
    estadoCandidatura: 'confirmada',
    nota: 'Coalición registrada. En Canarias, Baleares y la Comunitat Valenciana concurre dentro de otras coaliciones.',
    programa: {},
    anterior: {
      documento: 'Programa de Sumar para el 23-J (2023)',
      archivo: 'programas/sumar-2023.pdf',
      nota: 'En 2023, la mayoría de partidos del Frente Amplio concurrieron juntos como Sumar.',
    },
  },
  {
    id: 'podemos',
    siglas: 'Podemos',
    nombre: 'Podemos',
    candidato: 'Irene Montero',
    candidata: true,
    color: '#6B2C91',
    ambito: 'estatal',
    // En Cataluña apoya a ERC; en Canarias y la Comunitat Valenciana va en coalición.
    noSePresentaEn: ['cataluna', 'canarias', 'valenciana'],
    estadoCandidatura: 'confirmada',
    nota: 'Concurre por separado del Frente Amplio en la mayoría de comunidades; en Canarias y la Comunitat Valenciana, dentro de coaliciones; en Cataluña apoya la lista de ERC.',
    programa: {},
    anterior: {
      documento: 'Programa de Sumar para el 23-J (2023)',
      archivo: 'programas/sumar-2023.pdf',
      nota: 'En 2023 Podemos concurrió dentro de Sumar y no tuvo programa propio. Sus propuestas de 2023 son las del bloque Frente Amplio (Sumar).',
    },
  },
  {
    id: 'salf',
    siglas: 'SALF',
    nombre: 'Se Acabó La Fiesta',
    candidato: 'Alvise Pérez',
    color: '#A0522D',
    ambito: 'estatal',
    estadoCandidatura: 'provisional',
    programa: {},
    anterior: {
      documento: 'Sin programa para las generales de 2023',
      nota: 'Se fundó en 2024 y no se presentó a las generales de 2023.',
    },
  },

  // ── Se presentan solo en su comunidad (tienen diputados en el Congreso saliente)
  {
    id: 'erc',
    siglas: 'ERC',
    nombre: 'Esquerra Republicana de Catalunya',
    candidato: 'Gabriel Rufián',
    color: '#F28C00',
    ambito: 'autonomico',
    territorio: 'Cataluña',
    comunidades: ['cataluna'],
    estadoCandidatura: 'provisional',
    nota: 'Incluye independientes de Podemos en la lista de Barcelona.',
    programa: {},
    anterior: { documento: 'Programa de ERC para el 23-J (2023)' },
  },
  {
    id: 'junts',
    siglas: 'Junts',
    nombre: 'Junts per Catalunya',
    candidato: 'Míriam Nogueras',
    candidata: true,
    color: '#20B8AC',
    ambito: 'autonomico',
    territorio: 'Cataluña',
    comunidades: ['cataluna'],
    estadoCandidatura: 'provisional',
    programa: {},
    anterior: { documento: 'Programa de Junts para el 23-J (2023)' },
  },
  {
    id: 'bildu',
    siglas: 'EH Bildu',
    nombre: 'Euskal Herria Bildu',
    color: '#9DBB12',
    ambito: 'autonomico',
    territorio: 'País Vasco y Navarra',
    comunidades: ['pais-vasco', 'navarra'],
    estadoCandidatura: 'provisional',
    nota: 'Candidatura por confirmar.',
    programa: {},
    anterior: { documento: 'Programa de EH Bildu para el 23-J (2023)' },
  },
  {
    id: 'pnv',
    siglas: 'PNV',
    nombre: 'Partido Nacionalista Vasco (EAJ-PNV)',
    candidato: 'Maribel Vaquero',
    candidata: true,
    color: '#0F6B3A',
    ambito: 'autonomico',
    territorio: 'País Vasco',
    comunidades: ['pais-vasco'],
    estadoCandidatura: 'provisional',
    programa: {},
    anterior: { documento: 'Programa del PNV para el 23-J (2023)' },
  },
  {
    id: 'bng',
    siglas: 'BNG',
    nombre: 'Bloque Nacionalista Galego',
    color: '#76B3DE',
    ambito: 'autonomico',
    territorio: 'Galicia',
    comunidades: ['galicia'],
    estadoCandidatura: 'provisional',
    nota: 'Candidatura por confirmar.',
    programa: {},
    anterior: { documento: 'Programa del BNG para el 23-J (2023)' },
  },
  {
    id: 'cc',
    siglas: 'CC',
    nombre: 'Coalición Canaria – Primero Canarias',
    candidato: 'Cristina Valido',
    candidata: true,
    color: '#F5C400',
    ambito: 'autonomico',
    territorio: 'Canarias',
    comunidades: ['canarias'],
    estadoCandidatura: 'provisional',
    programa: {},
    anterior: { documento: 'Programa de Coalición Canaria para el 23-J (2023)' },
  },
  {
    id: 'compromis',
    siglas: 'Compromís',
    nombre: 'Compromís – Front Valencià (Compromís, Podemos, EUPV…)',
    candidato: 'Àgueda Micó',
    candidata: true,
    color: '#C2410C',
    ambito: 'autonomico',
    territorio: 'Comunitat Valenciana',
    comunidades: ['valenciana'],
    estadoCandidatura: 'confirmada',
    nota: 'Coalición registrada.',
    programa: {},
    anterior: {
      documento: 'Programa de Sumar para el 23-J (2023)',
      archivo: 'programas/sumar-2023.pdf',
      nota: 'En 2023 Compromís concurrió dentro de Sumar.',
    },
  },
  {
    id: 'upn',
    siglas: 'UPN',
    nombre: 'Unión del Pueblo Navarro',
    color: '#24406E',
    ambito: 'autonomico',
    territorio: 'Navarra',
    comunidades: ['navarra'],
    estadoCandidatura: 'provisional',
    nota: 'Candidatura por confirmar.',
    programa: {},
    anterior: { documento: 'Programa de UPN para el 23-J (2023)' },
  },
];

// Criterio de inclusión (neutral y verificable): partidos con diputados en el
// Congreso saliente + partidos que se presentan en toda España.
export const ESTATALES = PARTIDOS.filter((p) => p.ambito === 'estatal');
export const AUTONOMICOS = PARTIDOS.filter((p) => p.ambito === 'autonomico');

// ¿Está este partido en la papeleta de esa comunidad? Según las coaliciones
// registradas; se confirma cuando se proclaman las candidaturas.
export function sePresentaEn(p: Partido, comunidad: string): boolean {
  if (p.comunidades) return p.comunidades.includes(comunidad);
  return !(p.noSePresentaEn ?? []).includes(comunidad);
}

export function partidoPorId(id: string): Partido | undefined {
  return PARTIDOS.find((p) => p.id === id);
}
