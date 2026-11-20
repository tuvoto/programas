// Test de afinidad: frases sobre medidas concretas y la postura de cada
// programa sobre ellas.
//
// Reglas para que sea neutral:
//   - Las frases hablan de medidas, no de partidos, para no condicionar la
//     respuesta. Muchas incluyen su coste («aunque…»), para que no sean de
//     respuesta obvia. Se muestran en orden aleatorio.
//   - Cada postura sale de una propuesta concreta del programa (con su página).
//     Si el programa no dice nada, el partido NO tiene postura (no se inventa).
//   - Valores: 2 = a favor de forma explícita, 1 = a favor de forma indirecta,
//     -1 = en contra de forma indirecta, -2 = en contra de forma explícita.
//   - Unas frases van en un sentido y otras en el contrario, para que decir
//     «sí» a todo no empuje siempre hacia los mismos partidos.
//   - Solo entran partidos con programa cargado en la app.
//
// Test rehecho en noviembre de 2026 con los programas del 29-N: todas las
// posturas salen del programa de 2026 de cada partido (las páginas son de ese
// PDF). UPN comparte programa con el PP, así que tiene sus mismas posturas.

import { PARTIDOS } from './partidos';

export type Postura = { valor: -2 | -1 | 1 | 2; pagina: number; motivo: string };

export type Afirmacion = {
  id: string;
  temaId: string;
  texto: string;
  // Qué pasaría, en una línea por cada lado, para decidir con contexto.
  aFavor: string;
  enContra: string;
  // Forma parte del test corto (25 frases).
  corta?: boolean;
  posturas: Partial<Record<string, Postura>>;
};

export const PARTIDOS_TEST = ['psoe', 'pp', 'vox', 'frente-amplio', 'podemos', 'salf'];

// Partidos de comunidad que entran en el test si la persona ha elegido una
// provincia de su comunidad. Solo los que tienen postura en bastantes frases,
// para que el porcentaje no salga de dos o tres respuestas.
export const MIN_POSTURAS = 10;

// Versión corta del test: 25 frases, dos de cada tema (tres de impuestos).
export const AFIRMACIONES_CORTAS = () => AFIRMACIONES.filter((a) => a.corta);

const P = (valor: Postura['valor'], pagina: number, motivo: string): Postura => ({ valor, pagina, motivo });

