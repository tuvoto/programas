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

export type Postura = { valor: -2 | -1 | 1 | 2; pagina: number; motivo: string };

export type Afirmacion = {
  id: string;
  temaId: string;
  texto: string;
  posturas: Partial<Record<string, Postura>>;
};

export const PARTIDOS_TEST = ['psoe', 'pp', 'vox', 'frente-amplio'];

const P = (valor: Postura['valor'], pagina: number, motivo: string): Postura => ({ valor, pagina, motivo });

export const AFIRMACIONES: Afirmacion[] = [
  // Vivienda
  {
    id: 'limitar-alquiler',
    temaId: 'vivienda',
    texto: 'Aunque algunos propietarios dejen de alquilar sus pisos, el Estado debería poder poner un tope al precio del alquiler en las zonas más caras.',
    posturas: {
      psoe: P(2, 221, 'Desarrollar las medidas de contención de precios de la Ley de Vivienda.'),
      pp: P(-1, 33, 'Derogar la Ley de Vivienda, que permite limitar los alquileres.'),
      vox: P(-1, 43, 'Derogar la Ley de Vivienda de 2023.'),
      'frente-amplio': P(2, 77, 'Regular de forma más efectiva los precios del alquiler.'),
    },
  },
  {
    id: 'suelo-impuestos',
    temaId: 'vivienda',
    texto: 'La vivienda se abarata más liberando suelo y bajando impuestos que poniendo límites a los precios.',
    posturas: {
      psoe: P(-1, 221, 'Contener los precios con la Ley de Vivienda.'),
      pp: P(1, 32, 'Bonificar impuestos al comprar vivienda en el medio rural.'),
      vox: P(2, 40, 'Liberar suelo y quitar el IVA de la primera vivienda.'),
      'frente-amplio': P(-1, 77, 'Regular de forma más efectiva los precios del alquiler.'),
    },
  },
  {
    id: 'vivienda-publica',
    temaId: 'vivienda',
    texto: 'El dinero público para vivienda debería ir sobre todo a construir pisos públicos de alquiler, más que a ayudar a comprar.',
    posturas: {
      psoe: P(2, 130, 'Llegar a un 20 % de parque público de vivienda.'),
      pp: P(-1, 34, 'Avales públicos para comprar la primera vivienda.'),
      'frente-amplio': P(2, 76, 'Hacer crecer el parque de alquiler social y asequible.'),
    },
  },
  // Empleo y salarios
  {
    id: 'smi-automatico',
    temaId: 'empleo',
    texto: 'El salario mínimo debería fijarse por ley según el sueldo medio, sin depender de que lo pacten sindicatos y empresarios.',
    posturas: {
      psoe: P(2, 26, 'Fijar por ley que el salario mínimo sea el 60 % del salario medio.'),
      pp: P(-1, 19, 'Actualizarlo en el diálogo social con sindicatos y empresarios.'),
      'frente-amplio': P(2, 7, 'Subirlo cada año por encima del IPC.'),
    },
  },
  {
    id: 'cotizaciones',
    temaId: 'empleo',
    texto: 'Para crear empleo, hay que bajar lo que pagan empresas y autónomos a la Seguridad Social, aunque esta ingrese menos.',
    posturas: {
      pp: P(2, 20, 'Tarifa cero de cotización para nuevos autónomos el primer año.'),
      vox: P(2, 22, 'Bonificar las cotizaciones de los nuevos contratos indefinidos.'),
    },
  },
  {
    id: 'jornada',
    temaId: 'empleo',
    texto: 'La jornada laboral debería bajar por ley a 37,5 horas semanales, con el mismo sueldo, aunque a las empresas les cueste más.',
    posturas: {
      psoe: P(1, 50, 'Impulsar la reducción de jornada sin bajar el sueldo.'),
      'frente-amplio': P(2, 7, 'Jornada máxima de 37,5 horas por ley, sin bajar el sueldo.'),
    },
  },
  // Impuestos y economía
  {
    id: 'grandes-fortunas',
    temaId: 'impuestos',
    texto: 'Quien tiene un gran patrimonio debería pagar cada año un impuesto por lo que tiene, no solo por lo que gana.',
    posturas: {
      psoe: P(1, 39, 'Evaluar el impuesto temporal y debatir la tributación de la riqueza.'),
      pp: P(-2, 23, 'Eliminar el impuesto a las grandes fortunas.'),
      vox: P(-2, 77, 'Suprimir el impuesto de Patrimonio.'),
      'frente-amplio': P(2, 16, 'Un impuesto permanente a las grandes fortunas.'),
    },
  },
  {
    id: 'bajar-irpf',
    temaId: 'impuestos',
    texto: 'Prefiero pagar menos IRPF aunque eso suponga menos dinero para los servicios públicos.',
    posturas: {
      psoe: P(-1, 39, 'Defender los impuestos para sostener el Estado del bienestar.'),
      pp: P(2, 23, 'Bajada inmediata, ajustando el IRPF a la inflación.'),
      vox: P(2, 74, 'Dos tipos, del 15 % y del 25 %, con rebajas por hijo.'),
      'frente-amplio': P(-1, 17, 'Subir el tipo máximo al 52 % para rentas de más de 300.000 euros.'),
    },
  },
  {
    id: 'impuesto-empresas',
    temaId: 'impuestos',
    texto: 'Bajar el impuesto que pagan las empresas por sus beneficios trae más inversión y empleo, aunque se recaude menos.',
    posturas: {
      psoe: P(-1, 39, 'Evaluar la prórroga de los impuestos temporales a la banca y las energéticas.'),
      vox: P(2, 77, 'Bajar el impuesto de sociedades hasta el 15 %.'),
      'frente-amplio': P(-2, 16, 'Reformarlo para que las grandes empresas paguen más.'),
    },
  },
  {
    id: 'banca-energeticas',
    temaId: 'impuestos',
    texto: 'Los bancos y las eléctricas deberían seguir pagando un impuesto extra mientras tengan beneficios excepcionales.',
    posturas: {
      psoe: P(2, 39, 'Evaluar la prórroga de los gravámenes a la banca y las energéticas.'),
      'frente-amplio': P(2, 16, 'Mantener los impuestos extraordinarios a energéticas y financieras.'),
    },
  },
  {
    id: 'sucesiones',
    temaId: 'impuestos',
    texto: 'El impuesto sobre las herencias debería desaparecer en toda España.',
    posturas: {
      vox: P(2, 77, 'Suprimir el impuesto de Sucesiones y Donaciones.'),
      'frente-amplio': P(-2, 16, 'Un mínimo común en toda España que las comunidades no puedan rebajar.'),
    },
  },
  // Pensiones
  {
    id: 'pensiones-ipc',
    temaId: 'pensiones',
    texto: 'La subida de las pensiones con el IPC debería estar blindada en la Constitución, no depender de cada Gobierno.',
    posturas: {
      psoe: P(2, 170, 'Incluir en la Constitución que las pensiones suben con el IPC.'),
      pp: P(1, 19, 'Garantizar la revalorización de las pensiones en el Pacto de Toledo.'),
      'frente-amplio': P(1, 15, 'Mantener la subida de las pensiones con el IPC.'),
    },
  },
  {
    id: 'pensiones-bajas',
    temaId: 'pensiones',
    texto: 'Las pensiones más bajas deberían subir más que el resto, aunque se acorte la distancia con quien cotizó más.',
    posturas: {
      psoe: P(2, 170, 'Seguir subiendo las pensiones mínimas y no contributivas.'),
      'frente-amplio': P(2, 15, 'Subir más las mínimas y no contributivas.'),
    },
  },
  {
    id: 'planes-empresa',
    temaId: 'pensiones',
    texto: 'Además de la pensión pública, hay que impulsar que las empresas ofrezcan planes de pensiones a sus trabajadores.',
    posturas: {
      psoe: P(2, 25, 'Crear fondos de pensiones de empleo (segundo pilar).'),
    },
  },
  // Sanidad
  {
    id: 'sanidad-privada',
    temaId: 'sanidad',
    texto: 'Para bajar las listas de espera, la sanidad pública debería mandar más pacientes a clínicas privadas, pagadas con dinero público.',
    posturas: {
      vox: P(2, 57, 'Reforzar los conciertos con la sanidad privada.'),
      'frente-amplio': P(-1, 92, 'Pasar a la sanidad pública a quienes hoy se atienden por mutualidades.'),
    },
  },
  {
    id: 'sanidad-irregulares',
    temaId: 'sanidad',
    texto: 'La sanidad pública debería atender a los inmigrantes en situación irregular igual que a los demás, no solo en urgencias.',
    posturas: {
      vox: P(-2, 59, 'Para ellos, solo urgencias vitales y enfermedades infecciosas.'),
      'frente-amplio': P(2, 105, 'Acceso universal, incluidos los migrantes en situación irregular.'),
    },
  },
  {
    id: 'espera-maxima',
    temaId: 'sanidad',
    texto: 'Debería haber por ley un tiempo máximo de espera para operarse o ver al especialista en toda España.',
    posturas: {
      psoe: P(2, 201, '120 días para operaciones y 60 para el especialista.'),
      'frente-amplio': P(2, 89, 'Una ley de listas de espera con tiempos máximos.'),
    },
  },
  {
    id: 'eutanasia',
    temaId: 'sanidad',
    texto: 'La eutanasia debería seguir siendo un derecho que se puede pedir en la sanidad pública.',
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
    texto: 'La sanidad pública debería cubrir el dentista, aunque haya que dedicarle bastante más presupuesto.',
    posturas: {
      psoe: P(1, 183, 'Salud bucodental para niños y adolescentes.'),
      vox: P(2, 58, 'Incluir la salud bucodental y oftalmológica.'),
      'frente-amplio': P(2, 89, 'Incorporar la salud bucodental, la óptica y otras prestaciones.'),
    },
  },
  // Educación
  {
    id: 'cheque-escolar',
    temaId: 'educacion',
    texto: 'El Estado debería dar a cada familia un cheque para pagar el colegio que elija, sea público, concertado o privado.',
    posturas: {
      pp: P(1, 51, 'Defender la libertad de elegir centro.'),
      vox: P(2, 33, 'Cheque escolar para elegir centro.'),
      'frente-amplio': P(-2, 155, 'Que la concertada sea solo subsidiaria de la pública.'),
    },
  },
  {
    id: 'universidad-gratis',
    temaId: 'educacion',
    texto: 'La universidad pública debería ser gratis para todos, no solo para quien saca buenas notas o tiene beca.',
    posturas: {
      psoe: P(1, 116, 'Gratis para quien apruebe las asignaturas a la primera.'),
      'frente-amplio': P(2, 160, 'Bajar las tasas hasta la gratuidad.'),
    },
  },
  {
    id: 'examen-comun',
    temaId: 'educacion',
    texto: 'La selectividad debería ser un único examen igual en toda España, aunque las comunidades dejen de organizarla.',
    posturas: {
      pp: P(2, 52, 'Una EBAU común en toda España.'),
      vox: P(2, 32, 'Una prueba única de acceso en toda España.'),
    },
  },
  {
    id: 'religion',
    temaId: 'educacion',
    texto: 'La asignatura de Religión debería salir del horario de clase obligatorio.',
    posturas: {
      'frente-amplio': P(2, 156, 'Ninguna religión dentro del currículo ni del horario lectivo.'),
    },
  },
  // Inmigración
  {
    id: 'regularizacion',
    temaId: 'inmigracion',
    texto: 'Quien lleva años viviendo en España sin papeles debería tener una vía para regularizar su situación.',
    posturas: {
      pp: P(-1, 81, 'Agilizar el retorno de inmigrantes en situación irregular.'),
      vox: P(-2, 103, 'Suprimir el arraigo como vía de regularización.'),
      'frente-amplio': P(2, 104, 'Un procedimiento de regularización permanente.'),
    },
  },
  {
    id: 'control-fronteras',
    temaId: 'inmigracion',
    texto: 'Hay que endurecer el control de fronteras, aunque eso suponga devolver a más personas que llegan de forma irregular.',
    posturas: {
      pp: P(2, 81, 'Más personal y medios para el control de fronteras.'),
      vox: P(2, 102, 'Un bloqueo naval contra la llegada irregular de embarcaciones.'),
    },
  },
  {
    id: 'vias-legales',
    temaId: 'inmigracion',
    texto: 'España necesita más trabajadores de fuera y debería ponerles más fácil venir con un contrato.',
    posturas: {
      psoe: P(2, 256, 'Más vías de migración regular, con convenios de migración circular.'),
      'frente-amplio': P(1, 104, 'Reformar la ley de extranjería.'),
    },
  },
  {
    id: 'ayudas-residencia',
    temaId: 'inmigracion',
    texto: 'Las ayudas sociales deberían ser solo para quienes residen legalmente en España.',
    posturas: {
      vox: P(2, 100, 'Vincular las ayudas sociales a la residencia legal.'),
      'frente-amplio': P(-1, 105, 'Acceso universal a la sanidad, también en situación irregular.'),
    },
  },
  // Medio ambiente y energía
  {
    id: 'nucleares',
    temaId: 'medioambiente',
    texto: 'Habría que alargar la vida de las centrales nucleares en lugar de cerrarlas en los próximos años.',
    posturas: {
      pp: P(2, 38, 'Alargar su vida útil, con el visto bueno del CSN.'),
      vox: P(2, 117, 'Invertir en ellas y alargar su vida útil.'),
      'frente-amplio': P(-2, 48, 'Mantener el calendario de cierre.'),
    },
  },
  {
    id: 'clima',
    temaId: 'medioambiente',
    texto: 'España debería ir más rápido contra el cambio climático, aunque algunas cosas suban de precio.',
    posturas: {
      psoe: P(2, 88, 'Revisar siempre al alza los objetivos climáticos.'),
      vox: P(-2, 108, 'Derogar la Ley de Cambio Climático.'),
      'frente-amplio': P(2, 41, 'Más reducción de emisiones y más renovables en 2030.'),
    },
  },
  {
    id: 'combustion',
    temaId: 'medioambiente',
    texto: 'No debería prohibirse vender coches nuevos de gasolina y diésel a partir de 2035.',
    posturas: {
      vox: P(2, 50, 'Pedir en Europa que se suspenda la prohibición de 2035.'),
      'frente-amplio': P(-2, 11, 'Que en 2040 no circulen coches de combustión en España.'),
    },
  },
  {
    id: 'toros',
    temaId: 'medioambiente',
    texto: 'Las corridas de toros no deberían recibir dinero público.',
    posturas: {
      vox: P(-2, 151, 'Apoyar la tauromaquia con medidas fiscales y créditos.'),
      'frente-amplio': P(2, 56, 'Suprimir la financiación pública de los espectáculos taurinos.'),
    },
  },
  // Juventud
  {
    id: 'ayuda-alquiler-joven',
    temaId: 'juventud',
    texto: 'Los jóvenes deberían recibir cada mes una ayuda pública para pagar el alquiler.',
    posturas: {
      psoe: P(2, 131, 'Mantener y ampliar el Bono Alquiler Joven.'),
      'frente-amplio': P(2, 78, 'Más ayudas al alquiler y mejorar el bono joven.'),
    },
  },
  {
    id: 'aval-hipoteca',
    temaId: 'juventud',
    texto: 'El Estado debería avalar parte de la hipoteca de los jóvenes para que puedan comprar sin tener ahorrada la entrada.',
    posturas: {
      psoe: P(1, 226, 'Cuenta de ahorro sin IRPF para comprar la primera vivienda.'),
      pp: P(2, 34, 'Avales públicos para hipotecas de hasta el 95 % del precio.'),
    },
  },
  {
    id: 'edad-redes',
    temaId: 'juventud',
    texto: 'Las redes sociales deberían comprobar de verdad la edad, aunque haya que identificarse para usarlas.',
    posturas: {
      pp: P(2, 54, 'Verificación de edad eficaz para redes sociales.'),
      vox: P(1, 94, 'Proteger a los menores en internet.'),
    },
  },
  {
    id: 'voto-16',
    temaId: 'juventud',
    texto: 'Los jóvenes de 16 y 17 años deberían poder votar en las elecciones generales.',
    posturas: {
      'frente-amplio': P(2, 102, 'Derecho a votar desde los 16 años.'),
    },
  },
  {
    id: 'herencia-universal',
    temaId: 'juventud',
    texto: 'Cada joven debería recibir del Estado un dinero para empezar (por ejemplo, 20.000 €), pagado con impuestos a las grandes fortunas.',
    posturas: {
      'frente-amplio': P(2, 15, 'Una «herencia universal» de 20.000 € a los 23 años.'),
    },
  },
  // Igualdad
  {
    id: 'violencia-genero',
    temaId: 'igualdad',
    texto: 'La violencia contra las mujeres necesita leyes propias, distintas de las de la violencia en la familia en general.',
    posturas: {
      psoe: P(2, 152, 'Renovar el Pacto de Estado contra la Violencia de Género.'),
      pp: P(1, 62, 'Cumplir y actualizar el Pacto de Estado.'),
      vox: P(-2, 10, 'Derogar la Ley Integral de Violencia de Género.'),
      'frente-amplio': P(2, 111, 'Blindar el Pacto de Estado y su financiación.'),
    },
  },
  {
    id: 'planes-igualdad',
    temaId: 'igualdad',
    texto: 'No debería obligarse a las empresas a tener planes de igualdad entre hombres y mujeres.',
    posturas: {
      psoe: P(-1, 140, 'Más inspecciones y sanciones contra la brecha salarial.'),
      pp: P(-1, 21, 'Planes de igualdad con objetivos evaluables.'),
      vox: P(2, 10, 'Eliminar las cuotas y los planes de igualdad.'),
      'frente-amplio': P(-2, 108, 'Ampliar los planes de igualdad en las empresas.'),
    },
  },
  {
    id: 'trans',
    temaId: 'igualdad',
    texto: 'Las personas trans deberían poder cambiar su sexo en el registro sin informes médicos.',
    posturas: {
      vox: P(-2, 11, 'Derogar la ley trans.'),
      'frente-amplio': P(2, 116, 'Defender la autodeterminación de las personas trans.'),
    },
  },
  {
    id: 'aborto',
    temaId: 'igualdad',
    texto: 'El aborto debería poder hacerse en cualquier hospital público, no solo en clínicas privadas concertadas.',
    posturas: {
      vox: P(-2, 58, 'Retirar el aborto de la sanidad pública.'),
      'frente-amplio': P(2, 111, 'Garantizarlo en la sanidad pública en todo el territorio.'),
    },
  },
  {
    id: 'custodia',
    temaId: 'igualdad',
    texto: 'Tras un divorcio, la custodia compartida de los hijos debería ser la opción por defecto.',
    posturas: {
      vox: P(2, 165, 'Custodia compartida como regla general.'),
    },
  },
  // Modelo territorial
  {
    id: 'competencias',
    temaId: 'territorial',
    texto: 'La sanidad y la educación deberían volver a gestionarse desde el Estado, aunque las comunidades pierdan autogobierno.',
    posturas: {
      vox: P(2, 8, 'Devolver al Estado educación, sanidad, seguridad y justicia.'),
      'frente-amplio': P(-1, 120, 'Un pacto territorial que reconozca la plurinacionalidad.'),
    },
  },
  {
    id: 'referendum',
    temaId: 'territorial',
    texto: 'Convocar un referéndum de independencia sin autorización debería ser delito.',
    posturas: {
      pp: P(2, 72, 'Castigar la convocatoria de referendos no autorizados.'),
      vox: P(1, 126, 'Recuperar el delito de sedición.'),
    },
  },
  {
    id: 'una-nacion',
    temaId: 'territorial',
    texto: 'España es una sola nación y no debería reconocerse como un país de varias naciones.',
    posturas: {
      vox: P(2, 8, 'Pasar a un Estado unitario.'),
      'frente-amplio': P(-2, 120, 'Reconocer a España como realidad plurinacional.'),
    },
  },
  {
    id: 'menos-parlamentos',
    temaId: 'territorial',
    texto: 'Sobran cargos y parlamentos autonómicos: habría que reducirlos aunque las comunidades tengan menos voz.',
    posturas: {
      vox: P(2, 26, 'Reducir ministerios, consejerías, diputados y parlamentos.'),
    },
  },
  // Política exterior y defensa
  {
    id: 'defensa',
    temaId: 'exterior',
    texto: 'España debería gastar bastante más en defensa, aunque haya que recortar en otras partidas.',
    posturas: {
      psoe: P(1, 270, 'Aumentar el presupuesto de Defensa.'),
      pp: P(2, 103, 'Dedicar el 2 % del PIB a seguridad y defensa.'),
      vox: P(2, 93, 'Aumentar la inversión en Defensa.'),
    },
  },
  {
    id: 'ucrania',
    temaId: 'exterior',
    texto: 'España debería seguir enviando ayuda, también militar, a Ucrania frente a la invasión rusa.',
    posturas: {
      psoe: P(2, 259, 'Seguir apoyando a Ucrania.'),
      pp: P(2, 101, 'Mantener la ayuda militar, económica y humanitaria.'),
      'frente-amplio': P(1, 141, 'Solidaridad con Ucrania, reforzando la vía diplomática.'),
    },
  },
  {
    id: 'ayuda-desarrollo',
    temaId: 'exterior',
    texto: 'España debería dedicar el 0,7 % de su riqueza a ayudar a países pobres, aunque también haya necesidades aquí.',
    posturas: {
      psoe: P(2, 261, 'Avanzar hacia el 0,7 % de la renta nacional.'),
      vox: P(-1, 143, 'Revisar la cooperación al desarrollo.'),
      'frente-amplio': P(2, 148, 'Alcanzar el 0,7 % de la renta nacional.'),
    },
  },
  {
    id: 'otan',
    temaId: 'exterior',
    texto: 'Europa debería depender menos de la OTAN y de Estados Unidos y tener su propia defensa.',
    posturas: {
      psoe: P(-1, 264, 'Seguir trabajando dentro de la OTAN.'),
      'frente-amplio': P(2, 139, 'Pasar de las garantías de la OTAN a una autonomía estratégica europea.'),
    },
  },
  {
    id: 'sahara',
    temaId: 'exterior',
    texto: 'España debería defender que el pueblo saharaui decida en referéndum su futuro, aunque eso tense la relación con Marruecos.',
    posturas: {
      psoe: P(-1, 265, 'Apoyar una solución «mutuamente aceptable» en el marco de la ONU.'),
      pp: P(-1, 101, 'Una solución política «aceptable para las partes».'),
      'frente-amplio': P(2, 141, 'Apoyar la libre determinación del Sáhara Occidental.'),
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
export function calcular(respuestas: Respuestas, temasImportantes: string[] = []): Resultado[] {
  return PARTIDOS_TEST.map((id) => {
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
