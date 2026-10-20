import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TEMAS, Tema } from '../data/temas';
import { AFIRMACIONES, AFIRMACIONES_CORTAS } from '../data/test';
import { PARTIDOS, Partido } from '../data/partidos';
import { edicionVigente, numPropuestasTema, partidoTrataTema } from '../data/propuestas';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import { Paralaje, Revelar, ScrollAnimado } from '../components/Revelar';
import CuentaAtras from '../components/CuentaAtras';
import DescargarApp from '../components/DescargarApp';
import { C, F, HUECO_BARRA, M, R, S, T, plural, ANCHO_MAX, ANCHO_LECTURA, CENTRADO } from '../theme';

type Props = { onAbrirTema: (tema: Tema) => void };

// Días de calendario entre hoy (fecha del móvil u ordenador) y el 29 de
// noviembre. Se cuentan fechas, no horas: así el número cambia justo a
// medianoche, también la semana del cambio de hora (25 de octubre).
const DIA_ELECCIONES = Date.UTC(2026, 10, 29);
const diasHastaElecciones = () => {
  const h = new Date();
  const hoy = Date.UTC(h.getFullYear(), h.getMonth(), h.getDate());
  // Negativo cuando ya han pasado: entonces la cuenta atrás no se muestra.
  return Math.round((DIA_ELECCIONES - hoy) / 86_400_000);
};

const SEPARACION = 12;

// En las tarjetas de tema solo salen los partidos con programa cargado: un
// cuadrado vacío significa «su programa no trata el tema», no «falta el programa».
const CON_PROGRAMA = PARTIDOS.filter((p) => edicionVigente(p.id) !== null);