export const AFIRMACIONES: Afirmacion[] = [
  // Vivienda
  {
    id: 'limitar-alquiler',
    temaId: 'vivienda',
    corta: true,
    texto: 'El Estado debería poder poner un tope al precio del alquiler en las zonas donde más ha subido.',
    aFavor: 'Los inquilinos pagarían menos. Para que no falten pisos, varios programas proponen sacar al mercado las viviendas vacías: más IBI, un registro o ventajas fiscales a quien alquile barato.',
    enContra: 'Quienes se oponen creen que algunos propietarios dejarían de alquilar o pasarían al alquiler de temporada, y habría menos pisos en oferta.',
    posturas: {
      psoe: P(2, 30, 'Congelar las rentas que superen los índices de referencia en zonas tensionadas.'),
      pp: P(-2, 53, 'Derogar la Ley de Vivienda y eliminar las zonas tensionadas y el índice de precios.'),
      vox: P(-1, 23, 'Derogar la Ley de Vivienda.'),
      'frente-amplio': P(2, 13, 'Limitar el alquiler para que no supere el 25 % de la renta del barrio.'),
      podemos: P(2, 8, 'Bajar por ley un 40 % los alquileres, también en los contratos en vigor.'),
      junts: P(-2, 60, 'Derogar la contención de precios y las zonas tensionadas de la Ley de Vivienda.'),
      bng: P(2, 12, 'Topar por ley el precio del alquiler.'),
      bildu: P(2, 5, 'Subida anual máxima del 2 % en los alquileres y apoyo a las zonas tensionadas.'),
      adelante: P(2, 4, 'Ningún alquiler por encima del 20 % del salario.'),
      upc: P(2, 3, 'Controlar los precios del alquiler para impedir subidas abusivas.'),
      upn: P(-2, 53, 'Derogar la Ley de Vivienda y eliminar las zonas tensionadas y el índice de precios.'),
    },
  },
  {
    id: 'fondos-vivienda',
    temaId: 'vivienda',
    texto: 'Habría que prohibir que los fondos de inversión y los grandes propietarios compren viviendas para especular.',
    aFavor: 'Habría más pisos para quien los quiere para vivir, y menos presión sobre los precios.',
    enContra: 'Quienes se oponen creen que entraría menos dinero a construir y alquilar, y que sería difícil separar qué compra es especulativa.',
    posturas: {
      psoe: P(1, 31, 'Un impuesto progresivo a las viviendas vacías, turísticas o caras de fondos y grandes propietarios.'),
      vox: P(1, 25, 'Impuestos más altos a las operaciones especulativas de fondos.'),
      podemos: P(2, 8, 'Prohibir comprar viviendas que no sean para vivir en ellas.'),
      erc: P(1, 20, 'Nuevas limitaciones y obligaciones fiscales a fondos y grandes tenedores.'),
      junts: P(2, 16, 'Impedir que los «fondos buitre» compren vivienda para especular.'),
      bildu: P(2, 5, 'Prohibir la compra especulativa por empresas, fondos y grandes propietarios.'),
      bng: P(1, 13, 'Recargos fiscales a fondos y SOCIMI que no cumplan la función social de la vivienda.'),
      compromis: P(2, 5, 'Prohibir que fondos y sociedades especulativas compren viviendas.'),
      adelante: P(2, 4, 'Prohibir que los fondos compren vivienda y la compra especulativa.'),
      upc: P(1, 3, 'Expropiar viviendas a los «fondos buitre».'),
    },
  },
  {
    id: 'desalojo-48h',
    temaId: 'vivienda',
    corta: true,
    texto: 'Una vivienda ocupada ilegalmente debería poder desalojarse en 48 horas, sin esperar a un juicio largo.',
    aFavor: 'El propietario recuperaría su casa enseguida y ocupar dejaría de compensar.',
    enContra: 'Quienes se oponen temen que se desaloje a familias vulnerables sin alternativa o sin que un juez revise bien cada caso.',
    posturas: {
      pp: P(2, 55, 'Recuperar en 48 horas, por orden judicial, una vivienda ocupada ilegalmente.'),
      vox: P(2, 24, 'Desalojar una vivienda ocupada ilegalmente en menos de 24 horas.'),
      salf: P(2, 5, 'Desalojo en 48 horas con denuncia y título de propiedad.'),
      junts: P(2, 17, 'Desalojar las ocupaciones ilegales en un máximo de 48 horas.'),
      podemos: P(-1, 9, 'Prohibir las empresas de «desokupación» y los desahucios de personas vulnerables sin alternativa.'),
      adelante: P(-1, 4, 'Ilegalizar las empresas de «desokupación».'),
      upc: P(-1, 4, 'Ningún desalojo de familias vulnerables, también por ocupación por falta de vivienda, sin realojo garantizado.'),
      upn: P(2, 55, 'Recuperar en 48 horas, por orden judicial, una vivienda ocupada ilegalmente.'),
    },
  },
  {
    id: 'impuestos-primera-vivienda',
    temaId: 'vivienda',
    texto: 'Bajar los impuestos de comprar la primera vivienda (IVA e ITP) es la mejor forma de ayudar a acceder a una casa.',
    aFavor: 'Comprar costaría miles de euros menos desde el primer día.',
    enContra: 'Quienes se oponen creen que parte de la rebaja acabaría en precios más altos y que lo que falta es oferta, sobre todo de alquiler.',
    posturas: {
      pp: P(1, 54, 'IVA del 4 % en la primera vivienda para los menores de 40 años.'),
      vox: P(2, 24, 'Sin impuestos en la primera vivienda habitual: IVA del 0 % y sin ITP.'),
      salf: P(2, 5, 'Primera vivienda sin ITP ni AJD y con el IVA devuelto en la renta.'),
      erc: P(1, 19, 'Bajar el IVA y el ITP de la residencia habitual y subirlos a las demás viviendas.'),
      junts: P(1, 17, 'Bajar del 10 % al 5 % el IVA de la vivienda nueva para residencia habitual.'),
      compromis: P(1, 6, 'Sin ITP en la compra de la primera vivienda de menos de 350.000 €.'),
      upn: P(1, 54, 'IVA del 4 % en la primera vivienda para los menores de 40 años.'),
    },
  },
  {
    id: 'pisos-turisticos',
    temaId: 'vivienda',
    texto: 'Debería haber un límite de pisos turísticos por barrio o municipio.',
    aFavor: 'Volverían pisos al alquiler para quien vive allí y los barrios no se vaciarían de vecinos.',
    enContra: 'Los propietarios perderían ingresos y quienes se oponen creen que el problema son los pisos ilegales, no los legales.',
    posturas: {
      'frente-amplio': P(2, 12, 'Extinguir en tres años las licencias turísticas en edificios residenciales de zonas tensionadas.'),
      podemos: P(2, 9, 'Acabar con los pisos turísticos en edificios residenciales mientras dure la emergencia.'),
      salf: P(-2, 7, 'Registro único de pisos turísticos con cumplimiento fiscal, sin prohibiciones.'),
      pnv: P(1, 8, 'Regular los alquileres turísticos para que no quiten vivienda residencial.'),
      cc: P(1, 11, 'Reglas y control para la vivienda vacacional.'),
      adelante: P(2, 50, 'Cupos de pisos turísticos por zona según la población.'),
      existe: P(2, 7, 'Permitir limitar los pisos turísticos a un porcentaje del parque.'),
      upc: P(1, 4, 'Regular y ordenar la vivienda vacacional en zonas residenciales.'),
    },
  },
  // Empleo
  {
    id: 'jornada',
    temaId: 'empleo',
    corta: true,
    texto: 'La jornada laboral máxima debería bajar por ley de 40 a 37,5 horas semanales, cobrando lo mismo.',
    aFavor: 'Más tiempo para la vida personal y familiar, con el mismo salario.',
    enContra: 'Quienes se oponen creen que subiría los costes, sobre todo en pequeños negocios y en sectores con horarios largos.',
    posturas: {
      psoe: P(2, 41, 'Completar la reducción de la jornada a 37,5 horas.'),
      'frente-amplio': P(2, 56, 'Bajar a 37,5 horas ya y avanzar hasta las 32, sin bajar el sueldo.'),
      podemos: P(2, 41, 'Bajar la jornada a 35 horas y luego a 30, sin bajar el sueldo.'),
      erc: P(2, 26, 'Reducir la jornada a 37,5 horas sin bajar el sueldo.'),
      junts: P(-2, 88, 'En contra de imponer por ley la jornada de 37,5 horas.'),
      bildu: P(2, 6, 'Jornada de 32 horas o de cuatro días sin rebajar el salario.'),
      bng: P(2, 15, 'Jornada de 35 horas sin rebajar el salario.'),
      compromis: P(2, 7, 'Semana de cuatro días (32 horas) sin bajar el sueldo.'),
      adelante: P(2, 7, 'Jornada de 32 horas sin rebaja de sueldo.'),
      upc: P(2, 7, 'Jornada de 37,5 horas por ley y avanzar hacia las 34.'),
    },
  },
  {
    id: 'despido',
    temaId: 'empleo',
    texto: 'El despido improcedente debería costar más a las empresas que ahora.',
    aFavor: 'Los trabajadores estarían más protegidos y despedir sin causa dejaría de salir barato.',
    enContra: 'Quienes se oponen creen que las empresas contratarían menos, sobre todo las pequeñas.',
    posturas: {
      psoe: P(2, 41, 'Que la indemnización por despido improcedente repare de verdad el daño.'),
      'frente-amplio': P(2, 53, 'Un despido improcedente que repare el daño real y disuada de despedir sin causa.'),
      podemos: P(2, 42, 'Volver a los 45 días por año en los despidos ilegales.'),
      salf: P(-1, 30, 'Un contrato único con indemnización creciente de 12 a 33 días por año.'),
      erc: P(2, 26, 'Una indemnización extra por despido sin causa.'),
      bildu: P(2, 6, 'Indemnización de al menos 45 días por año por despido improcedente.'),
      bng: P(2, 15, 'Volver a los 45 días de indemnización por despido improcedente.'),
      compromis: P(2, 7, 'Volver a los 45 días por año de indemnización.'),
    },
  },
  {
    id: 'cotizaciones',
    temaId: 'empleo',
    corta: true,
    texto: 'Para crear empleo, habría que bajar lo que pagan empresas y autónomos a la Seguridad Social.',
    aFavor: 'Contratar sería más barato. Algunos programas lo limitan a nuevos autónomos o a quienes más difícil lo tienen para encontrar trabajo.',
    enContra: 'La Seguridad Social, que paga las pensiones, ingresaría menos.',
    posturas: {
      pp: P(2, 59, 'Nuevos autónomos sin cuota el primer año y el 100 % de las cotizaciones del primer trabajador bonificadas.'),
      vox: P(1, 9, 'Cuota cero para los autónomos que ingresen menos del salario mínimo.'),
      podemos: P(-1, 44, 'Eliminar el tope máximo de las bases de cotización.'),
      salf: P(2, 30, 'Bajar la cuña fiscal del 41 al 29 % y cero cotización en el salario mínimo.'),
      junts: P(1, 61, 'Bonificar las cotizaciones por contratar indefinidamente a menores de 35.'),
      cc: P(1, 12, 'Bonificar cotizaciones ligadas a subidas de sueldo.'),
      compromis: P(-1, 8, 'Eliminar el tope de la base máxima de cotización.'),
      existe: P(1, 11, 'Ayudas a las empresas de Teruel de hasta el 20 % de los costes laborales.'),
      upc: P(1, 13, 'Tarifa plana de 88 € al mes para los autónomos con menos ingresos.'),
      upn: P(2, 59, 'Nuevos autónomos sin cuota el primer año y el 100 % de las cotizaciones del primer trabajador bonificadas.'),
    },
  },
  {
    id: 'smi-autonomico',
    temaId: 'empleo',
    texto: 'Cada comunidad debería poder fijar su propio salario mínimo, por encima del estatal.',
    aFavor: 'Se ajustaría al coste de la vida de cada sitio, que es muy distinto entre comunidades.',
    enContra: 'Quienes se oponen creen que rompería la igualdad entre trabajadores y complicaría la vida a las empresas que operan en varias comunidades.',
    posturas: {
      erc: P(2, 20, 'Que Cataluña tenga un salario mínimo propio.'),
      junts: P(2, 70, 'Un salario mínimo catalán propio.'),
      bildu: P(2, 6, 'Que cada comunidad pueda fijar su propio salario mínimo por encima del estatal.'),
      pnv: P(2, 9, 'Que Euskadi pueda fijar un salario mínimo propio, siempre por encima del estatal.'),
    },
  },
  // Impuestos
  {
    id: 'grandes-fortunas',
    temaId: 'impuestos',
    corta: true,
    texto: 'Quien tiene un gran patrimonio debería pagar cada año un impuesto por lo que tiene, además de por lo que gana.',
    aFavor: 'Pagarían más quienes más tienen y se recaudaría más.',
    enContra: 'Algunos patrimonios podrían irse a otros países, y se paga por bienes que quizá no dan dinero.',
    posturas: {
      psoe: P(2, 47, 'Un impuesto complementario a los grandes patrimonios.'),
      pp: P(-1, 61, 'Eliminar los impuestos que frenan la inversión.'),
      'frente-amplio': P(2, 45, 'Que los patrimonios de más de un millón paguen al menos un 2 %.'),
      podemos: P(2, 17, 'Un impuesto estatal permanente a las grandes fortunas.'),
      salf: P(-2, 13, 'Suprimir los impuestos de patrimonio y de grandes fortunas.'),
      bildu: P(2, 14, 'Aumentar el impuesto a la banca y las grandes fortunas.'),
      compromis: P(2, 17, 'Mantener y ampliar el impuesto a las grandes fortunas.'),
      adelante: P(2, 10, 'Impuesto a las grandes fortunas y a los grandes propietarios de tierras.'),
      upc: P(2, 12, 'Un impuesto permanente a las grandes fortunas.'),
      upn: P(-1, 61, 'Eliminar los impuestos que frenan la inversión.'),
    },
  },
  {
    id: 'bajar-irpf',
    temaId: 'impuestos',
    corta: true,
    texto: 'Habría que bajar el IRPF a la mayoría de los contribuyentes.',
    aFavor: 'Más dinero en el bolsillo cada mes. Algunos programas proponen ajustarlo a la inflación, para no pagar más por subidas de sueldo que solo compensan los precios.',
    enContra: 'Habría menos dinero para sanidad, educación o pensiones, salvo que se recorte otro gasto o suba la deuda.',
    posturas: {
      pp: P(2, 60, 'Bajar el IRPF a las rentas medias y bajas y deflactar la tarifa.'),
      vox: P(2, 9, 'Simplificar y bajar el IRPF, con un tipo menor según el número de hijos.'),
      'frente-amplio': P(-1, 46, 'Subir el tipo máximo al 52 % para rentas de más de 300.000 euros.'),
      salf: P(2, 12, 'Nadie pagaría IRPF por los primeros 35.000 euros.'),
      junts: P(1, 67, 'Bajar la carga fiscal a la clase media y trabajadora.'),
      compromis: P(1, 17, 'Deflactar el IRPF para las rentas de menos de 30.000 €.'),
      upc: P(1, 12, 'Deflactar el IRPF hasta rentas de 65.000 euros.'),
      upn: P(2, 60, 'Bajar el IRPF a las rentas medias y bajas y deflactar la tarifa.'),
    },
  },
  {
    id: 'banca-energeticas',
    temaId: 'impuestos',
    corta: true,
    texto: 'Los bancos y las eléctricas deberían seguir pagando un impuesto extra mientras tengan beneficios excepcionales.',
    aFavor: 'Parte de los beneficios extraordinarios vuelve a la sociedad.',
    enContra: 'Bancos y eléctricas podrían trasladar el coste a sus clientes.',
    posturas: {
      'frente-amplio': P(2, 44, 'Mantener de forma permanente el gravamen a la banca.'),
      podemos: P(2, 17, 'Hacer permanentes los impuestos a la banca y a las eléctricas.'),
      erc: P(2, 22, 'Recuperar el de las energéticas y hacer permanente el de la banca.'),
      bildu: P(2, 14, 'Impuesto permanente a las energéticas y más carga a la banca.'),
      adelante: P(2, 10, 'Impuestos permanentes a los beneficios extraordinarios de la banca y las eléctricas.'),
      upc: P(2, 12, 'Mantener el impuesto a la banca y recuperar el de las energéticas.'),
    },
  },
  {
    id: 'impuesto-empresas',
    temaId: 'impuestos',
    texto: 'Habría que bajar el impuesto de sociedades, el que pagan las empresas por sus beneficios.',
    aFavor: 'Quienes lo defienden creen que traería más inversión y empleo.',
    enContra: 'El Estado ingresaría menos. Otros programas proponen lo contrario: un tipo mínimo para las grandes empresas.',
    posturas: {
      psoe: P(-1, 48, 'Más impuestos a las cotizadas con grandes diferencias salariales.'),
      pp: P(1, 61, 'Libertad de amortización: descontar el mismo año lo que se invierta.'),
      vox: P(2, 9, 'Bajar el impuesto de sociedades.'),
      'frente-amplio': P(-2, 44, 'Un tipo mínimo real del 20 % en sociedades.'),
      podemos: P(-1, 21, 'Que las grandes empresas paguen más en sociedades.'),
      salf: P(2, 13, 'Bajar sociedades al 20 %, al 15 % si se reinvierte y al 10 % para empresas nuevas.'),
      erc: P(-1, 27, 'Más progresividad en el impuesto de sociedades.'),
      junts: P(1, 69, 'Acelerar la rebaja del impuesto de sociedades para pymes.'),
      bng: P(-1, 44, 'Un impuesto de sociedades progresivo según el tamaño de la empresa.'),
      upn: P(1, 61, 'Libertad de amortización: descontar el mismo año lo que se invierta.'),
    },
  },
  // Pensiones
  {
    id: 'pensiones-ipc',
    temaId: 'pensiones',
    corta: true,
    texto: 'La subida de las pensiones con el IPC debería estar blindada en la Constitución, para que todos los Gobiernos tengan que aplicarla.',
    aFavor: 'Las pensiones mantendrían su poder de compra pase lo que pase.',
    enContra: 'En una crisis, el Estado tendría menos margen para ajustar el gasto.',
    posturas: {
      psoe: P(2, 89, 'Blindar en la Constitución la subida de las pensiones con el IPC.'),
      pp: P(1, 42, 'Subir las pensiones cada año con el IPC, dentro del Pacto de Toledo.'),
      'frente-amplio': P(2, 7, 'Revalorizar las pensiones por mandato constitucional.'),
      salf: P(2, 20, 'Blindar en la Constitución la subida de las pensiones con el IPC.'),
      erc: P(2, 26, 'Blindar la revalorización de las pensiones.'),
      junts: P(1, 56, 'Revisar cada año las pensiones con el IPC catalán.'),
      bildu: P(1, 7, 'Blindar la revalorización anual con el IPC.'),
      pnv: P(1, 31, 'Revalorizar cada año las pensiones con el IPC.'),
      bng: P(1, 18, 'Revalorizar las pensiones según el IPC real.'),
      compromis: P(1, 8, 'Mantener el poder adquisitivo de las pensiones.'),
      adelante: P(2, 13, 'Blindar en la Constitución las pensiones públicas, revalorizadas con el IPC real.'),
      upc: P(2, 6, 'Actualizar las pensiones con el IPC por ley y blindarlo en la Constitución.'),
      upn: P(1, 42, 'Subir las pensiones cada año con el IPC, dentro del Pacto de Toledo.'),
    },
  },
  {
    id: 'jubilacion-40',
    temaId: 'pensiones',
    texto: 'Con 40 años cotizados, uno debería poder jubilarse sin penalización, a cualquier edad.',
    aFavor: 'Quien empezó a trabajar muy joven no tendría que esperar a la edad ordinaria.',
    enContra: 'Costaría más al sistema de pensiones, justo cuando se jubila la generación más numerosa.',
    posturas: {
      psoe: P(1, 40, 'Menos penalización en las jubilaciones anticipadas que no se eligen.'),
      podemos: P(2, 41, 'Quitar las penalizaciones por jubilación anticipada con 40 años cotizados.'),
      salf: P(2, 20, 'Con 40 años cotizados, jubilarse cuando se quiera sin penalización.'),
      junts: P(2, 70, 'Eliminar las penalizaciones por jubilación anticipada con 40 o más años cotizados.'),
      bildu: P(2, 8, 'Jubilarse sin penalización con al menos 40 años cotizados.'),
      pnv: P(2, 31, 'Quitar las penalizaciones con más de 40 años cotizados.'),
      compromis: P(2, 8, 'Sin penalización por jubilación anticipada tras 40 años trabajados.'),
      adelante: P(2, 13, 'Jubilación completa con 40 años cotizados.'),
    },
  },
  {
    id: 'cuenta-individual',
    temaId: 'pensiones',
    corta: true,
    texto: 'Parte de lo que se cotiza debería ir a una cuenta de ahorro a tu nombre, que puedas heredar, además de a la pensión pública.',
    aFavor: 'Cada persona tendría un ahorro propio que no depende de cómo vaya la Seguridad Social.',
    enContra: 'Entraría menos dinero para pagar las pensiones actuales y esa parte dependería de cómo vayan los mercados.',
    posturas: {
      salf: P(2, 20, 'Que los menores de 45 años destinen el 2 % del salario a una cuenta individual heredable.'),
      bildu: P(-2, 7, 'Rechazar cualquier intento de privatizar las pensiones.'),
      pnv: P(1, 31, 'Extender los planes de pensiones complementarios.'),
      compromis: P(-1, 9, 'Quitar las ventajas fiscales de los planes de pensiones privados.'),
      adelante: P(-2, 13, 'Un sistema de pensiones 100 % público.'),
    },
  },
  {
    id: 'pension-minima-smi',
    temaId: 'pensiones',
    texto: 'La pensión mínima debería ser igual al salario mínimo.',
    aFavor: 'Ningún pensionista viviría con menos que un sueldo mínimo.',
    enContra: 'Costaría miles de millones al año y quienes se oponen creen que reduciría la diferencia entre haber cotizado mucho o poco.',
    posturas: {
      psoe: P(1, 39, 'Seguir acercando las pensiones mínimas a los ingresos del conjunto de la sociedad.'),
      'frente-amplio': P(1, 24, 'Subir las mínimas y no contributivas hasta el umbral de la pobreza.'),
      podemos: P(2, 44, 'Igualar la pensión mínima contributiva al salario mínimo.'),
      bildu: P(2, 8, 'Pensiones mínimas de al menos 1.220 €, ligadas al salario mínimo.'),
      pnv: P(1, 31, 'Mejorar poco a poco las pensiones mínimas.'),
      bng: P(2, 18, 'Pensión mínima igual al salario mínimo.'),
      adelante: P(2, 13, 'Pensiones mínimas y no contributivas iguales al salario mínimo neto.'),
      upc: P(1, 6, 'Subir las pensiones mínimas hacia los objetivos de la Carta Social Europea.'),
    },
  },
  // Sanidad
  {
    id: 'sanidad-privada',
    temaId: 'sanidad',
    corta: true,
    texto: 'Para bajar las listas de espera, la sanidad pública debería mandar más pacientes a clínicas privadas, pagadas con dinero público.',
    aFavor: 'Las listas de espera bajarían antes.',
    enContra: 'Parte del dinero de la sanidad pública acabaría en empresas privadas.',
    posturas: {
      psoe: P(-2, 49, 'Limitar la privatización: gestión directa como forma preferente.'),
      vox: P(1, 37, 'Colaboración público-privada cuando ayude a reducir las listas de espera.'),
      'frente-amplio': P(-2, 26, 'Gestión directa y revertir servicios privatizados.'),
      podemos: P(-2, 88, 'Acabar con la privatización y recuperar lo privatizado.'),
      salf: P(2, 22, 'Si se superan 60 días, operarse donde se elija, también en la privada, pagado por la pública.'),
      junts: P(1, 51, 'Defender el modelo catalán de colaboración con proveedores no públicos.'),
      bildu: P(-2, 11, 'Derogar la Ley 15/1997, que permite la gestión privada de la sanidad.'),
      bng: P(-2, 18, 'Limitar las privatizaciones y recuperar lo privatizado.'),
      compromis: P(-2, 9, 'Blindar la gestión pública derogando la Ley 15/1997.'),
      adelante: P(-2, 14, 'Sanidad 100 % pública, sin conciertos ni externalizaciones.'),
      upc: P(-2, 6, 'Derogar la Ley 15/1997 para evitar la privatización.'),
    },
  },
  {
    id: 'espera-maxima',
    temaId: 'sanidad',
    texto: 'Debería haber por ley un tiempo máximo de espera para operarse o ver al especialista en toda España.',
    aFavor: 'Todo el mundo tendría el mismo plazo garantizado, viva donde viva.',
    enContra: 'La sanidad la gestionan las comunidades, que perderían margen para organizarse.',
    posturas: {
      'frente-amplio': P(1, 29, 'Aprobar la norma de listas de espera con tiempos y registros.'),
      salf: P(2, 22, 'Un máximo de 60 días para operarse y 30 para el especialista.'),
      compromis: P(2, 9, 'Listas de espera máximas fijadas por ley.'),
      adelante: P(1, 16, 'Cita en atención primaria en 48 horas y en salud mental en 15 días.'),
    },
  },
  {
    id: 'dentista',
    temaId: 'sanidad',
    corta: true,
    texto: 'La sanidad pública debería cubrir el dentista.',
    aFavor: 'Ir al dentista dejaría de depender del bolsillo de cada uno.',
    enContra: 'Costaría mucho dinero, que habría que sacar de otras partidas o de más impuestos.',
    posturas: {
      psoe: P(2, 49, 'Plan Sonríe: tratamientos dentales básicos para toda la población.'),
      'frente-amplio': P(2, 27, 'Ampliar la cobertura dental en la sanidad pública.'),
      erc: P(2, 42, 'Atención dental completa en la sanidad pública.'),
      bildu: P(2, 10, 'Incluir la salud bucodental en la cartera común.'),
      upc: P(2, 6, 'Que la sanidad pública cubra el dentista.'),
    },
  },
  {
    id: 'sanidad-irregulares',
    temaId: 'sanidad',
    texto: 'La sanidad pública debería atender a los inmigrantes en situación irregular en todos los servicios, igual que a los demás.',
    aFavor: 'Las enfermedades se tratan antes, se protege la salud de todos y se evitan urgencias más caras.',
    enContra: 'Supone más gasto sanitario. Quienes se oponen prefieren limitar la atención a urgencias y enfermedades contagiosas.',
    posturas: {
      vox: P(-2, 19, 'Excluirlos de la sanidad pública salvo urgencia grave.'),
      'frente-amplio': P(2, 26, 'Sanidad universal sea cual sea la situación administrativa.'),
      podemos: P(2, 68, 'Sanidad universal, también para quien no tenga papeles.'),
      salf: P(-2, 23, 'Tarjeta sanitaria solo para españoles y residentes legales; urgencias para todos.'),
      bildu: P(2, 20, 'Acceso a la sanidad sea cual sea la situación administrativa.'),
      bng: P(1, 23, 'Acceso a la sanidad para las personas migrantes.'),
      compromis: P(2, 9, 'Sanidad universal sin discriminación por situación administrativa.'),
    },
  },
  // Educación
  {
    id: 'cheque-escolar',
    temaId: 'educacion',
    corta: true,
    texto: 'El Estado debería dar a cada familia un cheque para pagar el colegio que elija, sea público, concertado o privado.',
    aFavor: 'Las familias podrían elegir colegio con más libertad, también las que hoy no pueden pagar uno concertado o privado.',
    enContra: 'Parte del dinero de la escuela pública iría a colegios privados, y quienes se oponen temen que aumente la separación de alumnos por nivel económico entre colegios.',
    posturas: {
      pp: P(1, 67, 'Elegir colegio en todo el municipio y mantener los conciertos donde haya demanda.'),
      vox: P(1, 41, 'Libre elección de centro sin que lo impida la situación económica.'),
      'frente-amplio': P(-2, 31, 'Hacia una red única pública, sin cuotas en la concertada.'),
      podemos: P(-2, 79, 'Desprivatizar la educación.'),
      salf: P(2, 34, 'Cheque escolar del mismo importe para pública, concertada y privada.'),
      compromis: P(-1, 10, 'Que la concertada sea solo subsidiaria de la pública.'),
      adelante: P(-1, 17, 'Todo el dinero público para la escuela pública.'),
      upn: P(1, 67, 'Elegir colegio en todo el municipio y mantener los conciertos donde haya demanda.'),
    },
  },
  {
    id: 'solo-publica',
    temaId: 'educacion',
    texto: 'El dinero público para educación debería ir solo a la escuela pública, no a la concertada.',
    aFavor: 'La escuela pública tendría más recursos, menos alumnos por clase y más profesorado.',
    enContra: 'Muchas familias perderían la plaza que eligieron o tendrían que pagarla, y la pública tendría que absorber a ese alumnado.',
    posturas: {
      pp: P(-2, 67, 'Mantener los conciertos educativos donde haya demanda.'),
      vox: P(-1, 41, 'Libre elección de centro en todas las etapas.'),
      'frente-amplio': P(2, 31, 'Avanzar hacia una red pública única.'),
      podemos: P(2, 79, 'Desprivatizar la educación y apostar por la gestión pública.'),
      salf: P(-2, 34, 'Cheque escolar válido en pública, concertada y privada.'),
      junts: P(-2, 54, 'Actualizar los módulos de la concertada a los costes reales.'),
      compromis: P(1, 10, 'Que la concertada sea de verdad subsidiaria de la pública.'),
      adelante: P(2, 17, 'Todo el dinero público para la escuela pública.'),
      upn: P(-2, 67, 'Mantener los conciertos educativos donde haya demanda.'),
    },
  },
  {
    id: 'castellano',
    temaId: 'educacion',
    corta: true,
    texto: 'Las familias deberían poder elegir que sus hijos estudien en castellano en cualquier comunidad.',
    aFavor: 'Las familias castellanohablantes, o que se mudan, podrían elegir la lengua de la escuela.',
    enContra: 'Quienes se oponen creen que separaría a los alumnos por lengua y debilitaría el catalán, el euskera o el gallego.',
    posturas: {
      pp: P(2, 39, 'Garantizar la enseñanza en castellano en todas las etapas y en toda España.'),
      vox: P(2, 41, 'Garantía de estudiar en español en todo el territorio.'),
      salf: P(2, 33, 'Derecho a estudiar en castellano en toda España, con inspección que sancione.'),
      erc: P(-2, 10, 'Defender la escuela en catalán y la inmersión lingüística.'),
      junts: P(-2, 53, 'Defender la inmersión, con el catalán como lengua vehicular.'),
      bildu: P(-1, 11, 'Un sistema educativo propio y euskaldun.'),
      upn: P(2, 39, 'Garantizar la enseñanza en castellano en todas las etapas y en toda España.'),
    },
  },
  {
    id: 'universidades-privadas',
    temaId: 'educacion',
    texto: 'Debería limitarse la creación de nuevas universidades privadas.',
    aFavor: 'Se protegería la calidad de los títulos y el dinero se centraría en la universidad pública.',
    enContra: 'Habría menos plazas y opciones para estudiar, y quienes se oponen creen que la competencia mejora la oferta.',
    posturas: {
      podemos: P(2, 86, 'Una moratoria indefinida a nuevas universidades privadas.'),
      erc: P(2, 46, 'Endurecer los requisitos para crear universidades privadas.'),
      bng: P(1, 35, 'Evitar la privatización del sistema universitario gallego.'),
      compromis: P(2, 17, 'Limitar la proliferación de universidades privadas.'),
      adelante: P(2, 19, 'Ninguna universidad privada más.'),
      upc: P(2, 5, 'Controlar la calidad y la proliferación de universidades privadas.'),
    },
  },
  // Inmigración
  {
    id: 'regularizacion',
    temaId: 'inmigracion',
    corta: true,
    texto: 'Quien lleva años viviendo en España sin papeles debería tener una vía para regularizar su situación.',
    aFavor: 'Esas personas pagarían impuestos y tendrían derechos laborales.',
    enContra: 'Quienes se oponen creen que podría atraer más llegadas irregulares.',
    posturas: {
      pp: P(-2, 22, 'Prohibir las regularizaciones masivas; el arraigo será excepcional.'),
      vox: P(-2, 15, 'Prohibir las regularizaciones masivas y suprimir el arraigo.'),
      'frente-amplio': P(2, 126, 'Procedimientos estables de regularización.'),
      podemos: P(2, 67, 'Un procedimiento permanente de regularización.'),
      salf: P(-2, 17, 'Derogar la regularización de 2026 y prohibir las regularizaciones masivas.'),
      junts: P(-1, 48, 'En contra de las regularizaciones masivas por decreto.'),
      bildu: P(2, 20, 'Una regularización efectiva, accesible y estable.'),
      pnv: P(1, 25, 'Avanzar en las regularizaciones que prevé la ley.'),
      bng: P(2, 22, 'Promover la regularización administrativa.'),
      compromis: P(2, 56, 'Vías de regularización claras para quienes viven aquí.'),
      adelante: P(2, 28, 'Una regularización extraordinaria.'),
      upn: P(-2, 22, 'Prohibir las regularizaciones masivas; el arraigo será excepcional.'),
    },
  },
  {
    id: 'expulsiones',
    temaId: 'inmigracion',
    corta: true,
    texto: 'Las órdenes de expulsión deberían cumplirse en días, no en meses o años.',
    aFavor: 'La ley se cumpliría y entrar de forma irregular dejaría de compensar.',
    enContra: 'Quienes se oponen creen que con tanta prisa no se revisaría bien cada caso, como el asilo o los menores.',
    posturas: {
      pp: P(2, 21, 'Identificar en siete días a quien entre de forma irregular y tramitar sin demora el asilo o la devolución.'),
      vox: P(2, 15, 'Repatriar a quien esté en situación irregular.'),
      'frente-amplio': P(-1, 127, 'Cerrar los CIE.'),
      podemos: P(-1, 65, 'Cerrar los CIE.'),
      salf: P(2, 17, 'Expulsión en 48 horas y todas las órdenes ejecutadas en 90 días.'),
      junts: P(1, 49, 'Que las órdenes de retorno se cumplan, sin expedientes eternos.'),
      bildu: P(-1, 20, 'Rechazar las devoluciones sumarias y los CIE.'),
      compromis: P(-1, 56, 'Eliminar los CIE.'),
      adelante: P(-1, 28, 'Cerrar los CIE.'),
      upn: P(2, 21, 'Identificar en siete días a quien entre de forma irregular y tramitar sin demora el asilo o la devolución.'),
    },
  },
  {
    id: 'ayudas-residencia',
    temaId: 'inmigracion',
    texto: 'Las ayudas sociales deberían ser solo para quienes residen legalmente en España.',
    aFavor: 'Las ayudas se concentran en quienes residen legalmente.',
    enContra: 'Personas sin papeles, también niños, podrían quedar sin ayuda básica.',
    posturas: {
      pp: P(1, 40, 'Prioridad en las ayudas para quien tenga un arraigo real con España.'),
      vox: P(2, 19, 'Suprimir toda ayuda social a los inmigrantes en situación irregular.'),
      'frente-amplio': P(-1, 26, 'Derechos sociales sea cual sea la situación administrativa.'),
      podemos: P(-2, 68, 'Servicios sociales universales, también para quien no tenga papeles.'),
      salf: P(2, 19, 'Ninguna ayuda no contributiva sin cinco años de residencia legal y cotización.'),
      bildu: P(-2, 20, 'Protección social sea cual sea la situación administrativa.'),
      upn: P(1, 40, 'Prioridad en las ayudas para quien tenga un arraigo real con España.'),
    },
  },
  {
    id: 'inmigracion-ccaa',
    temaId: 'inmigracion',
    texto: 'Las comunidades autónomas deberían poder gestionar la inmigración: permisos, controles y expulsiones.',
    aFavor: 'Se gestionaría según las necesidades de cada territorio y con más cercanía.',
    enContra: 'Habría reglas distintas en cada comunidad para una frontera que es común a toda España y a la UE.',
    posturas: {
      erc: P(2, 14, 'Transferir a la Generalitat todas las competencias de migración y asilo.'),
      junts: P(2, 48, 'Delegar a la Generalitat permisos, expulsiones y CIE.'),
      bildu: P(2, 20, 'Traspasar las competencias de migración.'),
      pnv: P(1, 25, 'Que Euskadi gestione más los permisos de residencia y trabajo.'),
      cc: P(1, 19, 'Que Canarias tenga voz en las decisiones migratorias.'),
    },
  },
  // Medio ambiente
  {
    id: 'nucleares',
    temaId: 'medioambiente',
    corta: true,
    texto: 'Habría que alargar la vida de las centrales nucleares en lugar de cerrarlas en los próximos años.',
    aFavor: 'Electricidad sin emisiones de CO₂ y estable mientras crecen las renovables.',
    enContra: 'Genera residuos que duran miles de años y alargarlas obliga a invertir más en ellas.',
    posturas: {
      psoe: P(-2, 66, 'Mantener el calendario de cierre hasta 2035.'),
      pp: P(2, 71, 'Eliminar el calendario de cierre y extender su vida útil con el visto bueno del CSN.'),
      vox: P(2, 12, 'Derogar el calendario de cierre de las centrales nucleares.'),
      'frente-amplio': P(-2, 64, 'Cumplir el calendario de cierre (Almaraz, 2027-2028).'),
      podemos: P(-2, 103, 'Cumplir el calendario de cierre nuclear.'),
      bildu: P(-2, 15, 'Mantener el calendario de cierre nuclear.'),
      upn: P(2, 71, 'Eliminar el calendario de cierre y extender su vida útil con el visto bueno del CSN.'),
    },
  },
  {
    id: 'clima',
    temaId: 'medioambiente',
    corta: true,
    texto: 'España debería ir más rápido en la lucha contra el cambio climático.',
    aFavor: 'Menos emisiones y menos daños por calor, sequías o incendios. Algunos programas añaden ayudas para que los hogares vulnerables no paguen más.',
    enContra: 'Algunos productos, la energía o el transporte podrían ser más caros a corto plazo.',
    posturas: {
      psoe: P(2, 73, 'Defender el Pacto Verde Europeo sin rebajar la ambición climática.'),
      pp: P(-1, 72, 'Revisar el ritmo de descarbonización de cada sector.'),
      vox: P(-2, 11, 'Revertir el Pacto Verde Europeo y la Agenda 2030.'),
      'frente-amplio': P(2, 60, 'Reducir las emisiones un 85 % en 2040.'),
      podemos: P(2, 98, 'Un sistema eléctrico 100 % renovable, sin combustibles fósiles.'),
      salf: P(-1, 35, 'Vetar el Pacto Verde Europeo.'),
      erc: P(1, 32, 'Alinear la planificación climática con la ciencia.'),
      junts: P(1, 81, 'Neutralidad climática antes de 2050.'),
      bildu: P(2, 15, 'Adelantar la descarbonización al menos a 2045.'),
      compromis: P(2, 25, 'Un filtro climático vinculante contra los proyectos que suban las emisiones.'),
      adelante: P(2, 22, 'Una ley de emergencia climática con objetivos anuales verificables.'),
      existe: P(1, 4, 'Cumplir los objetivos de 2030 y la neutralidad en 2050.'),
      upn: P(-1, 72, 'Revisar el ritmo de descarbonización de cada sector.'),
    },
  },
  {
    id: 'macroparques',
    temaId: 'medioambiente',
    texto: 'Los grandes parques solares y eólicos deberían frenarse hasta ordenar dónde se instalan.',
    aFavor: 'Se protegerían el campo, el paisaje y los pueblos donde se concentran.',
    enContra: 'Se retrasaría la energía limpia y barata, y quienes se oponen creen que alejaría los objetivos climáticos.',
    posturas: {
      psoe: P(-1, 65, 'Que las renovables generen el 81 % de la electricidad en 2030.'),
      vox: P(2, 34, 'Impedir las grandes plantas solares y eólicas sin control en tierras agrícolas.'),
      junts: P(-1, 77, 'Abrir los nudos de la red a nuevos proyectos renovables.'),
      bildu: P(-1, 15, 'Un despliegue renovable rápido y a gran escala.'),
      bng: P(1, 54, 'Declarar el litoral gallego no apto para parques eólicos marinos.'),
      adelante: P(1, 22, 'Renovables pequeñas y repartidas en lugar de macroplantas.'),
      existe: P(2, 3, 'Moratoria a los grandes parques renovables y a las líneas de muy alta tensión.'),
    },
  },
  {
    id: 'toros',
    temaId: 'medioambiente',
    texto: 'Las corridas de toros deberían poder recibir dinero público, como otras actividades culturales.',
    aFavor: 'Se apoya una tradición y la economía de muchos pueblos.',
    enContra: 'Mucha gente considera que causan sufrimiento al animal.',
    posturas: {
      pp: P(1, 48, 'Restituir el Premio Nacional de Tauromaquia y promoverla como patrimonio cultural.'),
      vox: P(1, 43, 'Defender y promocionar la tauromaquia.'),
      'frente-amplio': P(-2, 76, 'Acabar con la financiación pública de la tauromaquia.'),
      podemos: P(-2, 124, 'Acabar con la tauromaquia.'),
      junts: P(-1, 41, 'Critica que la tauromaquia siga declarada patrimonio cultural.'),
      adelante: P(-2, 120, 'Transición hasta abolir la tauromaquia.'),
      upn: P(1, 48, 'Restituir el Premio Nacional de Tauromaquia y promoverla como patrimonio cultural.'),
    },
  },
  // Juventud
  {
    id: 'voto-16',
    temaId: 'juventud',
    corta: true,
    texto: 'Los jóvenes de 16 y 17 años deberían poder votar en las elecciones generales.',
    aFavor: 'Los jóvenes tendrían voz en las decisiones que les afectan.',
    enContra: 'Hay quien cree que a esa edad todavía no se tiene suficiente madurez para votar.',
    posturas: {
      psoe: P(2, 90, 'Rebajar la edad de voto a los 16 años.'),
      'frente-amplio': P(2, 42, 'Derecho a votar desde los 16 años.'),
      podemos: P(2, 129, 'Derecho a votar a partir de los 16 años.'),
      erc: P(2, 17, 'Promover el voto a partir de los 16 años.'),
      junts: P(2, 59, 'Reconocer el voto a los 16 años.'),
      compromis: P(2, 35, 'Ampliar el derecho a voto a los 16 años.'),
      adelante: P(2, 92, 'Votar desde los 16 años.'),
      upc: P(2, 8, 'Voto a los 16 años.'),
    },
  },
  {
    id: 'irpf-jovenes',
    temaId: 'juventud',
    corta: true,
    texto: 'Los menores de 35 años no deberían pagar IRPF, o pagar mucho menos, en sus primeros años de trabajo.',
    aFavor: 'Los jóvenes tendrían más dinero para emanciparse y menos motivos para irse fuera.',
    enContra: 'Costaría ingresos al Estado y quienes se oponen creen que es injusto cobrar distinto por el mismo sueldo según la edad.',
    posturas: {
      pp: P(2, 60, 'Jóvenes de 18 a 35 sin IRPF el primer año y con rebajas los tres siguientes.'),
      salf: P(1, 12, 'Nadie pagaría IRPF por los primeros 35.000 euros.'),
      junts: P(2, 61, 'Menores de 35 sin IRPF estatal el primer año y con rebajas hasta el décimo.'),
      upn: P(2, 60, 'Jóvenes de 18 a 35 sin IRPF el primer año y con rebajas los tres siguientes.'),
    },
  },
  {
    id: 'ayuda-alquiler-joven',
    temaId: 'juventud',
    texto: 'Los jóvenes deberían recibir cada mes una ayuda pública para pagar el alquiler.',
    aFavor: 'Los jóvenes podrían independizarse antes.',
    enContra: 'Si no hay más pisos, la ayuda puede acabar subiendo los alquileres.',
    posturas: {
      'frente-amplio': P(1, 22, 'Abrir el Ingreso Mínimo Vital a los jóvenes de 18 a 30 años sin estar emancipados.'),
      junts: P(2, 18, 'Convertir el Bono Joven en una renta de emancipación.'),
    },
  },
  {
    id: 'edad-redes',
    temaId: 'juventud',
    texto: 'Las redes sociales deberían comprobar de verdad la edad de quien se registra.',
    aFavor: 'Los menores estarían más protegidos en internet.',
    enContra: 'Habría que dar datos personales para usar las redes, con riesgos para la privacidad.',
    posturas: {
      psoe: P(2, 95, 'Verificación de edad pública y anónima; mínimo 16 años.'),
      pp: P(2, 58, 'Verificación de edad obligatoria y ninguna cuenta antes de los 14 años.'),
      vox: P(1, 52, 'Proteger a los menores en los entornos digitales.'),
      'frente-amplio': P(2, 41, 'Verificación de edad para menores de 16 años en redes.'),
      bildu: P(1, 21, 'Desactivar por defecto las recomendaciones algorítmicas a menores.'),
      upn: P(2, 58, 'Verificación de edad obligatoria y ninguna cuenta antes de los 14 años.'),
    },
  },
  // Igualdad
  {
    id: 'violencia-genero',
    temaId: 'igualdad',
    corta: true,
    texto: 'La violencia contra las mujeres necesita leyes propias, distintas de las de la violencia en la familia en general.',
    aFavor: 'Se atiende de forma específica la violencia que sufren las mujeres por serlo.',
    enContra: 'Hay quien prefiere una ley igual para cualquier violencia dentro de la familia.',
    posturas: {
      psoe: P(2, 82, 'Nueva estrategia contra las violencias machistas.'),
      pp: P(1, 19, 'Más medios para VioGen y las unidades especializadas.'),
      vox: P(-2, 30, 'Derogar las leyes de género.'),
      'frente-amplio': P(2, 38, 'Blindar la financiación del Pacto de Estado contra la Violencia de Género.'),
      podemos: P(1, 51, 'Un plan de choque contra las violencias digitales machistas.'),
      erc: P(2, 24, 'Ampliar la ley de violencia de género.'),
      junts: P(1, 33, 'Reforzar la prevención y la protección frente a la violencia machista.'),
      bildu: P(1, 19, 'Reconocer la violencia vicaria y revisar la protección a las víctimas.'),
      pnv: P(2, 26, 'Cumplir íntegramente el Pacto de Estado.'),
      bng: P(2, 24, 'Reformar la ley para cubrir todas las violencias.'),
      cc: P(2, 10, 'Financiar el Pacto de Estado en todas las islas.'),
      compromis: P(2, 47, 'Una respuesta penal efectiva ante la violencia machista.'),
      adelante: P(2, 27, 'Un Pacto de Estado contra la violencia machista con presupuesto.'),
      existe: P(2, 15, 'Cumplir y actualizar el Pacto de Estado contra la Violencia de Género.'),
      upc: P(2, 17, 'Más recursos contra la violencia machista.'),
      upn: P(1, 19, 'Más medios para VioGen y las unidades especializadas.'),
    },
  },
  {
    id: 'trans',
    temaId: 'igualdad',
    corta: true,
    texto: 'Las personas trans deberían poder cambiar su sexo en el registro con su sola declaración, como ocurre ahora.',
    aFavor: 'Se mantiene que las personas trans no necesiten informes médicos para el cambio.',
    enContra: 'Hay quien pide algún tipo de control, sobre todo en menores o en el deporte.',
    posturas: {
      psoe: P(1, 97, 'Que la ley LGTBI de 2023 sea el mínimo común en toda España.'),
      pp: P(-2, 44, 'Eliminar la libre autodeterminación registral del sexo.'),
      vox: P(-1, 43, 'Que el deporte femenino se rija por criterios biológicos.'),
      'frente-amplio': P(2, 123, 'Aplicar de forma efectiva la Ley Trans.'),
      podemos: P(1, 52, 'Nuevos derechos LGTBIQA+.'),
      erc: P(1, 23, 'Reconocer todas las identidades de género.'),
      junts: P(1, 36, 'Oponerse a recortar la ley trans y LGTBI.'),
      bildu: P(1, 19, 'No aceptar retrocesos en los derechos de las personas trans.'),
      pnv: P(1, 27, 'Desarrollar el cambio de documentación de la ley de 2023.'),
      bng: P(2, 29, 'Respetar la autodeterminación de género.'),
      upc: P(1, 18, 'Igualdad de derechos, con atención especial a las personas trans.'),
      upn: P(-2, 44, 'Eliminar la libre autodeterminación registral del sexo.'),
    },
  },
  {
    id: 'aborto-constitucion',
    temaId: 'igualdad',
    texto: 'El derecho al aborto debería estar en la Constitución.',
    aFavor: 'Ningún gobierno futuro podría restringirlo sin una reforma constitucional.',
    enContra: 'Quienes se oponen creen que es una cuestión moral que no debe blindarse, o que la ley actual ya es suficiente.',
    posturas: {
      psoe: P(2, 81, 'Blindar en la Constitución el derecho al aborto.'),
      vox: P(-2, 52, 'Defender la vida «desde su concepción».'),
      'frente-amplio': P(2, 28, 'Incluir el derecho al aborto en la Constitución.'),
      podemos: P(1, 51, 'Blindar el derecho al aborto.'),
      bildu: P(1, 19, 'Blindar el derecho al aborto.'),
      adelante: P(2, 27, 'El aborto en la sanidad pública y en la Constitución.'),
      upc: P(1, 18, 'Estudiar blindar el aborto en la Constitución, como Francia.'),
    },
  },
  // Modelo territorial
  {
    id: 'referendum',
    temaId: 'territorial',
    corta: true,
    texto: 'Convocar un referéndum de independencia sin autorización debería ser delito.',
    aFavor: 'Se protege la Constitución y la unidad del país.',
    enContra: 'Hay quien lo ve como castigar con la cárcel una votación.',
    posturas: {
      pp: P(2, 16, 'Recuperar el delito de convocatoria de referéndum ilegal.'),
      vox: P(1, 55, 'Recuperar el delito de sedición.'),
      erc: P(-2, 8, 'Negociar un referéndum de autodeterminación.'),
      junts: P(-2, 13, 'Garantizar el derecho de Cataluña a la autodeterminación.'),
      bildu: P(-2, 24, 'Reconocer el derecho a decidir del pueblo vasco.'),
      bng: P(-2, 89, 'Reconocer la autodeterminación de las naciones del Estado.'),
      upc: P(-2, 16, 'Defensa del derecho a decidir y de la autodeterminación.'),
      upn: P(2, 16, 'Recuperar el delito de convocatoria de referéndum ilegal.'),
    },
  },
  {
    id: 'una-nacion',
    temaId: 'territorial',
    corta: true,
    texto: 'España debería reconocerse como un Estado formado por varias naciones.',
    aFavor: 'Reconoce la identidad propia de territorios como Cataluña, Euskadi o Galicia.',
    enContra: 'Hay quien cree que debilita la unidad del país y la igualdad entre comunidades.',
    posturas: {
      vox: P(-2, 28, 'España es «una sola Nación».'),
      'frente-amplio': P(2, 140, 'Una república federal y plurinacional.'),
      podemos: P(2, 128, 'Un proceso constituyente hacia una república plurinacional.'),
      erc: P(1, 7, 'Defiende la autodeterminación de Cataluña.'),
      junts: P(2, 26, 'Cataluña es una nación con derecho a decidir su futuro.'),
      bildu: P(2, 23, 'Reconocer el carácter plurinacional del Estado.'),
      pnv: P(2, 39, 'Reconocimiento nacional de Euskadi.'),
      bng: P(2, 8, 'Defiende los derechos nacionales de Galicia.'),
      compromis: P(2, 52, 'Avanzar hacia un Estado plurinacional.'),
      adelante: P(1, 24, 'Andalucía como nacionalidad histórica.'),
      upc: P(1, 16, 'Defiende la identidad nacional canaria.'),
    },
  },
  {
    id: 'competencias',
    temaId: 'territorial',
    texto: 'La sanidad y la educación deberían volver a gestionarse desde el Estado en lugar de desde las comunidades.',
    aFavor: 'Los mismos servicios para todo el país y menos diferencias entre comunidades.',
    enContra: 'Las comunidades perderían autogobierno y las decisiones se tomarían lejos de cada territorio.',
    posturas: {
      psoe: P(-1, 91, 'Reforzar el Estado autonómico y el autogobierno.'),
      pp: P(-1, 16, 'Defender el Estado de las Autonomías, con estándares comunes.'),
      vox: P(1, 41, 'Currículo, evaluaciones e inspección comunes en toda España.'),
      'frente-amplio': P(-1, 140, 'Una república federal y plurinacional.'),
      erc: P(-2, 11, 'Competencias exclusivas en educación y currículos.'),
      junts: P(-2, 50, 'Defender las competencias de la Generalitat en sanidad y educación.'),
      bildu: P(-2, 24, 'Traspasar todas las competencias pendientes y otras nuevas.'),
      pnv: P(-2, 38, 'Rechazar cualquier recentralización.'),
      bng: P(-2, 85, 'Transferir a Galicia todas las competencias de enseñanza.'),
      cc: P(-1, 5, 'Oponerse a la recentralización.'),
      compromis: P(-2, 52, 'Traspasar más competencias a la Generalitat.'),
      upc: P(-1, 15, 'Desarrollar al máximo las competencias del Estatuto.'),
      upn: P(-1, 16, 'Defender el Estado de las Autonomías, con estándares comunes.'),
    },
  },
  {
    id: 'concierto-cataluna',
    temaId: 'territorial',
    texto: 'Cataluña debería tener un concierto económico propio, como el País Vasco y Navarra.',
    aFavor: 'Cataluña recaudaría y decidiría sobre sus impuestos, y aportaría al Estado una cuota pactada.',
    enContra: 'Quienes se oponen creen que habría menos dinero para repartir entre las comunidades con menos recursos.',
    posturas: {
      pp: P(-2, 41, 'Ninguna comunidad saldrá del régimen común ni habrá regímenes singulares.'),
      salf: P(-1, 14, 'Financiación con criterios iguales para todas las comunidades.'),
      erc: P(1, 14, 'Que la Agència Tributària de Catalunya recaude los impuestos estatales.'),
      junts: P(2, 68, 'Un concierto económico para Cataluña, fuera del régimen común.'),
      bng: P(1, 8, 'Un concierto económico también para Galicia.'),
      compromis: P(1, 50, 'Plantea un concierto económico para el País Valenciano.'),
      upn: P(-2, 41, 'Ninguna comunidad saldrá del régimen común ni habrá regímenes singulares.'),
    },
  },
  // Política exterior y defensa
  {
    id: 'defensa',
    temaId: 'exterior',
    corta: true,
    texto: 'España debería gastar bastante más en defensa.',
    aFavor: 'España estaría más preparada y cumpliría lo acordado con sus aliados.',
    enContra: 'Habría que recortar otros gastos, como servicios públicos o pensiones, o subir impuestos o deuda.',
    posturas: {
      psoe: P(-1, 105, 'Rechazó subir el gasto militar al 5 % del PIB.'),
      pp: P(1, 26, 'Una ley de financiación de la defensa y más efectivos en las Fuerzas Armadas.'),
      vox: P(2, 47, 'Aumentar la inversión en Defensa.'),
      'frente-amplio': P(-2, 130, 'Rechazar el 5 % y reducir el gasto militar.'),
      podemos: P(-2, 28, 'Revertir el rearme y rechazar el 5 % del PIB en defensa.'),
      salf: P(1, 38, 'Gastar el 2 % del PIB en defensa, con prioridad para la industria nacional.'),
      bildu: P(-2, 28, 'Rechazar el aumento del gasto en defensa que exige la OTAN.'),
      bng: P(-2, 89, 'Rechazar el aumento del gasto militar.'),
      compromis: P(-1, 55, 'Que el gasto militar no suba a costa de la inversión social.'),
      adelante: P(-2, 109, 'Reducción progresiva del gasto militar.'),
      upn: P(1, 26, 'Una ley de financiación de la defensa y más efectivos en las Fuerzas Armadas.'),
    },
  },
  {
    id: 'ucrania',
    temaId: 'exterior',
    corta: true,
    texto: 'España debería seguir enviando ayuda, también militar, a Ucrania frente a la invasión rusa.',
    aFavor: 'Se apoya a un país invadido y se frena a Rusia.',
    enContra: 'Algunos temen que alargue la guerra y cuesta dinero público.',
    posturas: {
      psoe: P(1, 105, 'Ha apoyado a Ucrania, también con ayuda militar.'),
      pp: P(2, 74, 'Mantener el apoyo político, económico, militar y humanitario a Ucrania.'),
      'frente-amplio': P(1, 133, 'Solidaridad con Ucrania, por la vía diplomática.'),
      erc: P(1, 16, 'Ayuda europea a Ucrania frente a la agresión rusa.'),
      junts: P(2, 26, 'Apoyo humanitario, financiero y militar a Ucrania.'),
      bildu: P(-1, 28, 'Rechazar el envío de armas a los conflictos.'),
      bng: P(-2, 89, 'Dejar de enviar armamento a Ucrania.'),
      upn: P(2, 74, 'Mantener el apoyo político, económico, militar y humanitario a Ucrania.'),
    },
  },
  {
    id: 'israel',
    temaId: 'exterior',
    texto: 'España debería romper relaciones con Israel y prohibir todo comercio de armas con ese país.',
    aFavor: 'Sería la presión más fuerte posible por lo que ocurre en Gaza.',
    enContra: 'España perdería capacidad de influir en la zona y quienes se oponen creen que debe mantenerse el diálogo con ambas partes.',
    posturas: {
      'frente-amplio': P(1, 131, 'Embargo automático de armas a los Estados cuyos dirigentes investigue la CPI.'),
      podemos: P(2, 34, 'Romper relaciones diplomáticas y comerciales con Israel y un embargo de armas efectivo.'),
      erc: P(2, 16, 'Embargo total de armas y suspender el acuerdo UE-Israel.'),
      junts: P(-2, 28, 'Defender el derecho de Israel a defenderse y rechazar los boicots indiscriminados.'),
      bildu: P(2, 29, 'Romper el «Tratado de Amistad» de la UE con Israel y un embargo total de armas.'),
      bng: P(1, 90, 'Condenar la ocupación israelí.'),
      adelante: P(2, 32, 'Romper relaciones con Israel y un embargo total de armas.'),
      upc: P(1, 19, 'Denunciar el genocidio en Palestina.'),
    },
  },
  {
    id: 'sahara',
    temaId: 'exterior',
    texto: 'España debería defender que el pueblo saharaui decida su futuro en un referéndum.',
    aFavor: 'Se defiende lo que dicen las resoluciones de la ONU.',
    enContra: 'Empeoraría la relación con Marruecos, clave en migración y comercio.',
    posturas: {
      pp: P(-1, 74, 'Apoyar a la ONU para una solución «mutuamente aceptable para las partes».'),
      'frente-amplio': P(2, 132, 'Referéndum de autodeterminación con opción de independencia.'),
      podemos: P(2, 36, 'Reconocer diplomáticamente a la República Árabe Saharaui Democrática.'),
      salf: P(1, 38, 'Volver a la posición de la ONU sobre el Sáhara.'),
      erc: P(1, 16, 'Revertir el giro sobre el Sáhara Occidental.'),
      bildu: P(2, 29, 'Recuperar el apoyo a la autodeterminación del pueblo saharaui.'),
      bng: P(2, 90, 'Un referéndum de autodeterminación en el Sáhara.'),
      compromis: P(2, 55, 'Un referéndum de autodeterminación en el Sáhara Occidental.'),
      adelante: P(2, 32, 'Autodeterminación del Sáhara Occidental.'),
      upc: P(2, 19, 'Apoyo a la autodeterminación del pueblo saharaui.'),
      upn: P(-1, 74, 'Apoyar a la ONU para una solución «mutuamente aceptable para las partes».'),
    },
  },
];

