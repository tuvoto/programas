import { useEffect, useState } from 'react';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { urlPagina } from '../lib/web';
import { router } from 'expo-router';
import { AUTONOMICOS, ESTATALES, PARTIDOS, Partido, sePresentaEn } from '../data/partidos';
import { provinciaPorId } from '../data/provincias';
import { useProvincia } from '../lib/provincia';
import { edicionVigente, propuestasDe } from '../data/propuestas';
import { Tema } from '../data/temas';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import { C, F, M, R, S, T, ANCHO_MAX, CENTRADO } from '../theme';

type Props = { tema: Tema; onVolver: () => void };

export default function ComparativaScreen({ tema, onVolver }: Props) {
  // Por defecto se comparan los que se presentan en toda España; los que solo
  // se presentan en su comunidad se añaden con un toque.
  const [seleccion, setSeleccion] = useState<string[]>(ESTATALES.map((p) => p.id));
  // Si la persona ha elegido dónde vota, se marcan los partidos de su papeleta.
  const provincia = provinciaPorId(useProvincia());
  useEffect(() => {
    if (provincia) setSeleccion(PARTIDOS.filter((p) => sePresentaEn(p, provincia.comunidad)).map((p) => p.id));
  }, [provincia]);
  const alternar = (id: string) =>
    setSeleccion((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
  const visibles = PARTIDOS.filter((p) => seleccion.includes(p.id));

  // Móvil: una columna. Tablet/ordenador: partidos lado a lado.
  const [ancho, setAncho] = useState(0);
  const columnas = ancho >= 960 ? 3 : ancho >= 640 ? 2 : 1;
  const cols: Partido[][] = Array.from({ length: columnas }, () => []);
  visibles.forEach((p, i) => cols[i % columnas].push(p));

  return (
    <ScrollView contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(Math.min(e.nativeEvent.layout.width, ANCHO_MAX) - M * 2)}>
      <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver a temas">
        <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Temas</Text>
      </Pulsable>

      <View style={s.titulo}>
        <View style={s.icono}>
          <Icono nombre={tema.icono} tam={26} color={C.tinta} />
        </View>
        <Text style={[T.titulo, { color: C.tinta, flexShrink: 1 }]} accessibilityRole="header">
          {tema.nombre}
        </Text>
      </View>

      {/* Qué partidos comparar */}
      <View accessibilityLabel="Partidos que se comparan">
        {provincia && (
          <Text style={[T.meta, { color: C.suave, marginTop: 14 }]}>Marcados los partidos de tu papeleta en {provincia.nombre}.</Text>
        )}
        <Text style={[T.etiqueta, s.grupo]}>En toda España</Text>
        <View style={s.filtro}>
          {ESTATALES.map((p) => (
            <Chip key={p.id} p={p} activo={seleccion.includes(p.id)} onPress={() => alternar(p.id)} />
          ))}
        </View>
        <Text style={[T.etiqueta, s.grupo]}>Solo en su comunidad</Text>
        <View style={s.filtro}>
          {AUTONOMICOS.map((p) => (
            <Chip key={p.id} p={p} activo={seleccion.includes(p.id)} onPress={() => alternar(p.id)} />
          ))}
        </View>
      </View>

      {visibles.length === 0 ? (
        <Text style={[T.cuerpo, { color: C.suave, marginTop: 20 }]}>
          Marca al menos un partido para ver sus propuestas.
        </Text>
      ) : (
        (
          <View style={s.rejilla}>
            {cols.map((col, c) => (
              <View key={c} style={s.columna}>
                {col.map((p) => (
                  <BloquePartido key={p.id} partido={p} temaId={tema.id} />
                ))}
              </View>
            ))}
          </View>
        )
      )}
    </ScrollView>
  );
}

function Chip({ p, activo, onPress }: { p: Partido; activo: boolean; onPress: () => void }) {
  return (
    <Pulsable
      onPress={onPress}
      style={[s.chip, activo && s.chipActivo]}
      escala={0.94}
      vibracion="seleccion"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: activo }}
      accessibilityLabel={p.territorio ? `${p.siglas}, se presenta en ${p.territorio}` : p.siglas}
    >
      <Marca color={p.color} tam={9} />
      <Text style={[T.etiqueta, { color: activo ? C.sobreTinta : C.suave, fontSize: 13.5 }]}>{p.siglas}</Text>
    </Pulsable>
  );
}

// Cuántas propuestas se ven antes de pulsar «Ver más». Las primeras de cada
// partido y tema en propuestas.ts son las principales.
const VISIBLES = 3;
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const ENTRAR = FadeIn.duration(220).easing(EASE_OUT);
const SALIR = FadeOut.duration(120);

