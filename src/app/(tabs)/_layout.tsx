import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import BarraPestanas, { PosicionBarra } from '../../components/BarraPestanas';
import { C } from '../../theme';
import { useAbrirDesdeAviso } from '../../lib/avisos';
import { elegirProvincia } from '../../lib/provincia';

export default function TabsLayout() {
  // Al tocar un aviso de fechas, se abre la sección que toca (solo en el móvil).
  useAbrirDesdeAviso();
  // La provincia elegida en Partidos se borra al pasar a Temas o a Cómo votar: al
  // volver, Partidos muestra toda España.
  const ruta = usePathname();
  // En pantallas anchas, menú de web en vez de la barra flotante del móvil. Se
  // decide después de abrir la página para que la web generada coincida.
  const { width } = useWindowDimensions();
  const [ancha, setAncha] = useState(false);
  useEffect(() => setAncha(width >= 1000), [width]);
  const posicion: PosicionBarra = ancha ? 'arriba' : 'abajo';
  useEffect(() => {
    if (ruta === '/' || ruta === '/vota') elegirProvincia(null);
  }, [ruta]);
  return (
    <Tabs
      tabBar={(props) => <BarraPestanas {...props} posicion={posicion} />}
      screenOptions={{
        headerShown: false,
        // Cambiar de pestaña es instantáneo: se hace muchas veces y no hay jerarquía.
        animation: 'none',
        sceneStyle: { backgroundColor: C.fondo },
        tabBarPosition: posicion === 'arriba' ? 'top' : 'bottom',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Temas' }} />
      <Tabs.Screen name="test" options={{ title: 'Test' }} />
      <Tabs.Screen name="partidos" options={{ title: 'Partidos' }} />
      <Tabs.Screen name="vota" options={{ title: 'Cómo votar' }} />
    </Tabs>
  );
}
