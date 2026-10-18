import Pantalla from '../../components/Pantalla';
import PartidosScreen from '../../screens/PartidosScreen';
import { C } from '../../theme';
import Meta from '../../components/Meta';

export default function Partidos() {
  return (
    <Pantalla fondo={C.fondoPartidos}>
      <Meta titulo="Partidos" ruta="/partidos" descripcion="Los partidos que se presentan a las elecciones generales del 29-N: candidatos, programas en PDF y noticias recientes." />
      <PartidosScreen />
    </Pantalla>
  );
}