function BloquePartido({ partido: p, temaId }: { partido: Partido; temaId: string }) {
  const props = propuestasDe(p.id, temaId);
  const [abierto, setAbierto] = useState(false);
  const ocultas = Math.max(0, props.length - VISIBLES);
  const mostradas = abierto ? props : props.slice(0, VISIBLES);
  const edicion = edicionVigente(p.id);
  // PDF del programa publicado con la web, para abrirlo por la página citada.
  const archivo = edicion === 2023 ? p.anterior?.archivo : undefined;
  const vacio = edicion ? 'Su programa no trata este tema.' : 'Programa aún no disponible.';

  return (
    <Tarjeta>
      <View style={s.cabeceraPartido}>
        <Marca color={p.color} tam={12} />
        <Text style={[T.tarjeta, { color: C.tinta, fontSize: 18, flexShrink: 1 }]}>{p.siglas}</Text>
        {edicion === 2023 && (
          <View style={s.edicion}>
            <Text style={[T.etiqueta, { color: C.suave, fontSize: 11.5 }]}>Programa de 2023</Text>
          </View>
        )}
      </View>
      {(p.candidato || p.territorio) && (
        <Text style={[T.meta, { color: C.suave, marginTop: 4 }]}>
          {[p.candidato, p.territorio && `Solo en ${p.territorio}`].filter(Boolean).join('. ')}
        </Text>
      )}

      {props.length === 0 ? (
        <Text style={[T.cuerpo, { color: C.suave, marginTop: 12 }]}>{vacio}</Text>
      ) : (
        <View style={{ marginTop: 12, gap: 12 }}>
          {mostradas.map((pr, i) => (
            <Animated.View
              key={`${pr.partidoId}-${i}`}
              entering={i >= VISIBLES ? ENTRAR : undefined}
              exiting={i >= VISIBLES ? SALIR : undefined}
              style={s.propuesta}
            >
              <View style={s.punto} />
              <Text style={[T.cuerpo, { color: C.tinta, flex: 1 }]}>
                {pr.resumen}
                {pr.pagina != null && '  '}
                {pr.pagina != null &&
                  (archivo ? (
                    // Toca la página para abrir el programa justo ahí.
                    <Text
                      onPress={() => Linking.openURL(urlPagina(archivo, pr.pagina!))}
                      accessibilityRole="link"
                      accessibilityLabel={`Abrir el programa por la página ${pr.pagina}`}
                      style={[T.meta, { color: C.tinta, fontFamily: F.textoSemi, textDecorationLine: 'underline' }]}
                    >{`pág.\u00a0${pr.pagina}`}</Text>
                  ) : (
                    <Text style={[T.meta, { color: C.suave, fontFamily: F.textoMedia }]}>{`pág.\u00a0${pr.pagina}`}</Text>
                  ))}
              </Text>
            </Animated.View>
          ))}
          <View style={s.botones}>
            {ocultas > 0 && (
              <Pulsable
                onPress={() => setAbierto((a) => !a)}
                style={s.verMas}
                vibracion="seleccion"
                accessibilityRole="button"
                accessibilityState={{ expanded: abierto }}
                accessibilityLabel={abierto ? 'Ver menos propuestas' : `Ver ${ocultas} propuestas más de ${p.siglas}`}
              >
                <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>
                  {abierto ? 'Ver menos' : `Ver ${ocultas} ${ocultas === 1 ? 'propuesta más' : 'propuestas más'}`}
                </Text>
                <View style={{ transform: [{ rotate: abierto ? '-90deg' : '90deg' }] }}>
                  <Icono nombre="next" tam={13} color={C.tinta} peso="bold" />
                </View>
              </Pulsable>
            )}
            <Pulsable
              onPress={() => router.push(`/ficha/${temaId}/${p.id}`)}
              style={s.verMas}
              vibracion="ligera"
              accessibilityRole="link"
              accessibilityLabel={`Ficha completa de ${p.siglas} sobre este tema, descargable en PDF`}
            >
              <Icono nombre="documento" tam={15} color={C.tinta} peso="bold" />
              <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>Ficha y PDF</Text>
            </Pulsable>
          </View>
        </View>
      )}
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  contenedor: { ...CENTRADO, paddingHorizontal: M, paddingTop: 12, paddingBottom: 48 },
  volver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  titulo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22 },
  icono: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.tarjeta, alignItems: 'center', justifyContent: 'center', boxShadow: S.tarjeta },
  filtro: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  grupo: { color: C.suave, marginTop: 16, fontSize: 12.5 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    minHeight: 38,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  chipActivo: { backgroundColor: C.tinta, boxShadow: S.boton },
  rejilla: { flexDirection: 'row', gap: 12, marginTop: 16, alignItems: 'flex-start' },
  columna: { flex: 1, gap: 12, minWidth: 0 },
  cabeceraPartido: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  edicion: { marginLeft: 'auto', backgroundColor: C.relleno, borderRadius: R.pildora, paddingHorizontal: 9, paddingVertical: 3 },
  propuesta: { flexDirection: 'row', gap: 10 },
  verMas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.relleno,
  },
  botones: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  punto: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.vacia, marginTop: 9 },
});
