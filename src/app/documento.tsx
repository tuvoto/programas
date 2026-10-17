import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Pulsable from '../components/Pulsable';
import DocumentoScreen from '../screens/DocumentoScreen';
import { PARTIDOS } from '../data/partidos';
import { TEMAS } from '../data/temas';
import { C, M, R, S, T } from '../theme';

// Ruta /documento?partido=pp&temas=vivienda,empleo: vista previa del PDF antes de descargarlo.
export default function DocumentoRoute() {
  const { partido: pid, temas: tids } = useLocalSearchParams<{ partido: string; temas: string }>();
  const partido = PARTIDOS.find((p) => p.id === String(pid));
  const ids = String(tids ?? '').split(',');
  // Mismo orden que en la app, aunque el enlace los traiga desordenados.
  const temas = TEMAS.filter((t) => ids.includes(t.id));

  const volver = () => (router.canGoBack() ? router.back() : router.replace(partido ? `/partido/${partido.id}` : '/'));

  return (
    <Pantalla fondo="#E9ECF2">
      {partido && temas.length > 0 ? (
        <DocumentoScreen partido={partido} temas={temas} onVolver={volver} />
      ) : (
        <View style={{ padding: M, paddingTop: 28, gap: 12 }}>
          <Text style={[T.titulo, { color: C.tinta }]}>Este documento no existe</Text>
          <Text style={[T.cuerpo, { color: C.suave }]}>Puede que el enlace esté mal copiado.</Text>
          <Pulsable
            onPress={() => router.replace('/partidos')}
            style={{ alignSelf: 'flex-start', backgroundColor: C.tinta, paddingHorizontal: 16, paddingVertical: 11, borderRadius: R.boton, boxShadow: S.boton }}
          >
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>Ver partidos</Text>
          </Pulsable>
        </View>
      )}
    </Pantalla>
  );
}
