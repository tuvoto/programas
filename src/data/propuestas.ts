// Propuestas extraídas de los programas electorales oficiales.
//
// Cada propuesta indica de qué programa sale (`edicion`):
//   - 2026: programa para el 29-N (cuando los partidos lo publiquen)
//   - 2023: programa de las elecciones del 23 de julio de 2023, que se
//           muestra mientras tanto, siempre marcado como "Programa de 2023"
//
// En cuanto un partido tenga alguna propuesta de 2026, la app deja de mostrar
// sus propuestas de 2023 automáticamente. No hace falta borrarlas.
//
// Ejemplo de formato (NO es una propuesta real):
//
//   {
//     partidoId: 'psoe',
//     temaId: 'vivienda',
//     edicion: 2026,
//     resumen: 'Resumen breve y neutral de la medida, en tus palabras.',
//     pagina: 42,
//   },
//
// Consejos para mantener la app neutral:
//   - Resume con el mismo nivel de detalle para todos los partidos.
//   - Usa las palabras del programa solo para datos concretos (cifras,
//     plazos); el resto, parafraseado.
//   - No añadas valoraciones ("buena", "irrealizable"...).

export type Edicion = 2023 | 2026;

export type Propuesta = {
  partidoId: string;
  temaId: string;
  edicion: Edicion;
  resumen: string;
  pagina?: number;
};

