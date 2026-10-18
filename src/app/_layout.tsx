import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { C } from '../theme';
import { CONFIG } from '../config';

// Web: el contador cuenta solo la primera página; al cambiar de pantalla
// dentro de la web se le avisa aquí.
function useContarVisitas() {
  const ruta = usePathname();
  const primera = useRef(true);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (primera.current) {
      primera.current = false;
      return;
    }
    const gc = (window as unknown as { goatcounter?: { count?: (o: { path: string }) => void } }).goatcounter;
    const base = new URL(CONFIG.webUrl).pathname.replace(/\/$/, '');
    gc?.count?.({ path: base + ruta });
  }, [ruta]);
}

export default function RootLayout() {
  useContarVisitas();
  // Las fuentes están copiadas en assets/fuentes con nombres cortos: así la web
  // no depende de rutas largas dentro de node_modules (Windows y GitHub Pages
  // las perdían al publicar).
  const [cargadas, error] = useFonts({
    BricolageGrotesque_600SemiBold: require('../../assets/fuentes/bricolage-600.ttf'),
    BricolageGrotesque_800ExtraBold: require('../../assets/fuentes/bricolage-800.ttf'),
    Figtree_400Regular: require('../../assets/fuentes/figtree-400.ttf'),
    Figtree_500Medium: require('../../assets/fuentes/figtree-500.ttf'),
    Figtree_600SemiBold: require('../../assets/fuentes/figtree-600.ttf'),
    Figtree_700Bold: require('../../assets/fuentes/figtree-700.ttf'),
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
