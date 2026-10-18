import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COMUNIDADES, PROVINCIAS } from '../data/provincias';
import { elegirProvincia } from '../lib/provincia';
import Pulsable from './Pulsable';
import { C, R, S, T } from '../theme';

type Props = { visible: boolean; actual: string | null; onCerrar: () => void };

// Ventana para elegir la provincia en la que se vota.
export default function SelectorProvincia({ visible, actual, onCerrar }: Props) {
  const elegir = (id: string | null) => {
    elegirProvincia(id);
    onCerrar();
  };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={s.fondo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCerrar} accessibilityLabel="Cerrar" />
        <View style={s.ventana} accessibilityViewIsModal>
          <View style={s.cabecera}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[T.seccion, { color: C.tinta, fontSize: 20 }]} accessibilityRole="header">
                ¿Dónde votas?
              </Text>
              <Text style={[T.meta, { color: C.suave }]}>Votas en la provincia en la que estás empadronado.</Text>
            </View>
            <Pulsable onPress={onCerrar} style={s.cerrar} accessibilityRole="button" accessibilityLabel="Cerrar">
              <Text style={[T.cuerpoSemi, { color: C.tinta, fontSize: 18, lineHeight: 20 }]}>✕</Text>
            </Pulsable>
          </View>

          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 4 }}>
            {actual && (
              <Pulsable onPress={() => elegir(null)} style={s.todas} accessibilityRole="button">
                <Text style={[T.cuerpoSemi, { color: C.tinta }]}>Ver todos los partidos</Text>
              </Pulsable>
            )}
            {COMUNIDADES.map((c) => (
              <View key={c.id} style={s.grupo}>
                <Text style={[T.etiqueta, { color: C.suave, fontSize: 12.5 }]}>{c.nombre}</Text>
                <View style={s.lista}>
                  {PROVINCIAS.filter((p) => p.comunidad === c.id).map((p) => {
                    const on = p.id === actual;
                    return (
                      <Pulsable
                        key={p.id}
                        onPress={() => elegir(p.id)}
                        style={[s.chip, on && s.chipOn]}
                        escala={0.97}
                        vibracion="seleccion"
                        accessibilityRole="radio"
                        accessibilityState={{ selected: on }}
                      >
                        <Text style={[T.etiqueta, { color: on ? C.sobreTinta : C.tinta, fontSize: 14 }]}>{p.nombre}</Text>
                      </Pulsable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(18,24,38,0.45)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  ventana: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '88%',
    backgroundColor: C.tarjeta,
    borderRadius: R.tarjeta + 4,
    padding: 18,
    gap: 12,
    boxShadow: S.flotante,
  },
  cabecera: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cerrar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.relleno, alignItems: 'center', justifyContent: 'center' },
  todas: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: R.boton, backgroundColor: C.relleno, marginBottom: 6 },
  grupo: { gap: 8, paddingVertical: 8 },
  lista: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: R.pildora, backgroundColor: C.relleno },
  chipOn: { backgroundColor: C.tinta },
});