export const PROPUESTAS: Propuesta[] = [
  // ===== Programas de las elecciones del 23-J de 2023 =====
  // PSOE: «Programa electoral. Elecciones generales 23 julio 2023»
  // PP: «Un proyecto al servicio de un gran país. 365 medidas»
  // Sumar (bloque Frente Amplio): «Un programa para ti»
  // Vox: «Programa electoral para las Elecciones Generales del 23J de 2023»
  // `pagina` = página del archivo PDF (la que muestra el visor).

  // --- vivienda ---
  { partidoId: 'psoe', temaId: 'vivienda', edicion: 2023, pagina: 222, resumen: 'Aumentar el parque de vivienda pública en alquiler hasta alcanzar el 20 % del total en los próximos años, mediante compra, alquiler y nueva construcción.' },
  { partidoId: 'psoe', temaId: 'vivienda', edicion: 2023, pagina: 225, resumen: 'Rehabilitar más de 500.000 viviendas durante la legislatura, con mejoras de eficiencia energética y accesibilidad.' },
  { partidoId: 'psoe', temaId: 'vivienda', edicion: 2023, pagina: 221, resumen: 'Desarrollar las medidas de contención de los precios de la vivienda previstas en la Ley de Vivienda de 2023.' },
  { partidoId: 'pp', temaId: 'vivienda', edicion: 2023, pagina: 33, resumen: 'Proponer un pacto de Estado sobre vivienda con comunidades autónomas y ayuntamientos, y derogar la Ley de Vivienda.' },
  { partidoId: 'pp', temaId: 'vivienda', edicion: 2023, pagina: 34, resumen: 'Movilizar suelo público para promover vivienda en alquiler asequible.' },
  { partidoId: 'pp', temaId: 'vivienda', edicion: 2023, pagina: 82, resumen: 'Aprobar medidas «anti-okupación»: desalojos en un plazo máximo de 24 horas e impedir que quien ocupa ilegalmente pueda empadronarse en la vivienda.' },
  { partidoId: 'frente-amplio', temaId: 'vivienda', edicion: 2023, pagina: 77, resumen: 'Limitar el alquiler turístico, el de habitaciones y el de temporada para que no se use para esquivar la Ley de Vivienda.' },
  { partidoId: 'frente-amplio', temaId: 'vivienda', edicion: 2023, pagina: 77, resumen: 'Alargar la duración mínima de los contratos de alquiler, con tendencia a que sean indefinidos salvo causas excepcionales.' },
  { partidoId: 'frente-amplio', temaId: 'vivienda', edicion: 2023, pagina: 77, resumen: 'Reformar la Ley de Vivienda para incluir alquiler social obligatorio para grandes tenedores, dación en pago y regulación efectiva de los precios del alquiler.' },

  // --- empleo ---
  { partidoId: 'psoe', temaId: 'empleo', edicion: 2023, pagina: 26, resumen: 'Fijar en el Estatuto de los Trabajadores que el salario mínimo se ajuste al 60 % del salario medio.' },
  { partidoId: 'psoe', temaId: 'empleo', edicion: 2023, pagina: 25, resumen: 'Acordar con sindicatos y empresarios un Pacto por el Pleno Empleo para bajar el paro estructural al 8 %, en línea con la media europea.' },
  { partidoId: 'psoe', temaId: 'empleo', edicion: 2023, pagina: 143, resumen: 'Plan nacional de trabajo flexible: jornadas híbridas, horarios más adaptables y posibilidad de concentrar la semana laboral en cuatro días.' },
  { partidoId: 'pp', temaId: 'empleo', edicion: 2023, pagina: 19, resumen: 'Reformar las políticas activas de empleo, con más libertad del desempleado para elegir formación y orientación laboral personalizada.' },
  { partidoId: 'pp', temaId: 'empleo', edicion: 2023, pagina: 19, resumen: 'Actualizar el salario mínimo en el marco del diálogo social con sindicatos, empresarios y expertos.' },
  { partidoId: 'pp', temaId: 'empleo', edicion: 2023, pagina: 20, resumen: 'Tarifa cero de cotización para nuevos autónomos durante el primer año y aplazamiento automático de cuotas.' },
  { partidoId: 'frente-amplio', temaId: 'empleo', edicion: 2023, pagina: 7, resumen: 'Jornada laboral máxima de 37,5 horas por ley en 2024 y diálogo social para seguir reduciéndola hasta 32 horas, sin bajar el salario.' },
  { partidoId: 'frente-amplio', temaId: 'empleo', edicion: 2023, pagina: 7, resumen: 'Subir el salario mínimo cada año por encima del IPC.' },
  { partidoId: 'frente-amplio', temaId: 'empleo', edicion: 2023, pagina: 27, resumen: 'Reforzar la protección frente al despido: derecho a elegir readmisión o indemnización e indemnización adicional según el daño causado.' },

  // --- sanidad ---
  { partidoId: 'psoe', temaId: 'sanidad', edicion: 2023, pagina: 201, resumen: 'Fijar por ley tiempos máximos de espera: 120 días para operaciones, 60 para consultas con el especialista y 30 para pruebas.' },
  { partidoId: 'psoe', temaId: 'sanidad', edicion: 2023, pagina: 203, resumen: 'Tiempo máximo de espera en salud mental, con un máximo de 15 días para menores de 21 años.' },
  { partidoId: 'psoe', temaId: 'sanidad', edicion: 2023, pagina: 204, resumen: 'Incorporar progresivamente empastes e implantes dentales a la sanidad pública, empezando por mayores de 75 años.' },
  { partidoId: 'pp', temaId: 'sanidad', edicion: 2023, pagina: 45, resumen: 'Plan de choque en atención primaria, con 1.000 plazas más de formación en medicina familiar e incentivos para cubrir puestos.' },
  { partidoId: 'pp', temaId: 'sanidad', edicion: 2023, pagina: 46, resumen: 'Retener y atraer talento sanitario reduciendo la temporalidad y agilizando la convalidación de títulos extranjeros.' },
  { partidoId: 'pp', temaId: 'sanidad', edicion: 2023, pagina: 46, resumen: 'Aprobar una nueva Ley General de Sanidad que actualice el funcionamiento del sistema nacional de salud.' },
  { partidoId: 'frente-amplio', temaId: 'sanidad', edicion: 2023, pagina: 89, resumen: 'Añadir a la sanidad pública salud bucodental, óptica, audífonos, psicoterapia y fisioterapia, y aprobar una ley de listas de espera con tiempos máximos.' },
  { partidoId: 'frente-amplio', temaId: 'sanidad', edicion: 2023, pagina: 90, resumen: 'Plan de choque para la atención primaria con financiación directa a las comunidades autónomas para más personal y material.' },
  { partidoId: 'frente-amplio', temaId: 'sanidad', edicion: 2023, pagina: 92, resumen: 'Integrar en la sanidad pública a quienes hoy reciben asistencia a través de mutualidades como MUFACE, MUGEJU o ISFAS.' },

  // --- educacion ---
  { partidoId: 'psoe', temaId: 'educacion', edicion: 2023, pagina: 116, resumen: 'Universidad y FP superior gratuitas para quienes aprueben las asignaturas a la primera, y más becas.' },
  { partidoId: 'psoe', temaId: 'educacion', edicion: 2023, pagina: 103, resumen: 'Universalizar la escolarización de 0 a 18 años con más plazas públicas gratuitas de 0 a 3 años y de FP, sin hacerla obligatoria.' },
  { partidoId: 'psoe', temaId: 'educacion', edicion: 2023, pagina: 105, resumen: 'Bajar el número de alumnos por aula en los centros que presenten un proyecto de mejora.' },
  { partidoId: 'pp', temaId: 'educacion', edicion: 2023, pagina: 50, resumen: 'Reformar la LOMLOE (ley Celaá) y buscar un acuerdo educativo con familias, docentes y partidos.' },
  { partidoId: 'pp', temaId: 'educacion', edicion: 2023, pagina: 50, resumen: 'Educación de 0 a 3 años universal y gratuita, cofinanciada por el Estado y las comunidades autónomas.' },
  { partidoId: 'pp', temaId: 'educacion', edicion: 2023, pagina: 52, resumen: 'Una prueba de acceso a la universidad (EBAU) común en toda España.' },
  { partidoId: 'frente-amplio', temaId: 'educacion', edicion: 2023, pagina: 154, resumen: 'Llevar el gasto en educación al 5 % del PIB de inmediato y avanzar hacia el 7 %, garantizado por una ley de financiación.' },
  { partidoId: 'frente-amplio', temaId: 'educacion', edicion: 2023, pagina: 155, resumen: 'Comedores escolares gratuitos en los centros públicos durante toda la etapa obligatoria.' },
  { partidoId: 'frente-amplio', temaId: 'educacion', edicion: 2023, pagina: 160, resumen: 'Bajar las tasas universitarias hasta la gratuidad, empezando por el primer curso de los grados.' },

  // --- impuestos ---
  { partidoId: 'psoe', temaId: 'impuestos', edicion: 2023, pagina: 38, resumen: 'Reforma fiscal orientada a las familias, con más deducciones por hijo y por dependencia en el IRPF.' },
  { partidoId: 'psoe', temaId: 'impuestos', edicion: 2023, pagina: 38, resumen: 'Pacto de Estado contra el fraude fiscal y refuerzo de la Agencia Tributaria.' },
  { partidoId: 'psoe', temaId: 'impuestos', edicion: 2023, pagina: 39, resumen: 'Evaluar la prórroga de los impuestos temporales a la banca y a las energéticas.' },
  { partidoId: 'pp', temaId: 'impuestos', edicion: 2023, pagina: 23, resumen: 'Bajada inmediata de impuestos a las familias: ajustar el IRPF a la inflación y bajar temporalmente el IVA de la carne, el pescado y las conservas.' },
  { partidoId: 'pp', temaId: 'impuestos', edicion: 2023, pagina: 23, resumen: 'Reforma fiscal integral que elimine el impuesto a las grandes fortunas y simplifique el IRPF y el impuesto de sociedades de las pymes.' },
  { partidoId: 'pp', temaId: 'impuestos', edicion: 2023, pagina: 23, resumen: 'Estatuto del Contribuyente, con un «derecho al error» para quien tenga un historial de cumplimiento.' },
  { partidoId: 'frente-amplio', temaId: 'impuestos', edicion: 2023, pagina: 16, resumen: 'Impuesto permanente a las grandes fortunas, con tipos de al menos el 4 % para los patrimonios más altos.' },
  { partidoId: 'frente-amplio', temaId: 'impuestos', edicion: 2023, pagina: 17, resumen: 'Subir el tipo máximo del IRPF hasta el 52 % para rentas de más de 300.000 euros.' },
  { partidoId: 'frente-amplio', temaId: 'impuestos', edicion: 2023, pagina: 16, resumen: 'Mantener los impuestos extraordinarios a energéticas y entidades financieras hasta reformar el impuesto de sociedades.' },

  // --- pensiones ---
  { partidoId: 'psoe', temaId: 'pensiones', edicion: 2023, pagina: 170, resumen: 'Incluir en la Constitución la garantía de que las pensiones suben con el IPC.' },
  { partidoId: 'psoe', temaId: 'pensiones', edicion: 2023, pagina: 171, resumen: 'Subir un 10 % adicional en 2026-2027 el complemento que reduce la brecha de género en las pensiones.' },
  { partidoId: 'psoe', temaId: 'pensiones', edicion: 2023, pagina: 171, resumen: 'Reconocer un año cotizado a cada progenitor por cada hijo nacido o adoptado.' },
  { partidoId: 'pp', temaId: 'pensiones', edicion: 2023, pagina: 19, resumen: 'Garantizar la revalorización de las pensiones en el marco del Pacto de Toledo e impulsar la contributividad del sistema.' },
  { partidoId: 'frente-amplio', temaId: 'pensiones', edicion: 2023, pagina: 15, resumen: 'Mantener la subida de las pensiones con el IPC y subir más las mínimas y no contributivas hasta alcanzar el umbral de la pobreza.' },
  { partidoId: 'frente-amplio', temaId: 'pensiones', edicion: 2023, pagina: 108, resumen: 'Reforzar el complemento contra la brecha de género y subir las pensiones de viudedad de mujeres sin cotizaciones propias.' },
  { partidoId: 'frente-amplio', temaId: 'pensiones', edicion: 2023, pagina: 97, resumen: 'Complementar las pensiones más bajas para garantizar unos ingresos mínimos suficientes a las personas mayores.' },

  // --- inmigracion ---
  { partidoId: 'psoe', temaId: 'inmigracion', edicion: 2023, pagina: 255, resumen: 'Ampliar la capacidad del sistema de acogida y reforzar su gestión pública.' },
  { partidoId: 'psoe', temaId: 'inmigracion', edicion: 2023, pagina: 256, resumen: 'Más vías de migración regular y ordenada, con convenios de migración circular.' },
  { partidoId: 'psoe', temaId: 'inmigracion', edicion: 2023, pagina: 256, resumen: 'Simplificar los trámites y cambiar el modelo de las oficinas de extranjería.' },
  { partidoId: 'pp', temaId: 'inmigracion', edicion: 2023, pagina: 81, resumen: 'Reforzar el control de fronteras con más personal y medios, y coordinación con Frontex.' },
  { partidoId: 'pp', temaId: 'inmigracion', edicion: 2023, pagina: 81, resumen: 'Agilizar el retorno de inmigrantes en situación irregular y la expulsión de quienes hayan cometido delitos, con acuerdos con los países de origen.' },
  { partidoId: 'pp', temaId: 'inmigracion', edicion: 2023, pagina: 99, resumen: 'Apoyar una política europea común de migración y asilo para las crisis migratorias en el Mediterráneo.' },
  { partidoId: 'frente-amplio', temaId: 'inmigracion', edicion: 2023, pagina: 104, resumen: 'Reformar la ley de extranjería e introducir un procedimiento de regularización permanente.' },
  { partidoId: 'frente-amplio', temaId: 'inmigracion', edicion: 2023, pagina: 105, resumen: 'Cerrar los centros de internamiento de extranjeros (CIE).' },
  { partidoId: 'frente-amplio', temaId: 'inmigracion', edicion: 2023, pagina: 104, resumen: 'Aprobar una ley integral contra el racismo.' },

  // --- medioambiente ---
  { partidoId: 'psoe', temaId: 'medioambiente', edicion: 2023, pagina: 74, resumen: 'Una ley para señalar, con comunidades y ayuntamientos, las zonas adecuadas para instalar renovables y que sus beneficios lleguen a la población local.' },
  { partidoId: 'psoe', temaId: 'medioambiente', edicion: 2023, pagina: 88, resumen: 'Revisar siempre al alza los objetivos climáticos de la Ley de Cambio Climático y del Plan Nacional de Energía y Clima.' },
  { partidoId: 'psoe', temaId: 'medioambiente', edicion: 2023, pagina: 74, resumen: 'Impulsar las comunidades energéticas y el autoconsumo, especialmente el colectivo.' },
  { partidoId: 'pp', temaId: 'medioambiente', edicion: 2023, pagina: 37, resumen: 'Pacto Nacional del Agua con todas las comunidades autónomas y una nueva ley del Plan Hidrológico Nacional.' },
  { partidoId: 'pp', temaId: 'medioambiente', edicion: 2023, pagina: 38, resumen: 'Alargar la vida útil de las centrales nucleares, con el visto bueno del Consejo de Seguridad Nuclear.' },
  { partidoId: 'pp', temaId: 'medioambiente', edicion: 2023, pagina: 26, resumen: 'Impulsar la Estrategia Española de Economía Circular 2030.' },
  { partidoId: 'frente-amplio', temaId: 'medioambiente', edicion: 2023, pagina: 41, resumen: 'Hacer más ambiciosa la Ley de Cambio Climático: 55 % menos emisiones y 90 % de electricidad renovable en 2030, y emisiones netas cero en 2040.' },
  { partidoId: 'frente-amplio', temaId: 'medioambiente', edicion: 2023, pagina: 48, resumen: 'Mantener el calendario de cierre de las centrales nucleares y una moratoria a nuevos proyectos nucleares.' },
  { partidoId: 'frente-amplio', temaId: 'medioambiente', edicion: 2023, pagina: 41, resumen: 'Limitar los vuelos en trayectos que se pueden hacer fácilmente en tren y potenciar el tren nocturno.' },

  // --- juventud ---
  { partidoId: 'psoe', temaId: 'juventud', edicion: 2023, pagina: 128, resumen: 'Aprobar el Estatuto del Becario, pactado con sindicatos y empresarios.' },
  { partidoId: 'psoe', temaId: 'juventud', edicion: 2023, pagina: 131, resumen: 'Transporte público urbano gratis para niños y estudiantes de hasta 24 años.' },
  { partidoId: 'psoe', temaId: 'juventud', edicion: 2023, pagina: 131, resumen: 'Mantener a largo plazo el Bono Alquiler Joven y ampliarlo para llegar a toda la población joven.' },
  { partidoId: 'pp', temaId: 'juventud', edicion: 2023, pagina: 34, resumen: 'Avales públicos para que jóvenes de hasta 35 años puedan conseguir hipotecas de hasta el 95 % del precio de la vivienda.' },
  { partidoId: 'pp', temaId: 'juventud', edicion: 2023, pagina: 19, resumen: 'Adaptar el contrato de formación para facilitar el primer empleo de jóvenes sin experiencia.' },
  { partidoId: 'pp', temaId: 'juventud', edicion: 2023, pagina: 20, resumen: 'Más formación y empleo juvenil en el trabajo autónomo, con una FP específica para autónomos.' },
  { partidoId: 'frente-amplio', temaId: 'juventud', edicion: 2023, pagina: 15, resumen: '«Herencia universal» de 20.000 euros al cumplir 23 años, financiada con un impuesto a las grandes fortunas.' },
  { partidoId: 'frente-amplio', temaId: 'juventud', edicion: 2023, pagina: 102, resumen: 'Derecho a votar desde los 16 años.' },
  { partidoId: 'frente-amplio', temaId: 'juventud', edicion: 2023, pagina: 103, resumen: 'Plan de emancipación juvenil con medidas urgentes para facilitar el acceso a la vivienda de los jóvenes.' },

  // --- igualdad ---
  { partidoId: 'psoe', temaId: 'igualdad', edicion: 2023, pagina: 140, resumen: 'Más transparencia salarial, inspecciones y sanciones para eliminar la brecha salarial entre hombres y mujeres.' },
  { partidoId: 'psoe', temaId: 'igualdad', edicion: 2023, pagina: 146, resumen: 'Ley de paridad en órganos de decisión: listas electorales «cremallera» y presencia equilibrada en gobiernos y empresas.' },
  { partidoId: 'psoe', temaId: 'igualdad', edicion: 2023, pagina: 158, resumen: 'Abolir la prostitución con una ley que prohíba el proxenetismo en todas sus formas.' },
  { partidoId: 'pp', temaId: 'igualdad', edicion: 2023, pagina: 21, resumen: 'Planes de igualdad con objetivos evaluables contra la brecha salarial y para más mujeres en puestos directivos.' },
  { partidoId: 'pp', temaId: 'igualdad', edicion: 2023, pagina: 62, resumen: 'Cumplir y actualizar el Pacto de Estado contra la Violencia de Género.' },
  { partidoId: 'pp', temaId: 'igualdad', edicion: 2023, pagina: 64, resumen: 'Una nueva ley sobre los derechos de las personas transexuales, buscando el consenso.' },
  { partidoId: 'frente-amplio', temaId: 'igualdad', edicion: 2023, pagina: 108, resumen: 'Ampliar los planes de igualdad en las empresas y aumentar las inspecciones para reducir la brecha salarial.' },
  { partidoId: 'frente-amplio', temaId: 'igualdad', edicion: 2023, pagina: 111, resumen: 'Blindar el Pacto de Estado contra la Violencia de Género y asegurar su financiación estable.' },
  { partidoId: 'frente-amplio', temaId: 'igualdad', edicion: 2023, pagina: 116, resumen: 'Defender la autodeterminación de las personas trans, intersex y no binarias.' },

  // --- territorial ---
  { partidoId: 'psoe', temaId: 'territorial', edicion: 2023, pagina: 234, resumen: 'Aprobar en un año como máximo un nuevo sistema de financiación autonómica.' },
  { partidoId: 'psoe', temaId: 'territorial', edicion: 2023, pagina: 231, resumen: 'Ley de Cohesión Territorial para mejorar la cooperación entre administraciones en servicios esenciales.' },
  { partidoId: 'psoe', temaId: 'territorial', edicion: 2023, pagina: 231, resumen: 'Seguir repartiendo por el territorio las sedes de organismos públicos estatales y autonómicos, mediante procedimientos abiertos.' },
  { partidoId: 'pp', temaId: 'territorial', edicion: 2023, pagina: 72, resumen: 'Recuperar el delito de sedición y castigar la convocatoria de referendos o consultas no autorizadas.' },
  { partidoId: 'pp', temaId: 'territorial', edicion: 2023, pagina: 79, resumen: 'Reformar la financiación autonómica, negociada con todas las comunidades autónomas.' },
  { partidoId: 'pp', temaId: 'territorial', edicion: 2023, pagina: 79, resumen: 'Delimitar mejor las competencias de cada administración para evitar duplicidades.' },
  { partidoId: 'frente-amplio', temaId: 'territorial', edicion: 2023, pagina: 120, resumen: 'Un nuevo pacto territorial que reconozca a España como realidad plurinacional.' },
  { partidoId: 'frente-amplio', temaId: 'territorial', edicion: 2023, pagina: 121, resumen: 'Nuevo modelo de financiación autonómica con un «suelo fiscal» para garantizar los servicios públicos.' },
  { partidoId: 'frente-amplio', temaId: 'territorial', edicion: 2023, pagina: 121, resumen: 'Mantener una mesa de diálogo entre el Gobierno y la Generalitat de Cataluña.' },

  // --- exterior ---
  { partidoId: 'psoe', temaId: 'exterior', edicion: 2023, pagina: 259, resumen: 'Seguir apoyando a Ucrania y su camino hacia la Unión Europea.' },
  { partidoId: 'psoe', temaId: 'exterior', edicion: 2023, pagina: 261, resumen: 'Avanzar hacia el 0,7 % de la renta nacional en ayuda al desarrollo en 2030.' },
  { partidoId: 'psoe', temaId: 'exterior', edicion: 2023, pagina: 270, resumen: 'Aumentar el presupuesto de Defensa según los compromisos internacionales de España.' },
  { partidoId: 'pp', temaId: 'exterior', edicion: 2023, pagina: 101, resumen: 'Mantener las sanciones a Rusia y la ayuda militar, económica y humanitaria a Ucrania.' },
  { partidoId: 'pp', temaId: 'exterior', edicion: 2023, pagina: 103, resumen: 'Cumplir el compromiso con la OTAN de dedicar el 2 % del PIB a seguridad y defensa.' },
  { partidoId: 'pp', temaId: 'exterior', edicion: 2023, pagina: 102, resumen: 'Retomar con el Reino Unido el diálogo sobre la soberanía de Gibraltar.' },
  { partidoId: 'frente-amplio', temaId: 'exterior', edicion: 2023, pagina: 141, resumen: 'Solidaridad con Ucrania, reforzando la vía diplomática y una reconstrucción basada en ayudas y no en préstamos.' },
  { partidoId: 'frente-amplio', temaId: 'exterior', edicion: 2023, pagina: 141, resumen: 'Revertir el cambio de posición de 2022 sobre el Sáhara Occidental y apoyar su autodeterminación.' },
  { partidoId: 'frente-amplio', temaId: 'exterior', edicion: 2023, pagina: 148, resumen: 'Alcanzar el 0,7 % de la renta nacional en ayuda al desarrollo, con al menos el 0,55 % al final de la legislatura.' },
  // ===== Vox: «Programa electoral para las Elecciones Generales del 23J de 2023» =====
  { partidoId: 'vox', temaId: 'vivienda', edicion: 2023, pagina: 40, resumen: 'Eliminar el IVA en la compra de la primera vivienda habitual.' },
  { partidoId: 'vox', temaId: 'vivienda', edicion: 2023, pagina: 40, resumen: 'Recuperar la deducción por vivienda habitual en la declaración de la renta.' },
  { partidoId: 'vox', temaId: 'vivienda', edicion: 2023, pagina: 43, resumen: 'Derogar la Ley de Vivienda de 2023.' },
  { partidoId: 'vox', temaId: 'empleo', edicion: 2023, pagina: 22, resumen: 'Bonificar al 100 % durante el primer año, y al 50 % el segundo, las cotizaciones por los nuevos contratos indefinidos de trabajadores españoles.' },
  { partidoId: 'vox', temaId: 'empleo', edicion: 2023, pagina: 23, resumen: 'Eximir de la cuota a los autónomos que ingresen menos del salario mínimo y bonificarla por completo durante la baja.' },
  { partidoId: 'vox', temaId: 'empleo', edicion: 2023, pagina: 24, resumen: 'Un marco legal para el teletrabajo que ayude a conciliar y a vivir fuera de las grandes ciudades.' },
  { partidoId: 'vox', temaId: 'sanidad', edicion: 2023, pagina: 57, resumen: 'Reducir las listas de espera incentivando a los centros públicos y reforzando los conciertos con la sanidad privada.' },
  { partidoId: 'vox', temaId: 'sanidad', edicion: 2023, pagina: 58, resumen: 'Incluir la salud bucodental y oftalmológica en la sanidad pública, y retirar de ella el cambio de sexo, el aborto y la eutanasia.' },
  { partidoId: 'vox', temaId: 'sanidad', edicion: 2023, pagina: 59, resumen: 'Dar preferencia sanitaria a españoles y residentes legales; a inmigrantes en situación irregular, solo urgencias vitales y enfermedades infecciosas.' },
  { partidoId: 'vox', temaId: 'educacion', edicion: 2023, pagina: 32, resumen: 'Devolver al Estado las competencias de educación.' },
  { partidoId: 'vox', temaId: 'educacion', edicion: 2023, pagina: 32, resumen: 'Una prueba única de acceso a la universidad en toda España y exámenes nacionales en distintas etapas.' },
  { partidoId: 'vox', temaId: 'educacion', edicion: 2023, pagina: 33, resumen: 'Cheque escolar para que las familias elijan libremente centro educativo.' },
  { partidoId: 'vox', temaId: 'impuestos', edicion: 2023, pagina: 74, resumen: 'IRPF con dos tipos: 15 % hasta 70.000 euros y 25 % por encima, cuatro puntos menos por cada hijo.' },
  { partidoId: 'vox', temaId: 'impuestos', edicion: 2023, pagina: 77, resumen: 'Bajar el impuesto de sociedades hasta el 15 % a lo largo de la legislatura.' },
  { partidoId: 'vox', temaId: 'impuestos', edicion: 2023, pagina: 77, resumen: 'Suprimir los impuestos de Patrimonio, Sucesiones y Donaciones y la plusvalía municipal en toda España.' },
  { partidoId: 'vox', temaId: 'pensiones', edicion: 2023, pagina: 25, resumen: 'Asegurar la sostenibilidad de las pensiones con el ahorro de reducir el sistema autonómico y fomentar la natalidad.' },
  { partidoId: 'vox', temaId: 'pensiones', edicion: 2023, pagina: 75, resumen: 'Dejar exentas del IRPF las pensiones contributivas.' },
  { partidoId: 'vox', temaId: 'pensiones', edicion: 2023, pagina: 65, resumen: 'Desgravaciones fiscales a jubilados que ayuden a familiares menores de 35 años con gastos de estudios, salud o primera vivienda.' },
  { partidoId: 'vox', temaId: 'inmigracion', edicion: 2023, pagina: 100, resumen: 'Expulsar a los inmigrantes con residencia legal que cometan delitos graves o delincan de forma habitual.' },
  { partidoId: 'vox', temaId: 'inmigracion', edicion: 2023, pagina: 102, resumen: 'Un bloqueo naval para frenar la llegada irregular de embarcaciones y devolverlas a puertos de origen o tránsito.' },
  { partidoId: 'vox', temaId: 'inmigracion', edicion: 2023, pagina: 103, resumen: 'Suprimir el arraigo como vía de regularización y las vías rápidas para obtener la nacionalidad.' },
  { partidoId: 'vox', temaId: 'medioambiente', edicion: 2023, pagina: 108, resumen: 'Derogar la Ley de Cambio Climático.' },
  { partidoId: 'vox', temaId: 'medioambiente', edicion: 2023, pagina: 117, resumen: 'Invertir en las centrales nucleares y alargar su vida útil.' },
  { partidoId: 'vox', temaId: 'medioambiente', edicion: 2023, pagina: 119, resumen: 'Salir de los acuerdos que considera perjudiciales para la soberanía energética, como el Acuerdo de París.' },
  { partidoId: 'vox', temaId: 'juventud', edicion: 2023, pagina: 24, resumen: 'Derogar la reforma laboral de 2021 y aprobar otra, como respuesta al paro y la precariedad juvenil.' },
  { partidoId: 'vox', temaId: 'juventud', edicion: 2023, pagina: 41, resumen: 'Construir vivienda social pública en propiedad o alquiler con opción a compra para jóvenes y familias.' },
  { partidoId: 'vox', temaId: 'juventud', edicion: 2023, pagina: 24, resumen: 'Mejorar la FP y ampliar la FP dual para facilitar el acceso al empleo.' },
  { partidoId: 'vox', temaId: 'igualdad', edicion: 2023, pagina: 10, resumen: 'Derogar la Ley Integral de Violencia de Género y aprobar una ley para todas las víctimas de violencia en el ámbito doméstico.' },
  { partidoId: 'vox', temaId: 'igualdad', edicion: 2023, pagina: 10, resumen: 'Eliminar las cuotas y los planes de igualdad, y sustituirlos por políticas contra la brecha de maternidad.' },
  { partidoId: 'vox', temaId: 'igualdad', edicion: 2023, pagina: 11, resumen: 'Derogar la ley trans y las leyes LGTBI, y prohibir tratamientos hormonales y cirugía de cambio de sexo en menores.' },
  { partidoId: 'vox', temaId: 'territorial', edicion: 2023, pagina: 8, resumen: 'Pasar a un Estado unitario, descentralizado solo en lo administrativo.' },
  { partidoId: 'vox', temaId: 'territorial', edicion: 2023, pagina: 8, resumen: 'Devolver de inmediato al Estado las competencias de educación, sanidad, seguridad y justicia.' },
  { partidoId: 'vox', temaId: 'territorial', edicion: 2023, pagina: 16, resumen: 'Suspender la autonomía de las comunidades cuyos gobiernos actúen contra la unidad de España.' },
  { partidoId: 'vox', temaId: 'exterior', edicion: 2023, pagina: 93, resumen: 'Aumentar la inversión en Defensa y mejorar sueldos y ayudas de los militares.' },
  { partidoId: 'vox', temaId: 'exterior', edicion: 2023, pagina: 92, resumen: 'Pedir que el Tratado de la OTAN incluya expresamente a Ceuta y Melilla.' },
  { partidoId: 'vox', temaId: 'exterior', edicion: 2023, pagina: 92, resumen: 'Vincular la ayuda al desarrollo a la colaboración de cada país con la política migratoria española.' },

  // ── Propuestas adicionales (se ven al pulsar «Ver más»). Mismo método:
  //    resumen neutral + página del PDF comprobada con una frase clave.
  // Programa del PSOE 2023
  { partidoId: 'psoe', temaId: 'vivienda', edicion: 2023, pagina: 226, resumen: 'Cuenta de ahorro para comprar la primera vivienda, para jóvenes de hasta 39 años, exenta de IRPF hasta 2.000 euros al año y 30.000 en total.' },
  { partidoId: 'psoe', temaId: 'vivienda', edicion: 2023, pagina: 223, resumen: 'Impedir que la vivienda protegida pase al mercado libre o se venda a fondos de inversión.' },
  { partidoId: 'psoe', temaId: 'vivienda', edicion: 2023, pagina: 224, resumen: 'Red de viviendas para personas sin hogar con modelos como «housing first».' },
  { partidoId: 'psoe', temaId: 'vivienda', edicion: 2023, pagina: 225, resumen: 'Regular nuevas formas de vivienda: cohousing, viviendas intergeneracionales y cooperativas de cesión de uso.' },
  { partidoId: 'psoe', temaId: 'empleo', edicion: 2023, pagina: 26, resumen: 'Prácticas en empresas con salario mínimo y Seguridad Social cubiertos para jóvenes que lleven un año en paro.' },
  { partidoId: 'psoe', temaId: 'empleo', edicion: 2023, pagina: 26, resumen: 'Plan de choque contra el desempleo juvenil con un paquete de «formación + empleo» en 12 meses.' },
  { partidoId: 'psoe', temaId: 'empleo', edicion: 2023, pagina: 26, resumen: 'Cursos cortos de formación y recualificación (microacreditaciones) para empleos verdes y digitales.' },
  { partidoId: 'psoe', temaId: 'empleo', edicion: 2023, pagina: 27, resumen: 'Dotar el fondo del mecanismo RED para proteger y recualificar a trabajadores en crisis.' },
  { partidoId: 'psoe', temaId: 'sanidad', edicion: 2023, pagina: 202, resumen: 'Estudiar las necesidades de personal sanitario para aumentar hasta un 15 % las plazas de formación.' },
  { partidoId: 'psoe', temaId: 'sanidad', edicion: 2023, pagina: 203, resumen: 'Reforzar la línea 024 con más profesionales.' },
  { partidoId: 'psoe', temaId: 'sanidad', edicion: 2023, pagina: 204, resumen: 'Ayudas para comprar gafas y lentillas a menores de 18 años de familias con menos recursos.' },
  { partidoId: 'psoe', temaId: 'sanidad', edicion: 2023, pagina: 204, resumen: 'Reformar el copago de medicamentos para beneficiar a las rentas de menos de 18.000 euros.' },
  { partidoId: 'psoe', temaId: 'educacion', edicion: 2023, pagina: 109, resumen: 'Programa de gratuidad de libros de texto y ayudas para material escolar, con las comunidades autónomas.' },
  { partidoId: 'psoe', temaId: 'educacion', edicion: 2023, pagina: 104, resumen: 'Tolerancia cero con el acoso escolar, con más protocolos y contenidos sobre convivencia.' },
  { partidoId: 'psoe', temaId: 'educacion', edicion: 2023, pagina: 113, resumen: 'Formar cada año a 3 millones de personas en FP, de las que 1.400.000 serán jóvenes.' },
  { partidoId: 'psoe', temaId: 'educacion', edicion: 2023, pagina: 116, resumen: 'Más becas y reducción de las tasas universitarias.' },
  { partidoId: 'psoe', temaId: 'impuestos', edicion: 2023, pagina: 38, resumen: 'Mejorar la fiscalidad de autónomos y pymes, con más incentivos a la transición ecológica y digital.' },
  { partidoId: 'psoe', temaId: 'impuestos', edicion: 2023, pagina: 39, resumen: 'Evaluar el impuesto temporal a las grandes fortunas y debatir la tributación de la riqueza junto a la financiación autonómica.' },
  { partidoId: 'psoe', temaId: 'impuestos', edicion: 2023, pagina: 39, resumen: 'Fiscalidad verde bajo el principio de «quien contamina paga».' },
  { partidoId: 'psoe', temaId: 'impuestos', edicion: 2023, pagina: 39, resumen: 'Una herramienta para que cada persona sepa a qué se destinan los impuestos que paga.' },
  { partidoId: 'psoe', temaId: 'pensiones', edicion: 2023, pagina: 170, resumen: 'Seguir subiendo las pensiones mínimas y no contributivas durante la legislatura.' },
  { partidoId: 'psoe', temaId: 'pensiones', edicion: 2023, pagina: 171, resumen: 'Nuevas fórmulas de jubilación parcial y activa para una salida gradual y voluntaria del trabajo.' },
  { partidoId: 'psoe', temaId: 'pensiones', edicion: 2023, pagina: 171, resumen: 'Regular la jubilación anticipada en profesiones especialmente duras o penosas.' },
  { partidoId: 'psoe', temaId: 'pensiones', edicion: 2023, pagina: 171, resumen: 'Reformar las pensiones de orfandad y mejorar las de viudedad en situación de vulnerabilidad.' },
  { partidoId: 'psoe', temaId: 'inmigracion', edicion: 2023, pagina: 255, resumen: 'Más colaboración con ACNUR y la Organización Internacional para las Migraciones.' },
  { partidoId: 'psoe', temaId: 'inmigracion', edicion: 2023, pagina: 255, resumen: 'Perspectiva de género en la acogida y protección de mujeres y niñas víctimas de violencia.' },
  { partidoId: 'psoe', temaId: 'inmigracion', edicion: 2023, pagina: 256, resumen: 'Facilitar el acceso al trabajo de las personas migrantes, permitiendo compatibilizar estudios y empleo.' },
  { partidoId: 'psoe', temaId: 'inmigracion', edicion: 2023, pagina: 257, resumen: 'Reforzar la lucha contra el racismo y la xenofobia, sobre todo en educación y comunicación.' },
  { partidoId: 'psoe', temaId: 'medioambiente', edicion: 2023, pagina: 79, resumen: 'Mejorar y ampliar las redes de Cercanías con nuevas líneas y estaciones.' },
  { partidoId: 'psoe', temaId: 'medioambiente', edicion: 2023, pagina: 80, resumen: 'Que el ferrocarril transporte el 10 % de las mercancías en 2030.' },
  { partidoId: 'psoe', temaId: 'medioambiente', edicion: 2023, pagina: 81, resumen: 'Electrificar la red de carreteras del Estado para que los coches eléctricos puedan circular sin límites.' },
  { partidoId: 'psoe', temaId: 'medioambiente', edicion: 2023, pagina: 89, resumen: 'Leyes básicas de bomberos forestales y de agentes forestales.' },
  { partidoId: 'psoe', temaId: 'juventud', edicion: 2023, pagina: 129, resumen: 'Más ayudas para preparar oposiciones a menores de 35 años.' },
  { partidoId: 'psoe', temaId: 'juventud', edicion: 2023, pagina: 129, resumen: 'Bonos para aprender idiomas y hacer cursos en el extranjero.' },
  { partidoId: 'psoe', temaId: 'juventud', edicion: 2023, pagina: 131, resumen: 'Estrategia nacional contra el suicidio juvenil.' },
  { partidoId: 'psoe', temaId: 'juventud', edicion: 2023, pagina: 132, resumen: 'Preservativos y anticonceptivos gratis para jóvenes, con más puntos de reparto.' },
  { partidoId: 'psoe', temaId: 'igualdad', edicion: 2023, pagina: 140, resumen: 'Oficina Estatal contra la discriminación dentro de la Inspección de Trabajo.' },
  { partidoId: 'psoe', temaId: 'igualdad', edicion: 2023, pagina: 152, resumen: 'Renovar el Pacto de Estado contra la Violencia de Género, con juzgados especializados en todo el territorio.' },
  { partidoId: 'psoe', temaId: 'igualdad', edicion: 2023, pagina: 158, resumen: 'Aprobar la ley integral contra la trata de personas con fines de explotación sexual.' },
  { partidoId: 'psoe', temaId: 'igualdad', edicion: 2023, pagina: 215, resumen: 'Tipificar como delito las terapias de conversión.' },
  { partidoId: 'psoe', temaId: 'territorial', edicion: 2023, pagina: 234, resumen: 'Abrir el debate para que el nuevo modelo de financiación lleve la inversión pública en sanidad al menos al 7 % del PIB y en educación al 5 %.' },
  { partidoId: 'psoe', temaId: 'territorial', edicion: 2023, pagina: 232, resumen: 'Reformar la Ley de Bases de Régimen Local para dar más capacidad y autonomía a los ayuntamientos.' },
  { partidoId: 'psoe', temaId: 'territorial', edicion: 2023, pagina: 232, resumen: 'Estatuto para los municipios pequeños y en riesgo de despoblación.' },
  { partidoId: 'psoe', temaId: 'territorial', edicion: 2023, pagina: 234, resumen: 'Reformar también la financiación local.' },
  { partidoId: 'psoe', temaId: 'exterior', edicion: 2023, pagina: 260, resumen: 'Buscar un acuerdo sobre Gibraltar que cree una zona de prosperidad compartida, respetando la posición española sobre la soberanía.' },
  { partidoId: 'psoe', temaId: 'exterior', edicion: 2023, pagina: 264, resumen: 'Seguir trabajando en la OTAN por la paz y la seguridad.' },
  { partidoId: 'psoe', temaId: 'exterior', edicion: 2023, pagina: 265, resumen: 'Sáhara Occidental: apoyar al enviado de la ONU para lograr una solución mutuamente aceptable.' },
  { partidoId: 'psoe', temaId: 'exterior', edicion: 2023, pagina: 265, resumen: 'Apoyar la solución de dos Estados entre Israel y Palestina.' },
  // Programa del PP 2023
  { partidoId: 'pp', temaId: 'vivienda', edicion: 2023, pagina: 34, resumen: 'Promover la vivienda social con objetivos «coherentes y realistas».' },
  { partidoId: 'pp', temaId: 'vivienda', edicion: 2023, pagina: 34, resumen: 'Ley de seguridad jurídica en urbanismo para que los planes urbanísticos no se anulen por cuestiones menores.' },
  { partidoId: 'pp', temaId: 'vivienda', edicion: 2023, pagina: 82, resumen: 'Endurecer las penas por usurpación de vivienda, con hasta 3 años de cárcel, y castigar más la ocupación organizada por mafias.' },
  { partidoId: 'pp', temaId: 'vivienda', edicion: 2023, pagina: 58, resumen: 'Apoyar la rehabilitación y adaptación de viviendas para que sean totalmente accesibles.' },
  { partidoId: 'pp', temaId: 'empleo', edicion: 2023, pagina: 19, resumen: 'Más relación de los servicios públicos de empleo con las empresas, con formación adaptada a las ofertas de trabajo.' },
  { partidoId: 'pp', temaId: 'empleo', edicion: 2023, pagina: 19, resumen: 'Hacer el ingreso mínimo vital más compatible con trabajar y vincularlo a itinerarios de inserción laboral.' },
  { partidoId: 'pp', temaId: 'empleo', edicion: 2023, pagina: 20, resumen: 'Cuentas individuales y portables para cada trabajador, financiadas con parte de las cotizaciones de las empresas.' },
  { partidoId: 'pp', temaId: 'empleo', edicion: 2023, pagina: 20, resumen: 'Bonificar la cuota de autónomos que contraten a alguien durante su permiso por nacimiento de hijo.' },
  { partidoId: 'pp', temaId: 'sanidad', edicion: 2023, pagina: 46, resumen: 'Plan nacional contra las agresiones a profesionales sanitarios.' },
  { partidoId: 'pp', temaId: 'sanidad', edicion: 2023, pagina: 47, resumen: 'Crear la Agencia Estatal de Salud Pública y una nueva ley de pandemias.' },
  { partidoId: 'pp', temaId: 'sanidad', edicion: 2023, pagina: 48, resumen: 'Impulsar la digitalización sanitaria, con una historia clínica digital que funcione en todo el sistema.' },
  { partidoId: 'pp', temaId: 'sanidad', edicion: 2023, pagina: 48, resumen: 'Mejor acceso a diagnóstico y tratamiento de enfermedades raras, viva el paciente en la comunidad que viva.' },
  { partidoId: 'pp', temaId: 'educacion', edicion: 2023, pagina: 51, resumen: 'Reducir el abandono escolar temprano y mejorar la comprensión lectora.' },
  { partidoId: 'pp', temaId: 'educacion', edicion: 2023, pagina: 51, resumen: 'Defender la libertad de los padres para elegir centro: público, privado o concertado.' },
  { partidoId: 'pp', temaId: 'educacion', edicion: 2023, pagina: 51, resumen: 'En las comunidades con dos lenguas oficiales, que ambas sean lenguas vehiculares en la enseñanza.' },
  { partidoId: 'pp', temaId: 'educacion', edicion: 2023, pagina: 51, resumen: 'Ampliar las becas en todas las etapas con un sistema nacional de becas y ayudas.' },
  { partidoId: 'pp', temaId: 'impuestos', edicion: 2023, pagina: 23, resumen: 'Mejorar el régimen fiscal para nuevos residentes, con incentivos para atraer inversión.' },
  { partidoId: 'pp', temaId: 'impuestos', edicion: 2023, pagina: 23, resumen: 'Revisar a fondo las cuentas públicas con la IGAE al inicio de la legislatura.' },
  { partidoId: 'pp', temaId: 'impuestos', edicion: 2023, pagina: 32, resumen: 'Fiscalidad específica para el medio rural, con bonificaciones al comprar vivienda en un pueblo.' },
  { partidoId: 'pp', temaId: 'inmigracion', edicion: 2023, pagina: 81, resumen: 'Equipos conjuntos de investigación sobre migración con países africanos.' },
  { partidoId: 'pp', temaId: 'inmigracion', edicion: 2023, pagina: 55, resumen: 'Estrategia nacional de protección e inclusión de menores migrantes no acompañados y reforma de la determinación de la edad.' },
  { partidoId: 'pp', temaId: 'inmigracion', edicion: 2023, pagina: 102, resumen: 'Apoyar a África en seguridad, lucha contra el tráfico de personas y la migración irregular, y en su desarrollo.' },
  { partidoId: 'pp', temaId: 'medioambiente', edicion: 2023, pagina: 38, resumen: 'Proteger los espacios naturales y humedales como el Mar Menor, Doñana o las Tablas de Daimiel.' },
  { partidoId: 'pp', temaId: 'medioambiente', edicion: 2023, pagina: 38, resumen: 'Agilizar los permisos para instalar energías renovables.' },
  { partidoId: 'pp', temaId: 'medioambiente', edicion: 2023, pagina: 38, resumen: 'Un Bono Social Único que sustituya a los bonos eléctrico y térmico, como pago directo al consumidor.' },
  { partidoId: 'pp', temaId: 'medioambiente', edicion: 2023, pagina: 39, resumen: 'Fomentar el hidrógeno verde para impulsar la reindustrialización.' },
  { partidoId: 'pp', temaId: 'juventud', edicion: 2023, pagina: 54, resumen: 'Verificación de edad eficaz para el acceso de menores a redes sociales y páginas pornográficas o violentas.' },
  { partidoId: 'pp', temaId: 'juventud', edicion: 2023, pagina: 54, resumen: 'Plan contra las adicciones en la infancia y la adolescencia: tecnología, juego, alcohol y tabaco.' },
  { partidoId: 'pp', temaId: 'juventud', edicion: 2023, pagina: 54, resumen: 'Plan estatal de prevención de la salud digital infantojuvenil.' },
  { partidoId: 'pp', temaId: 'juventud', edicion: 2023, pagina: 108, resumen: 'Apoyar a los jóvenes creadores y las nuevas expresiones artísticas.' },
  { partidoId: 'pp', temaId: 'igualdad', edicion: 2023, pagina: 62, resumen: 'Tipificar la violencia digital de género y combatirla especialmente entre menores de 18 años.' },
  { partidoId: 'pp', temaId: 'igualdad', edicion: 2023, pagina: 62, resumen: 'Ley orgánica integral contra la trata con fines de explotación sexual.' },
  { partidoId: 'pp', temaId: 'igualdad', edicion: 2023, pagina: 62, resumen: 'Más personal y medios para las unidades policiales y oficinas judiciales de atención a víctimas.' },
  { partidoId: 'pp', temaId: 'igualdad', edicion: 2023, pagina: 64, resumen: 'Protocolos educativos y cambios penales contra todo tipo de discriminación.' },
  { partidoId: 'pp', temaId: 'territorial', edicion: 2023, pagina: 72, resumen: 'Recuperar el delito de malversación tal como estaba antes de la reforma de 2022.' },
  { partidoId: 'pp', temaId: 'territorial', edicion: 2023, pagina: 78, resumen: 'Que los órganos de cooperación entre administraciones funcionen con regularidad y las comunidades participen en las decisiones del Estado.' },
  { partidoId: 'pp', temaId: 'territorial', edicion: 2023, pagina: 79, resumen: 'Reformar la financiación local junto a la autonómica.' },
  { partidoId: 'pp', temaId: 'territorial', edicion: 2023, pagina: 79, resumen: 'Más apoyo del Estado a Ceuta y Melilla, con un nuevo modelo de financiación, y atención a la insularidad de Baleares y Canarias.' },
  { partidoId: 'pp', temaId: 'exterior', edicion: 2023, pagina: 99, resumen: 'Una Unión Europea que hable con una sola voz en el mundo.' },
  { partidoId: 'pp', temaId: 'exterior', edicion: 2023, pagina: 100, resumen: 'Liderar en Europa la firma del acuerdo entre la UE y Mercosur.' },
  { partidoId: 'pp', temaId: 'exterior', edicion: 2023, pagina: 102, resumen: 'Apoyar la solución de dos Estados en el conflicto israelo-palestino.' },
  { partidoId: 'pp', temaId: 'exterior', edicion: 2023, pagina: 103, resumen: 'Aumentar las Fuerzas Armadas hasta los 140.000 efectivos previstos por la ley en dos legislaturas.' },
  // Programa de Vox 2023
  { partidoId: 'vox', temaId: 'vivienda', edicion: 2023, pagina: 41, resumen: 'Revisar y bajar los impuestos y cargas en todo el proceso de construcción de viviendas.' },
  { partidoId: 'vox', temaId: 'vivienda', edicion: 2023, pagina: 41, resumen: 'Colaboración público-privada para aumentar la vivienda de protección oficial y uso del suelo público del Estado para alquiler social.' },
  { partidoId: 'vox', temaId: 'vivienda', edicion: 2023, pagina: 42, resumen: 'Más beneficios fiscales a los propietarios que pongan sus viviendas vacías en alquiler.' },
  { partidoId: 'vox', temaId: 'vivienda', edicion: 2023, pagina: 68, resumen: 'Impedir que quienes ocupan ilegalmente una vivienda y los inmigrantes en situación irregular se empadronen, para perseguir los «pisos patera».' },
  { partidoId: 'vox', temaId: 'empleo', edicion: 2023, pagina: 23, resumen: 'Sanciones duras, incluida la retirada de licencias, a quien emplee a inmigrantes sin permiso en condiciones de explotación.' },
  { partidoId: 'vox', temaId: 'empleo', edicion: 2023, pagina: 23, resumen: 'Bonificar a las empresas el coste del embarazo y las bajas por maternidad, y deducciones por contratar a madres.' },
  { partidoId: 'vox', temaId: 'empleo', edicion: 2023, pagina: 26, resumen: 'Eliminar las subvenciones públicas a los sindicatos.' },
  { partidoId: 'vox', temaId: 'empleo', edicion: 2023, pagina: 26, resumen: 'Medidas fiscales y de crédito para proteger la artesanía y los oficios tradicionales.' },
  { partidoId: 'vox', temaId: 'sanidad', edicion: 2023, pagina: 56, resumen: 'Plan Nacional de Sanidad con una tarjeta sanitaria única y una historia clínica digital común.' },
  { partidoId: 'vox', temaId: 'sanidad', edicion: 2023, pagina: 56, resumen: 'Garantizar la libre elección de médico y centro, con una evaluación nacional de resultados.' },
  { partidoId: 'vox', temaId: 'sanidad', edicion: 2023, pagina: 57, resumen: 'Más inversión en atención primaria, sobre todo en zonas rurales y saturadas.' },
  { partidoId: 'vox', temaId: 'sanidad', edicion: 2023, pagina: 58, resumen: 'Reforzar la Estrategia Nacional de Salud Mental, priorizando la prevención del suicidio, los trastornos alimentarios y las adicciones.' },
  { partidoId: 'vox', temaId: 'educacion', edicion: 2023, pagina: 34, resumen: 'Acceso a la profesión docente con un sistema nacional basado en mérito y capacidad.' },
  { partidoId: 'vox', temaId: 'educacion', edicion: 2023, pagina: 34, resumen: 'Que no se pueda pasar de curso ni obtener títulos con asignaturas suspensas.' },
  { partidoId: 'vox', temaId: 'educacion', edicion: 2023, pagina: 34, resumen: 'Ayudas fiscales a las familias según el número de hijos para comedor, transporte, material y uniforme.' },
  { partidoId: 'vox', temaId: 'educacion', edicion: 2023, pagina: 35, resumen: 'Currículos comunes a todas las regiones, con contenidos sobre historia de España.' },
  { partidoId: 'vox', temaId: 'impuestos', edicion: 2023, pagina: 76, resumen: 'Bajar el IVA de productos de primera necesidad como pañales, productos infantiles y geriátricos.' },
  { partidoId: 'vox', temaId: 'impuestos', edicion: 2023, pagina: 78, resumen: 'Más bonificaciones en el IBI, por ejemplo cuando uno de los cónyuges se dedica al cuidado de los hijos.' },
  { partidoId: 'vox', temaId: 'impuestos', edicion: 2023, pagina: 78, resumen: 'Reducir los impuestos sobre luz, agua y gas, especialmente para familias numerosas.' },
  { partidoId: 'vox', temaId: 'impuestos', edicion: 2023, pagina: 83, resumen: 'Eliminar las subvenciones a sindicatos, partidos políticos y patronal.' },
  { partidoId: 'vox', temaId: 'inmigracion', edicion: 2023, pagina: 100, resumen: 'Eliminar las ayudas públicas a inmigrantes en situación irregular y vincular las ayudas sociales a la residencia legal.' },
  { partidoId: 'vox', temaId: 'inmigracion', edicion: 2023, pagina: 102, resumen: 'Declarar la presión migratoria en Canarias, Ceuta y Melilla asunto de interés para la Seguridad Nacional.' },
  { partidoId: 'vox', temaId: 'inmigracion', edicion: 2023, pagina: 103, resumen: 'Endurecer el acceso a la nacionalidad y ampliar los casos en que se puede perder.' },
  { partidoId: 'vox', temaId: 'inmigracion', edicion: 2023, pagina: 103, resumen: 'Revisar el derecho a la nacionalidad ligado solo a haber nacido en España.' },
  { partidoId: 'vox', temaId: 'medioambiente', edicion: 2023, pagina: 109, resumen: 'Poner fin a la demolición de presas y embalses e invertir en infraestructuras hidráulicas.' },
  { partidoId: 'vox', temaId: 'medioambiente', edicion: 2023, pagina: 116, resumen: 'Suprimir los impuestos de la factura de la luz ligados al coste de las renovables.' },
  { partidoId: 'vox', temaId: 'medioambiente', edicion: 2023, pagina: 119, resumen: 'Cambiar el sistema marginalista que fija el precio de la electricidad.' },
  { partidoId: 'vox', temaId: 'medioambiente', edicion: 2023, pagina: 137, resumen: 'Pedir que se levante la prohibición de fabricar coches de combustión a partir de 2035.' },
  { partidoId: 'vox', temaId: 'juventud', edicion: 2023, pagina: 24, resumen: 'Conectar universidad y empresas, y combinar la prestación por desempleo con medidas eficaces de inserción.' },
  { partidoId: 'vox', temaId: 'juventud', edicion: 2023, pagina: 94, resumen: 'Proteger a los menores en internet frente a la adicción al juego y la pornografía.' },
  { partidoId: 'vox', temaId: 'igualdad', edicion: 2023, pagina: 11, resumen: 'Suprimir el Ministerio de Igualdad y dedicar ese gasto a servicios públicos.' },
  { partidoId: 'vox', temaId: 'igualdad', edicion: 2023, pagina: 11, resumen: 'Vigilar que en la función pública y el deporte no se discrimine a mujeres frente a personas trans que ocupen espacios reservados para ellas.' },
  { partidoId: 'vox', temaId: 'igualdad', edicion: 2023, pagina: 10, resumen: 'Aumentar las penas a violadores y agresores sexuales.' },
  { partidoId: 'vox', temaId: 'territorial', edicion: 2023, pagina: 9, resumen: 'Garantizar el uso del español en todo el territorio y en la atención de todas las administraciones.' },
  { partidoId: 'vox', temaId: 'territorial', edicion: 2023, pagina: 8, resumen: 'Suprimir los privilegios legales y fiscales basados en «derechos históricos».' },
  { partidoId: 'vox', temaId: 'territorial', edicion: 2023, pagina: 16, resumen: 'Ilegalizar y retirar subvenciones a partidos y asociaciones que busquen romper la unidad territorial.' },
  { partidoId: 'vox', temaId: 'territorial', edicion: 2023, pagina: 126, resumen: 'Recuperar el delito de sedición y endurecer la malversación.' },
  { partidoId: 'vox', temaId: 'exterior', edicion: 2023, pagina: 136, resumen: 'Rechazar cualquier acuerdo con el Reino Unido que no respete la soberanía española sobre Gibraltar.' },
  { partidoId: 'vox', temaId: 'exterior', edicion: 2023, pagina: 136, resumen: 'Reformar por completo la política europea de inmigración y asilo.' },
  { partidoId: 'vox', temaId: 'exterior', edicion: 2023, pagina: 137, resumen: 'Pedir la suspensión y revisión del Pacto Verde Europeo.' },
  { partidoId: 'vox', temaId: 'exterior', edicion: 2023, pagina: 92, resumen: 'Revisar la contribución e incluso la pertenencia de España a organismos internacionales que actúen contra los intereses nacionales.' },
  // Programa de Sumar 2023
  { partidoId: 'frente-amplio', temaId: 'vivienda', edicion: 2023, pagina: 76, resumen: 'Un impuesto sobre el suelo urbanizable sin usar y un «banco de suelo» público con crédito del ICO.' },
  { partidoId: 'frente-amplio', temaId: 'vivienda', edicion: 2023, pagina: 76, resumen: 'Prohibir la venta de suelo y vivienda públicos, como los de la Sareb, Adif y Defensa.' },
  { partidoId: 'frente-amplio', temaId: 'vivienda', edicion: 2023, pagina: 77, resumen: 'Juzgados especializados en conflictos sobre el derecho a la vivienda.' },
  { partidoId: 'frente-amplio', temaId: 'vivienda', edicion: 2023, pagina: 78, resumen: 'Más ayudas al alquiler, mejorando el bono de alquiler joven, y un bono de ayuda para hipotecados.' },
  { partidoId: 'frente-amplio', temaId: 'empleo', edicion: 2023, pagina: 25, resumen: 'En las jornadas partidas, una sola interrupción de como máximo una hora, ampliable por convenio.' },
  { partidoId: 'frente-amplio', temaId: 'empleo', edicion: 2023, pagina: 30, resumen: 'Que los autónomos que dependen de un único cliente tengan las condiciones del convenio de esa empresa.' },
  { partidoId: 'frente-amplio', temaId: 'empleo', edicion: 2023, pagina: 7, resumen: 'Centrar las políticas activas de empleo en las personas con más dificultades para encontrar trabajo.' },
  { partidoId: 'frente-amplio', temaId: 'sanidad', edicion: 2023, pagina: 90, resumen: 'Acabar con la temporalidad y la precariedad del personal sanitario.' },
  { partidoId: 'frente-amplio', temaId: 'sanidad', edicion: 2023, pagina: 90, resumen: 'Más plazas de formación en medicina, enfermería y psicología, y más plazas MIR, EIR y PIR.' },
  { partidoId: 'frente-amplio', temaId: 'sanidad', edicion: 2023, pagina: 91, resumen: 'Crear una empresa farmacéutica pública que investigue y fabrique medicamentos y vacunas.' },
  { partidoId: 'frente-amplio', temaId: 'educacion', edicion: 2023, pagina: 155, resumen: 'Apoyos para reducir la repetición, el fracaso escolar y el abandono temprano.' },
  { partidoId: 'frente-amplio', temaId: 'educacion', edicion: 2023, pagina: 160, resumen: 'Más becas según la renta y ayudas para el alojamiento de estudiantes.' },
  { partidoId: 'frente-amplio', temaId: 'educacion', edicion: 2023, pagina: 158, resumen: 'Plan contra el calor en los centros educativos.' },
  { partidoId: 'frente-amplio', temaId: 'impuestos', edicion: 2023, pagina: 16, resumen: 'Reformar el impuesto de sociedades para que paguen más las grandes empresas, aplicando de inmediato un tipo mínimo del 15 % sobre beneficios.' },
  { partidoId: 'frente-amplio', temaId: 'impuestos', edicion: 2023, pagina: 16, resumen: 'Eliminar el trato fiscal especial de las SICAV y las SOCIMI.' },
  { partidoId: 'frente-amplio', temaId: 'impuestos', edicion: 2023, pagina: 17, resumen: 'Reducir el fraude fiscal y reforzar los instrumentos contra la corrupción.' },
  { partidoId: 'frente-amplio', temaId: 'impuestos', edicion: 2023, pagina: 145, resumen: 'Plan de choque europeo contra el fraude fiscal y los paraísos fiscales.' },
  { partidoId: 'frente-amplio', temaId: 'inmigracion', edicion: 2023, pagina: 104, resumen: 'Facilitar pedir asilo por vía diplomática para reducir las migraciones irregulares.' },
  { partidoId: 'frente-amplio', temaId: 'inmigracion', edicion: 2023, pagina: 105, resumen: 'Promover la participación de las personas migrantes en las elecciones.' },
  { partidoId: 'frente-amplio', temaId: 'inmigracion', edicion: 2023, pagina: 105, resumen: 'Acceso universal a la sanidad pública, incluidos solicitantes de asilo y migrantes en situación irregular.' },
  { partidoId: 'frente-amplio', temaId: 'medioambiente', edicion: 2023, pagina: 46, resumen: 'Un fondo público de inversión en energías renovables.' },
  { partidoId: 'frente-amplio', temaId: 'medioambiente', edicion: 2023, pagina: 46, resumen: 'Fomentar el autoconsumo, con el objetivo de que el 10 % de la electricidad venga de autoconsumo en 2030.' },
  { partidoId: 'frente-amplio', temaId: 'medioambiente', edicion: 2023, pagina: 48, resumen: 'Apostar por el hidrógeno renovable donde sea viable.' },
  { partidoId: 'frente-amplio', temaId: 'medioambiente', edicion: 2023, pagina: 13, resumen: 'Que el bono social eléctrico y térmico se solicite y renueve de forma automática.' },
  { partidoId: 'frente-amplio', temaId: 'juventud', edicion: 2023, pagina: 102, resumen: 'Una ley de participación juvenil que regule el movimiento asociativo juvenil.' },
  { partidoId: 'frente-amplio', temaId: 'juventud', edicion: 2023, pagina: 102, resumen: 'Plan integral de salud mental para jóvenes.' },
  { partidoId: 'frente-amplio', temaId: 'juventud', edicion: 2023, pagina: 102, resumen: 'Acceso gratuito y universal a los anticonceptivos y educación sexual integral.' },
  { partidoId: 'frente-amplio', temaId: 'juventud', edicion: 2023, pagina: 103, resumen: 'Ampliar las becas y ayudas al estudio.' },
  { partidoId: 'frente-amplio', temaId: 'igualdad', edicion: 2023, pagina: 108, resumen: 'Plan de choque contra la precariedad en sectores muy feminizados, como limpieza, camareras de piso o servicio doméstico.' },
  { partidoId: 'frente-amplio', temaId: 'igualdad', edicion: 2023, pagina: 108, resumen: 'Medidas de conciliación y corresponsabilidad en las tareas domésticas y de cuidado.' },
  { partidoId: 'frente-amplio', temaId: 'igualdad', edicion: 2023, pagina: 111, resumen: 'Garantizar el acceso al aborto en la sanidad pública en todo el territorio.' },
  { partidoId: 'frente-amplio', temaId: 'igualdad', edicion: 2023, pagina: 114, resumen: 'Más formación en justicia y policía contra los delitos de odio LGTBI.' },
  { partidoId: 'frente-amplio', temaId: 'territorial', edicion: 2023, pagina: 121, resumen: 'Presencia de las comunidades autónomas en organismos del Estado y de la UE, y reforzar los órganos de coordinación.' },
  { partidoId: 'frente-amplio', temaId: 'territorial', edicion: 2023, pagina: 121, resumen: 'Reconocer y reforzar el papel de los ayuntamientos.' },
  { partidoId: 'frente-amplio', temaId: 'territorial', edicion: 2023, pagina: 121, resumen: 'Reconocer el plurilingüismo y proteger las lenguas de España desde las instituciones del Estado.' },
  { partidoId: 'frente-amplio', temaId: 'exterior', edicion: 2023, pagina: 138, resumen: 'Impulsar la ratificación del Tratado sobre la Prohibición de Armas Nucleares.' },
  { partidoId: 'frente-amplio', temaId: 'exterior', edicion: 2023, pagina: 141, resumen: 'Avanzar hacia el reconocimiento del Estado palestino y el fin de la ocupación.' },
  { partidoId: 'frente-amplio', temaId: 'exterior', edicion: 2023, pagina: 139, resumen: 'Pasar progresivamente de las garantías de seguridad de la OTAN a una autonomía estratégica europea.' },
];

