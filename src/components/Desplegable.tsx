import { ReactNode, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Pulsable from './Pulsable';
import Icono, { NombreIcono } from './Icono';
import { C, PALETA, R, S, T } from '../theme';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const ENTRAR = FadeIn.duration(200).easing(EASE_OUT);

type Props = {
  titulo: string;
  icono?: NombreIcono;
  resumen?: string; // una línea bajo el título, visible aunque esté cerrado
  color?: number; // posición en la PALETA para el cuadro del icono
  abierto?: boolean; // cómo empieza
  children: ReactNode;
};

// Tarjeta que se abre y se cierra al tocar su cabecera.
export default function Desplegable({ titulo, icono, resumen, color, abierto: inicial = false, children }: Props) {
  const tono = color == null ? null : PALETA[color % PALETA.length];
  const [abierto, setAbierto] = useState(inicial);
  const flecha = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(abierto ? '180deg' : '0deg', { duration: 180, easing: EASE_OUT }) }],
  }));

  return (
    <View style={s.tarjeta}>
      <Pulsable
        onPress={() => setAbierto((a) => !a)}
        style={s.cabecera}
        escala={0.99}
        vibracion="seleccion"
        accessibilityRole="button"
        accessibilityState={{ expanded: abierto }}
        accessibilityLabel={titulo}
      >
        {icono && (
          <View style={[s.icono, tono && { backgroundColor: tono.fondo }]}>
            <Icono nombre={icono} tam={20} color={tono ? tono.dibujo : C.tinta} peso={tono ? 'bold' : 'regular'} />
          </View>
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[T.tarjeta, { color: C.tinta, fontSize: 17, lineHeight: 21 }]}>{titulo}</Text>
          {resumen && <Text style={[T.meta, { color: C.suave }]}>{resumen}</Text>}
        </View>
        <Animated.View style={flecha}>
          <Icono nombre="abajo" tam={16} color={C.suave} peso="bold" />
        </Animated.View>
      </Pulsable>
      {abierto && (
        <Animated.View entering={ENTRAR} style={s.cuerpo}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tarjeta: { backgroundColor: C.tarjeta, borderRadius: R.tarjeta, boxShadow: S.tarjeta, overflow: 'hidden' },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  icono: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.relleno, alignItems: 'center', justifyContent: 'center' },
  cuerpo: { paddingHorizontal: 16, paddingBottom: 18, gap: 10 },
});
