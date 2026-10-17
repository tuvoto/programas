import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TEMAS, Tema } from '../data/temas';
import { AFIRMACIONES } from '../data/test';
import { PARTIDOS, Partido } from '../data/partidos';
import { edicionVigente, numPropuestasTema, partidoTrataTema } from '../data/propuestas';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import { Paralaje, Revelar, ScrollAnimado } from '../components/Revelar';
import InstalarWeb from '../components/InstalarWeb';
import { C, F, HUECO_BARRA, M, R, S, T, plural } from '../theme';

type Props = { onAbrirTema: (tema: Tema) => void };

const DIA_ELECCIONES = new Date('2026-11-29T00:00:00+01:00');
const diasHastaElecciones = () => Math.max(0, Math.ceil((DIA_ELECCIONES.getTime() - Date.now()) / 86_400_000));

const SEPARACION = 12;

// En las tarjetas de tema solo salen los partidos con programa cargado: un
// cuadrado vacío significa «su programa no trata el tema», no «falta el programa».
const CON_PROGRAMA = PARTIDOS.filter((p) => edicionVigente(p.id) !== null);

export default function TemasScreen({ onAbrirTema }: Props) {
  const [ancho, setAncho] = useState(0);
  const columnas = ancho >= 900 ? 4 : ancho >= 600 ? 3 : 2;
  const dias = diasHastaElecciones();
  const ancho760 = ancho >= 760;

  // Reparto en filas: las tarjetas de una misma fila quedan alineadas y con la misma altura.
  const filas: Tema[][] = [];
  for (let i = 0; i < TEMAS.length; i += columnas) filas.push(TEMAS.slice(i, i + columnas));

  return (
    <ScrollAnimado contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(e.nativeEvent.layout.width - M * 2)}>
      {/* Portada: se aleja despacio al hacer scroll */}
      <Paralaje>
        <Text style={[T.portada, s.portada]} accessibilityRole="header">
          Compara los programas del {/* Guion y espacios que no se parten, para que «29-N» no se separe */}
          <Text style={s.subrayado}>{'\u00A029\u2011N\u00A0'}</Text>
        </Text>
      </Paralaje>

      {/* Cuenta atrás */}
      <Revelar>
        <Tarjeta style={s.resumen}>
          <View style={s.cuenta}>
            <View style={s.dias} accessibilityLabel={dias === 0 ? 'Las elecciones son hoy' : dias === 1 ? 'Falta 1 día' : `Faltan ${dias} días`}>
              {dias === 0 ? (
                <Text style={[s.diasNum, { fontSize: 24 }]}>Hoy</Text>
              ) : (
                <>
                  <Text style={s.diasTxt}>{dias === 1 ? 'Falta' : 'Faltan'}</Text>
                  <Text style={s.diasNum}>{dias}</Text>
                  <Text style={s.diasTxt}>{dias === 1 ? 'día' : 'días'}</Text>
                </>
              )}
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={[T.tarjeta, { color: C.tinta, fontSize: 19, lineHeight: 23 }]}>Elecciones generales</Text>
              <Text style={[T.cuerpo, { color: C.suave }]}>29 de noviembre</Text>
            </View>
          </View>
        </Tarjeta>
      </Revelar>

      {/* Test de afinidad, destacado */}
      <Revelar>
        <Pulsable
          onPress={() => router.push('/test')}
          style={[s.test, ancho760 && s.testAncho]}
          escala={0.98}
          vibracion="ligera"
          accessibilityRole="link"
          accessibilityLabel="Hacer el test de afinidad"
        >
          <View style={{ flex: ancho760 ? 1 : undefined, gap: 6 }}>
            <Text style={[T.seccion, { color: C.sobreTinta, fontSize: 24, lineHeight: 28 }]}>¿Con qué programa coincides?</Text>
            <Text style={[T.cuerpo, { color: C.sobreTintaSuave }]}>
              {AFIRMACIONES.length} frases, unos {Math.round((AFIRMACIONES.length * 8) / 60)} minutos.
            </Text>
          </View>
          <View style={[s.boton, { backgroundColor: C.amarillo }]}>
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 15 }]}>Hacer el test</Text>
            <Icono nombre="next" tam={15} color={C.tinta} peso="bold" />
          </View>
        </Pulsable>
      </Revelar>

      {/* Resúmenes de los programas: lleva a la pestaña Partidos */}
      <Revelar>
        <Pulsable
          onPress={() => router.navigate('/partidos')}
          style={[s.resumenes, ancho760 && s.testAncho]}
          escala={0.98}
          vibracion="ligera"
          accessibilityRole="link"
          accessibilityLabel="Ver los resúmenes de los programas en Partidos"
        >
          <View style={{ flex: ancho760 ? 1 : undefined, gap: 6 }}>
            <Text style={[T.seccion, { color: C.tinta, fontSize: 24, lineHeight: 28 }]}>Resúmenes de los programas</Text>
            <Text style={[T.cuerpo, { color: C.tinta, opacity: 0.8 }]}>
              Descarga el programa de cada partido o sus propuestas por temas en PDF.
            </Text>
          </View>
          <View style={[s.boton, { backgroundColor: C.tinta }]}>
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 15 }]}>Ver partidos</Text>
            <Icono nombre="next" tam={15} color={C.sobreTinta} peso="bold" />
          </View>
        </Pulsable>
      </Revelar>

      <InstalarWeb />

      {/* Temas */}
      <Revelar style={s.seccion}>
        <View style={s.tituloSeccion}>
          <Text style={[T.seccion, { color: C.tinta }]} accessibilityRole="header">
            Temas
          </Text>
        </View>
        <Text style={[T.meta, { color: C.suave }]}>
          Mientras los partidos publican sus programas para el 29-N, se muestran los de las elecciones de 2023. Cada
          cuadrado es un partido: relleno si su programa trata el tema.
        </Text>
        <Leyenda partidos={PARTIDOS} />
      </Revelar>

      {ancho > 0 && (
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
  contenedor: {
    paddingHorizontal: M,
    paddingTop: 12,
    paddingBottom: HUECO_BARRA,
  },
  portada: { color: C.tinta, marginTop: 22, marginBottom: 4, maxWidth: 640 },
  subrayado: { backgroundColor: C.amarillo },
  resumen: { marginTop: 20, gap: 16 },
  test: {
    marginTop: 12,
    backgroundColor: C.tinta,
    borderRadius: R.tarjeta,
    padding: 20,
    gap: 16,
    boxShadow: S.flotante,
  },
  testAncho: { flexDirection: 'row', alignItems: 'center', gap: 24 },
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
  cuenta: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  dias: {
    backgroundColor: C.tinta,
    borderRadius: 14,
    paddingVertical: 10,
    minWidth: 66,
    alignItems: 'center',
  },
  diasNum: {
    fontFamily: F.titular,
    fontSize: 30,
    lineHeight: 32,
    color: C.sobreTinta,
    fontVariant: ['tabular-nums'],
  },
  diasTxt: {
    fontFamily: F.textoSemi,
    fontSize: 11,
    color: C.sobreTintaSuave,
    marginTop: 2,
  },
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