export default function TemasScreen({ onAbrirTema }: Props) {
  const [ancho, setAncho] = useState(0);
  const columnas = ancho >= 900 ? 4 : ancho >= 600 ? 3 : 2;
  // En la web la página se genera antes (al publicarla), así que los días se
  // calculan al abrirla en el navegador para que siempre estén al día.
  const [dias, setDias] = useState<number | null>(Platform.OS === 'web' ? null : diasHastaElecciones());
  // Se recalcula cada minuto: si la página sigue abierta a medianoche, cambia sola.
  useEffect(() => {
    setDias(diasHastaElecciones());
    const t = setInterval(() => setDias(diasHastaElecciones()), 60_000);
    return () => clearInterval(t);
  }, []);
  const ancho760 = ancho >= 760;
  // En pantallas anchas, el test y los resúmenes van uno al lado del otro.
  const pareja = ancho >= 960;

  // Reparto en filas: las tarjetas de una misma fila quedan alineadas y con la misma altura.
  const filas: Tema[][] = [];
  for (let i = 0; i < TEMAS.length; i += columnas) filas.push(TEMAS.slice(i, i + columnas));

  return (
    <ScrollAnimado contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(Math.min(e.nativeEvent.layout.width, ANCHO_MAX) - M * 2)}>
      {/* Portada: se aleja despacio al hacer scroll */}
      <Paralaje>
        <Text style={[T.portada, s.portada]} accessibilityRole="header">
          Compara los programas del {/* Guion y espacios que no se parten, para que «29-N» no se separe */}
          <Text style={s.subrayado}>{'\u00A029\u2011N\u00A0'}</Text>
        </Text>
      </Paralaje>

      {/* Cuenta atrás */}
      {(dias === null || dias >= 0) && (
        <Revelar>
          <CuentaAtras dias={dias} ancho={ancho} />
        </Revelar>
      )}

      {/* Buscador: lleva a /buscar */}
      <Revelar>
        <Pulsable
          onPress={() => router.push('/buscar')}
          style={s.buscador}
          escala={0.98}
          vibracion="ligera"
          accessibilityRole="search"
          accessibilityLabel="Buscar una medida en los programas"
        >
          <Icono nombre="buscar" tam={20} color={C.suave} peso="bold" />
          <Text style={[T.cuerpo, { color: C.suave, flex: 1 }]} numberOfLines={1}>
            Busca una medida: alquiler, SMI, becas…
          </Text>
        </Pulsable>
      </Revelar>

      <View style={pareja ? s.pareja : undefined}>
      {/* Test de afinidad, destacado */}
      <Revelar style={pareja ? s.mitad : undefined}>
        <Pulsable
          onPress={() => router.push('/test')}
          style={[s.test, ancho760 && !pareja && s.testAncho, pareja && s.alto]}
          escala={0.98}
          vibracion="ligera"
          accessibilityRole="link"
          accessibilityLabel="Hacer el test de afinidad"
        >
          <View style={{ flex: ancho760 && !pareja ? 1 : undefined, gap: 6 }}>
            <Text style={[T.portada, { color: C.sobreTinta }]}>Test</Text>
            <Text style={[T.cuerpo, { color: C.sobreTintaSuave }]}>
              ¿Con qué programa coincides? Versión corta de {AFIRMACIONES_CORTAS().length} frases o completa de {AFIRMACIONES.length}.
            </Text>
          </View>
          <View style={[s.boton, { backgroundColor: C.amarillo }]}>
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 15 }]}>Hacer el test</Text>
            <Icono nombre="next" tam={15} color={C.tinta} peso="bold" />
          </View>
        </Pulsable>
      </Revelar>

      {/* Resúmenes de los programas: lleva a la pestaña Partidos */}
      <Revelar style={pareja ? s.mitad : undefined}>
        <Pulsable
          onPress={() => router.navigate('/partidos')}
          style={[s.resumenes, ancho760 && !pareja && s.testAncho, pareja && s.alto]}
          escala={0.98}
          vibracion="ligera"
          accessibilityRole="link"
          accessibilityLabel="Ver los resúmenes de los programas en Partidos"
        >
          <View style={{ flex: ancho760 && !pareja ? 1 : undefined, gap: 6 }}>
            <Text style={[T.portada, { color: C.tinta }]}>Resúmenes de los programas</Text>
          </View>
          <View style={[s.boton, { backgroundColor: C.tinta }]}>
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 15 }]}>Ver partidos</Text>
            <Icono nombre="next" tam={15} color={C.sobreTinta} peso="bold" />
          </View>
        </Pulsable>
      </Revelar>
      </View>

      {/* Solo en la web, cuando la app esté publicada */}
      <DescargarApp />

      {/* Temas */}
      <Revelar style={s.seccion}>
        <View style={s.tituloSeccion}>
          <Text style={[T.seccion, { color: C.tinta }]} accessibilityRole="header">
            Temas
          </Text>
        </View>
        <Text style={[T.meta, { color: C.suave, maxWidth: ANCHO_LECTURA }]}>
          Mientras los partidos publican sus programas para el 29-N, se muestran los de las elecciones de 2023. Cada
          cuadrado es un partido: relleno si su programa trata el tema.
        </Text>
        <Leyenda partidos={PARTIDOS} />
      </Revelar>

      {(
        <View style={s.rejilla}>
          {filas.map((fila, f) => (
            <View key={f} style={s.fila}>
              {fila.map((t, c) => (
                <Revelar key={t.id} style={s.celda} retraso={c * 80}>
                  <TarjetaTema tema={t} onPress={() => onAbrirTema(t)} />
                </Revelar>
              ))}
              {/* Huecos vacíos para que la última fila no estire sus tarjetas */}
              {Array.from({ length: columnas - fila.length }, (_, i) => (
                <View key={`hueco-${i}`} style={s.celda} />
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollAnimado>
  );
}

function Leyenda({ partidos }: { partidos: Partido[] }) {
  return (
    <View style={[s.leyenda, { marginTop: 8 }]}>
      {partidos.map((p) => (
        <View key={p.id} style={s.leyendaItem}>
          <Marca color={p.color} tam={10} />
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>{p.siglas}</Text>
        </View>
      ))}
    </View>
  );
}

function TarjetaTema({ tema: t, onPress }: { tema: Tema; onPress: () => void }) {
  // Gris clarito mientras el dedo está encima.
  const [pulsada, setPulsada] = useState(false);
  const n = numPropuestasTema(t.id);
  const estado = n === 0 ? 'Sin propuestas todavía' : plural(n, 'propuesta', 'propuestas');
  return (
    <Pulsable
      onPress={onPress}
      onPressIn={() => setPulsada(true)}
      onPressOut={() => setPulsada(false)}
      style={[s.tema, pulsada && s.temaPulsada]}
      accessibilityRole="link"
      accessibilityLabel={`${t.nombre}. ${estado}`}
      vibracion="ligera"
    >
      <View style={s.icono}>
        <Icono nombre={t.icono} tam={22} color={C.tinta} />
      </View>
      <Text style={[T.tarjeta, { color: C.tinta }]}>{t.nombre}</Text>
      {/* Pie pegado abajo: así los cuadrados quedan a la misma altura en toda la fila */}
      <View style={{ gap: 6, marginTop: 'auto' }}>
        <View style={s.marcas}>
          {CON_PROGRAMA.map((p) => (
            <Marca key={p.id} color={p.color} tam={8} vacia={!partidoTrataTema(p.id, t.id)} />
          ))}
        </View>
        <Text style={[T.meta, { color: C.suave, fontSize: 12.5, lineHeight: 16 }]}>{estado}</Text>
      </View>
    </Pulsable>
  );
}

const s = StyleSheet.create({
  contenedor: { ...CENTRADO,
    paddingHorizontal: M,
    paddingTop: 12,
    paddingBottom: HUECO_BARRA,
  },
  portada: { color: C.tinta, marginTop: 22, marginBottom: 4, maxWidth: 640 },
  subrayado: { backgroundColor: C.amarillo },
  test: {
    marginTop: 12,
    backgroundColor: C.tinta,
    borderRadius: R.tarjeta,
    padding: 20,
    gap: 16,
    boxShadow: S.flotante,
  },
  testAncho: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    paddingHorizontal: 18,
    minHeight: 54,
    borderRadius: R.boton + 4,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  pareja: { flexDirection: 'row', gap: 12, alignItems: 'stretch', marginTop: 12 },
  mitad: { flex: 1, minWidth: 0 },
  alto: { flex: 1, marginTop: 0, justifyContent: 'space-between' },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: C.amarillo,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: R.boton,
  },
  resumenes: { marginTop: 12, backgroundColor: C.amarillo, borderRadius: R.tarjeta, padding: 20, gap: 16, boxShadow: S.tarjeta },
  leyenda: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 6 },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seccion: { marginTop: 28, marginBottom: 12, gap: 2 },
  tituloSeccion: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rejilla: { gap: SEPARACION },
  fila: { flexDirection: 'row', gap: SEPARACION, alignItems: 'stretch' },
  celda: { flex: 1, minWidth: 0 },
  tema: {
    flex: 1,
    backgroundColor: C.tarjeta,
    borderRadius: R.tarjeta,
    padding: 14,
    gap: 12,
    minHeight: 136,
    boxShadow: S.tarjeta,
  },
  icono: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.relleno,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temaPulsada: { backgroundColor: '#E8EBF0' },
  marcas: { flexDirection: 'row', gap: 3 },
});
