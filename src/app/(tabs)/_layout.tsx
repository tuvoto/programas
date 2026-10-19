import { Tabs } from 'expo-router';
import BarraPestanas from '../../components/BarraPestanas';
import { C } from '../../theme';
import { useAbrirDesdeAviso } from '../../lib/avisos';

export default function TabsLayout() {
  // Al tocar un aviso de fechas, se abre la sección que toca (solo en el móvil).
  useAbrirDesdeAviso();
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
