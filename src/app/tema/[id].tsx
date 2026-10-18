import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Pantalla from '../../components/Pantalla';
import ComparativaScreen from '../../screens/ComparativaScreen';
import { TEMAS, temaPorId } from '../../data/temas';
import Pulsable from '../../components/Pulsable';
import { C, M, R, S, T, CENTRADO } from '../../theme';
import Meta from '../../components/Meta';

// Ruta /tema/<id>: en la web se puede compartir el enlace de un tema.
// La web genera una página por tema para que Google pueda encontrarlas.
export function generateStaticParams() {
  return TEMAS.map((t) => ({ id: t.id }));
}

export default function TemaRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tema = temaPorId(String(id));

  // Si se entra directamente por enlace no hay historial al que volver.
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Pantalla>
      {tema && <Meta titulo={`${tema.nombre}: qué proponen los partidos`} ruta={`/tema/${tema.id}`} descripcion={`Qué proponen PSOE, PP, Vox, Frente Amplio y el resto de partidos sobre ${tema.nombre.toLowerCase()} para las elecciones del 29-N, con la página de cada programa.`} />}
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
