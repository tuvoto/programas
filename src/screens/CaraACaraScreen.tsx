import { useEffect, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PARTIDOS, Partido, partidoPorId } from '../data/partidos';
import { edicionVigente, propuestasDe } from '../data/propuestas';
import { TEMAS, Tema } from '../data/temas';
import { urlPagina } from '../lib/web';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import { C, F, M, R, S, T, ANCHO_LECTURA, ANCHO_MAX, CENTRADO } from '../theme';

type Props = { a?: string; b?: string; onVolver: () => void };

// Solo se pueden comparar partidos con propuestas cargadas.
const CON_PROGRAMA = PARTIDOS.filter((p) => edicionVigente(p.id));
// Cuántas propuestas por tema y partido se ven de entrada.
const VISIBLES = 3;

// Cara a cara: dos partidos, tema a tema.
export default function CaraACaraScreen({ a: aInicial, b: bInicial, onVolver }: Props) {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  useEffect(() => {
    if (aInicial && partidoPorId(aInicial)) setA(aInicial);
    if (bInicial && partidoPorId(bInicial) && bInicial !== aInicial) setB(bInicial);
  }, [aInicial, bInicial]);

  // En la web, la comparación queda en la dirección para poder compartirla.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    a ? url.searchParams.set('a', a) : url.searchParams.delete('a');
    b ? url.searchParams.set('b', b) : url.searchParams.delete('b');
    window.history.replaceState(window.history.state, '', url.toString());
  }, [a, b]);

  const [ancho, setAncho] = useState(0);
  const lado = ancho >= 700;
  const pa = a ? partidoPorId(a) : undefined;
  const pb = b ? partidoPorId(b) : undefined;

  const elegir = (id: string) => {
    if (id === a) return setA(null);
    if (id === b) return setB(null);
    if (!a) return setA(id);
    if (!b) return setB(id);
    setB(id); // con los dos elegidos, se cambia el segundo
  };

  return (
    <ScrollView contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(Math.min(e.nativeEvent.layout.width, ANCHO_MAX) - M * 2)}>
      <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver">
        <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Volver</Text>
      </Pulsable>

      <Text style={[T.titulo, { color: C.tinta, marginTop: 22 }]} accessibilityRole="header">
        Cara a cara
      </Text>
      <Text style={[T.cuerpo, { color: C.suave, marginTop: 6, maxWidth: ANCHO_LECTURA }]}>
        Elige dos partidos y compara sus propuestas tema a tema.
      </Text>

      <View style={s.chips} accessibilityLabel="Partidos que se comparan">
        {CON_PROGRAMA.map((p) => {
          const n = p.id === a ? 1 : p.id === b ? 2 : 0;
          return (
            <Pulsable
              key={p.id}
              onPress={() => elegir(p.id)}
              style={[s.chip, n > 0 && s.chipActivo]}
              escala={0.94}
              vibracion="seleccion"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: n > 0 }}
              accessibilityLabel={p.siglas}
            >
              <Marca color={p.color} tam={9} />
              <Text style={[T.etiqueta, { color: n ? C.sobreTinta : C.suave, fontSize: 13.5 }]}>{p.siglas}</Text>
            </Pulsable>
          );
        })}
      </View>

      {!pa || !pb ? (
        <Text style={[T.cuerpo, { color: C.suave, marginTop: 18 }]}>
          {!pa && !pb ? 'Elige el primer partido.' : 'Ahora elige el segundo.'}
        </Text>
      ) : (
        <>
          {/* Cabecera fija de las dos columnas */}
          <View style={[s.versus, !lado && { flexDirection: 'column', alignItems: 'flex-start', gap: 6 }]}>
            <Nombre p={pa} />
            <Text style={[T.etiqueta, { color: C.suave }]}>frente a</Text>
            <Nombre p={pb} />
            <Pulsable
              onPress={() => {
                setA(b);
                setB(a);
              }}
              style={[s.cambiar, !lado && { position: 'absolute', right: 0, top: 0 }]}
              accessibilityRole="button"
              accessibilityLabel="Cambiar el orden"
            >
              <Icono nombre="comparar" tam={16} color={C.tinta} />
            </Pulsable>
          </View>
          {(edicionVigente(pa.id) === 2023 || edicionVigente(pb.id) === 2023) && (
            <Text style={[T.meta, { color: C.suave, marginTop: 6 }]}>Con sus programas de 2023, hasta que publiquen los del 29-N.</Text>
          )}
          <View style={{ gap: 12, marginTop: 14 }}>
            {TEMAS.map((t) => (
              <BloqueTema key={t.id} tema={t} pa={pa} pb={pb} lado={lado} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function Nombre({ p }: { p: Partido }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Marca color={p.color} tam={14} />
      <Text style={[T.seccion, { color: C.tinta }]}>{p.siglas}</Text>
    </View>
  );
}

function BloqueTema({ tema, pa, pb, lado }: { tema: Tema; pa: Partido; pb: Partido; lado: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const la = propuestasDe(pa.id, tema.id);
  const lb = propuestasDe(pb.id, tema.id);
  const hayMas = la.length > VISIBLES || lb.length > VISIBLES;
  return (
    <Tarjeta style={{ gap: 12 }}>
      <Pulsable onPress={() => router.push(`/tema/${tema.id}`)} style={s.temaFila} escala={0.98} accessibilityRole="link">
        <View style={s.icono}>
          <Icono nombre={tema.icono} tam={18} color={C.tinta} />
        </View>
        <Text style={[T.tarjeta, { color: C.tinta, fontSize: 18 }]}>{tema.nombre}</Text>
      </Pulsable>
      <View style={[s.columnas, !lado && { flexDirection: 'column' }]}>
        <Columna p={pa} lista={abierto ? la : la.slice(0, VISIBLES)} lado={lado} />
        <View style={lado ? s.separadorV : s.separadorH} />
        <Columna p={pb} lista={abierto ? lb : lb.slice(0, VISIBLES)} lado={lado} />
      </View>
      {hayMas && (
        <Pulsable
          onPress={() => setAbierto((x) => !x)}
          style={s.verMas}
          vibracion="seleccion"
          accessibilityRole="button"
          accessibilityState={{ expanded: abierto }}
        >
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>{abierto ? 'Ver menos' : 'Ver todas'}</Text>
          <View style={{ transform: [{ rotate: abierto ? '-90deg' : '90deg' }] }}>
            <Icono nombre="next" tam={13} color={C.tinta} peso="bold" />
          </View>
        </Pulsable>
      )}
    </Tarjeta>
  );
}

function Columna({ p, lista, lado }: { p: Partido; lista: ReturnType<typeof propuestasDe>; lado: boolean }) {
  const archivo = edicionVigente(p.id) === 2023 ? p.anterior?.archivo : undefined;
  return (
    <View style={{ flex: lado ? 1 : undefined, minWidth: 0, gap: 8 }}>
      {/* En el móvil las columnas van una debajo de otra: se repite el nombre */}
      {!lado && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Marca color={p.color} tam={9} />
          <Text style={[T.etiqueta, { color: C.suave }]}>{p.siglas}</Text>
        </View>
      )}
      {lista.length === 0 ? (
        <Text style={[T.cuerpo, { color: C.suave }]}>Su programa no trata este tema.</Text>
      ) : (
        lista.map((pr, i) => (
          <View key={i} style={s.propuesta}>
            <View style={[s.punto, { backgroundColor: p.color }]} />
            <Text style={[T.cuerpo, { color: C.tinta, flex: 1 }]}>
              {pr.resumen}
              {pr.pagina != null && '  '}
              {pr.pagina != null &&
                (archivo ? (
                  <Text
                    onPress={() => Linking.openURL(urlPagina(archivo, pr.pagina!))}
                    accessibilityRole="link"
                    accessibilityLabel={`Abrir el programa de ${p.siglas} por la página ${pr.pagina}`}
                    style={[T.meta, { color: C.tinta, fontFamily: F.textoSemi, textDecorationLine: 'underline' }]}
                  >{`pág. ${pr.pagina}`}</Text>
                ) : (
                  <Text style={[T.meta, { color: C.suave }]}>{`pág. ${pr.pagina}`}</Text>
                ))}
            </Text>
          </View>
        ))
      )}
    </View>
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
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
  versus: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22 },
  cambiar: { marginLeft: 'auto', width: 40, height: 40, borderRadius: 20, backgroundColor: C.tarjeta, boxShadow: S.tarjeta, alignItems: 'center', justifyContent: 'center' },
  temaFila: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start' },
  icono: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.relleno, alignItems: 'center', justifyContent: 'center' },
  columnas: { flexDirection: 'row', gap: 16 },
  separadorV: { width: StyleSheet.hairlineWidth, backgroundColor: C.linea },
  separadorH: { height: StyleSheet.hairlineWidth, backgroundColor: C.linea },
  propuesta: { flexDirection: 'row', gap: 10 },
  punto: { width: 6, height: 6, borderRadius: 3, marginTop: 9 },
  verMas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.relleno,
  },
});
