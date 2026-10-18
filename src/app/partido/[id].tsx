import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Pantalla from '../../components/Pantalla';
import Pulsable from '../../components/Pulsable';
import PartidoScreen from '../../screens/PartidoScreen';
import { PARTIDOS, partidoPorId } from '../../data/partidos';
import { C, M, R, S, T, suave, CENTRADO } from '../../theme';
import Meta from '../../components/Meta';

// Ruta /partido/<id>: programa completo y noticias de un partido.
// La web genera una página por partido.
export function generateStaticParams() {
  return PARTIDOS.map((p) => ({ id: p.id }));
}

export default function PartidoRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const partido = partidoPorId(String(id));
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/partidos'));

  return (
    <Pantalla fondo={partido ? suave(partido.color, 0.88) : undefined}>
      {partido && <Meta titulo={`${partido.siglas}: programa y noticias`} ruta={`/partido/${partido.id}`} descripcion={`Propuestas de ${partido.siglas} por temas, su programa electoral completo y noticias recientes. Elecciones generales del 29 de noviembre de 2026.`} />}
      {partido ? (
        <PartidoScreen partido={partido} onVolver={volver} />
      ) : (
        <View style={{ ...CENTRADO, padding: M, paddingTop: 28, gap: 12 }}>
          <Text style={[T.titulo, { color: C.tinta }]}>Ese partido no está en la lista</Text>
          <Text style={[T.cuerpo, { color: C.suave }]}>Puede que el enlace esté mal copiado.</Text>
          <Pulsable
            onPress={() => router.replace('/partidos')}
            style={{ alignSelf: 'flex-start', backgroundColor: C.tinta, paddingHorizontal: 16, paddingVertical: 11, borderRadius: R.boton, boxShadow: S.boton }}
          >
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>Ver todos los partidos</Text>
          </Pulsable>
        </View>
      )}
    </Pantalla>
  );
}
