import { ReactNode } from 'react';
import { Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Curva "ease-out" fuerte: responde rápido nada más tocar.
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

type Vibracion = 'ninguna' | 'seleccion' | 'ligera';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  /** Cuánto se encoge al tocar (0.97 = un 3 %). */
  escala?: number;
  /** Vibración al tocar (solo en móvil). */
  vibracion?: Vibracion;
};

function vibrar(tipo: Vibracion) {
  if (Platform.OS === 'web' || tipo === 'ninguna') return;
  if (tipo === 'seleccion') Haptics.selectionAsync().catch(() => {});
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Botón que se encoge un poco en cuanto el dedo toca (no al soltar) y vuelve
// a su tamaño al soltar. La animación corre en el hilo de la interfaz, así que
// sigue fluida aunque la app esté ocupada.
export default function Pulsable({
  style,
  children,
  escala = 0.97,
  vibracion = 'ninguna',
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: Props) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      hitSlop={rest.hitSlop ?? 6}
      pressRetentionOffset={16}
      onPressIn={(e) => {
        s.set(withTiming(escala, { duration: 110, easing: EASE_OUT }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.set(withTiming(1, { duration: 180, easing: EASE_OUT }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        vibrar(vibracion);
        onPress?.(e);
      }}
      style={[style, anim]}
    >
      {children}
    </AnimatedPressable>
  );
}
