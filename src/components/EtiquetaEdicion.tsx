import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Partido } from '../data/partidos';
import { edicionVigente, programaNuevo } from '../data/propuestas';
import { C, R, T } from '../theme';

// Qué programa se está mostrando de un partido: «Programa 2026» (y «Nuevo»
// durante la primera semana) o «Programa de 2023» mientras no haya uno nuevo.
// «Nuevo» depende de la fecha de hoy, así que se calcula al montar (en la web
// la página se genera antes y no debe salir distinta al cargar).
export function useNuevo(p: Partido): boolean {
  const [nuevo, setNuevo] = useState(false);
  useEffect(() => setNuevo(programaNuevo(p, new Date())), [p]);
  return nuevo;
}

export default function EtiquetaEdicion({ p, corta = false }: { p: Partido; corta?: boolean }) {
  const edicion = edicionVigente(p.id);
  const nuevo = useNuevo(p);
  if (!edicion) return null;
  return (
    <View style={s.fila}>
      {nuevo && (
        <View style={[s.chip, { backgroundColor: C.amarillo }]}>
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 12 }]}>Nuevo</Text>
        </View>
      )}
      <View style={[s.chip, { backgroundColor: edicion === 2026 ? C.okFondo : C.relleno }]}>
        <Text style={[T.etiqueta, { color: edicion === 2026 ? C.okTexto : C.suave, fontSize: 12 }]}>
          {edicion === 2026 ? (corta ? '2026' : 'Programa 2026') : corta ? '2023' : 'Programa de 2023'}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 6, marginLeft: 'auto', alignItems: 'center' },
  chip: { borderRadius: R.pildora, paddingHorizontal: 9, paddingVertical: 3 },
});
