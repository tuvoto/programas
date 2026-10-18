import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme';

// Contenedor común: respeta el notch del móvil. El ancho máximo en escritorio
// lo pone cada pantalla dentro de su scroll (CENTRADO), para que la barra de
// desplazamiento quede pegada al borde de la ventana. `fondo` cambia el color de fondo
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
  contenido: { flex: 1, width: '100%' },
});
