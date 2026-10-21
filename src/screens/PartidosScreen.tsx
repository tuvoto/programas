import { useCallback, useRef, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Paralaje, Revelar, ScrollAnimado } from '../components/Revelar';
import { router, useFocusEffect } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AUTONOMICOS, ESTATALES, Partido, sePresentaEn } from '../data/partidos';
import { comunidadPorId, provinciaPorId, Provincia } from '../data/provincias';
import { BOE_CANDIDATURAS, OTRAS_CANDIDATURAS } from '../data/candidaturas';
import { useProvincia } from '../lib/provincia';
import SelectorProvincia from '../components/SelectorProvincia';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono, { NombreIcono } from '../components/Icono';
import { C, F, HUECO_BARRA, M, R, S, T, textoSobre, fondoLegible, ANCHO_MAX, ANCHO_LECTURA, CENTRADO } from '../theme';

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

      <View style={columnas > 1 ? s.dosAtajos : undefined}>
        <DondeVotas />
        <Atajo
          icono="comparar"
          titulo="Cara a cara"
          texto="Compara dos partidos tema a tema."
          boton="Comparar"
          onPress={() => router.push('/cara-a-cara')}
        />
      </View>

      <ListaPartidos columnas={columnas} />

      {/* Criterio de inclusión, para que quede claro que no se deja fuera a nadie a propósito */}
      <Revelar>
        <Text style={[T.meta, s.criterio, { maxWidth: ANCHO_LECTURA }]}>
          Se incluyen los partidos que obtuvieron escaños en el Congreso en 2023, en el Parlamento Europeo en 2024 o en su
          parlamento autonómico en las últimas elecciones, y los que han surgido de ellos. En cada provincia se presentan más
          candidaturas: la lista oficial se publica en el BOE.
        </Text>
      </Revelar>
    </ScrollAnimado>
  );
}

// Tarjeta «¿Dónde votas?»: al elegir provincia, solo salen los partidos de esa papeleta.
function Atajo({ icono, titulo, texto, boton, onPress }: { icono: NombreIcono; titulo: string; texto: string; boton: string; onPress: () => void }) {
  return (
    <Pulsable onPress={onPress} style={[s.donde, { flex: 1 }]} escala={0.98} vibracion="ligera" accessibilityRole="link" accessibilityLabel={`${titulo}. ${texto}`}>
      <View style={s.dondeIcono}>
        <Icono nombre={icono} tam={20} color={C.tinta} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[T.tarjeta, { color: C.tinta, fontSize: 17, lineHeight: 21 }]}>{titulo}</Text>
        <Text style={[T.meta, { color: C.suave, marginTop: 2 }]}>{texto}</Text>
      </View>
      <View style={s.dondeBoton}>
        <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 13.5 }]}>{boton}</Text>
      </View>
    </Pulsable>
  );
}

function DondeVotas() {
  const provincia = provinciaPorId(useProvincia());
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <Pulsable
        onPress={() => setAbierto(true)}
        style={[s.donde, { flex: 1 }]}
        escala={0.98}
        vibracion="ligera"
        accessibilityRole="button"
        accessibilityLabel={provincia ? `Votas en ${provincia.nombre}. Cambiar provincia` : 'Elegir la provincia en la que votas'}
      >
        <View style={s.dondeIcono}>
          <Icono nombre="lugar" tam={20} color={C.tinta} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[T.tarjeta, { color: C.tinta, fontSize: 17, lineHeight: 21 }]}>
            {provincia ? `Votas en ${provincia.nombre}` : '¿Dónde votas?'}
          </Text>
          <Text style={[T.meta, { color: C.suave, marginTop: 2 }]}>
            {provincia ? 'Solo ves los partidos de tu papeleta.' : 'Elige tu provincia y verás solo los partidos de tu papeleta.'}
          </Text>
        </View>
        <View style={s.dondeBoton}>
          <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 13.5 }]}>{provincia ? 'Cambiar' : 'Elegir'}</Text>
        </View>
      </Pulsable>
      <SelectorProvincia visible={abierto} actual={provincia?.id ?? null} onCerrar={() => setAbierto(false)} />
    </>
  );
}

function ListaPartidos({ columnas }: { columnas: number }) {
  const provincia = provinciaPorId(useProvincia());
  if (!provincia) {
    return (
      <>
        <Grupo titulo="Se presentan en toda España" partidos={ESTATALES} columnas={columnas} />
        <Grupo titulo="Se presentan solo en su comunidad" partidos={AUTONOMICOS} columnas={columnas} />
      </>
    );
  }
  const comunidad = comunidadPorId(provincia.comunidad)!;
  const estatales = ESTATALES.filter((p) => sePresentaEn(p, comunidad.id));
  const propios = AUTONOMICOS.filter((p) => sePresentaEn(p, comunidad.id));
  return (
    <>
      <Grupo titulo="Se presentan en toda España" partidos={estatales} columnas={columnas} />
      {propios.length > 0 && <Grupo titulo={`Se presentan solo en ${comunidad.nombre}`} partidos={propios} columnas={columnas} />}
      <OtrasCandidaturas provincia={provincia} />
      <Text style={[T.meta, s.aviso, { maxWidth: ANCHO_LECTURA }]}>
        Según las coaliciones registradas ante la Junta Electoral. Se confirmará cuando se proclamen las candidaturas, a
        principios de noviembre.
      </Text>
    </>
  );
}

