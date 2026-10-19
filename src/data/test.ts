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

import { PARTIDOS, partidoPorId, sePresentaEn } from './partidos';

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
      psoe: P(2, 221, 'Desarrollar las medidas de contención de precios de la Ley de Vivienda.'),
      pp: P(-1, 34, 'Derogar la Ley de Vivienda, que permite limitar los alquileres.'),
      vox: P(-1, 43, 'Derogar la Ley de Vivienda de 2023.'),
      'frente-amplio': P(2, 77, 'Regular de forma más efectiva los precios del alquiler.'),
      erc: P(2, 52, 'Defender la limitación y la reducción de los precios del alquiler.'),
      bildu: P(1, 2, 'Apoyó la Ley de Vivienda que limita los alquileres.'),
    },
  },
  {
    id: 'suelo-impuestos',
    temaId: 'vivienda',
    texto: 'La vivienda se abarata más liberando suelo y bajando impuestos que poniendo límites a los precios.',
    aFavor: 'Construir más y con menos impuestos aumenta la oferta de vivienda.',
    enContra: 'Construir lleva años, y bajar impuestos reduce lo que ingresa el Estado.',
    posturas: {
      psoe: P(-1, 221, 'Contener los precios con la Ley de Vivienda.'),
      pp: P(1, 32, 'Bonificar impuestos al comprar vivienda en el medio rural.'),
      vox: P(2, 40, 'Liberar suelo y quitar el IVA de la primera vivienda.'),
      'frente-amplio': P(-1, 77, 'Regular de forma más efectiva los precios del alquiler.'),
      erc: P(-1, 52, 'Limitar los precios del alquiler.'),
      bildu: P(-1, 2, 'Apoyó la Ley de Vivienda que limita los alquileres.'),
      junts: P(1, 95, 'Bonificaciones fiscales a quien alquile por debajo del índice de precios.'),
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
      psoe: P(1, 130, 'Llegar a un 20 % de parque público de vivienda, junto a avales para comprar.'),
      pp: P(-1, 34, 'Avales públicos para comprar la primera vivienda.'),
      'frente-amplio': P(2, 76, 'Hacer crecer el parque de alquiler social y asequible.'),
      erc: P(1, 114, 'Ampliar el parque de vivienda protegida, sobre todo de alquiler social.'),
      junts: P(1, 95, 'Usar el Plan de Vivienda para construir alquiler asequible.'),
      pnv: P(1, 45, 'Fomentar el alquiler y la promoción de vivienda pública.'),
      bng: P(1, 15, 'Ampliar el parque público de vivienda con los pisos de la SAREB.'),
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
      psoe: P(2, 26, 'Fijar por ley que el salario mínimo sea el 60 % del salario medio.'),
      pp: P(-1, 19, 'Actualizarlo en el diálogo social con sindicatos y empresarios.'),
      'frente-amplio': P(2, 7, 'Subirlo cada año por encima del IPC.'),
      bng: P(2, 16, 'Salario mínimo del 60 % del salario medio.'),
      bildu: P(1, 3, 'Salario mínimo propio guiado por el 60 % del salario medio.'),
      erc: P(1, 91, 'Fijar por ley una subida mínima anual de salarios.'),
      junts: P(1, 63, 'Salario mínimo catalán según el coste de la vida.'),
      pnv: P(-1, 29, 'Que el empleo se debata en el diálogo social.'),
    },
  },
  {
    id: 'cotizaciones',
    temaId: 'empleo',
    texto: 'Para crear empleo, habría que bajar lo que pagan empresas y autónomos a la Seguridad Social.',
    aFavor: 'Contratar sería más barato. Algunos programas lo limitan a nuevos autónomos o a quienes más difícil lo tienen para encontrar trabajo.',
    enContra: 'La Seguridad Social, que paga las pensiones, ingresaría menos.',
    posturas: {
      pp: P(2, 20, 'Tarifa cero de cotización para nuevos autónomos el primer año.'),
      vox: P(2, 22, 'Bonificar las cotizaciones de los nuevos contratos indefinidos.'),
      cc: P(1, 6, 'Bonificar la cuota empresarial por contratos indefinidos a jóvenes.'),
      junts: P(1, 58, 'Moderar las cotizaciones de quienes tienen más difícil encontrar empleo.'),
      erc: P(1, 90, 'Bajar la cuota de los autónomos a niveles europeos.'),
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
      psoe: P(1, 50, 'Impulsar la reducción de jornada sin bajar el sueldo.'),
      'frente-amplio': P(2, 7, 'Jornada máxima de 37,5 horas por ley, sin bajar el sueldo.'),
      bildu: P(2, 3, 'Jornada de 32 horas sin rebajar el salario.'),
      bng: P(2, 16, 'Jornada de 35 horas sin rebajar el salario.'),
      erc: P(1, 53, 'Implantar la semana laboral de cuatro días.'),
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
      psoe: P(1, 39, 'Evaluar el impuesto temporal y debatir la tributación de la riqueza.'),
      pp: P(-2, 23, 'Eliminar el impuesto a las grandes fortunas.'),
      vox: P(-2, 77, 'Suprimir el impuesto de Patrimonio.'),
      'frente-amplio': P(2, 16, 'Un impuesto permanente a las grandes fortunas.'),
      erc: P(2, 8, 'Crear impuestos a las grandes fortunas.'),
      bildu: P(2, 8, 'Hacer permanente el impuesto a las grandes fortunas.'),
      bng: P(2, 40, 'Impuestos permanentes a las grandes fortunas.'),
      junts: P(1, 57, 'Gravar más el capital improductivo.'),
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
      psoe: P(-1, 39, 'Defender los impuestos para sostener el Estado del bienestar.'),
      pp: P(2, 23, 'Bajada inmediata, ajustando el IRPF a la inflación.'),
      vox: P(2, 74, 'Dos tipos, del 15 % y del 25 %, con rebajas por hijo.'),
      'frente-amplio': P(-1, 17, 'Subir el tipo máximo al 52 % para rentas de más de 300.000 euros.'),
      bildu: P(-1, 8, 'Aumentar la carga impositiva.'),
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
      psoe: P(-1, 39, 'Impulsar en la UE una tributación mínima en el impuesto de sociedades.'),
      pp: P(1, 23, 'Simplificar el impuesto de sociedades de las pymes, con atención a las que contraten.'),
      vox: P(2, 77, 'Bajar el impuesto de sociedades hasta el 15 %.'),
      'frente-amplio': P(-2, 16, 'Reformarlo para que las grandes empresas paguen más.'),
      erc: P(-1, 71, 'Tipo mínimo del 15 % en sociedades para grandes empresas.'),
    },
  },
  {
    id: 'banca-energeticas',
    temaId: 'impuestos',
    texto: 'Los bancos y las eléctricas deberían seguir pagando un impuesto extra mientras tengan beneficios excepcionales.',
    aFavor: 'Parte de los beneficios extraordinarios vuelve a la sociedad.',
    enContra: 'Bancos y eléctricas podrían trasladar el coste a sus clientes.',
    posturas: {
      psoe: P(2, 39, 'Evaluar la prórroga de los gravámenes a la banca y las energéticas.'),
      'frente-amplio': P(2, 16, 'Mantener los impuestos extraordinarios a energéticas y financieras.'),
      bildu: P(2, 8, 'Hacer permanentes los impuestos a la banca y las energéticas.'),
      bng: P(2, 40, 'Hacer permanentes los impuestos a la banca y las energéticas.'),
      erc: P(1, 71, 'Que la Generalitat recaude su parte de esos impuestos.'),
    },
  },
  {
    id: 'sucesiones',
    temaId: 'impuestos',
    texto: 'El impuesto sobre las herencias debería desaparecer en toda España.',
    aFavor: 'Heredar no costaría impuestos y sería igual en todas las comunidades.',
    enContra: 'Las comunidades ingresarían menos, y el ahorro sería mayor para las herencias grandes.',
    posturas: {
      vox: P(2, 77, 'Suprimir el impuesto de Sucesiones y Donaciones.'),
      'frente-amplio': P(-2, 16, 'Un mínimo común en toda España que las comunidades no puedan rebajar.'),
      erc: P(-1, 55, 'Critica las bonificaciones del impuesto de sucesiones.'),
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
      psoe: P(2, 170, 'Incluir en la Constitución que las pensiones suben con el IPC.'),
      pp: P(1, 19, 'Garantizar la revalorización de las pensiones en el Pacto de Toledo.'),
      'frente-amplio': P(1, 15, 'Mantener la subida de las pensiones con el IPC.'),
      bng: P(1, 18, 'Revalorizar las pensiones según el IPC real.'),
      pnv: P(1, 33, 'Impedir que las pensiones no se actualicen con el IPC.'),
      cc: P(1, 7, 'Pensiones actualizadas según el coste de la vida.'),
      junts: P(1, 100, 'Tener en cuenta el coste de la vida en las pensiones.'),
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
      psoe: P(2, 170, 'Seguir subiendo las pensiones mínimas y no contributivas.'),
      'frente-amplio': P(2, 15, 'Subir más las mínimas y no contributivas.'),
      bildu: P(2, 5, 'Subir las pensiones mínimas a 1.080 €.'),
      bng: P(2, 17, 'Pensiones mínimas del 60 % del salario medio.'),
      erc: P(2, 96, 'Subir las pensiones mínimas.'),
      junts: P(1, 100, 'Mejorar de forma gradual las pensiones mínimas.'),
    },
  },
  {
    id: 'planes-empresa',
    temaId: 'pensiones',
    texto: 'Además de la pensión pública, hay que impulsar que las empresas ofrezcan planes de pensiones a sus trabajadores.',
    aFavor: 'La jubilación tendría un complemento además de la pensión pública.',
    enContra: 'Beneficia más a quien trabaja en empresas grandes, y parte del ahorro se va a fondos privados.',
    posturas: {
      psoe: P(2, 25, 'Crear fondos de pensiones de empleo (segundo pilar).'),
      pnv: P(2, 34, 'Impulsar de forma decidida los planes de empresa.'),
      junts: P(2, 100, 'Extender los planes de pensiones complementarios a las pymes.'),
      erc: P(-1, 7, 'Se opone al negocio de los planes de pensiones privados.'),
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
      vox: P(2, 57, 'Reforzar los conciertos con la sanidad privada.'),
      'frente-amplio': P(-1, 92, 'Pasar a la sanidad pública a quienes hoy se atienden por mutualidades.'),
      bildu: P(-2, 6, 'Derogar la ley que permite privatizar servicios sanitarios.'),
      bng: P(-2, 35, 'Limitar la privatización de la sanidad pública.'),
    },
  },
  {
    id: 'sanidad-irregulares',
    temaId: 'sanidad',
    texto: 'La sanidad pública debería atender a los inmigrantes en situación irregular en todos los servicios, igual que a los demás.',
    aFavor: 'Las enfermedades se tratan antes, se protege la salud de todos y se evitan urgencias más caras.',
    enContra: 'Supone más gasto sanitario. Quienes se oponen prefieren limitar la atención a urgencias y enfermedades contagiosas.',
    posturas: {
      vox: P(-2, 60, 'Para ellos, solo urgencias vitales y enfermedades infecciosas.'),
      'frente-amplio': P(2, 105, 'Acceso universal, incluidos los migrantes en situación irregular.'),
      pnv: P(1, 46, 'Acceso universal a la sanidad.'),
      bng: P(1, 35, 'Recuperar la universalidad sanitaria.'),
      bildu: P(1, 11, 'Acceso de todas las personas migrantes a los servicios públicos.'),
    },
  },
  {
    id: 'espera-maxima',
    temaId: 'sanidad',
    texto: 'Debería haber por ley un tiempo máximo de espera para operarse o ver al especialista en toda España.',
    aFavor: 'Todo el mundo tendría el mismo plazo garantizado, viva donde viva.',
    enContra: 'La sanidad la gestionan las comunidades, que perderían margen para organizarse.',
    posturas: {
      psoe: P(2, 201, '120 días para operaciones y 60 para el especialista.'),
      'frente-amplio': P(2, 89, 'Una ley de listas de espera con tiempos máximos.'),
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
      psoe: P(2, 197, 'Defender la Ley de Eutanasia aprobada.'),
      pp: P(-1, 48, 'Revisar la Ley de Eutanasia.'),
      vox: P(-2, 58, 'Derogar la ley de eutanasia.'),
      'frente-amplio': P(2, 99, 'Reconocer el derecho a una muerte digna según la Ley de Eutanasia.'),
    },
  },
  {
    id: 'dentista',
    temaId: 'sanidad',
    texto: 'La sanidad pública debería cubrir el dentista.',
    aFavor: 'Ir al dentista dejaría de depender del bolsillo de cada uno.',
    enContra: 'Costaría mucho dinero, que habría que sacar de otras partidas o de más impuestos.',
    posturas: {
      psoe: P(1, 183, 'Salud bucodental para niños y adolescentes.'),
      vox: P(2, 58, 'Incluir la salud bucodental y oftalmológica.'),
      'frente-amplio': P(2, 89, 'Incorporar la salud bucodental, la óptica y otras prestaciones.'),
      bildu: P(2, 6, 'Incluir el dentista básico en la sanidad pública.'),
      erc: P(1, 62, 'Financiar los planes de salud bucodental.'),
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
      pp: P(1, 51, 'Defender la libertad de elegir centro.'),
      vox: P(2, 33, 'Cheque escolar para elegir centro.'),
      'frente-amplio': P(-2, 155, 'Que la concertada sea solo subsidiaria de la pública.'),
    },
  },
  {
    id: 'universidad-gratis',
    temaId: 'educacion',
    texto: 'La matrícula de la universidad pública debería ser gratis para todo el alumnado, con independencia de sus notas o de su renta.',
    aFavor: 'Nadie dejaría de estudiar por dinero. Ya hay modelos cercanos: Andalucía descuenta el 99 % de la matrícula de los créditos aprobados a la primera.',
    enContra: 'También pagaría el Estado los estudios de quien sí puede pagarlos, y se perdería el incentivo de aprobar a la primera.',
    posturas: {
      psoe: P(1, 116, 'Gratis para quien apruebe las asignaturas a la primera.'),
      'frente-amplio': P(2, 160, 'Bajar las tasas hasta la gratuidad.'),
      erc: P(1, 129, 'Precios públicos que avancen hacia la gratuidad.'),
    },
  },
  {
    id: 'examen-comun',
    temaId: 'educacion',
    texto: 'La selectividad debería ser un único examen igual en toda España.',
    aFavor: 'Todos competirían por las plazas con el mismo examen.',
    enContra: 'Las comunidades perderían una competencia y las pruebas en lenguas propias.',
    posturas: {
      pp: P(2, 52, 'Una EBAU común en toda España.'),
      vox: P(2, 32, 'Una prueba única de acceso en toda España.'),
      pnv: P(-2, 48, 'Respetar el modelo propio de EBAU.'),
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
      'frente-amplio': P(2, 156, 'Ninguna religión dentro del currículo ni del horario lectivo.'),
      erc: P(2, 32, 'Anular los acuerdos con la Santa Sede que obligan a ofrecer Religión.'),
      bng: P(2, 33, 'Que Religión no forme parte del currículo.'),
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
      pp: P(-1, 81, 'Agilizar el retorno de inmigrantes en situación irregular.'),
      vox: P(-2, 103, 'Suprimir el arraigo como vía de regularización.'),
      'frente-amplio': P(2, 104, 'Un procedimiento de regularización permanente.'),
      erc: P(1, 37, 'Flexibilizar los permisos de residencia y acabar con la irregularidad sobrevenida.'),
      junts: P(1, 107, 'Buscar soluciones para quienes están sin papeles.'),
      pnv: P(1, 34, 'Que quien tenga contrato no tenga que pasar por el arraigo.'),
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
      pp: P(2, 81, 'Más personal y medios para el control de fronteras.'),
      vox: P(2, 102, 'Un bloqueo naval contra la llegada irregular de embarcaciones.'),
      erc: P(-2, 38, 'Acabar con las devoluciones en caliente.'),
      bildu: P(-2, 11, 'Acabar con las devoluciones en caliente.'),
      bng: P(-2, 20, 'Cerrar los CIE y acabar con las deportaciones.'),
      junts: P(-1, 107, 'Eliminar las devoluciones en caliente.'),
      pnv: P(-1, 10, 'Garantizar los derechos humanos en los rechazos en frontera.'),
      cc: P(1, 13, 'Cooperar con los países de origen contra la inmigración irregular.'),
    },
  },
  {
    id: 'vias-legales',
    temaId: 'inmigracion',
    texto: 'España necesita más trabajadores de fuera y debería ponerles más fácil venir con un contrato.',
    aFavor: 'Se cubren puestos de trabajo que faltan y se reduce la llegada irregular.',
    enContra: 'Quienes se oponen temen más competencia en algunos empleos y más presión sobre los servicios públicos.',
    posturas: {
      psoe: P(2, 256, 'Más vías de migración regular, con convenios de migración circular.'),
      'frente-amplio': P(1, 104, 'Reformar la ley de extranjería.'),
      erc: P(2, 37, 'Vías legales y seguras de migración.'),
      junts: P(2, 107, 'Vías legales y seguras de migración regular.'),
      pnv: P(2, 34, 'Que quien tenga contrato no tenga que pasar por el arraigo.'),
      bildu: P(1, 11, 'Corredores y vías seguras para las personas migrantes.'),
    },
  },
  {
    id: 'ayudas-residencia',
    temaId: 'inmigracion',
    texto: 'Las ayudas sociales deberían ser solo para quienes residen legalmente en España.',
    aFavor: 'Las ayudas se concentran en quienes residen legalmente.',
    enContra: 'Personas sin papeles, también niños, podrían quedar sin ayuda básica.',
    posturas: {
      vox: P(2, 100, 'Vincular las ayudas sociales a la residencia legal.'),
      'frente-amplio': P(-1, 105, 'Acceso universal a la sanidad, también en situación irregular.'),
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
      pp: P(2, 38, 'Alargar su vida útil, con el visto bueno del CSN.'),
      vox: P(2, 117, 'Invertir en ellas y alargar su vida útil.'),
      'frente-amplio': P(-2, 48, 'Mantener el calendario de cierre.'),
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
      psoe: P(2, 88, 'Revisar siempre al alza los objetivos climáticos.'),
      vox: P(-2, 108, 'Derogar la Ley de Cambio Climático.'),
      'frente-amplio': P(2, 41, 'Más reducción de emisiones y más renovables en 2030.'),
      bildu: P(2, 9, 'Neutralidad climática en 2040.'),
      erc: P(2, 99, 'Subir el objetivo de reducción de emisiones al 55 % en 2030.'),
      pnv: P(1, 19, 'Transición hacia una economía baja en carbono.'),
      junts: P(1, 142, 'Cumplir los compromisos de reducción de emisiones.'),
      cc: P(1, 12, 'Acelerar la transición energética en Canarias.'),
    },
  },
  {
    id: 'combustion',
    temaId: 'medioambiente',
    texto: 'Debería mantenerse la prohibición europea de vender coches nuevos de gasolina y diésel a partir de 2035.',
    aFavor: 'Los coches nuevos dejarían de emitir CO₂ por el tubo de escape.',
    enContra: 'Los coches eléctricos aún son más caros y no hay cargadores en todas partes.',
    posturas: {
      vox: P(-2, 50, 'Pedir en Europa que se suspenda la prohibición de 2035.'),
      'frente-amplio': P(2, 11, 'Que en 2040 no circulen coches de combustión en España.'),
    },
  },
  {
    id: 'toros',
    temaId: 'medioambiente',
    texto: 'Las corridas de toros deberían poder recibir dinero público, como otras actividades culturales.',
    aFavor: 'Se apoya una tradición y la economía de muchos pueblos.',
    enContra: 'Mucha gente considera que causan sufrimiento al animal.',
    posturas: {
      vox: P(2, 151, 'Apoyar la tauromaquia con medidas fiscales y créditos.'),
      'frente-amplio': P(-2, 56, 'Suprimir la financiación pública de los espectáculos taurinos.'),
      erc: P(-1, 106, 'Abolir las corridas de toros.'),
      junts: P(-1, 146, 'Derogar la declaración de la tauromaquia como patrimonio cultural.'),
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
      psoe: P(2, 131, 'Mantener y ampliar el Bono Alquiler Joven.'),
      'frente-amplio': P(2, 78, 'Más ayudas al alquiler y mejorar el bono joven.'),
      junts: P(2, 98, 'Convertir el Bono Joven en una renta de emancipación.'),
    },
  },
  {
    id: 'aval-hipoteca',
    temaId: 'juventud',
    texto: 'El Estado debería avalar parte de la hipoteca de los jóvenes para que puedan comprar sin tener ahorrada la entrada.',
    aFavor: 'Comprar sin tener ahorrado el 20 % de entrada.',
    enContra: 'Si muchos jóvenes no pueden pagar, el Estado tendría que cubrirlo.',
    posturas: {
      psoe: P(2, 226, 'Avales del ICO del 20 % de la hipoteca para menores de 35 años.'),
      pp: P(2, 34, 'Avales públicos para hipotecas de hasta el 95 % del precio.'),
      junts: P(1, 98, 'Mejores condiciones hipotecarias del ICO para menores de 35 años.'),
    },
  },
  {
    id: 'edad-redes',
    temaId: 'juventud',
    texto: 'Las redes sociales deberían comprobar de verdad la edad de quien se registra.',
    aFavor: 'Los menores estarían más protegidos en internet.',
    enContra: 'Habría que dar datos personales para usar las redes, con riesgos para la privacidad.',
    posturas: {
      pp: P(2, 54, 'Verificación de edad eficaz para redes sociales.'),
      vox: P(1, 94, 'Proteger a los menores en internet.'),
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
      'frente-amplio': P(2, 102, 'Derecho a votar desde los 16 años.'),
      erc: P(2, 53, 'Derecho a votar desde los 16 años.'),
      bng: P(2, 63, 'Derecho a votar desde los 16 años.'),
      junts: P(2, 99, 'Avanzar hacia el voto a los 16 años.'),
    },
  },
  {
    id: 'herencia-universal',
    temaId: 'juventud',
    texto: 'Cada joven debería recibir del Estado un dinero para empezar (por ejemplo, 20.000 €), pagado con impuestos a las grandes fortunas.',
    aFavor: 'Todos los jóvenes empezarían su vida adulta con un mínimo.',
    enContra: 'Cuesta mucho dinero y lo recibirían también quienes no lo necesitan.',
    posturas: {
      'frente-amplio': P(2, 15, 'Una «herencia universal» de 20.000 € a los 23 años.'),
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
      psoe: P(2, 152, 'Renovar el Pacto de Estado contra la Violencia de Género.'),
      pp: P(1, 62, 'Cumplir y actualizar el Pacto de Estado.'),
      vox: P(-2, 10, 'Derogar la Ley Integral de Violencia de Género.'),
      'frente-amplio': P(2, 111, 'Blindar el Pacto de Estado y su financiación.'),
      erc: P(2, 47, 'Ampliar la ley de violencia de género.'),
      bng: P(2, 22, 'Juzgados exclusivos de violencia machista.'),
      cc: P(2, 8, 'Oponerse a cualquier retroceso en las leyes contra la violencia de género.'),
      pnv: P(1, 26, 'Más recursos contra la violencia machista.'),
      bildu: P(1, 10, 'Reforzar la lucha contra la violencia machista.'),
      junts: P(1, 111, 'Más prevención de la violencia machista.'),
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
      psoe: P(1, 140, 'Más inspecciones y sanciones contra la brecha salarial.'),
      pp: P(1, 21, 'Planes de igualdad con objetivos evaluables.'),
      vox: P(-2, 10, 'Eliminar las cuotas y los planes de igualdad.'),
      'frente-amplio': P(2, 108, 'Ampliar los planes de igualdad en las empresas.'),
      pnv: P(1, 26, 'Cumplir las medidas de igualdad retributiva en las empresas.'),
      erc: P(1, 91, 'Transparencia retributiva en las empresas.'),
    },
  },
  {
    id: 'trans',
    temaId: 'igualdad',
    texto: 'Las personas trans deberían poder cambiar su sexo en el registro con su sola declaración, como ocurre ahora.',
    aFavor: 'Se mantiene que las personas trans no necesiten informes médicos para el cambio.',
    enContra: 'Hay quien pide algún tipo de control, sobre todo en menores o en el deporte.',
    posturas: {
      vox: P(-2, 11, 'Derogar la ley trans.'),
      'frente-amplio': P(2, 116, 'Defender la autodeterminación de las personas trans.'),
      erc: P(1, 51, 'Que las personas trans migrantes puedan rectificar su sexo legal.'),
    },
  },
  {
    id: 'aborto',
    temaId: 'igualdad',
    texto: 'El aborto debería poder hacerse en cualquier hospital público, además de en las clínicas concertadas.',
    aFavor: 'Las mujeres no tendrían que desplazarse ni ir a una clínica privada.',
    enContra: 'Algunos médicos se oponen por conciencia y habría que organizar los servicios.',
    posturas: {
      vox: P(-2, 58, 'Retirar el aborto de la sanidad pública.'),
      'frente-amplio': P(2, 111, 'Garantizarlo en la sanidad pública en todo el territorio.'),
    },
  },
  {
    id: 'custodia',
    temaId: 'igualdad',
    texto: 'Tras un divorcio, la custodia compartida de los hijos debería ser la opción por defecto.',
    aFavor: 'Ambos progenitores seguirían cuidando de sus hijos.',
    enContra: 'No siempre es lo mejor para el menor; hay quien prefiere decidirlo caso a caso.',
    posturas: {
      vox: P(2, 165, 'Custodia compartida como regla general.'),
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
      vox: P(2, 8, 'Devolver al Estado educación, sanidad, seguridad y justicia.'),
      'frente-amplio': P(-1, 120, 'Un pacto territorial que reconozca la plurinacionalidad.'),
      erc: P(-2, 127, 'Competencias exclusivas sobre los currículos escolares.'),
      junts: P(-2, 115, 'Traspasar las becas a la Generalitat.'),
      bildu: P(-2, 15, 'Blindar los modelos educativos propios.'),
      pnv: P(-2, 48, 'Respetar las competencias educativas vascas.'),
      bng: P(-2, 62, 'Transferir a Galicia todas las competencias de enseñanza.'),
      cc: P(-1, 3, 'Máximo nivel de autogobierno para Canarias.'),
    },
  },
  {
    id: 'referendum',
    temaId: 'territorial',
    texto: 'Convocar un referéndum de independencia sin autorización debería ser delito.',
    aFavor: 'Se protege la Constitución y la unidad del país.',
    enContra: 'Hay quien lo ve como castigar con la cárcel una votación.',
    posturas: {
      pp: P(2, 72, 'Castigar la convocatoria de referendos no autorizados.'),
      vox: P(1, 126, 'Recuperar el delito de sedición.'),
      erc: P(-2, 12, 'Negociar un referéndum de autodeterminación.'),
      bildu: P(-2, 14, 'Reconocer el derecho a decidir.'),
      bng: P(-2, 10, 'Reconocer el derecho de autodeterminación de Galicia.'),
      junts: P(-2, 5, 'No apoyar a quien niegue el derecho de autodeterminación.'),
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
      vox: P(-2, 8, 'Pasar a un Estado unitario.'),
      'frente-amplio': P(2, 120, 'Reconocer a España como realidad plurinacional.'),
      bildu: P(2, 14, 'Reconocer el carácter plurinacional del Estado.'),
      pnv: P(2, 6, 'Reconocimiento nacional de Euskadi.'),
      bng: P(2, 10, 'Galicia como nación con derecho de autodeterminación.'),
      erc: P(2, 116, 'Critica que se niegue la realidad plurinacional del Estado.'),
      junts: P(2, 27, 'Define a Cataluña como una nación.'),
      cc: P(1, 3, 'Canarias dentro de un Estado plurinacional consensuado.'),
    },
  },
  {
    id: 'menos-parlamentos',
    temaId: 'territorial',
    texto: 'Habría que reducir el número de diputados y cargos públicos de las comunidades autónomas.',
    aFavor: 'Menos gasto público en cargos políticos.',
    enContra: 'Las comunidades y los partidos pequeños tendrían menos voz.',
    posturas: {
      vox: P(2, 26, 'Reducir ministerios, consejerías, diputados y parlamentos.'),
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
      psoe: P(1, 270, 'Aumentar el presupuesto de Defensa.'),
      pp: P(2, 103, 'Dedicar el 2 % del PIB a seguridad y defensa.'),
      vox: P(2, 93, 'Aumentar la inversión en Defensa.'),
      erc: P(-2, 30, 'Reducir el gasto militar.'),
      bng: P(-2, 66, 'Anular el compromiso del 2 % del PIB en defensa.'),
    },
  },
  {
    id: 'ucrania',
    temaId: 'exterior',
    texto: 'España debería seguir enviando ayuda, también militar, a Ucrania frente a la invasión rusa.',
    aFavor: 'Se apoya a un país invadido y se frena a Rusia.',
    enContra: 'Algunos temen que alargue la guerra y cuesta dinero público.',
    posturas: {
      psoe: P(2, 259, 'Seguir apoyando a Ucrania.'),
      pp: P(2, 101, 'Mantener la ayuda militar, económica y humanitaria.'),
      'frente-amplio': P(1, 141, 'Solidaridad con Ucrania, reforzando la vía diplomática.'),
      bng: P(-2, 66, 'Dejar de enviar armas a Ucrania.'),
      erc: P(1, 14, 'Apoyo al pueblo ucraniano frente a la invasión.'),
      junts: P(1, 30, 'Apoyo a Ucrania frente a la invasión rusa.'),
    },
  },
  {
    id: 'ayuda-desarrollo',
    temaId: 'exterior',
    texto: 'España debería dedicar el 0,7 % de su riqueza a ayudar a países pobres.',
    aFavor: 'Mejora la vida en los países pobres y puede reducir la emigración forzada.',
    enContra: 'Es dinero que no se gasta en necesidades de aquí.',
    posturas: {
      psoe: P(2, 261, 'Avanzar hacia el 0,7 % de la renta nacional.'),
      vox: P(-1, 143, 'Revisar la cooperación al desarrollo.'),
      'frente-amplio': P(2, 148, 'Alcanzar el 0,7 % de la renta nacional.'),
      erc: P(2, 29, 'Llegar al 0,7 % en cooperación.'),
      junts: P(2, 107, 'Recuperar el objetivo del 0,7 %.'),
      pnv: P(1, 11, 'Un peso suficiente de la cooperación en los presupuestos.'),
    },
  },
  {
    id: 'otan',
    temaId: 'exterior',
    texto: 'Europa debería depender menos de la OTAN y de Estados Unidos y tener su propia defensa.',
    aFavor: 'Europa decidiría su seguridad sin depender de lo que vote Estados Unidos.',
    enContra: 'Crear una defensa europea propia costaría mucho dinero y años.',
    posturas: {
      psoe: P(-1, 264, 'Seguir trabajando dentro de la OTAN.'),
      'frente-amplio': P(2, 139, 'Pasar de las garantías de la OTAN a una autonomía estratégica europea.'),
      junts: P(1, 29, 'Reforzar la política exterior y de seguridad común de la UE.'),
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
      psoe: P(-1, 265, 'Apoyar una solución «mutuamente aceptable» en el marco de la ONU.'),
      pp: P(-1, 101, 'Una solución política «aceptable para las partes».'),
      'frente-amplio': P(2, 141, 'Apoyar la libre determinación del Sáhara Occidental.'),
      erc: P(2, 14, 'Defender la autodeterminación del Sáhara Occidental.'),
      pnv: P(2, 11, 'Defender la autodeterminación del pueblo saharaui.'),
      bng: P(2, 67, 'Un referéndum de autodeterminación en el Sáhara.'),
      junts: P(2, 29, 'Cumplir las resoluciones de la ONU sobre la autodeterminación del Sáhara.'),
    },
  },
];

