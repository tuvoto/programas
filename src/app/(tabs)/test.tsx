import Pantalla from '../../components/Pantalla';
import TestScreen from '../../screens/TestScreen';
import Meta from '../../components/Meta';

// /test: Test de afinidad, ahora como pestaña propia.
export default function Test() {
  return (
    <Pantalla>
      <Meta titulo="Test de afinidad" ruta="/test" descripcion="25 o 50 frases para ver con qué programa electoral coincides más en las elecciones del 29-N. No es una recomendación de voto." />
      <TestScreen />
    </Pantalla>
  );
}
