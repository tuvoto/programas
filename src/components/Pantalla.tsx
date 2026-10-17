import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ANCHO_MAX, C } from '../theme';

// Contenedor común: respeta el notch del móvil y, en web/escritorio,
// limita el ancho del contenido y lo centra. `fondo` cambia el color de fondo
// de toda la pantalla (incluida la zona de la barra de estado).
export default function Pantalla({ children, fondo }: { children: ReactNode; fondo?: string }) {
  return (
    <SafeAreaView style={[s.raiz, fondo && { backgroundColor: fondo }]} edges={['top']}>
      <View style={s.contenido}>{children}</View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: C.fondo },
  contenido: { flex: 1, width: '100%', maxWidth: ANCHO_MAX, alignSelf: 'center' },
});
