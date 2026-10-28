import { useEffect } from 'react';
import { Tabs, usePathname } from 'expo-router';
import BarraPestanas from '../../components/BarraPestanas';
import { C } from '../../theme';
import { useAbrirDesdeAviso } from '../../lib/avisos';
import { elegirProvincia } from '../../lib/provincia';

export default function TabsLayout() {
  // Al tocar un aviso de fechas, se abre la sección que toca (solo en el móvil).
  useAbrirDesdeAviso();
  // La provincia elegida en Partidos se borra al pasar a Temas o a Vota: al
  // volver, Partidos muestra toda España.
  const ruta = usePathname();
  useEffect(() => {
    if (ruta === '/' || ruta === '/vota') elegirProvincia(null);
  }, [ruta]);
  return (
    <Tabs
      tabBar={(props) => <BarraPestanas {...props} />}
      screenOptions={{
        headerShown: false,
        // Cambiar de pestaña es instantáneo: se hace muchas veces y no hay jerarquía.
        animation: 'none',
        sceneStyle: { backgroundColor: C.fondo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Temas' }} />
      <Tabs.Screen name="partidos" options={{ title: 'Partidos' }} />
      <Tabs.Screen name="vota" options={{ title: 'Vota' }} />
    </Tabs>
  );
}
