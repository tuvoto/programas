// Partidos para las elecciones generales del 29 de noviembre de 2026.
//
// Coaliciones revisadas tras el registro ante la Junta Electoral Central
// (registradas el 17 de octubre de 2026). Están todos los partidos que se
// presentan, aunque aún no tengan programa: se añade en cuanto lo publiquen.
// Candidatos revisados con las candidaturas proclamadas (BOE del 3 de
// noviembre de 2026).
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

import { EN_PAPELETA } from './candidaturas';

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
    url?: string; // en la web oficial del partido
    fechaPublicacion?: string; // AAAA-MM-DD: durante 7 días sale como «Nuevo»
    documento?: string; // cómo se cita en la app
    // Copia del PDF dentro de la web (carpeta public/programas), de la que
    // salen las páginas que cita la app.
    archivo?: string;
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
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://www.psoe.es/media-content/2026/11/PROGRAMAPSOE29N26.pdf',
      fechaPublicacion: '2026-11-15',
      documento: 'Programa del PSOE para el 29-N (2026): «La fuerza de seguir avanzando»',
      archivo: 'programas/psoe-2026.pdf',
    },
    anterior: { documento: 'Programa del PSOE para el 23-J (2023)', archivo: 'programas/psoe-2023.pdf' },
  },
  {
    id: 'pp',
    siglas: 'PP',
    nombre: 'Partido Popular',
    candidato: 'Alberto Núñez Feijóo',
    color: '#1D84CE',
    ambito: 'estatal',
    // En Navarra va dentro de la coalición UPN-PP (ficha de UPN).
    noSePresentaEn: ['navarra'],
    estadoCandidatura: 'confirmada',
    nota: 'En Navarra se presenta en coalición con UPN (UPN-PP).',
    programa: {
      url: 'https://www.pp.es/wp-content/uploads/2026/11/LA-RECONSTRUCCION-NACIONAL.pdf',
      fechaPublicacion: '2026-11-10',
      documento: 'Programa del PP para el 29-N (2026): «Reconstrucción Nacional»',
      archivo: 'programas/pp-2026.pdf',
    },
    anterior: { documento: 'Programa del PP para el 23-J (2023)', archivo: 'programas/pp-2023.pdf' },
  },
  {
    id: 'vox',
    siglas: 'Vox',
    nombre: 'Vox',
    candidato: 'Santiago Abascal',
    color: '#5AC035',
    ambito: 'estatal',
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://www.voxespana.es/wp-content/uploads/2026/11/Programa-completo-A5-1.pdf',
      fechaPublicacion: '2026-11-12',
      documento: 'Programa de Vox para el 29-N (2026): «Es sentido común»',
      archivo: 'programas/vox-2026.pdf',
    },
    anterior: { documento: 'Programa de Vox para el 23-J (2023)', archivo: 'programas/vox-2023.pdf' },
  },
  {
    id: 'frente-amplio',
    siglas: 'Frente Amplio',
    nombre: 'Frente Amplio (Sumar, IU, Más Madrid, Comuns…)',
    candidato: 'Ada Colau',
    candidata: true,
    color: '#E5007E',
    ambito: 'estatal',
    // En Canarias, Baleares y la Comunitat Valenciana sus partidos van en otras coaliciones.
    noSePresentaEn: ['canarias', 'baleares', 'valenciana'],
    estadoCandidatura: 'confirmada',
    nota: 'En Canarias, Baleares y la Comunitat Valenciana va dentro de otras coaliciones, y no presenta lista en Teruel, Ceuta ni Melilla.',
    programa: {
      url: 'https://frenteamplio.info/pdf/ProgramaFrenteAmplio.pdf',
      fechaPublicacion: '2026-11-16',
      documento: 'Programa del Frente Amplio para el 29-N (2026)',
      archivo: 'programas/frente-amplio-2026.pdf',
    },
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
    noSePresentaEn: ['cataluna', 'canarias', 'valenciana', 'baleares'],
    estadoCandidatura: 'confirmada',
    nota: 'Va por separado del Frente Amplio. En Canarias y la Comunitat Valenciana va dentro de otras coaliciones; en Cataluña apoya la lista de ERC, y no presenta lista en Baleares ni en Melilla.',
    programa: {
      url: 'https://podemos.info/wp-content/uploads/2026/11/29N-programa-Podemos.-Paz-casa-y-trabajo.pdf',
      fechaPublicacion: '2026-11-17',
      documento: 'Programa de Podemos para el 29-N (2026): «Así de básico: Paz, casa y trabajo»',
      archivo: 'programas/podemos-2026.pdf',
    },
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
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://www.seacabolafiesta.com/SALF_Contrato_Electoral_29N.pdf',
      fechaPublicacion: '2026-11-16',
      documento: 'Contrato electoral de SALF para el 29-N (2026)',
      archivo: 'programas/salf-2026.pdf',
    },
    anterior: {
      documento: 'Sin programa para las generales de 2023',
      nota: 'Se fundó en 2024 y no se presentó a las generales de 2023.',
    },
  },

  // ── Se presentan solo en su comunidad (tienen escaños en el Congreso saliente,
  //    en el Parlamento Europeo o en su parlamento autonómico)
  {
    id: 'erc',
    siglas: 'ERC',
    nombre: 'Esquerra Republicana de Catalunya',
    candidato: 'Gabriel Rufián',
    color: '#F28C00',
    ambito: 'autonomico',
    territorio: 'Cataluña',
    comunidades: ['cataluna'],
    estadoCandidatura: 'confirmada',
    nota: 'Incluye independientes de Podemos en la lista de Barcelona.',
    programa: {
      url: 'https://esquerrarepublicana.cat/documents/e2026-programa.pdf',
      fechaPublicacion: '2026-11-17',
      documento: 'Programa de ERC para el 29-N (2026): «Pel país. Per la gent. Pel futur»',
      archivo: 'programas/erc-2026.pdf',
    },
    anterior: { documento: 'Programa de ERC para el 23-J (2023)', url: 'https://defensacatalunya.esquerrarepublicana.cat/documents/e2023-programa.pdf', archivo: 'programas/erc-2023.pdf' },
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
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://www.elnacional.cat/uploads/s1/60/70/28/30/junts-programa-electoral-29n.pdf',
      fechaPublicacion: '2026-11-19',
      documento: 'Programa de Junts para el 29-N (2026): «Catalunya al centre» (en catalán)',
      archivo: 'programas/junts-2026.pdf',
    },
    anterior: { documento: 'Programa de Junts para el 23-J (2023)', archivo: 'programas/junts-2023.pdf' },
  },
  {
    id: 'bildu',
    siglas: 'EH Bildu',
    nombre: 'Euskal Herria Bildu',
    candidato: 'Oskar Matute',
    color: '#9DBB12',
    ambito: 'autonomico',
    territorio: 'País Vasco y Navarra',
    comunidades: ['pais-vasco', 'navarra'],
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://www.naiz.eus/media/asset_publics/resources/001/388/034/original/posibleegin-programa-cas.pdf',
      fechaPublicacion: '2026-11-16',
      documento: 'Programa de EH Bildu para el 29-N (2026): «Garantía y derechos»',
      archivo: 'programas/bildu-2026.pdf',
    },
    anterior: { documento: 'Programa de EH Bildu para el 23-J (2023)', archivo: 'programas/bildu-2023.pdf' },
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
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://www.eaj-pnv.eus/es/adjuntos-documentos/21765/pdf/programa-electoral-29n',
      fechaPublicacion: '2026-11-16',
      documento: 'Programa del PNV para el 29-N (2026): «Defendemos Euskadi»',
      archivo: 'programas/pnv-2026.pdf',
    },
    anterior: { documento: 'Programa del PNV para el 23-J (2023)', url: 'https://www.eaj-pnv.eus/es/documentos/20945/con-voz-propia-programa-electoral-23-j', archivo: 'programas/pnv-2023.pdf' },
  },
  {
    id: 'bng',
    siglas: 'BNG',
    nombre: 'Bloque Nacionalista Galego',
    candidato: 'Néstor Rego',
    color: '#76B3DE',
    ambito: 'autonomico',
    territorio: 'Galicia',
    comunidades: ['galicia'],
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://www.bng.gal/media/bnggaliza/files/2026/11/12/26_bng_xerais_documentos_programa_electoral.pdf',
      fechaPublicacion: '2026-11-12',
      documento: 'Programa del BNG para el 29-N (2026)',
      archivo: 'programas/bng-2026.pdf',
    },
    anterior: { documento: 'Programa del BNG para el 23-J (2023)', url: 'https://www.bng.gal/media/bnggaliza/files/2023/07/05/23_bng_xerais_programa.pdf', archivo: 'programas/bng-2023.pdf' },
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
    estadoCandidatura: 'confirmada',
    programa: {
      url: 'https://coalicioncanaria.org/wp-content/uploads/2026/11/CCA-26-Programa_Electoral-29NOV.pdf',
      fechaPublicacion: '2026-11-13',
      documento: 'Programa de Coalición Canaria y Primero Canarias para el 29-N (2026): «Defiende Canarias»',
      archivo: 'programas/cc-2026.pdf',
    },
    anterior: {
      documento: 'Manifiesto de Coalición Canaria para el 23-J (2023)',
      url: 'https://coalicioncanaria.org/wp-content/uploads/2023/06/COALICION_POR_CANARIAS.pdf',
      archivo: 'programas/cc-2023.pdf',
      nota: 'En 2023 Coalición Canaria no publicó un programa largo: presentó un manifiesto con 52 compromisos.',
    },
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
    nota: 'Coalición registrada ante la Junta Electoral. Une a Compromís, Podemos, Esquerra Unida, Esquerra Republicana del País Valencià y otros partidos valencianos.',
    programa: {
      url: 'https://frontvalencia.org/programa-compromis-front-valencia.pdf',
      fechaPublicacion: '2026-11-15',
      documento: 'Programa de Compromís-Front Valencià para el 29-N (2026)',
      archivo: 'programas/compromis-2026.pdf',
    },
    anterior: {
      documento: 'Programa de Sumar para el 23-J (2023)',
      archivo: 'programas/sumar-2023.pdf',
      nota: 'En 2023 Compromís concurrió dentro de Sumar.',
    },
  },
  {
    id: 'upc',
    siglas: 'Unidad del Pueblo Canario',
    nombre: 'Nueva Canarias, Podemos, Sumar e IU Canaria',
    color: '#00838F',
    ambito: 'autonomico',
    territorio: 'Canarias',
    comunidades: ['canarias'],
    estadoCandidatura: 'confirmada',
    nota: 'Coalición registrada ante la Junta Electoral, para el Congreso y el Senado. Une a Nueva Canarias-Bloque Canarista, Podemos, Movimiento Sumar e Izquierda Unida Canaria.',
    programa: {
      url: 'https://www.unidadpueblocanario.org/manifiesto-20261119/manifiesto-electoral-upc.pdf',
      fechaPublicacion: '2026-11-17',
      documento: 'Manifiesto electoral de Unidad del Pueblo Canario para el 29-N (2026), con las líneas básicas de su programa',
      archivo: 'programas/upc-2026.pdf',
    },
    anterior: {
      documento: 'Programa de Sumar para el 23-J (2023)',
      archivo: 'programas/sumar-2023.pdf',
      nota: 'Es una coalición nueva. En 2023, Podemos, Sumar e IU concurrieron juntos como Sumar; Nueva Canarias fue por separado.',
    },
  },
  {
    id: 'ara-mes',
    siglas: 'Ara Més-Front Ampli',
    nombre: 'Més per Mallorca, Més per Menorca, Ara Eivissa, Sumar e IU',
    color: '#C2185B',
    ambito: 'autonomico',
    territorio: 'Illes Balears',
    comunidades: ['baleares'],
    estadoCandidatura: 'confirmada',
    nota: 'Coalición para el Congreso en Baleares de Ara Més con el Frente Amplio (Esquerra Unida y Movimiento Sumar). Ara Més ha presentado propuestas propias para Baleares, pero no hemos encontrado su programa completo publicado: mientras tanto, las propuestas que ves son las del programa del Frente Amplio, su socio en la coalición.',
    programa: {
      url: 'https://frenteamplio.info/pdf/ProgramaFrenteAmplio.pdf',
      fechaPublicacion: '2026-11-16',
      documento: 'Programa del Frente Amplio para el 29-N (2026), socio de Ara Més en la coalición',
      archivo: 'programas/frente-amplio-2026.pdf',
    },
    anterior: {
      documento: 'Programa de Sumar para el 23-J (2023)',
      archivo: 'programas/sumar-2023.pdf',
      nota: 'En 2023, Més per Mallorca concurrió dentro de Sumar.',
    },
  },
  {
    id: 'upn',
    siglas: 'UPN',
    nombre: 'Unión del Pueblo Navarro (en coalición con el PP)',
    color: '#24406E',
    ambito: 'autonomico',
    territorio: 'Navarra',
    comunidades: ['navarra'],
    estadoCandidatura: 'confirmada',
    nota: 'Se presenta al Congreso en coalición con el PP (UPN-PP) y comparte su programa: las propuestas que ves son las del PP.',
    programa: {
      url: 'https://www.pp.es/wp-content/uploads/2026/11/LA-RECONSTRUCCION-NACIONAL.pdf',
      fechaPublicacion: '2026-11-10',
      documento: 'Programa conjunto de PP y UPN para el 29-N (2026): «Reconstrucción Nacional»',
      archivo: 'programas/pp-2026.pdf',
    },
    anterior: {
      documento: 'Sin programa propio para las generales de 2023',
      nota: 'En 2023 UPN no publicó programa para las generales, solo el de las elecciones forales de Navarra.',
    },
  },
  {
    id: 'adelante',
    siglas: 'Adelante Andalucía',
    nombre: 'Adelante Andalucía',
    color: '#1B7F4B',
    ambito: 'autonomico',
    territorio: 'Andalucía',
    comunidades: ['andalucia'],
    estadoCandidatura: 'confirmada',
    nota: 'Se presenta en solitario en las ocho provincias andaluzas, sin el Frente Amplio. Tiene 8 escaños en el Parlamento de Andalucía desde mayo de 2026.',
    programa: {
      url: 'https://programa.adelanteandalucia.org/programa-29n-adelante-andalucia.pdf',
      fechaPublicacion: '2026-11-16',
      documento: 'Programa de Adelante Andalucía para el 29-N (2026): «Un programa para frenar a las derechas»',
      archivo: 'programas/adelante-2026.pdf',
    },
  },
  {
    id: 'existe',
    siglas: 'Existe',
    nombre: 'Teruel Existe y Aragón Existe',
    color: '#5D7C2E',
    ambito: 'autonomico',
    territorio: 'Aragón',
    comunidades: ['aragon'],
    estadoCandidatura: 'confirmada',
    nota: 'Al Congreso solo se presenta en Teruel, como Teruel Existe. Tiene escaños en las Cortes de Aragón.',
    programa: {
      url: 'https://teruelexiste.info/wp-content/uploads/2026/11/Programa_Teruel_Existe_Completo_29N.pdf',
      fechaPublicacion: '2026-11-15',
      documento: 'Programa de Teruel Existe para el 29-N (2026): «Vamos a seguir defendiendo nuestra tierra»',
      archivo: 'programas/existe-2026.pdf',
    },
  },
  {
    id: 'geroa-bai',
    siglas: 'Geroa Bai',
    nombre: 'Geroa Bai',
    color: '#E0572A',
    ambito: 'autonomico',
    territorio: 'Navarra',
    comunidades: ['navarra'],
    estadoCandidatura: 'confirmada',
    nota: 'Se presenta con candidatura propia al Congreso en Navarra. Tiene 7 escaños en el Parlamento de Navarra.',
    programa: {
      fechaPublicacion: '2026-11-18',
      documento: '«Defiéndete. Guk, Nafarroa». Bases políticas de Geroa Bai para el 29-N (2026)',
      archivo: 'programas/geroa-bai-2026.pdf',
    },
  },
];

// Criterio de inclusión (neutral y verificable): partidos con escaños en el
// Congreso saliente, en el Parlamento Europeo (2024) o en su parlamento
// autonómico, y los que han surgido de ellos.
export const ESTATALES = PARTIDOS.filter((p) => p.ambito === 'estatal');
export const AUTONOMICOS = PARTIDOS.filter((p) => p.ambito === 'autonomico');

// ¿Está este partido en la papeleta del Congreso de esa provincia? Si ya está
// el BOE cargado (data/candidaturas), manda el BOE; si no, las coaliciones
// registradas por comunidad.
export function sePresentaEn(p: Partido, provincia: { id: string; comunidad: string }): boolean {
  const boe = EN_PAPELETA[provincia.id];
  if (boe) return boe.includes(p.id);
  if (p.comunidades) return p.comunidades.includes(provincia.comunidad);
  return !(p.noSePresentaEn ?? []).includes(provincia.comunidad);
}

export function partidoPorId(id: string): Partido | undefined {
  return PARTIDOS.find((p) => p.id === id);
}