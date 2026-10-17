import Pantalla from '../../components/Pantalla';
import PartidosScreen from '../../screens/PartidosScreen';
import { C } from '../../theme';

export default function Partidos() {
  return (
    <Pantalla fondo={C.fondoPartidos}>
      <PartidosScreen />
    </Pantalla>
  );
}
