import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import { C } from '../theme';

export default function RootLayout() {
  const [cargadas, error] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_800ExtraBold,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  // Si las fuentes fallan, la app sigue funcionando con la fuente del sistema.
  if (!cargadas && !error) return null;

  return (
    // Necesario para los gestos (tarjetas del test).
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.fondo } }}>
        <Stack.Screen name="(tabs)" />
        {/* Abrir un tema: la transición nativa de la plataforma (desliza desde la derecha) */}
        <Stack.Screen name="tema/[id]" options={{ animation: 'default' }} />
        <Stack.Screen name="ficha/[tema]/[partido]" options={{ animation: 'default' }} />
        <Stack.Screen name="partido/[id]" options={{ animation: 'default' }} />
        <Stack.Screen name="voto-correo" options={{ animation: 'default' }} />
        <Stack.Screen name="test" options={{ animation: 'default' }} />
        <Stack.Screen name="documento" options={{ animation: 'default' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