// Programa que se muestra de cada partido: el de 2026 si ya hay propuestas
// suyas de 2026; si no, el de 2023; si no hay ninguno, null.
export function edicionVigente(partidoId: string): Edicion | null {
  if (PROPUESTAS.some((p) => p.partidoId === partidoId && p.edicion === 2026)) return 2026;
  if (PROPUESTAS.some((p) => p.partidoId === partidoId && p.edicion === 2023)) return 2023;
  return null;
}

function vigentes(): Propuesta[] {
  return PROPUESTAS.filter((p) => p.edicion === edicionVigente(p.partidoId));
}

export function propuestasDe(partidoId: string, temaId: string): Propuesta[] {
  return vigentes().filter((p) => p.partidoId === partidoId && p.temaId === temaId);
}

export function numPropuestasTema(temaId: string): number {
  return vigentes().filter((p) => p.temaId === temaId).length;
}

// ¿Tiene este partido al menos una propuesta (vigente) en este tema?
export function partidoTrataTema(partidoId: string, temaId: string): boolean {
  return vigentes().some((p) => p.partidoId === partidoId && p.temaId === temaId);
}

// ¿Se está mostrando algún programa de 2023?
export function hayProgramasAnteriores(): boolean {
  return vigentes().some((p) => p.edicion === 2023);
}
