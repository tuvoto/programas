import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  ReduceMotion,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import * as Haptics from 'expo-haptics';
import { C, F, R, S, T, esWeb } from '../theme';

export type Direccion = 'si' | 'no' | 'igual';
export type TarjetaRef = { lanzar: (d: Direccion) => void };

type Props = {
  tema: string;
  texto: string;
  aFavor?: string;
  enContra?: string;
  onDecidir: (d: Direccion) => void;
  // Desplazamiento extra que mueve la demostración (mano) sin que nadie toque.
  ex?: SharedValue<number>;
  ey?: SharedValue<number>;
  onTocar?: () => void; // al poner el dedo encima
};

// Cuánto hay que arrastrar (o con qué velocidad soltar) para que cuente.
const UMBRAL = 110;
const UMBRAL_VEL = 800;
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

function vibrar() {
  if (!esWeb) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Tarjeta de una frase del test. Derecha = sí, izquierda = no, arriba = me da igual.
// El arrastre corre entero en el hilo de la interfaz; React solo se entera al decidir.
const TarjetaDeslizable = forwardRef<TarjetaRef, Props>(function TarjetaDeslizable({ tema, texto, aFavor, enContra, onDecidir, ex, ey, onTocar }, ref) {
  const { width, height } = useWindowDimensions();
  const reducido = useReducedMotion();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const cero = useSharedValue(0);
  const dx = ex ?? cero;
  const dy = ey ?? cero;
  const tocar = () => onTocar?.();
  const fuera = Math.max(width, 500) * 1.2;

  const decidir = (d: Direccion) => {
    vibrar();
    onDecidir(d);
  };

  // Saca la tarjeta de la pantalla en la dirección elegida y avisa al terminar.
  const salir = (d: Direccion, vx = 0, vy = 0) => {
    'worklet';
    const destX = d === 'si' ? fuera : d === 'no' ? -fuera : 0;
    const destY = d === 'igual' ? -height : vy * 0.05;
    const dur = reducido ? 0 : 220;
    x.set(withTiming(destX + vx * 0.02, { duration: dur, easing: EASE_OUT }));
    y.set(
      withTiming(destY, { duration: dur, easing: EASE_OUT }, (terminado) => {
        if (terminado) scheduleOnRN(decidir, d);
      }),
    );
  };

  useImperativeHandle(ref, () => ({ lanzar: (d) => salir(d) }));

  const arrastre = Gesture.Pan()
    .onBegin(() => {
      if (onTocar) scheduleOnRN(tocar);
    })
    .onUpdate((e) => {
      x.set(e.translationX);
      y.set(e.translationY);
    })
    .onEnd((e) => {
      if (e.translationX > UMBRAL || e.velocityX > UMBRAL_VEL) salir('si', e.velocityX, e.velocityY);
      else if (e.translationX < -UMBRAL || e.velocityX < -UMBRAL_VEL) salir('no', e.velocityX, e.velocityY);
      else if (e.translationY < -UMBRAL || e.velocityY < -UMBRAL_VEL) salir('igual', e.velocityX, e.velocityY);
      else {
        // No llega al umbral: vuelve a su sitio conservando la velocidad del dedo.
        const muelle = { duration: 400, dampingRatio: 0.8, reduceMotion: ReduceMotion.System };
        x.set(withSpring(0, { ...muelle, velocity: e.velocityX }));
        y.set(withSpring(0, { ...muelle, velocity: e.velocityY }));
      }
    });

  const estiloTarjeta = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() + dx.get() },
      { translateY: y.get() + dy.get() },
      { rotate: `${interpolate(x.get() + dx.get(), [-300, 0, 300], [-12, 0, 12])}deg` },
    ],
  }));
  const estiloSi = useAnimatedStyle(() => ({ opacity: interpolate(x.get() + dx.get(), [20, UMBRAL], [0, 1], 'clamp') }));
  const estiloNo = useAnimatedStyle(() => ({ opacity: interpolate(x.get() + dx.get(), [-UMBRAL, -20], [1, 0], 'clamp') }));
  const estiloIgual = useAnimatedStyle(() => {
    const tx = x.get() + dx.get();
    const ty = y.get() + dy.get();
    return { opacity: interpolate(ty, [-UMBRAL, -20], [1, 0], 'clamp') * interpolate(Math.abs(tx), [0, 60], [1, 0], 'clamp') };
  });

  return (
    <GestureDetector gesture={arrastre}>
      <Animated.View style={[s.tarjeta, estiloTarjeta]} accessible accessibilityLabel={`${tema}. ${texto}${aFavor ? `. A favor: ${aFavor}` : ''}${enContra ? `. En contra: ${enContra}` : ''}`}>
        <Text style={[T.etiqueta, { color: C.suave, fontSize: 13 }]}>{tema}</Text>
        <Text style={[T.seccion, s.texto, aFavor ? s.textoConContexto : null]}>{texto}</Text>
        {aFavor && enContra && (
          <View style={s.contexto}>
            <Text style={[T.meta, { color: C.suave }]}>
              <Text style={{ fontFamily: F.textoSemi, color: C.tinta }}>A favor: </Text>
              {aFavor}
            </Text>
            <Text style={[T.meta, { color: C.suave }]}>
              <Text style={{ fontFamily: F.textoSemi, color: C.tinta }}>En contra: </Text>
              {enContra}
            </Text>
          </View>
        )}

        <Animated.View style={[s.sello, s.selloSi, estiloSi]} pointerEvents="none">
          <Text style={[T.etiqueta, s.selloTexto, { color: C.okTexto }]}>SÍ</Text>
        </Animated.View>
        <Animated.View style={[s.sello, s.selloNo, estiloNo]} pointerEvents="none">
          <Text style={[T.etiqueta, s.selloTexto, { color: '#9B2C2C' }]}>NO</Text>
        </Animated.View>
        <Animated.View style={[s.sello, s.selloIgual, estiloIgual]} pointerEvents="none">
          <Text style={[T.etiqueta, s.selloTexto, { color: C.suave }]}>ME DA IGUAL</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
});

export default TarjetaDeslizable;

// Tarjeta de detrás: asoma para indicar que hay más, sin adelantar la frase.
export function TarjetaFondo() {
  return <View style={[s.tarjeta, s.fondo]} pointerEvents="none" importantForAccessibility="no-hide-descendants" />;
}

const s = StyleSheet.create({
  tarjeta: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: C.tarjeta,
    borderRadius: R.tarjeta + 4,
    padding: 22,
    boxShadow: S.flotante,
    justifyContent: 'center',
    gap: 14,
  },
  fondo: { transform: [{ scale: 0.95 }, { translateY: 14 }], opacity: 0.7, boxShadow: S.tarjeta },
  texto: { color: C.tinta, fontSize: 25, lineHeight: 32 },
  textoConContexto: { fontSize: 21, lineHeight: 27 },
  contexto: { gap: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.linea, paddingTop: 12 },
  sello: { position: 'absolute', top: 22, borderWidth: 2.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  selloSi: { left: 22, borderColor: C.okTexto, transform: [{ rotate: '-10deg' }] },
  selloNo: { right: 22, borderColor: '#9B2C2C', transform: [{ rotate: '10deg' }] },
  selloIgual: { top: 'auto', bottom: 22, alignSelf: 'center', borderColor: C.suave },
  selloTexto: { fontSize: 18, letterSpacing: 1.5 },
});
