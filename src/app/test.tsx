import { router } from 'expo-router';
import Pantalla from '../components/Pantalla';
import TestScreen from '../screens/TestScreen';

// /test: Test de afinidad.
export default function Ruta() {
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Pantalla>
      <TestScreen onVolver={volver} />
    </Pantalla>
  );
}
