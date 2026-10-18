import Pantalla from '../../components/Pantalla';
import InfoScreen from '../../screens/InfoScreen';
import Meta from '../../components/Meta';

export default function Info() {
  return (
    <Pantalla>
      <Meta titulo="Cómo votar el 29-N" ruta="/vota" descripcion="Fechas clave, voto por correo, dónde votar, qué llevar y cómo votar desde el extranjero en las elecciones generales del 29 de noviembre de 2026." />
      <InfoScreen />
    </Pantalla>
  );
}
