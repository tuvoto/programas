import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Pantalla from '../components/Pantalla';
import BuscarScreen from '../screens/BuscarScreen';
import Meta from '../components/Meta';

// /buscar?q=…: buscador de propuestas en todos los programas.
export default function Ruta() {
  const params = useLocalSearchParams<{ q?: string }>();
  // En la web la página se genera sin búsqueda; se lee ?q= al abrirla.
  const [inicial, setInicial] = useState(Platform.OS === 'web' ? '' : String(params.q ?? ''));
  useEffect(() => {
    if (params.q) setInicial(String(params.q));
  }, [params.q]);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Pantalla>
      <Meta titulo="Buscar en los programas" ruta="/buscar" descripcion="Escribe una medida, como alquiler o salario mínimo, y mira qué propone cada partido en su programa electoral." />
      <BuscarScreen inicial={inicial} onVolver={volver} />
    </Pantalla>
  );
}
