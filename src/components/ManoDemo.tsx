// Mano que enseña cómo se responde el test, como en las apps de deslizar:
// arrastra la tarjeta a la derecha y a la izquierda, y después
// pulsa los tres botones. Se repite hasta que la persona toca algo.
//
// Todo se anima en el hilo de la interfaz con secuencias de Reanimated que
// comparten la misma duración, así la mano, la tarjeta y los botones van a la vez.
import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { C } from '../theme';

const MANO =
  'M224,104v50.93c0,46.2-36.85,84.55-83,85.06A83.71,83.71,0,0,1,80.6,215.4C58.79,192.33,34.15,136,34.15,136a16,16,0,0,1,6.53-22.23c7.66-4,17.1-.84,21.4,6.62l21,36.44a6.09,6.09,0,0,0,6,3.09l.12,0A8.19,8.19,0,0,0,96,151.74V32a16,16,0,0,1,16.77-16c8.61.4,15.23,7.82,15.23,16.43V104a8,8,0,0,0,8.53,8,8.17,8.17,0,0,0,7.47-8.25V88a16,16,0,0,1,16.77-16c8.61.4,15.23,7.82,15.23,16.43V112a8,8,0,0,0,8.53,8,8.17,8.17,0,0,0,7.47-8.25v-7.28c0-8.61,6.62-16,15.23-16.43A16,16,0,0,1,224,104Z';
const TAM = 58;
// Punta del dedo dentro del icono (viewBox de 256).
const PUNTA = { x: (112 / 256) * TAM, y: (18 / 256) * TAM };
const EASE = Easing.bezier(0.77, 0, 0.175, 1); // movimiento en pantalla
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export type Punto = { x: number; y: number };
export type PosicionesDemo = { tarjeta: Punto; no: Punto; igual: Punto; si: Punto };

type Paso = Partial<Record<Clave, number>> & { t: number; curva?: 'mover' | 'salir' };
type Clave = 'hx' | 'hy' | 'ho' | 'hs' | 'ex' | 'ey' | 'pNo' | 'pIgual' | 'pSi';
const CLAVES: Clave[] = ['hx', 'hy', 'ho', 'hs', 'ex', 'ey', 'pNo', 'pIgual', 'pSi'];

// Guion de la demostración. Cada paso dura «t» ms; lo que no cambia se mantiene.
function guion(p: PosicionesDemo): Paso[] {
  const { tarjeta: c } = p;
  const D = 110; // lo que se arrastra la tarjeta: suficiente para que salga el sello
  const arrastre = (dx: number, dy: number): Paso[] => [
    { t: 160, hs: 0.86, curva: 'salir' }, // apoya el dedo
    { t: 650, hx: c.x + dx, hy: c.y + dy, ex: dx, ey: dy },
    { t: 450 },
    { t: 480, hx: c.x, hy: c.y, ex: 0, ey: 0 },
    { t: 160, hs: 1, curva: 'salir' }, // levanta el dedo
    { t: 260 },
  ];
  const boton = (b: Punto, presion: 'pNo' | 'pIgual' | 'pSi', ex: number, ey: number): Paso[] => [
    { t: 520, hx: b.x, hy: b.y },
    { t: 140, hs: 0.86, [presion]: 0.86, ex, ey, curva: 'salir' },
    { t: 260 },
    { t: 200, hs: 1, [presion]: 1, ex: 0, ey: 0, curva: 'salir' },
    { t: 220 },
  ];
  return [
    { t: 1, hx: c.x, hy: c.y + 30, ho: 0, hs: 1, ex: 0, ey: 0, pNo: 1, pIgual: 1, pSi: 1 },
    { t: 350, ho: 1, hy: c.y, curva: 'salir' },
    ...arrastre(D, 0),
    ...arrastre(-D, 0),
    ...boton(p.no, 'pNo', -36, 0),
    ...boton(p.igual, 'pIgual', 0, -36),
    ...boton(p.si, 'pSi', 36, 0),
    { t: 300, ho: 0, curva: 'salir' },
    { t: 900 },
  ];
}

export type Demo = {
  ex: SharedValue<number>;
  ey: SharedValue<number>;
  pNo: SharedValue<number>;
  pIgual: SharedValue<number>;
  pSi: SharedValue<number>;
  parar: () => void;
  mano: { hx: SharedValue<number>; hy: SharedValue<number>; ho: SharedValue<number>; hs: SharedValue<number> };
};

// Valores compartidos de la demo. Con «activa» y las posiciones medidas, arranca.
export function useDemo(activa: boolean, pos: PosicionesDemo | null): Demo {
  const reducido = useReducedMotion();
  const v = {
    hx: useSharedValue(0),
    hy: useSharedValue(0),
    ho: useSharedValue(0),
    hs: useSharedValue(1),
    ex: useSharedValue(0),
    ey: useSharedValue(0),
    pNo: useSharedValue(1),
    pIgual: useSharedValue(1),
    pSi: useSharedValue(1),
  };

  useEffect(() => {
    if (!activa || !pos || reducido) return;
    const pasos = guion(pos);
    for (const k of CLAVES) {
      let actual = pasos[0][k] ?? 0;
      const tramos = pasos.map((p) => {
        if (p[k] != null) actual = p[k]!;
        return withTiming(actual, { duration: p.t, easing: p.curva === 'salir' ? EASE_OUT : EASE });
      });
      v[k].set(withRepeat(withSequence(...tramos), -1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa, pos?.tarjeta.x, pos?.tarjeta.y, pos?.si.x, reducido]);

  const parar = useCallback(() => {
    for (const k of CLAVES) cancelAnimation(v[k]);
    const suave = { duration: 200, easing: EASE_OUT };
    v.ho.set(withTiming(0, suave));
    v.ex.set(withTiming(0, suave));
    v.ey.set(withTiming(0, suave));
    v.pNo.set(withTiming(1, suave));
    v.pIgual.set(withTiming(1, suave));
    v.pSi.set(withTiming(1, suave));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ex: v.ex, ey: v.ey, pNo: v.pNo, pIgual: v.pIgual, pSi: v.pSi, parar, mano: { hx: v.hx, hy: v.hy, ho: v.ho, hs: v.hs } };
}

export function ManoDemo({ demo }: { demo: Demo }) {
  const { hx, hy, ho, hs } = demo.mano;
  const estilo = useAnimatedStyle(() => ({
    opacity: ho.get(),
    transform: [{ translateX: hx.get() - PUNTA.x }, { translateY: hy.get() - PUNTA.y }, { scale: hs.get() }],
  }));
  return (
    <Animated.View style={[s.mano, estilo]} pointerEvents="none" aria-hidden>
      <Svg width={TAM} height={TAM} viewBox="0 0 256 256">
        {/* Borde blanco para que se vea sobre la tarjeta y sobre el fondo */}
        <Path d={MANO} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={22} strokeLinejoin="round" />
        <Path d={MANO} fill={C.tinta} />
      </Svg>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  mano: { position: 'absolute', left: 0, top: 0, width: TAM, height: TAM, transformOrigin: `${PUNTA.x}px ${PUNTA.y}px`, zIndex: 10 },
});