// Respuestas posibles. «Me da igual» no cuenta en el resultado.
export type Respuesta = 2 | -2 | null; // sí, no, me da igual
export type Respuestas = Record<string, Respuesta>;

export type Resultado = { partidoId: string; porcentaje: number; preguntas: number };

// Partidos que entran en el test: los mismos para todo el mundo, sin depender
// de la provincia. Los estatales con programa cargado y los autonómicos cuyo
// programa trata suficientes frases (aunque solo se presenten en su comunidad).
export function partidosDelTest(): string[] {
  const propios = PARTIDOS.filter(
    (p) => p.ambito === 'autonomico' && AFIRMACIONES.filter((a) => a.posturas[p.id]).length >= MIN_POSTURAS,
  ).map((p) => p.id);
  return [...PARTIDOS_TEST, ...propios];
}

// Coincidencia en cada frase: 1 si tu respuesta coincide con la postura del
// programa, 0 si es la contraria (escala de -2 a 2). Las frases de tus temas
// importantes cuentan el doble. Solo cuentan las frases que has respondido y
// sobre las que el programa se pronuncia.
export function calcular(respuestas: Respuestas, temasImportantes: string[] = [], partidos: string[] = PARTIDOS_TEST): Resultado[] {
  return partidos.map((id) => {
    let suma = 0;
    let pesos = 0;
    let n = 0;
    for (const a of AFIRMACIONES) {
      const r = respuestas[a.id];
      const p = a.posturas[id];
      if (r == null || !p) continue;
      const peso = temasImportantes.includes(a.temaId) ? 2 : 1;
      suma += peso * (1 - Math.abs(r - p.valor) / 4);
      pesos += peso;
      n++;
    }
    return { partidoId: id, porcentaje: pesos ? Math.round((suma / pesos) * 100) : 0, preguntas: n };
  }).sort((a, b) => b.porcentaje - a.porcentaje || b.preguntas - a.preguntas);
}

