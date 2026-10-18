import { router } from 'expo-router';
import Pantalla from '../../components/Pantalla';
import TemasScreen from '../../screens/TemasScreen';
import Meta from '../../components/Meta';

export default function Temas() {
  return (
    <Pantalla>
      <Meta titulo="TuVoto" ruta="/" descripcion="Compara qué propone cada partido sobre vivienda, empleo, sanidad y otros 9 temas para las elecciones generales del 29 de noviembre de 2026, con la página de cada programa." />
      <TemasScreen onAbrirTema={(t) => router.push(`/tema/${t.id}`)} />
    </Pantalla>
  );
}
