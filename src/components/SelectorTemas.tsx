import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Partido } from '../data/partidos';
import { propuestasDe } from '../data/propuestas';
import { TEMAS } from '../data/temas';
import Pulsable from './Pulsable';
import Icono, { NombreIcono } from './Icono';
import { C, R, S, T } from '../theme';

type Props = { partido: Partido; visible: boolean; onCerrar: () => void };

// Ventana para elegir de qué temas se verán (y descargarán) las propuestas de un partido en PDF.
export default function SelectorTemas({ partido: p, visible, onCerrar }: Props) {
  const temas = TEMAS.map((t) => ({ t, n: propuestasDe(p.id, t.id).length })).filter((x) => x.n > 0);
  const [elegidos, setElegidos] = useState<string[]>(temas.map((x) => x.t.id));

  // Cada vez que se abre, empieza con todos marcados.
  useEffect(() => {
    if (visible) setElegidos(temas.map((x) => x.t.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, p.id]);

  const todos = elegidos.length === temas.length;
  const alternar = (id: string) => setElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  const total = temas.filter((x) => elegidos.includes(x.t.id)).reduce((n, x) => n + x.n, 0);

  // Se cierra la ventana y se abre la vista previa del PDF, que tiene el botón de descargar.
  const ver = () => {
    const seleccion = temas.filter((x) => elegidos.includes(x.t.id)).map((x) => x.t.id);
    onCerrar();
    router.push(`/documento?partido=${p.id}&temas=${seleccion.join(',')}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={s.fondo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCerrar} accessibilityLabel="Cerrar" />
        <View style={s.ventana} accessibilityViewIsModal>
          <View style={s.cabecera}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[T.etiqueta, { color: C.suave, fontSize: 13 }]}>{p.nombre}</Text>
              <Text style={[T.seccion, { color: C.tinta, fontSize: 20 }]} accessibilityRole="header">
                Elige los temas
              </Text>
            </View>
            <Pulsable onPress={onCerrar} style={s.cerrar} accessibilityRole="button" accessibilityLabel="Cerrar">
              <Text style={[T.cuerpoSemi, { color: C.tinta, fontSize: 18, lineHeight: 20 }]}>✕</Text>
            </Pulsable>
          </View>

          <Fila
            texto="Todos los temas"
            marcado={todos}
            negrita
            onPress={() => setElegidos(todos ? [] : temas.map((x) => x.t.id))}
          />
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 4 }}>
            {temas.map(({ t, n }) => (
              <Fila
                key={t.id}
                texto={t.nombre}
                detalle={String(n)}
                icono={t.icono}
                marcado={elegidos.includes(t.id)}
                onPress={() => alternar(t.id)}
              />
            ))}
          </ScrollView>

          <Pulsable
            onPress={ver}
            disabled={elegidos.length === 0}
            style={[s.boton, elegidos.length === 0 && { opacity: 0.45 }]}
            vibracion="ligera"
            accessibilityRole="button"
          >
            <Icono nombre="documento" tam={16} color={C.sobreTinta} peso="bold" />
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14.5 }]}>{`Ver y descargar (${total} propuestas)`}</Text>
          </Pulsable>
        </View>
      </View>
    </Modal>
  );
}

function Fila({
  texto,
  detalle,
  icono,
  marcado,
  negrita,
  onPress,
}: {
  texto: string;
  detalle?: string;
  icono?: NombreIcono;
  marcado: boolean;
  negrita?: boolean;
  onPress: () => void;
}) {
  return (
    <Pulsable
      onPress={onPress}
      style={[s.fila, negrita && s.filaTodos]}
      escala={0.98}
      vibracion="seleccion"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcado }}
      accessibilityLabel={texto}
    >
      <View style={[s.casilla, marcado && s.casillaOn]}>
        {marcado && <Text style={{ color: C.sobreTinta, fontSize: 13, lineHeight: 15, fontWeight: '700' }}>✓</Text>}
      </View>
      {icono && <Icono nombre={icono} tam={18} color={C.suave} />}
      <Text style={[negrita ? T.cuerpoSemi : T.cuerpo, { color: C.tinta, flex: 1 }]}>{texto}</Text>
      {detalle && <Text style={[T.meta, { color: C.suave }]}>{detalle}</Text>}
    </Pulsable>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(18,24,38,0.45)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  ventana: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '88%',
    backgroundColor: C.tarjeta,
    borderRadius: R.tarjeta + 4,
    padding: 18,
    gap: 10,
    boxShadow: S.flotante,
  },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  cerrar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.relleno, alignItems: 'center', justifyContent: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 4 },
  filaTodos: { borderBottomWidth: 1, borderBottomColor: C.linea, paddingBottom: 12 },
  casilla: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.vacia,
    alignItems: 'center',
    justifyContent: 'center',
  },
  casillaOn: { backgroundColor: C.tinta, borderColor: C.tinta },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.tinta,
    paddingVertical: 13,
    borderRadius: R.boton,
    boxShadow: S.boton,
    marginTop: 4,
  },
});
