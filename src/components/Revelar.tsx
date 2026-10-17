// Animaciones al hacer scroll, al estilo de las webs de producto:
//   - <ScrollAnimado> sustituye a ScrollView y comparte la posición del scroll.
//   - <Revelar> hace que un bloque aparezca (sube y se funde) la primera vez
//     que entra en pantalla en cada visita a la pestaña: al salir se reinicia
//     y al volver se anima otra vez. Con «retraso» se escalonan los de una fila.
//   - <Paralaje> mueve un bloque más despacio que el scroll y lo va apagando.
//
// Todo corre en el hilo de la interfaz (Reanimated), sin renders de React por
// cada fotograma. Con «Reducir movimiento» activado, todo aparece sin animar.
import { ReactNode, createContext, useCallback, useContext } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, {
  AnimatedScrollViewProps,
  Easing,
  Extrapolation,
  SharedValue,
  cancelAnimation,
  interpolate,
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
type Contexto = { y: SharedValue<number>; activa: SharedValue<number> };
const Scroll = createContext<Contexto | null>(null);

export function ScrollAnimado({ children, ...props }: AnimatedScrollViewProps & { children: ReactNode }) {
  const y = useSharedValue(0);
  // 1 mientras la pestaña está a la vista; 0 al irse, para que todo se reinicie.
  const activa = useSharedValue(1);
  useFocusEffect(
    useCallback(() => {
      activa.set(1);
      return () => activa.set(0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  const onScroll = useAnimatedScrollHandler((e) => {
    y.set(e.contentOffset.y);
  });
  return (
    <Scroll.Provider value={{ y, activa }}>
      <Animated.ScrollView {...props} onScroll={onScroll} scrollEventThrottle={16}>
        {children}
      </Animated.ScrollView>
    </Scroll.Provider>
  );
}

type RevelarProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  retraso?: number; // ms, para escalonar
  distancia?: number; // px que sube al aparecer
};

export function Revelar({ children, style, retraso = 0, distancia = 32 }: RevelarProps) {
  const ctx = useContext(Scroll);
  const scrollY = ctx?.y;
  const activa = ctx?.activa;
  const reducido = useReducedMotion();
  const { height } = useWindowDimensions();
  const ref = useAnimatedRef<Animated.View>();
  const p = useSharedValue(reducido ? 1 : 0);
  const lanzado = useSharedValue(reducido);
  const medido = useSharedValue(0);

  useAnimatedReaction(
    () => [scrollY ? scrollY.get() : 0, medido.get(), activa ? activa.get() : 1],
    () => {
      if (reducido) return;
      // Fuera de la pestaña: se esconde para volver a aparecer al regresar.
      if (activa && activa.get() === 0) {
        if (lanzado.get()) {
          lanzado.set(false);
          cancelAnimation(p);
          p.set(0);
        }
        return;
      }
      if (lanzado.get() || medido.get() === 0) return;
      const m = measure(ref);
      // Si no se puede medir, se muestra sin más: nunca debe quedar oculto.
      if (!m || m.pageY < height - 24) {
        lanzado.set(true);
        p.set(withDelay(retraso, withTiming(1, { duration: 650, easing: EASE_OUT })));
      }
    },
  );

  const estilo = useAnimatedStyle(() => ({
    opacity: p.get(),
    transform: [{ translateY: (1 - p.get()) * distancia }, { scale: 0.96 + 0.04 * p.get() }],
  }));

  return (
    <Animated.View ref={ref} style={[style, estilo]} onLayout={() => medido.set(medido.get() + 1)}>
      {children}
    </Animated.View>
  );
}

export function Paralaje({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const scrollY = useContext(Scroll)?.y;
  const reducido = useReducedMotion();
  const estilo = useAnimatedStyle(() => {
    const y = scrollY ? Math.max(0, scrollY.get()) : 0;
    if (reducido) return { opacity: interpolate(y, [0, 220], [1, 0.25], Extrapolation.CLAMP) };
    return {
      opacity: interpolate(y, [0, 220], [1, 0.25], Extrapolation.CLAMP),
      transform: [{ translateY: y * 0.35 }, { scale: interpolate(y, [0, 220], [1, 0.94], Extrapolation.CLAMP) }],
    };
  });
  return <Animated.View style={[{ transformOrigin: 'left top' }, style, estilo]}>{children}</Animated.View>;
}
