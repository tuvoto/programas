import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Pantalla from '../components/Pantalla';
import CaraACaraScreen from '../screens/CaraACaraScreen';
import Meta from '../components/Meta';

// /cara-a-cara?a=…&b=…: dos partidos comparados tema a tema.
export default function Ruta() {
  const params = useLocalSearchParams<{ a?: string; b?: string }>();
  // En la web la página se genera sin partidos; se leen ?a= y ?b= al abrirla.
  const leer = () => ({ a: params.a ? String(params.a) : undefined, b: params.b ? String(params.b) : undefined });
  const [elegidos, setElegidos] = useState(Platform.OS === 'web' ? {} : leer());
  useEffect(() => {
    setElegidos(leer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.a, params.b]);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/partidos'));
  return (
    <Pantalla>
      <Meta titulo="Cara a cara" ruta="/cara-a-cara" descripcion="Compara las propuestas de dos partidos tema a tema: vivienda, empleo, sanidad, impuestos y más." />
      <CaraACaraScreen {...elegidos} onVolver={volver} />
    </Pantalla>
  );
}
