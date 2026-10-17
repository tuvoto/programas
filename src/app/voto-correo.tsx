import { router } from 'expo-router';
import Pantalla from '../components/Pantalla';
import VotoCorreoScreen from '../screens/VotoCorreoScreen';

// /voto-correo: Guía del voto por correo.
export default function Ruta() {
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/vota'));
  return (
    <Pantalla>
      <VotoCorreoScreen onVolver={volver} />
    </Pantalla>
  );
}
