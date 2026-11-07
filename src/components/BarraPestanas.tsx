import { ComponentProps, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs, router, usePathname } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icono, { NombreIcono } from './Icono';
import Logo from './Logo';
import { C, F, S, T, esWeb } from '../theme';

type BarraProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONOS: Record<string, NombreIcono> = { index: 'temas', test: 'test', partidos: 'partidos', vota: 'vota' };
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const PAD = 6;

// Barra de pestañas flotante. Un marcador oscuro se desliza hasta la
// pestaña elegida; el icono de la pestaña activa se rellena.
// En el ordenador, cabecera arriba como en cualquier web; en el móvil, barra flotante abajo.
export type PosicionBarra = 'abajo' | 'arriba';

export default function BarraPestanas(props: BarraProps & { posicion?: PosicionBarra }) {
  if (props.posicion === 'arriba') return <MenuEscritorio {...props} />;
  return <BarraMovil {...props} />;
}

// Secciones fijas de la web (las mismas que las pestañas).
const SECCIONES = [
  { name: 'index', titulo: 'Temas', ruta: '/' },
  { name: 'test', titulo: 'Test', ruta: '/test' },
  { name: 'partidos', titulo: 'Partidos', ruta: '/partidos' },
  { name: 'vota', titulo: 'Cómo votar', ruta: '/vota' },
] as const;

function MenuEscritorio({ state, navigation }: BarraProps) {
  const ir = (i: number) => {
    const route = state.routes[i];
    const ev = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (state.index !== i && !ev.defaultPrevented) navigation.navigate(route.name, route.params);
  };
  const activa = SECCIONES.findIndex((x) => x.name === state.routes[state.index]?.name);
  return <CabeceraEscritorio activa={activa} onIr={(i) => ir(state.routes.findIndex((r) => r.name === SECCIONES[i].name))} />;
}

// Cabecera de la web en pantallas anchas. La usan las pestañas y también las
// páginas de detalle (tema, partido, ficha, buscar…), para que el menú esté
// siempre en el mismo sitio, como en cualquier web.
export function CabeceraEscritorio({ activa, onIr }: { activa: number; onIr: (i: number) => void }) {
  return (
    <View style={e.arriba}>
      <View style={e.arribaDentro} accessibilityRole="tablist">
        <Pressable onPress={() => onIr(0)} style={e.marca} accessibilityRole="link" accessibilityLabel="TuVoto, inicio">
          <Logo tam={26} />
          <Text style={[T.seccion, { color: C.tinta, fontSize: 22 }]}>TuVoto</Text>
          <View style={e.noOficial}>
            <Text style={[T.etiqueta, { color: C.suave, fontSize: 11.5 }]}>No oficial</Text>
          </View>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {SECCIONES.map((x, i) => {
            const on = activa === i;
            const color = on ? C.sobreTinta : C.tinta;
            return (
              <Pressable
                key={x.name}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => onIr(i)}
                style={({ hovered, pressed }: { hovered?: boolean; pressed: boolean }) => [
                  e.item,
                  on ? { backgroundColor: C.tinta } : (hovered || pressed) && { backgroundColor: C.relleno },
                ]}
              >
                <Icono nombre={ICONOS[x.name] ?? 'info'} tam={18} color={color} peso={on ? 'fill' : 'regular'} />
                <Text style={[T.etiqueta, { color, fontSize: 14.5 }]}>{x.titulo}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// En las páginas de detalle se marca la sección de la que cuelgan.
export function CabeceraPaginas() {
  const ruta = usePathname();
  const activa = /^\/(partido|cara-a-cara)/.test(ruta) ? 2 : /^\/(voto-correo|documento)/.test(ruta) ? 3 : 0;
  return <CabeceraEscritorio activa={activa} onIr={(i) => router.navigate(SECCIONES[i].ruta)} />;
}

function BarraMovil({ state, descriptors, navigation, insets }: BarraProps) {
  const [ancho, setAncho] = useState(0);
  const n = state.routes.length;
  const seg = ancho > 0 ? (ancho - PAD * 2) / n : 0;
  const x = useSharedValue(0);

  useEffect(() => {
    if (seg > 0) x.set(withTiming(state.index * seg, { duration: 260, easing: EASE_IN_OUT }));
  }, [state.index, seg, x]);

  const marcador = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View pointerEvents="box-none" style={[s.envoltorio, { bottom: Math.max(insets.bottom, 10) + 6 }]}>
      <View
        style={s.barra}
        onLayout={(e) => setAncho(e.nativeEvent.layout.width)}
        accessibilityRole="tablist"
      >
        {seg > 0 && <Animated.View style={[s.marcador, { width: seg }, marcador]} />}
        {state.routes.map((route, i) => {
          const activa = state.index === i;
          const { options } = descriptors[route.key];
          const titulo = typeof options.title === 'string' ? options.title : route.name;
          const color = activa ? C.sobreTinta : C.suave;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}
              accessibilityLabel={titulo}
              style={({ pressed }) => [s.boton, pressed && !activa && { transform: [{ scale: 0.94 }] }]}
              onPress={() => {
                const ev = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!activa && !ev.defaultPrevented) {
                  if (!esWeb) Haptics.selectionAsync().catch(() => {});
                  navigation.navigate(route.name, route.params);
                }
              }}
            >
              <Icono nombre={ICONOS[route.name] ?? 'info'} tam={22} color={color} peso={activa ? 'fill' : 'regular'} />
              <Text style={[s.etiqueta, { color }]}>{titulo}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  envoltorio: { position: 'absolute', left: 14, right: 14, alignItems: 'center' },
  barra: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 520,
    padding: PAD,
    borderRadius: 22,
    backgroundColor: C.tarjeta,
    boxShadow: S.flotante,
  },
  marcador: { position: 'absolute', top: PAD, bottom: PAD, left: PAD, borderRadius: 16, backgroundColor: C.tinta },
  boton: { flex: 1, alignItems: 'center', gap: 2, paddingTop: 8, paddingBottom: 6 },
  etiqueta: { fontFamily: F.textoSemi, fontSize: 12, lineHeight: 15 },
});

const e = StyleSheet.create({
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  noOficial: { borderWidth: 1, borderColor: C.linea, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  arriba: { backgroundColor: C.tarjeta, borderBottomWidth: 1, borderBottomColor: C.linea },
  arribaDentro: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 24, height: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
});