// El resto de candidaturas de la papeleta, solo con su nombre, según el BOE.
function OtrasCandidaturas({ provincia }: { provincia: Provincia }) {
  const lista = OTRAS_CANDIDATURAS[provincia.id];
  const url = BOE_CANDIDATURAS.url;
  return (
    <Revelar>
      <View style={s.otras}>
        <Text style={[T.subseccion, { color: C.tinta }]} accessibilityRole="header">
          Otras candidaturas en {provincia.nombre}
        </Text>
        {lista ? (
          <>
            <Text style={[T.meta, { color: C.suave }]}>
              También están en tu papeleta. No tienen ficha en la app porque no obtuvieron escaños en las últimas elecciones.
            </Text>
            <View style={{ gap: 6, marginTop: 4 }}>
              {lista.map((nombre) => (
                <Text key={nombre} style={[T.cuerpo, { color: C.tinta }]}>
                  {nombre}
                </Text>
              ))}
            </View>
          </>
        ) : (
          <Text style={[T.meta, { color: C.suave }]}>
            El 28 de octubre el BOE publica la lista oficial de candidaturas de cada provincia. Las que no tienen ficha en la app
            aparecerán aquí, con su nombre.
          </Text>
        )}
        {url && (
          <Pulsable onPress={() => Linking.openURL(url)} style={s.boe} vibracion="ligera" accessibilityRole="link">
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>Ver la lista oficial en el BOE</Text>
            <Icono nombre="next" tam={14} color={C.tinta} peso="bold" />
          </Pulsable>
        )}
      </View>
    </Revelar>
  );
}

function Grupo({ titulo, partidos, columnas }: { titulo: string; partidos: Partido[]; columnas: number }) {
  // Cuadrícula por filas: las tarjetas de una misma fila miden lo mismo.
  const filas: Partido[][] = [];
  for (let i = 0; i < partidos.length; i += columnas) filas.push(partidos.slice(i, i + columnas));
  return (
    <>
      <Revelar>
        <Text style={[T.seccion, { color: C.sobrePartidos, marginTop: 28 }]} accessibilityRole="header">
          {titulo}
        </Text>
      </Revelar>
      <View style={s.filas}>
        {filas.map((fila, f) => (
          <View key={f} style={s.fila}>
            {fila.map((p, c) => (
              <Revelar key={p.id} retraso={c * 80} style={s.celda}>
                <TarjetaPartido p={p} />
              </Revelar>
            ))}
            {Array.from({ length: columnas - fila.length }, (_, i) => (
              <View key={`hueco-${i}`} style={s.celda} />
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
  const fondo = fondoLegible(p.color);
  const sobre = textoSobre(fondo);

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
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: fondo, borderRadius: R.tarjeta }, capa]} />
      <View style={s.cabecera}>
        <Marca color={activa ? sobre : p.color} tam={14} />
        <Text style={[T.tarjeta, { color: tinta, fontSize: 20, lineHeight: 24, flexShrink: 1 }]}>{p.siglas}</Text>
      </View>
      {p.nombre !== p.siglas && (
        <Text style={[T.meta, { color: tinta, marginTop: 4 }]}>{p.nombre}</Text>
      )}
      {p.territorio && (
        <Text style={[T.meta, { color: tinta, marginTop: 2 }]}>
          Se presenta en <Text style={{ fontFamily: F.textoNegrita, color: tinta }}>{p.territorio}</Text>
        </Text>
      )}
      {p.candidato && (
        <Text style={[T.cuerpo, { color: tinta, marginTop: 10 }]}>
          <Text style={{ color: suave }}>{p.candidata ? 'Candidata' : 'Candidato'}: </Text>
          {p.candidato}
        </Text>
      )}

      {/* Empuja el pie abajo para que todas las tarjetas de la fila acaben igual */}
      <View style={{ flexGrow: 1, minHeight: 14 }} />
      <View style={[s.pie, activa && { borderTopColor: 'rgba(255,255,255,0.3)' }]}>
        <View style={{ flex: 1 }} />
        <Text style={[T.etiqueta, { color: tinta, fontSize: 13.5 }]}>Programa y noticias</Text>
        <Icono nombre="next" tam={14} color={tinta} peso="bold" />
      </View>
    </Pulsable>
  );
}

const s = StyleSheet.create({
  tarjeta: { flex: 1, backgroundColor: C.tarjeta, borderRadius: R.tarjeta, padding: 16, boxShadow: S.tarjeta, overflow: 'hidden' },
  contenedor: { ...CENTRADO, paddingHorizontal: M, paddingTop: 12, paddingBottom: HUECO_BARRA },
  donde: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    padding: 14,
    borderRadius: R.tarjeta,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  dosAtajos: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  dondeIcono: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.relleno, alignItems: 'center', justifyContent: 'center' },
  dondeBoton: { backgroundColor: C.tinta, paddingHorizontal: 14, paddingVertical: 9, borderRadius: R.boton },
  aviso: { color: C.sobrePartidos, opacity: 0.85, marginTop: 14 },
  otras: { backgroundColor: C.tarjeta, borderRadius: R.tarjeta, padding: 16, boxShadow: S.tarjeta, gap: 6, marginTop: 28, maxWidth: ANCHO_LECTURA },
  boe: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 8, paddingVertical: 6 },
  criterio: { color: C.sobrePartidos, opacity: 0.85, marginTop: 28, maxWidth: 640 },
  filas: { gap: 12, marginTop: 12 },
  fila: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  celda: { flex: 1, minWidth: 0 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pie: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.linea },
});
