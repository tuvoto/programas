import { router } from 'expo-router';
import { Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Pulsable from '../components/Pulsable';
import { C, M, R, S, T, CENTRADO } from '../theme';

// Cualquier dirección que no existe en la app.
export default function NoEncontrada() {
  return (
    <Pantalla>
      <View style={{ ...CENTRADO, padding: M, paddingTop: 28, gap: 12 }}>
        <Text style={[T.titulo, { color: C.tinta }]} accessibilityRole="header">
          Esta página no existe
        </Text>
        <Text style={[T.cuerpo, { color: C.suave }]}>
          Puede que el enlace esté mal copiado o que la página haya cambiado de dirección.
        </Text>
        <Pulsable
          onPress={() => router.replace('/')}
          style={{ alignSelf: 'flex-start', backgroundColor: C.tinta, paddingHorizontal: 16, paddingVertical: 11, borderRadius: R.boton, boxShadow: S.boton }}
          accessibilityRole="button"
        >
          <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>Ir al inicio</Text>
        </Pulsable>
      </View>
    </Pantalla>
  );
}
