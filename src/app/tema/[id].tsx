import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Pantalla from '../../components/Pantalla';
import ComparativaScreen from '../../screens/ComparativaScreen';
import { temaPorId } from '../../data/temas';
import Pulsable from '../../components/Pulsable';
import { C, M, R, S, T, CENTRADO } from '../../theme';

// Ruta /tema/<id>: en la web se puede compartir el enlace de un tema.
export default function TemaRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tema = temaPorId(String(id));

  // Si se entra directamente por enlace no hay historial al que volver.
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Pantalla>
      {tema ? (
        <ComparativaScreen tema={tema} onVolver={volver} />
      ) : (
        <View style={{ ...CENTRADO, padding: M, paddingTop: 28, gap: 12 }}>
          <Text style={[T.titulo, { color: C.tinta }]}>Ese tema no existe</Text>
          <Text style={[T.cuerpo, { color: C.suave }]}>
            Puede que el enlace esté mal copiado o que el tema haya cambiado de nombre.
          </Text>
          <Pulsable
            onPress={() => router.replace('/')}
            style={{ alignSelf: 'flex-start', backgroundColor: C.tinta, paddingHorizontal: 16, paddingVertical: 11, borderRadius: R.boton, boxShadow: S.boton }}
          >
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>Ver todos los temas</Text>
          </Pulsable>
        </View>
      )}
    </Pantalla>
  );
}
