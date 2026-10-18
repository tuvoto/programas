import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Pantalla from '../../../components/Pantalla';
import Pulsable from '../../../components/Pulsable';
import FichaScreen from '../../../screens/FichaScreen';
import { PARTIDOS } from '../../../data/partidos';
import { TEMAS, temaPorId } from '../../../data/temas';
import { crearFicha } from '../../../lib/ficha';
import { C, M, R, S, T } from '../../../theme';
import Meta from '../../../components/Meta';

// Ruta /ficha/<tema>/<partido>: todo lo que dice un partido sobre un tema,
// en formato documento y descargable en PDF.
// La web genera una página por cada tema y partido.
export function generateStaticParams() {
  return TEMAS.flatMap((t) => PARTIDOS.map((p) => ({ tema: t.id, partido: p.id })));
}

export default function FichaRoute() {
  const { tema: temaId, partido: partidoId } = useLocalSearchParams<{ tema: string; partido: string }>();
  const tema = temaPorId(String(temaId));
  const partido = PARTIDOS.find((p) => p.id === String(partidoId));

  // Si se entra directamente por enlace no hay historial al que volver.
  const volver = () =>
    router.canGoBack() ? router.back() : router.replace(tema ? `/tema/${tema.id}` : '/');

  return (
    <Pantalla>
      {tema && partido && <Meta titulo={`${partido.siglas} · ${tema.nombre}`} ruta={`/ficha/${tema.id}/${partido.id}`} descripcion={`Todo lo que propone ${partido.siglas} sobre ${tema.nombre.toLowerCase()} en su programa, con la página de cada propuesta. Elecciones del 29-N.`} />}
      {tema && partido ? (
        <FichaScreen ficha={crearFicha(partido, tema)} onVolver={volver} />
      ) : (
        <View style={{ padding: M, paddingTop: 28, gap: 12 }}>
          <Text style={[T.titulo, { color: C.tinta }]}>Esta ficha no existe</Text>
          <Text style={[T.cuerpo, { color: C.suave }]}>
            Puede que el enlace esté mal copiado o que el tema o el partido hayan cambiado.
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
