import { Tabs } from 'expo-router';
import BarraPestanas from '../../components/BarraPestanas';
import { C } from '../../theme';

export default function TabsLayout() {
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
