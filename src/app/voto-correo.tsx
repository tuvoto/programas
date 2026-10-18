import { router } from 'expo-router';
import Pantalla from '../components/Pantalla';
import VotoCorreoScreen from '../screens/VotoCorreoScreen';
import Meta from '../components/Meta';

// /voto-correo: Guía del voto por correo.
export default function Ruta() {
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/vota'));
  return (
    <Pantalla>
      <Meta titulo="Voto por correo" ruta="/voto-correo" descripcion="Cómo votar por correo en las elecciones generales del 29 de noviembre de 2026, paso a paso y con los plazos." />
      <VotoCorreoScreen onVolver={volver} />
    </Pantalla>
  );
}