// Respuestas posibles. «Me da igual» no cuenta en el resultado.
export type Respuesta = 2 | -2 | null; // sí, no, me da igual
export type Respuestas = Record<string, Respuesta>;

export type Resultado = { partidoId: string; porcentaje: number; preguntas: number };

// Coincidencia en cada frase: 1 si tu respuesta coincide con la postura del
// programa, 0 si es la contraria (escala de -2 a 2). Las frases de tus temas
// importantes cuentan el doble. Solo cuentan las frases que has respondido y
// sobre las que el programa se pronuncia.
// Partidos que entran en el test: los estatales con programa cargado y, si hay
// provincia elegida, los de esa comunidad que tengan suficientes posturas.
// Con provincia, solo cuentan los partidos que se presentan allí.
export function partidosDelTest(comunidad?: string | null): string[] {
  if (!comunidad) return PARTIDOS_TEST;
  const estatales = PARTIDOS_TEST.filter((id) => {
    const p = partidoPorId(id);
    return !p || sePresentaEn(p, comunidad);
  });
  const propios = PARTIDOS.filter(
    (p) =>
      p.ambito === 'autonomico' &&
      sePresentaEn(p, comunidad) &&
      AFIRMACIONES.filter((a) => a.posturas[p.id]).length >= MIN_POSTURAS,
  ).map((p) => p.id);
  return [...estatales, ...propios];
}

// Partidos de la comunidad que no entran por tener pocas posturas.
export function partidosSinTest(comunidad?: string | null): string[] {
  if (!comunidad) return [];
  return PARTIDOS.filter(
    (p) => p.ambito === 'autonomico' && sePresentaEn(p, comunidad) && !partidosDelTest(comunidad).includes(p.id),
  ).map((p) => p.id);
}

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
