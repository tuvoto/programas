import { router } from 'expo-router';
import Pantalla from '../../components/Pantalla';
import TemasScreen from '../../screens/TemasScreen';

export default function Temas() {
  return (
    <Pantalla>
      <TemasScreen onAbrirTema={(t) => router.push(`/tema/${t.id}`)} />
    </Pantalla>
  );
}