// Orden aleatorio, distinto cada vez que se empieza el test.
export function barajar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a.at(j)!, a.at(i)!];
  }
  return a;
}

// Orden del test: aleatorio, pero sin dos frases seguidas del mismo tema y
// empezando por un tema de economía (vivienda, empleo, impuestos o pensiones).
// En cada paso se elige entre los temas a los que les quedan más frases, para
// que no se acumulen frases de un mismo tema al final.
const ECONOMIA = ['vivienda', 'empleo', 'impuestos', 'pensiones'];
export function mezclarPorTemas(lista: Afirmacion[]): Afirmacion[] {
  const grupos = new Map<string, Afirmacion[]>();
  for (const a of barajar(lista)) grupos.set(a.temaId, [...(grupos.get(a.temaId) ?? []), a]);
  const res: Afirmacion[] = [];
  let anterior: string | null = null;
  while (res.length < lista.length) {
    const quedan = [...grupos.entries()].filter(([, v]) => v.length > 0);
    let candidatos = quedan.filter(([t]) => t !== anterior);
    if (res.length === 0) {
      const eco = candidatos.filter(([t]) => ECONOMIA.includes(t));
      if (eco.length) candidatos = eco;
    }
    if (candidatos.length === 0) candidatos = quedan;
    const max = Math.max(...candidatos.map(([, v]) => v.length));
    const mejores = candidatos.filter(([, v]) => v.length === max);
    const [tema, frases] = mejores[Math.floor(Math.random() * mejores.length)];
    res.push(frases.shift()!);
    anterior = tema;
  }
  return res;
}
