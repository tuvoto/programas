import { router } from 'expo-router';
import Pantalla from '../components/Pantalla';
import TestScreen from '../screens/TestScreen';
import Meta from '../components/Meta';

// /test: Test de afinidad.
export default function Ruta() {
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Pantalla>
      <Meta titulo="Test de afinidad" ruta="/test" descripcion="50 frases para ver con qué programa electoral coincides más en las elecciones del 29-N. No es una recomendación de voto." />
      <TestScreen onVolver={volver} />
    </Pantalla>
  );
}
