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
// Cuando salgan los programas de 2026, hay que revisar todas las posturas.
// PSOE, PP, Vox, Frente Amplio, ERC, Junts, EH Bildu, PNV, BNG y CC: revisadas con su programa de 2026 (las páginas son de ese PDF).

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

export const PARTIDOS_TEST = ['psoe', 'pp', 'vox', 'frente-amplio'];

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
      junts: P(-2, 60, 'Derogar la contención de precios y las zonas tensionadas de la Ley de Vivienda.'),
      bng: P(2, 12, 'Topar por ley el precio del alquiler.'),
      psoe: P(2, 30, 'Congelar las rentas que superen los índices de referencia en zonas tensionadas.'),
      pp: P(-2, 53, 'Derogar la Ley de Vivienda y eliminar las zonas tensionadas y el índice de precios.'),
      vox: P(-1, 23, 'Derogar la Ley de Vivienda.'),
      'frente-amplio': P(2, 13, 'Limitar el alquiler para que no supere el 25 % de la renta del barrio.'),
      bildu: P(2, 5, 'Subida anual máxima del 2 % en los alquileres y apoyo a las zonas tensionadas.'),
    },
  },
  {
    id: 'suelo-impuestos',
    temaId: 'vivienda',
    texto: 'La vivienda se abarata más liberando suelo y bajando impuestos que poniendo límites a los precios.',
    aFavor: 'Construir más y con menos impuestos aumenta la oferta de vivienda.',
    enContra: 'Construir lleva años, y bajar impuestos reduce lo que ingresa el Estado.',
    posturas: {
      psoe: P(-1, 30, 'Congelar las rentas que superen los índices de referencia.'),
      pp: P(2, 53, 'Un millón de viviendas con más suelo; cree que los límites al alquiler han reducido la oferta.'),
      vox: P(2, 23, 'Reformar la Ley del Suelo para construir mucho más y derogar la Ley de Vivienda.'),
      'frente-amplio': P(-1, 13, 'Limitar por ley los alquileres en las zonas tensionadas.'),
      bildu: P(-1, 5, 'Intervenir el mercado de la vivienda y regular los precios.'),
      junts: P(2, 16, 'Más oferta y menos impuestos; los topes de precios no crean pisos.'),
    },
  },
  {
    id: 'vivienda-publica',
    temaId: 'vivienda',
    corta: true,
    texto: 'El dinero público para vivienda debería ir sobre todo a construir pisos públicos de alquiler, más que a ayudar a comprar.',
    aFavor: 'Un parque público de alquiler da precios estables durante décadas.',
    enContra: 'Las familias que quieren comprar recibirían menos ayudas.',
    posturas: {
      psoe: P(1, 28, 'Un parque público estatal de 100.000 viviendas, junto a préstamos para comprar.'),
      pp: P(-1, 55, 'Aval público y una cuenta de ahorro con ventajas fiscales para comprar la primera vivienda.'),
      'frente-amplio': P(2, 10, 'Un parque público de 1,5 millones de viviendas en alquiler.'),
      erc: P(2, 19, 'El 1,5 % del PIB para ampliar el parque público de alquiler.'),
      pnv: P(-1, 8, 'Que el alquiler protegido no sea la única opción para emanciparse.'),
      bng: P(2, 12, 'El 3 % de los Presupuestos para un parque público de alquiler.'),
    },
  },
  // Empleo y salarios
  {
    id: 'smi-automatico',
    temaId: 'empleo',
    corta: true,
    texto: 'El salario mínimo debería subir automáticamente por ley según el sueldo medio, en lugar de pactarse con sindicatos y empresarios.',
    aFavor: 'El salario mínimo subiría solo, al ritmo de los sueldos.',
    enContra: 'Empresas y sindicatos perderían poder para negociarlo según la economía de cada momento.',
    posturas: {
      psoe: P(2, 37, 'Fijar por ley el salario mínimo por encima del 60 % del salario medio.'),
      'frente-amplio': P(2, 51, 'Un suelo legal del 60 % del salario medio neto.'),
      bng: P(2, 15, 'Salario mínimo del 60 % del salario medio.'),
      bildu: P(1, 6, 'Salario mínimo propio con la Carta Social Europea como referencia.'),
      erc: P(2, 20, 'Subir el salario mínimo hasta el 60 % del salario medio.'),
      junts: P(1, 70, 'Salario mínimo catalán que avance hacia el 60 % del salario medio.'),
      pnv: P(-1, 9, 'Un salario mínimo vasco fijado en el diálogo social.'),
    },
  },
  {
    id: 'cotizaciones',
    temaId: 'empleo',
    texto: 'Para crear empleo, habría que bajar lo que pagan empresas y autónomos a la Seguridad Social.',
    aFavor: 'Contratar sería más barato. Algunos programas lo limitan a nuevos autónomos o a quienes más difícil lo tienen para encontrar trabajo.',
    enContra: 'La Seguridad Social, que paga las pensiones, ingresaría menos.',
    posturas: {
      pp: P(2, 59, 'Nuevos autónomos sin cuota el primer año y el 100 % de las cotizaciones del primer trabajador bonificadas.'),
      vox: P(1, 9, 'Cuota cero para los autónomos que ingresen menos del salario mínimo.'),
      cc: P(1, 12, 'Bonificar cotizaciones ligadas a subidas de sueldo.'),
      junts: P(1, 61, 'Bonificar las cotizaciones por contratar indefinidamente a menores de 35.'),
    },
  },
  {
    id: 'jornada',
    temaId: 'empleo',
    corta: true,
    texto: 'La jornada laboral máxima debería bajar por ley de 40 a 37,5 horas semanales, cobrando lo mismo.',
    aFavor: 'Más tiempo para la vida personal y familiar, con el mismo salario.',
    enContra: 'Quienes se oponen creen que subiría los costes, sobre todo en pequeños negocios y en sectores con horarios largos.',
    posturas: {
      junts: P(-2, 88, 'En contra de imponer por ley la jornada de 37,5 horas.'),
      psoe: P(2, 41, 'Completar la reducción de la jornada a 37,5 horas.'),
      'frente-amplio': P(2, 56, 'Bajar a 37,5 horas ya y avanzar hasta las 32, sin bajar el sueldo.'),
      bildu: P(2, 6, 'Jornada de 32 horas o de cuatro días sin rebajar el salario.'),
      bng: P(2, 15, 'Jornada de 35 horas sin rebajar el salario.'),
      erc: P(2, 26, 'Reducir la jornada a 37,5 horas sin bajar el sueldo.'),
    },
  },
  // Impuestos y economía
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
      bildu: P(2, 14, 'Aumentar el impuesto a la banca y las grandes fortunas.'),
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
      junts: P(1, 67, 'Bajar la carga fiscal a la clase media y trabajadora.'),
      pp: P(2, 60, 'Bajar el IRPF a las rentas medias y bajas y deflactar la tarifa.'),
      vox: P(2, 9, 'Simplificar y bajar el IRPF, con un tipo menor según el número de hijos.'),
      'frente-amplio': P(-1, 46, 'Subir el tipo máximo al 52 % para rentas de más de 300.000 euros.'),
    },
  },
  {
    id: 'impuesto-empresas',
    temaId: 'impuestos',
    corta: true,
    texto: 'Habría que bajar el impuesto de sociedades, el que pagan las empresas por sus beneficios.',
    aFavor: 'Quienes lo defienden creen que traería más inversión y empleo.',
    enContra: 'El Estado ingresaría menos. Otros programas proponen lo contrario: un tipo mínimo para las grandes empresas.',
    posturas: {
      junts: P(1, 69, 'Acelerar la rebaja del impuesto de sociedades para pymes.'),
      psoe: P(-1, 48, 'Más impuestos a las cotizadas con grandes diferencias salariales.'),
      pp: P(1, 61, 'Libertad de amortización: descontar el mismo año lo que se invierta.'),
      vox: P(2, 9, 'Reducir el tipo del impuesto de sociedades.'),
      'frente-amplio': P(-2, 44, 'Un tipo mínimo real del 20 % en sociedades.'),
      erc: P(-1, 27, 'Más progresividad en el impuesto de sociedades.'),
    },
  },
  {
    id: 'banca-energeticas',
    temaId: 'impuestos',
    texto: 'Los bancos y las eléctricas deberían seguir pagando un impuesto extra mientras tengan beneficios excepcionales.',
    aFavor: 'Parte de los beneficios extraordinarios vuelve a la sociedad.',
    enContra: 'Bancos y eléctricas podrían trasladar el coste a sus clientes.',
    posturas: {
      'frente-amplio': P(2, 44, 'Mantener de forma permanente el gravamen a la banca.'),
      bildu: P(2, 14, 'Impuesto permanente a las energéticas y más carga a la banca.'),
      erc: P(2, 22, 'Recuperar el de las energéticas y hacer permanente el de la banca.'),
    },
  },
  {
    id: 'sucesiones',
    temaId: 'impuestos',
    texto: 'El impuesto sobre las herencias debería desaparecer en toda España.',
    aFavor: 'Heredar no costaría impuestos y sería igual en todas las comunidades.',
    enContra: 'Las comunidades ingresarían menos, y el ahorro sería mayor para las herencias grandes.',
    posturas: {
      'frente-amplio': P(-2, 45, 'Un impuesto estatal a las herencias de más de un millón.'),
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
      bildu: P(1, 7, 'Blindar la revalorización anual con el IPC.'),
      erc: P(2, 26, 'Blindar la revalorización de las pensiones.'),
      psoe: P(2, 89, 'Blindar en la Constitución la subida de las pensiones con el IPC.'),
      pp: P(1, 43, 'Subir las pensiones cada año con el IPC, dentro del Pacto de Toledo.'),
      'frente-amplio': P(2, 7, 'Revalorizar las pensiones por mandato constitucional.'),
      bng: P(1, 18, 'Revalorizar las pensiones según el IPC real.'),
      pnv: P(1, 31, 'Revalorizar cada año las pensiones con el IPC.'),
      junts: P(1, 56, 'Revisar cada año las pensiones con el IPC catalán.'),
    },
  },
  {
    id: 'pensiones-bajas',
    temaId: 'pensiones',
    corta: true,
    texto: 'Las pensiones más bajas deberían subir más que el resto.',
    aFavor: 'Ayuda más a quien tiene menos para vivir. Varios programas quieren llevarlas al umbral de la pobreza o al 60 % del salario medio.',
    enContra: 'Quien cotizó más años o con sueldos más altos vería que su pensión se acerca a la mínima.',
    posturas: {
      pnv: P(1, 31, 'Mejorar poco a poco las pensiones mínimas.'),
      psoe: P(2, 39, 'Seguir acercando las pensiones mínimas a los ingresos medios.'),
      'frente-amplio': P(2, 24, 'Subir las mínimas y no contributivas hasta el umbral de la pobreza.'),
      bildu: P(2, 8, 'Pensiones mínimas de al menos 1.220 € y subir un 15 % viudedad y no contributivas.'),
      bng: P(2, 18, 'Pensiones mínimas iguales al salario mínimo.'),
    },
  },
  {
    id: 'planes-empresa',
    temaId: 'pensiones',
    texto: 'Además de la pensión pública, hay que impulsar que las empresas ofrezcan planes de pensiones a sus trabajadores.',
    aFavor: 'La jubilación tendría un complemento además de la pensión pública.',
    enContra: 'Beneficia más a quien trabaja en empresas grandes, y parte del ahorro se va a fondos privados.',
    posturas: {
      pnv: P(2, 31, 'Extender los planes de pensiones complementarios.'),
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
      bildu: P(-2, 11, 'Derogar la Ley 15/1997, que permite la gestión privada de la sanidad.'),
      bng: P(-2, 18, 'Limitar las privatizaciones y recuperar lo privatizado.'),
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
      bng: P(1, 23, 'Acceso a la sanidad para las personas migrantes.'),
      bildu: P(2, 20, 'Acceso a la sanidad sea cual sea la situación administrativa.'),
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
    },
  },
  {
    id: 'eutanasia',
    temaId: 'sanidad',
    corta: true,
    texto: 'La eutanasia debería seguir siendo un derecho que se puede pedir en la sanidad pública.',
    aFavor: 'Quien sufre una enfermedad grave e incurable puede decidir cómo morir.',
    enContra: 'Hay quien teme presiones sobre personas vulnerables y pide más cuidados paliativos.',
    posturas: {
      bildu: P(2, 10, 'Reforzar el derecho a la eutanasia, también por sufrimiento psíquico.'),
      psoe: P(2, 50, 'Garantizar el ejercicio efectivo del derecho a la eutanasia.'),
      vox: P(-1, 52, 'Defender la vida hasta la muerte natural y potenciar los cuidados paliativos.'),
      'frente-amplio': P(2, 150, 'Garantizar el derecho a la eutanasia y al suicidio asistido.'),
    },
  },
  {
    id: 'dentista',
    temaId: 'sanidad',
    texto: 'La sanidad pública debería cubrir el dentista.',
    aFavor: 'Ir al dentista dejaría de depender del bolsillo de cada uno.',
    enContra: 'Costaría mucho dinero, que habría que sacar de otras partidas o de más impuestos.',
    posturas: {
      psoe: P(2, 49, 'Plan Sonríe: tratamientos dentales básicos para toda la población.'),
      'frente-amplio': P(2, 27, 'Ampliar la cobertura dental en la sanidad pública.'),
      bildu: P(2, 10, 'Incluir la salud bucodental en la cartera común.'),
      erc: P(2, 42, 'Atención dental completa en la sanidad pública.'),
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
    },
  },
  {
    id: 'universidad-gratis',
    temaId: 'educacion',
    texto: 'La matrícula de la universidad pública debería ser gratis para todo el alumnado, con independencia de sus notas o de su renta.',
    aFavor: 'Nadie dejaría de estudiar por dinero. Ya hay modelos cercanos: Andalucía descuenta el 99 % de la matrícula de los créditos aprobados a la primera.',
    enContra: 'También pagaría el Estado los estudios de quien sí puede pagarlos, y se perdería el incentivo de aprobar a la primera.',
    posturas: {
      psoe: P(1, 54, 'Matrícula gratuita del primer curso de grado.'),
      'frente-amplio': P(2, 7, 'Gratuidad desde los 0 años hasta la universidad.'),
    },
  },
  {
    id: 'examen-comun',
    temaId: 'educacion',
    texto: 'La selectividad debería ser un único examen igual en toda España.',
    aFavor: 'Todos competirían por las plazas con el mismo examen.',
    enContra: 'Las comunidades perderían una competencia y las pruebas en lenguas propias.',
    posturas: {
      pp: P(2, 39, 'Una prueba de acceso a la universidad (PAU) común en toda España.'),
      vox: P(2, 41, 'Reválidas y una EVAU única en toda España.'),
    },
  },
  {
    id: 'religion',
    temaId: 'educacion',
    corta: true,
    texto: 'La asignatura de Religión debería salir del horario de clase obligatorio.',
    aFavor: 'El horario lectivo se dedicaría a otras materias.',
    enContra: 'Las familias que quieren esa asignatura tendrían que buscarla fuera del horario.',
    posturas: {
      'frente-amplio': P(1, 150, 'Revisar los acuerdos con la Santa Sede y el artículo 27.'),
      erc: P(2, 8, 'Dejar sin efecto los acuerdos de 1979 con la Santa Sede.'),
      bng: P(2, 35, 'Que Religión no forme parte del currículo.'),
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
      bildu: P(2, 20, 'Una regularización efectiva, accesible y estable.'),
      bng: P(2, 22, 'Promover la regularización administrativa.'),
      pp: P(-2, 22, 'Prohibir las regularizaciones masivas; el arraigo será excepcional, no una vía generalizada.'),
      vox: P(-2, 15, 'Prohibir las regularizaciones masivas y suprimir el arraigo.'),
      'frente-amplio': P(2, 126, 'Procedimientos estables de regularización.'),
      junts: P(-1, 48, 'En contra de las regularizaciones masivas por decreto.'),
      pnv: P(1, 25, 'Avanzar en las regularizaciones que prevé la ley.'),
    },
  },
  {
    id: 'control-fronteras',
    temaId: 'inmigracion',
    corta: true,
    texto: 'España debería reforzar el control de fronteras para que lleguen menos personas de forma irregular.',
    aFavor: 'Menos llegadas irregulares y por rutas peligrosas. Algunos programas proponen más medios policiales y acuerdos con los países de origen.',
    enContra: 'Quienes se oponen temen que se devuelva a personas que podrían pedir asilo, y piden vías legales y seguras.',
    posturas: {
      pp: P(2, 21, 'Más agentes en la frontera sur y apoyo de las Fuerzas Armadas cuando haga falta.'),
      vox: P(2, 46, 'Proteger las fronteras de forma permanente con apoyo de las Fuerzas Armadas.'),
      bildu: P(-2, 20, 'Rechazar las devoluciones sumarias y la externalización de fronteras.'),
      junts: P(1, 47, 'Limitar y controlar los flujos desordenados, con los Mossos en la frontera.'),
    },
  },
  {
    id: 'vias-legales',
    temaId: 'inmigracion',
    texto: 'España necesita más trabajadores de fuera y debería ponerles más fácil venir con un contrato.',
    aFavor: 'Se cubren puestos de trabajo que faltan y se reduce la llegada irregular.',
    enContra: 'Quienes se oponen temen más competencia en algunos empleos y más presión sobre los servicios públicos.',
    posturas: {
      psoe: P(2, 92, 'Simplificar trámites e impulsar la contratación en origen.'),
      pp: P(1, 22, 'Cupos anuales y contratos firmados en origen para los sectores donde falten trabajadores.'),
      vox: P(-2, 15, '«Ni uno más»: España no puede acoger a más inmigrantes.'),
      'frente-amplio': P(2, 127, 'Más vías legales y seguras de migración y asilo.'),
      erc: P(2, 17, 'Vías legales y seguras para migrar.'),
      junts: P(2, 48, 'Priorizar las vías legales y la contratación en origen.'),
      pnv: P(2, 25, 'Vías legales y contratación en origen.'),
      bildu: P(1, 20, 'Facilitar las autorizaciones de residencia y trabajo.'),
    },
  },
  {
    id: 'ayudas-residencia',
    temaId: 'inmigracion',
    texto: 'Las ayudas sociales deberían ser solo para quienes residen legalmente en España.',
    aFavor: 'Las ayudas se concentran en quienes residen legalmente.',
    enContra: 'Personas sin papeles, también niños, podrían quedar sin ayuda básica.',
    posturas: {
      bildu: P(-2, 20, 'Protección social sea cual sea la situación administrativa.'),
      pp: P(1, 40, 'Prioridad en las ayudas para quien tenga un arraigo real con España, sin basarse solo en la nacionalidad.'),
      vox: P(2, 19, 'Suprimir toda ayuda social a los inmigrantes en situación irregular.'),
      'frente-amplio': P(-1, 26, 'Derechos sociales sea cual sea la situación administrativa.'),
    },
  },
  // Medio ambiente y energía
  {
    id: 'nucleares',
    temaId: 'medioambiente',
    corta: true,
    texto: 'Habría que alargar la vida de las centrales nucleares en lugar de cerrarlas en los próximos años.',
    aFavor: 'Electricidad sin emisiones de CO₂ y estable mientras crecen las renovables.',
    enContra: 'Genera residuos que duran miles de años y alargarlas obliga a invertir más en ellas.',
    posturas: {
      bildu: P(-2, 15, 'Mantener el calendario de cierre nuclear.'),
      psoe: P(-2, 66, 'Mantener el calendario de cierre hasta 2035.'),
      pp: P(2, 71, 'Eliminar el calendario de cierre y extender su vida útil con el visto bueno del CSN.'),
      vox: P(2, 12, 'Derogar el calendario de cierre de las centrales nucleares.'),
      'frente-amplio': P(-2, 64, 'Cumplir el calendario de cierre (Almaraz, 2027-2028).'),
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
      pp: P(-1, 72, 'Revisar el ritmo de descarbonización de cada sector y frenar «calendarios imposibles».'),
      vox: P(-2, 29, 'Acabar con las imposiciones climáticas como el Pacto Verde.'),
      'frente-amplio': P(2, 60, 'Reducir las emisiones un 85 % en 2040.'),
      bildu: P(2, 15, 'Adelantar la descarbonización al menos a 2045.'),
      erc: P(1, 32, 'Alinear la planificación climática con la ciencia.'),
      junts: P(1, 81, 'Neutralidad climática antes de 2050.'),
    },
  },
  {
    id: 'combustion',
    temaId: 'medioambiente',
    texto: 'Debería mantenerse la prohibición europea de vender coches nuevos de gasolina y diésel a partir de 2035.',
    aFavor: 'Los coches nuevos dejarían de emitir CO₂ por el tubo de escape.',
    enContra: 'Los coches eléctricos aún son más caros y no hay cargadores en todas partes.',
    posturas: {
      vox: P(-2, 11, 'Revertir la prohibición europea de los motores de combustión.'),
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
      junts: P(-1, 41, 'Critica que la tauromaquia siga declarada patrimonio cultural.'),
    },
  },
  // Juventud
  {
    id: 'ayuda-alquiler-joven',
    temaId: 'juventud',
    corta: true,
    texto: 'Los jóvenes deberían recibir cada mes una ayuda pública para pagar el alquiler.',
    aFavor: 'Los jóvenes podrían independizarse antes.',
    enContra: 'Si no hay más pisos, la ayuda puede acabar subiendo los alquileres.',
    posturas: {
      junts: P(2, 18, 'Convertir el Bono Joven en una renta de emancipación.'),
    },
  },
  {
    id: 'aval-hipoteca',
    temaId: 'juventud',
    texto: 'El Estado debería avalar parte de la hipoteca de los jóvenes para que puedan comprar sin tener ahorrada la entrada.',
    aFavor: 'Comprar sin tener ahorrado el 20 % de entrada.',
    enContra: 'Si muchos jóvenes no pueden pagar, el Estado tendría que cubrirlo.',
    posturas: {
      psoe: P(1, 31, 'Préstamos sin intereses de hasta 50.000 € para la primera vivienda.'),
      pp: P(2, 55, 'Aval público de hasta el 20 % del valor de la vivienda para menores de 40 años.'),
      junts: P(2, 18, 'Que el aval de la entrada de la primera vivienda llegue a los menores de 35.'),
    },
  },
  {
    id: 'edad-redes',
    temaId: 'juventud',
    texto: 'Las redes sociales deberían comprobar de verdad la edad de quien se registra.',
    aFavor: 'Los menores estarían más protegidos en internet.',
    enContra: 'Habría que dar datos personales para usar las redes, con riesgos para la privacidad.',
    posturas: {
      'frente-amplio': P(2, 41, 'Verificación de edad para menores de 16 años en redes.'),
      psoe: P(2, 95, 'Verificación de edad pública y anónima; mínimo 16 años.'),
      pp: P(2, 58, 'Verificación de edad obligatoria y ninguna cuenta antes de los 14 años.'),
      vox: P(1, 52, 'Proteger a los menores en los entornos digitales.'),
    },
  },
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
      erc: P(2, 17, 'Promover el voto a partir de los 16 años.'),
      junts: P(2, 59, 'Reconocer el voto a los 16 años.'),
    },
  },
  {
    id: 'herencia-universal',
    temaId: 'juventud',
    texto: 'Cada joven debería recibir del Estado un dinero para empezar (por ejemplo, 20.000 €), pagado con impuestos a las grandes fortunas.',
    aFavor: 'Todos los jóvenes empezarían su vida adulta con un mínimo.',
    enContra: 'Cuesta mucho dinero y lo recibirían también quienes no lo necesitan.',
    posturas: {
      psoe: P(1, 56, 'Cuenta de Futuro: 1.000 € al nacer, disponibles a los 18.'),
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
      pp: P(1, 19, 'Rendir cuentas cada año del Pacto de Estado contra la Violencia de Género y más medios para VioGen.'),
      vox: P(-2, 30, 'Derogar las leyes de género.'),
      'frente-amplio': P(2, 38, 'Blindar la financiación del Pacto de Estado contra la Violencia de Género.'),
      erc: P(2, 24, 'Ampliar la ley de violencia de género.'),
      bng: P(2, 24, 'Reformar la ley para cubrir todas las violencias.'),
      cc: P(2, 10, 'Financiar el Pacto de Estado en todas las islas.'),
      pnv: P(2, 26, 'Cumplir íntegramente el Pacto de Estado.'),
      bildu: P(1, 19, 'Reconocer la violencia vicaria y revisar la protección a las víctimas.'),
      junts: P(1, 33, 'Reforzar la prevención y la protección frente a la violencia machista.'),
    },
  },
  {
    id: 'planes-igualdad',
    temaId: 'igualdad',
    corta: true,
    texto: 'Las empresas medianas y grandes deberían seguir obligadas a tener planes de igualdad entre hombres y mujeres.',
    aFavor: 'Ayudan a detectar y corregir brechas de sueldo o de ascensos.',
    enContra: 'Son papeleo y coste para las empresas.',
    posturas: {
      psoe: P(2, 78, 'Reforzar el cumplimiento de los planes de igualdad.'),
      'frente-amplio': P(1, 123, 'Más inspección contra la brecha salarial.'),
      pnv: P(1, 9, 'Aplicar la transparencia salarial europea.'),
    },
  },
  {
    id: 'trans',
    temaId: 'igualdad',
    texto: 'Las personas trans deberían poder cambiar su sexo en el registro con su sola declaración, como ocurre ahora.',
    aFavor: 'Se mantiene que las personas trans no necesiten informes médicos para el cambio.',
    enContra: 'Hay quien pide algún tipo de control, sobre todo en menores o en el deporte.',
    posturas: {
      bildu: P(1, 19, 'No aceptar retrocesos en los derechos de las personas trans.'),
      junts: P(1, 36, 'Oponerse a recortar la ley trans y LGTBI.'),
      bng: P(2, 29, 'Respetar la autodeterminación de género.'),
      pnv: P(1, 27, 'Desarrollar el cambio de documentación de la ley de 2023.'),
      psoe: P(1, 97, 'Que la ley LGTBI de 2023 sea el mínimo común en toda España.'),
      pp: P(-2, 44, 'Eliminar la libre autodeterminación registral del sexo.'),
      vox: P(-1, 43, 'Que el deporte femenino se rija por criterios biológicos.'),
      'frente-amplio': P(2, 123, 'Aplicar de forma efectiva la Ley Trans.'),
      erc: P(1, 23, 'Reconocer todas las identidades de género.'),
    },
  },
  {
    id: 'aborto',
    temaId: 'igualdad',
    texto: 'El aborto debería poder hacerse en cualquier hospital público, además de en las clínicas concertadas.',
    aFavor: 'Las mujeres no tendrían que desplazarse ni ir a una clínica privada.',
    enContra: 'Algunos médicos se oponen por conciencia y habría que organizar los servicios.',
    posturas: {
      bildu: P(1, 19, 'Blindar el acceso libre y seguro al aborto.'),
      pnv: P(1, 26, 'Perímetros de protección en las clínicas.'),
      psoe: P(1, 81, 'Blindar el aborto en la Constitución.'),
      vox: P(-1, 52, 'Defender la vida desde la concepción.'),
      'frente-amplio': P(2, 28, 'Garantizar el aborto en la sanidad pública.'),
    },
  },
  {
    id: 'custodia',
    temaId: 'igualdad',
    texto: 'Tras un divorcio, la custodia compartida de los hijos debería ser la opción por defecto.',
    aFavor: 'Ambos progenitores seguirían cuidando de sus hijos.',
    enContra: 'No siempre es lo mejor para el menor; hay quien prefiere decidirlo caso a caso.',
    posturas: {
    },
  },
  // Modelo territorial
  {
    id: 'competencias',
    temaId: 'territorial',
    corta: true,
    texto: 'La sanidad y la educación deberían volver a gestionarse desde el Estado en lugar de desde las comunidades.',
    aFavor: 'Los mismos servicios para todo el país y menos diferencias entre comunidades.',
    enContra: 'Las comunidades perderían autogobierno y las decisiones se tomarían lejos de cada territorio.',
    posturas: {
      psoe: P(-1, 91, 'Reforzar el Estado autonómico y el autogobierno.'),
      pp: P(-1, 16, 'Defender el Estado de las Autonomías, con estándares comunes en lo que gestionan las comunidades.'),
      vox: P(1, 41, 'Currículo, evaluaciones e inspección comunes en toda España.'),
      'frente-amplio': P(-1, 140, 'Una república federal y plurinacional.'),
      erc: P(-2, 11, 'Competencias exclusivas en educación y currículos.'),
      junts: P(-2, 50, 'Defender las competencias de la Generalitat en sanidad y educación.'),
      bildu: P(-2, 24, 'Traspasar todas las competencias pendientes y otras nuevas.'),
      pnv: P(-2, 38, 'Rechazar cualquier recentralización.'),
      bng: P(-2, 85, 'Transferir a Galicia todas las competencias de enseñanza.'),
      cc: P(-1, 5, 'Oponerse a la recentralización.'),
    },
  },
  {
    id: 'referendum',
    temaId: 'territorial',
    texto: 'Convocar un referéndum de independencia sin autorización debería ser delito.',
    aFavor: 'Se protege la Constitución y la unidad del país.',
    enContra: 'Hay quien lo ve como castigar con la cárcel una votación.',
    posturas: {
      pp: P(2, 16, 'Recuperar el delito de convocatoria de referéndum ilegal.'),
      vox: P(1, 55, 'Recuperar el delito de sedición.'),
      erc: P(-2, 8, 'Negociar un referéndum de autodeterminación.'),
      bildu: P(-2, 24, 'Reconocer el derecho a decidir del pueblo vasco.'),
      bng: P(-2, 89, 'Reconocer la autodeterminación de las naciones del Estado.'),
      junts: P(-2, 13, 'Garantizar el derecho de Cataluña a la autodeterminación.'),
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
      bildu: P(2, 23, 'Reconocer el carácter plurinacional del Estado.'),
      pnv: P(2, 39, 'Reconocimiento nacional de Euskadi.'),
      bng: P(2, 8, 'Defiende los derechos nacionales de Galicia.'),
      erc: P(1, 7, 'Defiende la autodeterminación de Cataluña.'),
      junts: P(2, 26, 'Cataluña es una nación con derecho a decidir su futuro.'),
    },
  },
  {
    id: 'menos-parlamentos',
    temaId: 'territorial',
    texto: 'Habría que reducir el número de diputados y cargos públicos de las comunidades autónomas.',
    aFavor: 'Menos gasto público en cargos políticos.',
    enContra: 'Las comunidades y los partidos pequeños tendrían menos voz.',
    posturas: {
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
      bildu: P(-2, 28, 'Rechazar el aumento del gasto en defensa que exige la OTAN.'),
      'frente-amplio': P(-2, 130, 'Rechazar el 5 % y reducir el gasto militar.'),
      psoe: P(-1, 105, 'Rechazó subir el gasto militar al 5 % del PIB.'),
      pp: P(1, 26, 'Una ley de financiación de la defensa y más efectivos en las Fuerzas Armadas.'),
      vox: P(2, 47, 'Aumentar la inversión en Defensa.'),
      bng: P(-2, 89, 'Rechazar el aumento del gasto militar.'),
    },
  },
  {
    id: 'ucrania',
    temaId: 'exterior',
    texto: 'España debería seguir enviando ayuda, también militar, a Ucrania frente a la invasión rusa.',
    aFavor: 'Se apoya a un país invadido y se frena a Rusia.',
    enContra: 'Algunos temen que alargue la guerra y cuesta dinero público.',
    posturas: {
      bildu: P(-1, 28, 'Rechazar el envío de armas a los conflictos.'),
      psoe: P(1, 105, 'Ha apoyado a Ucrania, también con ayuda militar.'),
      pp: P(2, 74, 'Mantener el apoyo político, económico, militar y humanitario a Ucrania.'),
      'frente-amplio': P(1, 133, 'Solidaridad con Ucrania, por la vía diplomática.'),
      bng: P(-2, 89, 'Dejar de enviar armamento a Ucrania.'),
      erc: P(1, 16, 'Ayuda europea a Ucrania frente a la agresión rusa.'),
      junts: P(2, 26, 'Apoyo humanitario, financiero y militar a Ucrania.'),
    },
  },
  {
    id: 'ayuda-desarrollo',
    temaId: 'exterior',
    texto: 'España debería dedicar el 0,7 % de su riqueza a ayudar a países pobres.',
    aFavor: 'Mejora la vida en los países pobres y puede reducir la emigración forzada.',
    enContra: 'Es dinero que no se gasta en necesidades de aquí.',
    posturas: {
      psoe: P(2, 107, 'Cerrar la brecha con el 0,7 % de la renta nacional.'),
      vox: P(-1, 16, 'Retirar la cooperación a los países que no colaboren con los flujos migratorios.'),
      'frente-amplio': P(2, 133, 'Llegar al 0,7 % de la renta nacional.'),
      erc: P(2, 16, 'Cumplir el 0,7 % en cooperación.'),
    },
  },
  {
    id: 'otan',
    temaId: 'exterior',
    texto: 'Europa debería depender menos de la OTAN y de Estados Unidos y tener su propia defensa.',
    aFavor: 'Europa decidiría su seguridad sin depender de lo que vote Estados Unidos.',
    enContra: 'Crear una defensa europea propia costaría mucho dinero y años.',
    posturas: {
      bildu: P(2, 28, 'Rechazar la OTAN y una seguridad europea sin depender de EE. UU.'),
      bng: P(2, 89, 'Salir de la OTAN.'),
      pnv: P(1, 41, 'Más autonomía estratégica europea.'),
      erc: P(1, 16, 'Una UE autónoma de la OTAN en defensa.'),
      psoe: P(1, 112, 'Reforzar la autonomía estratégica y la defensa común de la UE.'),
      pp: P(-1, 75, 'Recuperar el vínculo transatlántico y reforzar el pilar europeo dentro de la OTAN.'),
      'frente-amplio': P(2, 135, 'Pasar de la OTAN a una autonomía estratégica europea.'),
      junts: P(1, 28, 'Una defensa europea más integrada, complementaria de la OTAN.'),
    },
  },
  {
    id: 'sahara',
    temaId: 'exterior',
    corta: true,
    texto: 'España debería defender que el pueblo saharaui decida su futuro en un referéndum.',
    aFavor: 'Se defiende lo que dicen las resoluciones de la ONU.',
    enContra: 'Empeoraría la relación con Marruecos, clave en migración y comercio.',
    posturas: {
      bildu: P(2, 29, 'Recuperar el apoyo a la autodeterminación del pueblo saharaui.'),
      pp: P(-1, 74, 'Apoyar a la ONU para una solución «mutuamente aceptable para las partes».'),
      'frente-amplio': P(2, 132, 'Referéndum de autodeterminación con opción de independencia.'),
      erc: P(1, 16, 'Revertir el giro sobre el Sáhara Occidental.'),
      bng: P(2, 90, 'Un referéndum de autodeterminación en el Sáhara.'),
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
