import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Paralaje, Revelar, ScrollAnimado } from '../components/Revelar';
import { router, useFocusEffect } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AUTONOMICOS, ESTATALES, Partido } from '../data/partidos';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import { C, HUECO_BARRA, M, R, S, T, textoSobre, ANCHO_MAX, CENTRADO } from '../theme';

export default function PartidosScreen() {
  const [ancho, setAncho] = useState(0);
  const columnas = ancho >= 980 ? 3 : ancho >= 760 ? 2 : 1;

  return (
    <ScrollAnimado contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(Math.min(e.nativeEvent.layout.width, ANCHO_MAX) - M * 2)}>
      <Paralaje>
        <Text style={[T.titulo, { color: C.sobrePartidos, marginTop: 18 }]} accessibilityRole="header">
          Partidos
        </Text>
      </Paralaje>

      {ancho > 0 && (
        <>
          <Grupo titulo="Se presentan en toda España" partidos={ESTATALES} columnas={columnas} />
          <Grupo titulo="Se presentan solo en su comunidad" partidos={AUTONOMICOS} columnas={columnas} />
        </>
      )}
    </ScrollAnimado>
  );
}

function Grupo({ titulo, partidos, columnas }: { titulo: string; partidos: Partido[]; columnas: number }) {
  const cols: Partido[][] = Array.from({ length: columnas }, () => []);
  partidos.forEach((p, i) => cols[i % columnas].push(p));
  return (
    <>
      <Revelar>
        <Text style={[T.seccion, { color: C.sobrePartidos, marginTop: 28 }]} accessibilityRole="header">
          {titulo}
        </Text>
      </Revelar>
      <View style={s.rejilla}>
        {cols.map((col, c) => (
          <View key={c} style={s.columna}>
            {col.map((p) => (
              <Revelar key={p.id} retraso={c * 80}>
                <TarjetaPartido p={p} />
              </Revelar>
            ))}
          </View>
        ))}
      </View>
    </>
  );
}

function TarjetaPartido({ p }: { p: Partido }) {
  // Al tocar, la tarjeta se tiñe del color del partido y se abre su página.
  const [activa, setActiva] = useState(false);
  const tinte = useSharedValue(0);
  const capa = useAnimatedStyle(() => ({ opacity: tinte.get() }));
  const sobre = textoSobre(p.color);

  // Se tiñe nada más tocar; si el toque se cancela (por ejemplo, al hacer
  // scroll), vuelve a blanco.
  const pulsado = useRef(false);
  useFocusEffect(
    useCallback(() => {
      // Al volver a la lista, la tarjeta recupera su aspecto normal.
      pulsado.current = false;
      tinte.set(withTiming(0, { duration: 220 }));
      setActiva(false);
    }, [tinte]),
  );

  const colorear = (si: boolean) => {
    setActiva(si);
    tinte.set(withTiming(si ? 1 : 0, { duration: si ? 140 : 200, easing: Easing.bezier(0.23, 1, 0.32, 1) }));
  };
  const abrir = () => {
    pulsado.current = true;
    colorear(true);
    setTimeout(() => router.push(`/partido/${p.id}`), 130);
  };

  const tinta = activa ? sobre : C.tinta;
  const suave = activa ? sobre : C.suave;

  return (
    <Pulsable
      onPressIn={() => {
        pulsado.current = false;
        colorear(true);
      }}
      onPressOut={() => setTimeout(() => !pulsado.current && colorear(false), 60)}
      onPress={abrir}
      unstable_pressDelay={70}
      style={s.tarjeta}
      escala={0.98}
      vibracion="ligera"
      accessibilityRole="link"
      accessibilityLabel={`${p.siglas}: programa y noticias`}
    >
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: p.color, borderRadius: R.tarjeta }, capa]} />
      <View style={s.cabecera}>
        <Marca color={activa ? sobre : p.color} tam={14} />
        <Text style={[T.tarjeta, { color: tinta, fontSize: 20, lineHeight: 24, flexShrink: 1 }]}>{p.siglas}</Text>
      </View>
      {p.nombre !== p.siglas && (
        <Text style={[T.meta, { color: suave, marginTop: 4 }]}>{p.nombre}</Text>
      )}
      {p.territorio && (
        <Text style={[T.meta, { color: suave, marginTop: 2 }]}>Se presenta en {p.territorio}</Text>
      )}
      {p.candidato && (
        <Text style={[T.cuerpo, { color: tinta, marginTop: 10 }]}>
          <Text style={{ color: suave }}>{p.candidata ? 'Candidata' : 'Candidato'}: </Text>
          {p.candidato}
        </Text>
      )}

      <View style={[s.pie, activa && { borderTopColor: 'rgba(255,255,255,0.3)' }]}>
        <View style={{ flex: 1 }} />
        <Text style={[T.etiqueta, { color: tinta, fontSize: 13.5 }]}>Programa y noticias</Text>
        <Icono nombre="next" tam={14} color={tinta} peso="bold" />
      </View>
    </Pulsable>
  );
}

const s = StyleSheet.create({
  tarjeta: { backgroundColor: C.tarjeta, borderRadius: R.tarjeta, padding: 16, boxShadow: S.tarjeta, overflow: 'hidden' },
  contenedor: { ...CENTRADO, paddingHorizontal: M, paddingTop: 12, paddingBottom: HUECO_BARRA },
  rejilla: { flexDirection: 'row', gap: 12, marginTop: 12, alignItems: 'flex-start' },
  columna: { flex: 1, gap: 12, minWidth: 0 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pie: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.linea },
});
