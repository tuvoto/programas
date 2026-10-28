import { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import { LayoutRectangle } from 'react-native';
import { ActivityIndicator, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { partidoPorId } from '../data/partidos';
import { TEMAS, temaPorId } from '../data/temas';
import { AFIRMACIONES, AFIRMACIONES_CORTAS, Afirmacion, Respuesta, Respuestas, calcular, mezclarPorTemas, partidosDelTest } from '../data/test';
import { urlPagina } from '../lib/web';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import TarjetaDeslizable, { Direccion, TarjetaFondo, TarjetaRef } from '../components/TarjetaDeslizable';
import { ManoDemo, PosicionesDemo, useDemo } from '../components/ManoDemo';
import TarjetaResultado from '../components/TarjetaResultado';
import { compartirResultado } from '../lib/compartirResultado';
import { pedirValoracion } from '../lib/valorar';
import { ANCHO_MAX, C, F, M, R, S, T, esWeb } from '../theme';

const ENTRAR = FadeIn.duration(220).easing(Easing.bezier(0.23, 1, 0.32, 1));
const MAX_IMPORTANTES = 3;

const VALOR: Record<Direccion, Respuesta> = { si: 2, no: -2, igual: null };

const textoPostura = (v?: number) =>
  v == null ? 'No se pronuncia' : v >= 2 ? 'A favor' : v === 1 ? 'Algo a favor' : v === -1 ? 'Algo en contra' : 'En contra';
const textoRespuesta = (v: Respuesta | undefined) => (v === 2 ? 'Sí' : v === -2 ? 'No' : 'Me da igual');

type Fase = 'elegir' | 'tarjetas' | 'temas' | 'resultado';
type Modo = 'corto' | 'completo';
const lista = (m: Modo) => (m === 'corto' ? AFIRMACIONES_CORTAS() : AFIRMACIONES);
// Unos 8 segundos por frase.
const minutos = (n: number) => Math.max(1, Math.round((n * 8) / 60));

// Primera tarjeta de cada test: sirve para aprender el gesto y no cuenta.
const PRACTICA = { tema: 'Práctica', texto: 'Estoy listo para empezar el test.' };

// Partidos del test: los mismos para todo el mundo.
function usePartidosTest() {
  return { partidos: partidosDelTest() };
}

export default function TestScreen({ onVolver }: { onVolver: () => void }) {
  const [fase, setFase] = useState<Fase>('elegir');
  const [modo, setModo] = useState<Modo>('corto');
  const [orden, setOrden] = useState<Afirmacion[]>(() => mezclarPorTemas(AFIRMACIONES_CORTAS()));
  const [ronda, setRonda] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [importantes, setImportantes] = useState<string[]>([]);

  // Si el test está a medias, salir pide confirmación: con el botón «Volver»,
  // con el gesto o el botón de atrás del móvil y con el de atrás del navegador.
  const enCurso = (fase === 'tarjetas' && Object.keys(respuestas).length > 0) || fase === 'temas';
  const { preguntando, pedirSalir, salir, seguir } = useConfirmarSalida(enCurso, onVolver);

  const empezar = (m: Modo = modo) => {
    setModo(m);
    setOrden(mezclarPorTemas(lista(m)));
    setRespuestas({});
    setImportantes([]);
    setRonda((r) => r + 1);
    setFase('tarjetas');
  };

  return (
    // La página siempre se puede mover: las tarjetas solo se arrastran a los
    // lados, así que deslizar hacia arriba o abajo hace scroll y en móviles
    // pequeños se llega a los botones.
    <ScrollView contentContainerStyle={[s.contenedor, fase === 'resultado' && { maxWidth: ANCHO_MAX }]}>
      <Pulsable onPress={enCurso ? pedirSalir : onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver">
        <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Volver</Text>
      </Pulsable>

      {fase === 'elegir' && <ElegirModo onElegir={empezar} />}
      {fase === 'tarjetas' && (
        <Tarjetas
          key={ronda}
          orden={orden}
          respuestas={respuestas}
          onResponder={(id, v) => setRespuestas((r) => ({ ...r, [id]: v }))}
          onDeshacer={(id) =>
            setRespuestas((r) => {
              const { [id]: _, ...resto } = r;
              return resto;
            })
          }
          onTerminar={() => setFase('temas')}
        />
      )}
      {fase === 'temas' && (
        <Importantes elegidos={importantes} onCambiar={setImportantes} onSeguir={() => setFase('resultado')} />
      )}
      {fase === 'resultado' && (
        <Resultado
          respuestas={respuestas}
          importantes={importantes}
          total={orden.length}
          modo={modo}
          onRepetir={() => setFase('elegir')}
        />
      )}
      <ConfirmarSalida visible={preguntando} onSalir={salir} onSeguir={seguir} />
    </ScrollView>
  );
}

// Pide confirmación antes de salir de un test a medias.
// - Móvil: se intercepta la salida de la pantalla (botón y gesto de atrás) y se
//   desactiva el gesto de deslizar desde el borde mientras dura el test.
// - Web: se añade una entrada «de guarda» al historial; si el navegador vuelve
//   atrás (botón o gesto del iPhone), se repone y se pregunta.
function useConfirmarSalida(enCurso: boolean, onVolver: () => void) {
  const navigation = useNavigation();
  const [preguntando, setPreguntando] = useState(false);
  const pendiente = useRef<(() => void) | null>(null);
  const saliendo = useRef(false);

  // Móvil
  useEffect(() => {
    if (esWeb) return;
    navigation.setOptions({ gestureEnabled: !enCurso });
    if (!enCurso) return;
    return navigation.addListener('beforeRemove', (e) => {
      if (saliendo.current) return;
      e.preventDefault();
      pendiente.current = () => navigation.dispatch(e.data.action);
      setPreguntando(true);
    });
  }, [navigation, enCurso]);

  // Web
  useEffect(() => {
    if (!esWeb || !enCurso || typeof window === 'undefined') return;
    const guarda = () => window.history.pushState({ ...window.history.state, tuvotoGuarda: true }, '');
    guarda();
    const alVolver = () => {
      if (saliendo.current) return;
      guarda();
      pendiente.current = () => window.history.go(-2);
      setPreguntando(true);
    };
    window.addEventListener('popstate', alVolver);
    return () => {
      window.removeEventListener('popstate', alVolver);
      // Test terminado: se quita la guarda para que «atrás» funcione normal.
      if (!saliendo.current && window.history.state?.tuvotoGuarda) window.history.back();
    };
  }, [enCurso]);

  const salir = () => {
    saliendo.current = true;
    setPreguntando(false);
    const accion = pendiente.current;
    pendiente.current = null;
    if (accion) return accion();
    if (esWeb && typeof window !== 'undefined' && window.history.state?.tuvotoGuarda) {
      // Botón «Volver» en la web: primero se quita la guarda y luego se vuelve.
      const tras = () => {
        window.removeEventListener('popstate', tras);
        onVolver();
      };
      window.addEventListener('popstate', tras);
      window.history.back();
      return;
    }
    onVolver();
  };
  const seguir = () => {
    pendiente.current = null;
    setPreguntando(false);
  };
  return { preguntando, pedirSalir: () => setPreguntando(true), salir, seguir };
}

function ConfirmarSalida({ visible, onSalir, onSeguir }: { visible: boolean; onSalir: () => void; onSeguir: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSeguir}>
      <View style={s.velo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onSeguir} accessibilityLabel="Seguir con el test" />
        <View style={s.dialogo} accessibilityViewIsModal>
          <Text style={[T.seccion, { color: C.tinta }]} accessibilityRole="header">
            ¿Salir del test?
          </Text>
          <Text style={[T.cuerpo, { color: C.suave }]}>Si sales ahora, se pierden las respuestas que llevas.</Text>
          <View style={{ gap: 8, marginTop: 6 }}>
            <Pulsable onPress={onSeguir} style={[s.boton, { alignSelf: 'stretch', justifyContent: 'center' }]} vibracion="ligera" accessibilityRole="button">
              <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 15 }]}>Seguir con el test</Text>
            </Pulsable>
            <Pulsable onPress={onSalir} style={[s.pildora, { alignSelf: 'stretch', justifyContent: 'center', paddingVertical: 12 }]} accessibilityRole="button">
              <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Salir</Text>
            </Pulsable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Antes de empezar: test corto o completo.
function ElegirModo({ onElegir }: { onElegir: (m: Modo) => void }) {
  const corto = AFIRMACIONES_CORTAS().length;
  const largo = AFIRMACIONES.length;
  return (
    <Animated.View entering={ENTRAR} style={{ marginTop: 22, gap: 12 }}>
      <Text style={[T.titulo, { color: C.tinta }]} accessibilityRole="header">
        Test
      </Text>
      <Text style={[T.cuerpo, { color: C.suave, maxWidth: 560 }]}>
        Frases sobre medidas concretas, sin nombres de partidos. Debajo de cada una verás qué se gana y qué se pierde. Al final,
        con qué programas coincides más. No es una recomendación de voto.
      </Text>
      <View style={s.modos}>
        <Pulsable onPress={() => onElegir('corto')} style={[s.modo, { backgroundColor: C.tinta }]} escala={0.98} vibracion="ligera" accessibilityRole="button">
          <Text style={[T.seccion, { color: C.sobreTinta }]}>Corto</Text>
          <Text style={[T.cuerpo, { color: C.sobreTintaSuave }]}>{`${corto} frases, unos ${minutos(corto)} minutos. Dos de cada tema.`}</Text>
          <View style={[s.modoBoton, { backgroundColor: C.amarillo }]}>
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 15 }]}>Empezar</Text>
            <Icono nombre="next" tam={15} color={C.tinta} peso="bold" />
          </View>
        </Pulsable>
        <Pulsable onPress={() => onElegir('completo')} style={[s.modo, { backgroundColor: C.tarjeta, boxShadow: S.tarjeta }]} escala={0.98} vibracion="ligera" accessibilityRole="button">
          <Text style={[T.seccion, { color: C.tinta }]}>Completo</Text>
          <Text style={[T.cuerpo, { color: C.suave }]}>{`${largo} frases, unos ${minutos(largo)} minutos. Resultado más preciso.`}</Text>
          <View style={[s.modoBoton, { backgroundColor: C.tinta }]}>
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 15 }]}>Empezar</Text>
            <Icono nombre="next" tam={15} color={C.sobreTinta} peso="bold" />
          </View>
        </Pulsable>
      </View>
    </Animated.View>
  );
}

function Tarjetas({
  orden,
  respuestas,
  onResponder,
  onDeshacer,
  onTerminar,
}: {
  orden: Afirmacion[];
  respuestas: Respuestas;
  onResponder: (id: string, v: Respuesta) => void;
  onDeshacer: (id: string) => void;
  onTerminar: () => void;
}) {
  const [i, setI] = useState(0);
  const tarjeta = useRef<TarjetaRef>(null);
  const { partidos } = usePartidosTest();
  // La tarjeta se adapta a pantallas bajas para que los botones quepan debajo.
  const { height: altoVentana } = useWindowDimensions();
  const altoPila = Math.max(300, Math.min(390, altoVentana - 400));
  // Las flechas del teclado solo se mencionan si hay ratón (ordenador), no en el móvil.
  const [conRaton, setConRaton] = useState(false);
  useEffect(() => {
    if (esWeb && typeof window !== 'undefined') setConRaton(window.matchMedia?.('(pointer: fine)').matches ?? false);
  }, []);
  const actual = orden.at(i);
  const siguiente = orden.at(i + 1);

  // Tutorial: tarjeta de práctica con la mano al empezar cada test.
  const tutorial = true;
  const [practicaHecha, setPracticaHecha] = useState(false);
  const [celebrando, setCelebrando] = useState(false);
  const [tocado, setTocado] = useState(false);
  const practicando = tutorial && !practicaHecha;

  // Posiciones de la tarjeta y de los botones, para que la mano sepa adónde ir.
  const [pila, setPila] = useState<LayoutRectangle | null>(null);
  const [fila, setFila] = useState<LayoutRectangle | null>(null);
  const [bNo, setBNo] = useState<LayoutRectangle | null>(null);
  const [bIgual, setBIgual] = useState<LayoutRectangle | null>(null);
  const [bSi, setBSi] = useState<LayoutRectangle | null>(null);
  const centroBoton = (b: LayoutRectangle, alto: number) => ({ x: fila!.x + b.x + b.width / 2, y: fila!.y + b.y + alto / 2 });
  const pos: PosicionesDemo | null =
    pila && fila && bNo && bIgual && bSi
      ? {
          tarjeta: { x: pila.x + pila.width / 2, y: pila.y + pila.height * 0.62 },
          no: centroBoton(bNo, 64),
          igual: centroBoton(bIgual, 50),
          si: centroBoton(bSi, 64),
        }
      : null;
  const demo = useDemo(practicando && !tocado && !celebrando, pos);

  // Cualquier toque (tarjeta, botón o teclado) quita la mano.
  const interactuar = () => {
    if (practicando && !tocado) {
      demo.parar();
      setTocado(true);
    }
  };
  const interactuarRef = useRef(interactuar);
  interactuarRef.current = interactuar;

  const decidir = (d: Direccion) => {
    if (practicando) {
      setCelebrando(true);
      setTimeout(() => {
        setCelebrando(false);
        setPracticaHecha(true);
      }, 1100);
      return;
    }
    if (!actual) return;
    onResponder(actual.id, VALOR[d]);
    if (i + 1 >= orden.length) onTerminar();
    else setI(i + 1);
  };

  const deshacer = () => {
    if (i === 0 || practicando) return;
    onDeshacer(orden.at(i - 1)!.id);
    setI(i - 1);
  };

  const lanzar = (d: Direccion) => {
    interactuarRef.current();
    tarjeta.current?.lanzar(d);
  };

  // En el ordenador también se puede responder con las flechas del teclado.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') lanzar('si');
      else if (e.key === 'ArrowLeft') lanzar('no');
      else if (e.key === 'ArrowUp') lanzar('igual');
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!actual) return null;
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[T.meta, { color: C.suave, marginBottom: 14 }]}>
        <Text style={{ fontFamily: F.textoSemi, color: C.tinta }}>No es una recomendación de voto.</Text> Partidos incluidos:{' '}
        {partidos.map((id) => partidoPorId(id)!.siglas).join(', ')}, con sus programas de 2023. Algunos solo se presentan
        en su comunidad. Los demás partidos no entran: su programa de 2023 no trata suficientes frases.
      </Text>
      <View style={s.progresoFila}>
        <Text style={[T.etiqueta, { color: C.suave }]}>{practicando ? 'Práctica: no cuenta' : `${i + 1} de ${orden.length}`}</Text>
        <Pulsable
          onPress={deshacer}
          disabled={i === 0 || practicando}
          style={[s.deshacer, (i === 0 || practicando) && { opacity: 0.35 }]}
          accessibilityRole="button"
        >
          <Icono nombre="back" tam={12} color={C.tinta} peso="bold" />
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13 }]}>Deshacer</Text>
        </Pulsable>
      </View>
      <View style={s.barra}>
        <View style={[s.barraLlena, { width: `${practicando ? 0 : (i / orden.length) * 100}%` }]} />
      </View>

      <View style={[s.pila, { height: altoPila }]} onLayout={(e) => setPila(e.nativeEvent.layout)}>
        {celebrando ? (
          <Animated.View entering={ENTRAR} exiting={FadeOut.duration(150)} style={s.celebrar}>
            <Text style={[T.seccion, { color: C.sobreTinta, fontSize: 26, lineHeight: 30 }]}>¡Perfecto!</Text>
            <Text style={[T.cuerpo, { color: C.sobreTintaSuave }]}>Empezamos.</Text>
          </Animated.View>
        ) : practicando ? (
          <>
            <TarjetaFondo />
            <TarjetaDeslizable
              key="practica"
              ref={tarjeta}
              tema={PRACTICA.tema}
              texto={PRACTICA.texto}
              onDecidir={decidir}
              ex={demo.ex}
              ey={demo.ey}
              onTocar={interactuar}
            />
          </>
        ) : (
          <>
            {siguiente && <TarjetaFondo />}
            <TarjetaDeslizable
              key={actual.id}
              ref={tarjeta}
              tema={temaPorId(actual.temaId)?.nombre ?? ''}
              texto={actual.texto}
              aFavor={actual.aFavor}
              enContra={actual.enContra}
              onDecidir={decidir}
            />
          </>
        )}
      </View>

      <View style={s.botones} onLayout={(e) => setFila(e.nativeEvent.layout)}>
        <BotonRespuesta texto="No" icono="✕" color="#9B2C2C" onPress={() => lanzar('no')} presion={demo.pNo} onMedir={setBNo} />
        <BotonRespuesta texto="Me da igual" icono="↑" color={C.suave} onPress={() => lanzar('igual')} presion={demo.pIgual} onMedir={setBIgual} pequeño />
        <BotonRespuesta texto="Sí" icono="✓" color={C.okTexto} onPress={() => lanzar('si')} presion={demo.pSi} onMedir={setBSi} />
      </View>
      <Text style={[T.meta, { color: C.suave, textAlign: 'center', marginTop: 10 }]}>
        {conRaton ? 'Arrastra la tarjeta a un lado, pulsa un botón o usa las flechas del teclado.' : 'Desliza la tarjeta a un lado o pulsa un botón.'}
      </Text>

      {practicando && !tocado && !celebrando && <ManoDemo demo={demo} />}
    </View>
  );
}

function BotonRespuesta({
  texto,
  icono,
  color,
  onPress,
  pequeño,
  presion,
  onMedir,
}: {
  texto: string;
  icono: string;
  color: string;
  onPress: () => void;
  pequeño?: boolean;
  presion: SharedValue<number>; // la mano de la demostración lo «pulsa»
  onMedir: (l: LayoutRectangle) => void;
}) {
  const hundido = useAnimatedStyle(() => ({ transform: [{ scale: presion.get() }] }));
  return (
    <Pulsable
      onPress={onPress}
      style={s.botonResp}
      escala={0.92}
      accessibilityRole="button"
      accessibilityLabel={texto}
      onLayout={(e) => onMedir(e.nativeEvent.layout)}
    >
      <Animated.View style={[s.circulo, pequeño && s.circuloPeq, hundido]}>
        <Text style={[T.seccion, { color, fontSize: pequeño ? 18 : 24, lineHeight: pequeño ? 22 : 28 }]}>{icono}</Text>
      </Animated.View>
      <Text style={[T.etiqueta, { color: C.tinta, fontSize: 12.5 }]}>{texto}</Text>
    </Pulsable>
  );
}

function Importantes({
  elegidos,
  onCambiar,
  onSeguir,
}: {
  elegidos: string[];
  onCambiar: (t: string[]) => void;
  onSeguir: () => void;
}) {
  const alternar = (id: string) =>
    onCambiar(
      elegidos.includes(id)
        ? elegidos.filter((x) => x !== id)
        : elegidos.length < MAX_IMPORTANTES
          ? [...elegidos, id]
          : elegidos,
    );
  return (
    <Animated.View entering={ENTRAR}>
      <Text style={[T.titulo, { color: C.tinta, marginTop: 22 }]} accessibilityRole="header">
        ¿Qué temas te importan más?
      </Text>
      <Text style={[T.cuerpo, { color: C.suave, marginTop: 8 }]}>
        Elige hasta {MAX_IMPORTANTES}. Sus frases contarán el doble en tu resultado.
      </Text>
      <View style={s.temas}>
        {TEMAS.map((t) => {
          const activo = elegidos.includes(t.id);
          const lleno = !activo && elegidos.length >= MAX_IMPORTANTES;
          return (
            <Pulsable
              key={t.id}
              onPress={() => alternar(t.id)}
              style={[s.tema, activo && s.temaActivo, lleno && { opacity: 0.45 }]}
              escala={0.95}
              vibracion="seleccion"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: activo, disabled: lleno }}
            >
              <Icono nombre={t.icono} tam={18} color={activo ? C.sobreTinta : C.tinta} />
              <Text style={[T.etiqueta, { color: activo ? C.sobreTinta : C.tinta, fontSize: 13.5, flexShrink: 1 }]}>{t.nombre}</Text>
            </Pulsable>
          );
        })}
      </View>
      <View style={[s.pieFila, { justifyContent: 'flex-start', gap: 8 }]}>
        <Pulsable onPress={onSeguir} style={s.boton} vibracion="ligera" accessibilityRole="button">
          <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 15 }]}>Ver mi resultado</Text>
          <Icono nombre="next" tam={15} color={C.sobreTinta} peso="bold" />
        </Pulsable>
        {elegidos.length === 0 && (
          <Text style={[T.meta, { color: C.suave }]}>Si no eliges ninguno, todos cuentan igual.</Text>
        )}
      </View>
    </Animated.View>
  );
}

// Frases del test agrupadas para un partido: en qué coincides, en qué no y
// cuáles no trata su programa. Solo cuentan las respondidas con sí o no.
type Reparto = { si: Afirmacion[]; no: Afirmacion[]; sin: Afirmacion[] };
function repartir(frases: Afirmacion[], respuestas: Respuestas, partidoId: string): Reparto {
  const r: Reparto = { si: [], no: [], sin: [] };
  for (const a of frases) {
    const tu = respuestas[a.id];
    if (tu == null) continue;
    const po = a.posturas[partidoId];
    if (!po) r.sin.push(a);
    else if (Math.sign(po.valor) === Math.sign(tu)) r.si.push(a);
    else r.no.push(a);
  }
  return r;
}

const NO_FONDO = '#F9E3E1';
const NO_TEXTO = '#8A2A20';

function Resultado({
  respuestas,
  importantes,
  total,
  modo,
  onRepetir,
}: {
  respuestas: Respuestas;
  importantes: string[];
  total: number;
  modo: Modo;
  onRepetir: () => void;
}) {
  const TOTAL = total;
  const { partidos } = usePartidosTest();
  const resultados = calcular(respuestas, importantes, partidos);
  const contestadas = AFIRMACIONES.filter((a) => respuestas[a.id] != null).length;
  const hechas = lista(modo);
  const [compartir, setCompartir] = useState(false);
  const { width } = useWindowDimensions();
  // En pantallas anchas: ranking a la izquierda y detalle a la derecha.
  const ancho = width >= 900;
  // Partido abierto: al empezar, ninguno; se abre al tocarlo.
  const [abierto, setAbierto] = useState<string | null>(null);
  const elegido = abierto;
  // Tras un resultado de verdad, la tienda puede pedir una valoración.
  useEffect(() => {
    if (contestadas >= 5) pedirValoracion();
  }, [contestadas]);

  const cabecera = (
    <>
      <Text style={[T.titulo, { color: C.tinta, marginTop: 22 }]} accessibilityRole="header">
        Tu resultado
      </Text>
      <Text style={[T.cuerpo, { color: C.suave, marginTop: 8 }]}>
        Has respondido sí o no a {contestadas} de {TOTAL}.
        {importantes.length > 0 &&
          ` Cuentan el doble (★): ${importantes.map((t) => temaPorId(t)?.nombre.toLowerCase()).join(', ')}.`}
      </Text>
      <View style={s.aviso}>
        <Text style={[T.meta, { color: C.avisoTexto }]}>
          <Text style={{ fontFamily: F.textoSemi }}>No es una recomendación de voto.</Text> Solo compara tus respuestas con lo
          que dicen los programas.
        </Text>
      </View>
    </>
  );

  const acciones = (
    <>
      <View style={[s.pieFila, { justifyContent: 'flex-start', gap: 8, marginTop: 16 }]}>
        {contestadas >= 5 && (
          <Pulsable onPress={() => setCompartir(true)} style={s.compartirBoton} vibracion="ligera" accessibilityRole="button">
            <Icono nombre="enlace" tam={16} color={C.tinta} peso="bold" />
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Compartir mi resultado</Text>
          </Pulsable>
        )}
        <Pulsable onPress={onRepetir} style={s.pildora} accessibilityRole="button">
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>Repetir</Text>
        </Pulsable>
      </View>
      <VentanaCompartir
        visible={compartir}
        onCerrar={() => setCompartir(false)}
        resultados={resultados}
        contestadas={contestadas}
        total={TOTAL}
      />
    </>
  );

  if (contestadas < 5) {
    return (
      <Animated.View entering={ENTRAR}>
        {cabecera}
        <Tarjeta style={{ marginTop: 18 }}>
          <Text style={[T.cuerpo, { color: C.tinta }]}>Responde sí o no a al menos 5 frases para ver un resultado.</Text>
        </Tarjeta>
        {acciones}
      </Animated.View>
    );
  }

  const fila = (r: (typeof resultados)[number], i: number, abiertoAqui: boolean) => {
    const p = partidoPorId(r.partidoId)!;
    const rep = repartir(hechas, respuestas, r.partidoId);
    const conPostura = rep.si.length + rep.no.length;
    return (
      <Pulsable
        onPress={() => setAbierto(ancho ? r.partidoId : abiertoAqui ? null : r.partidoId)}
        style={{ gap: 6 }}
        escala={0.99}
        vibracion="seleccion"
        accessibilityRole="button"
        accessibilityState={ancho ? { selected: abiertoAqui } : { expanded: abiertoAqui }}
        accessibilityLabel={`${i + 1}. ${p.siglas}: ${r.porcentaje} %. Coincides en ${rep.si.length} de ${conPostura} frases.`}
      >
        <View style={s.filaResultado}>
          <Text style={[T.seccion, { color: C.suave, fontSize: 18, width: 22 }]}>{i + 1}</Text>
          <Marca color={p.color} tam={11} />
          <Text style={[T.cuerpoSemi, { color: C.tinta, flex: 1 }]}>{p.siglas}</Text>
          <Text style={[T.seccion, { color: C.tinta, fontSize: 22, fontVariant: ['tabular-nums'] }]}>
            {r.preguntas ? `${r.porcentaje} %` : '—'}
          </Text>
          <View style={{ transform: [{ rotate: ancho ? '0deg' : abiertoAqui ? '-90deg' : '90deg' }] }}>
            <Icono nombre="next" tam={14} color={C.suave} peso="bold" />
          </View>
        </View>
        <View style={[s.barra, { marginLeft: 32, marginTop: 4 }]}>
          <View style={[s.barraLlena, { width: `${r.porcentaje}%`, backgroundColor: p.color }]} />
        </View>
        <Text style={[T.meta, { color: C.suave, fontSize: 12.5, marginLeft: 32 }]}>
          Coincides en {rep.si.length} de {conPostura} {conPostura === 1 ? 'frase' : 'frases'} con postura
          {p.territorio ? ` · solo se presenta en ${p.territorio}` : ''}
        </Text>
      </Pulsable>
    );
  };

  // Pantalla ancha: ranking fijo a la izquierda, detalle a la derecha.
  if (ancho) {
    const r = resultados.find((x) => x.partidoId === elegido);
    return (
      <Animated.View entering={ENTRAR} style={s.dosColumnas}>
        <View style={[s.colRanking, esWeb && ({ position: 'sticky', top: 12 } as object)]}>
          {cabecera}
          <View style={{ gap: 10, marginTop: 16 }}>
            {resultados.map((x, i) => (
              <Tarjeta key={x.partidoId} style={[s.borde, x.partidoId === r?.partidoId && s.seleccionado]}>
                {fila(x, i, x.partidoId === r?.partidoId)}
              </Tarjeta>
            ))}
          </View>
          <Text style={[T.meta, { color: C.suave, marginTop: 10 }]}>
            {r ? 'Pulsa otro partido para ver su detalle.' : 'Pulsa un partido para ver en qué coincidís y en qué no.'}
          </Text>
          {acciones}
        </View>
        <View style={{ flex: 1, minWidth: 0, marginTop: 22 }}>
          {r ? (
            <Detalle partidoId={r.partidoId} porcentaje={r.porcentaje} frases={hechas} respuestas={respuestas} importantes={importantes} columnas={width >= 1180} todo />
          ) : (
            <Tarjeta style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Text style={[T.cuerpo, { color: C.suave, textAlign: 'center' }]}>
                Pulsa un partido de la izquierda para ver, frase a frase, en qué coincidís y en qué no.
              </Text>
            </Tarjeta>
          )}
        </View>
      </Animated.View>
    );
  }

  // Móvil: el ranking, con el partido abierto desplegado dentro de su tarjeta.
  return (
    <Animated.View entering={ENTRAR}>
      {cabecera}
      <Text style={[T.meta, { color: C.suave, marginTop: 16 }]}>Toca un partido para ver en qué coincidís y en qué no.</Text>
      <View style={{ gap: 10, marginTop: 10 }}>
        {resultados.map((x, i) => {
          const abiertoAqui = abierto === x.partidoId;
          return (
            <Tarjeta key={x.partidoId} style={{ gap: 14 }}>
              {fila(x, i, abiertoAqui)}
              {abiertoAqui && (
                <Detalle partidoId={x.partidoId} porcentaje={x.porcentaje} frases={hechas} respuestas={respuestas} importantes={importantes} />
              )}
            </Tarjeta>
          );
        })}
      </View>
      {acciones}
    </Animated.View>
  );
}

// Detalle de un partido: frases en las que coincides y en las que no.
// En el móvil, las que no coinciden y las que no trata su programa se abren
// con un botón; en pantalla ancha se ve todo desplegado.
function Detalle({
  partidoId,
  porcentaje,
  frases,
  respuestas,
  importantes,
  columnas = false,
  todo = false,
}: {
  partidoId: string;
  porcentaje: number;
  frases: Afirmacion[];
  respuestas: Respuestas;
  importantes: string[];
  columnas?: boolean;
  todo?: boolean;
}) {
  const p = partidoPorId(partidoId)!;
  const rep = repartir(frases, respuestas, partidoId);
  const [verNo, setVerNo] = useState(false);
  const [verSin, setVerSin] = useState(false);
  useEffect(() => {
    setVerNo(false);
    setVerSin(false);
  }, [partidoId]);

  const tarjeta = (a: Afirmacion) => (
    <FraseResultado key={a.id} a={a} partidoId={partidoId} tu={respuestas[a.id]} importante={importantes.includes(a.temaId)} suelta={todo} />
  );
  const titulo = (icono: string, texto: string, n: number, color = C.tinta) => (
    <View style={s.grupo}>
      <Text style={[T.cuerpoSemi, { color, fontSize: 15 }]}>
        {icono} {texto}
      </Text>
      <View style={s.cuenta}>
        <Text style={[T.meta, { color: C.suave, fontSize: 12 }]}>{n}</Text>
      </View>
    </View>
  );
  const vacio = (t: string) => <Text style={[T.meta, { color: C.suave }]}>{t}</Text>;

  const si = (
    <View style={{ gap: 10, flex: columnas ? 1 : undefined, minWidth: 0 }}>
      {titulo('✓', 'En lo que coincidís', rep.si.length, C.okTexto)}
      {rep.si.length ? rep.si.map(tarjeta) : vacio('En ninguna de tus respuestas.')}
    </View>
  );
  const no = (
    <View style={{ gap: 10, flex: columnas ? 1 : undefined, minWidth: 0 }}>
      {titulo('✗', 'En lo que no', rep.no.length, NO_TEXTO)}
      {rep.no.length ? rep.no.map(tarjeta) : vacio('En ninguna de tus respuestas.')}
    </View>
  );
  const boton = (texto: string, abierto: boolean, onPress: () => void) => (
    <Pulsable onPress={onPress} style={s.verMas} vibracion="seleccion" accessibilityRole="button" accessibilityState={{ expanded: abierto }}>
      <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14, flexShrink: 1 }]}>{texto}</Text>
      <View style={{ transform: [{ rotate: abierto ? '-90deg' : '90deg' }] }}>
        <Icono nombre="next" tam={13} color={C.tinta} peso="bold" />
      </View>
    </Pulsable>
  );

  return (
    <View style={{ gap: 14 }}>
      {todo && (
        <View style={s.filaResultado}>
          <Marca color={p.color} tam={14} />
          <Text style={[T.titulo, { color: C.tinta, flex: 1 }]}>{p.siglas}</Text>
          <Text style={[T.titulo, { color: C.tinta, fontVariant: ['tabular-nums'] }]}>{porcentaje} %</Text>
        </View>
      )}
      {todo && <Text style={[T.meta, { color: C.suave }]}>
        {rep.si.length} {rep.si.length === 1 ? 'coincidencia' : 'coincidencias'} y {rep.no.length}{' '}
        {rep.no.length === 1 ? 'diferencia' : 'diferencias'}.
        {rep.sin.length > 0 &&
          ` ${rep.sin.length} ${rep.sin.length === 1 ? 'frase no cuenta porque su programa no la trata' : 'frases no cuentan porque su programa no las trata'}.`}
      </Text>}
      {todo ? (
        <View style={[{ gap: 18 }, columnas && { flexDirection: 'row', alignItems: 'flex-start' }]}>
          {si}
          {no}
        </View>
      ) : (
        <>
          {si}
          {rep.no.length > 0 && boton(verNo ? 'Ocultar en lo que no coincidís' : `Ver en lo que no coincidís (${rep.no.length})`, verNo, () => setVerNo((v) => !v))}
          {verNo && no}
        </>
      )}
      {rep.sin.length > 0 &&
        (todo ? (
          <View style={{ gap: 10 }}>
            {titulo('–', 'Sin postura en su programa', rep.sin.length, C.suave)}
            {rep.sin.map((a) => (
              <FraseResultado key={a.id} a={a} partidoId={partidoId} tu={respuestas[a.id]} importante={importantes.includes(a.temaId)} suelta={todo} />
            ))}
          </View>
        ) : (
          <>
            {boton(verSin ? 'Ocultar las que su programa no trata' : `Ver las que su programa no trata (${rep.sin.length})`, verSin, () => setVerSin((v) => !v))}
            {verSin && rep.sin.map((a) => <FraseResultado key={a.id} a={a} partidoId={partidoId} tu={respuestas[a.id]} importante={importantes.includes(a.temaId)} suelta={todo} />)}
          </>
        ))}
    </View>
  );
}

// Una frase del test con tu respuesta, la del partido y su página.
function FraseResultado({ a, partidoId, tu, importante, suelta = false }: { a: Afirmacion; partidoId: string; tu: Respuesta | undefined; importante: boolean; suelta?: boolean }) {
  const p = partidoPorId(partidoId)!;
  const po = a.posturas[partidoId];
  const archivo = p.anterior?.archivo;
  const coincide = po && tu != null && Math.sign(po.valor) === Math.sign(tu);
  return (
    <View style={[s.frase, suelta && s.fraseSuelta]}>
      <Text style={[T.meta, { color: C.suave, fontSize: 12.5 }]}>
        {temaPorId(a.temaId)?.nombre}
        {importante ? '  ★' : ''}
      </Text>
      <Text style={[T.cuerpoSemi, { color: C.tinta, fontSize: 15, lineHeight: 21 }]}>{a.texto}</Text>
      <View style={s.chips}>
        <View style={[s.chipResp, { backgroundColor: C.relleno }]}>
          <Text style={[T.meta, { color: C.tinta, fontFamily: F.textoSemi, fontSize: 12.5 }]}>Tú: {textoRespuesta(tu)}</Text>
        </View>
        <View style={[s.chipResp, { backgroundColor: !po ? C.relleno : coincide ? C.okFondo : NO_FONDO }]}>
          <Text style={[T.meta, { color: !po ? C.suave : coincide ? C.okTexto : NO_TEXTO, fontFamily: F.textoSemi, fontSize: 12.5 }]}>
            {p.siglas}: {textoPostura(po?.valor)}
          </Text>
        </View>
        {po &&
          (archivo ? (
            <Text
              onPress={() => Linking.openURL(urlPagina(archivo, po.pagina))}
              style={[T.meta, { color: C.tinta, fontFamily: F.textoSemi, textDecorationLine: 'underline', fontSize: 12.5, marginLeft: 'auto' }]}
              accessibilityRole="link"
              accessibilityLabel={`Abrir el programa de ${p.siglas} por la página ${po.pagina}`}
            >
              {`pág. ${po.pagina}`}
            </Text>
          ) : (
            <Text style={[T.meta, { color: C.suave, fontSize: 12.5, marginLeft: 'auto' }]}>{`pág. ${po.pagina}`}</Text>
          ))}
      </View>
    </View>
  );
}

// Vista previa de la imagen del resultado y botón para compartirla.
function VentanaCompartir({
  visible,
  onCerrar,
  resultados,
  contestadas,
  total,
}: {
  visible: boolean;
  onCerrar: () => void;
  resultados: ReturnType<typeof calcular>;
  contestadas: number;
  total: number;
}) {
  const TOTAL = total;
  const { width, height } = useWindowDimensions();
  // Que la tarjeta quepa entera con los botones debajo.
  const ancho = Math.min(width - 64, (height - 200) * (9 / 16), 320);
  const tarjeta = useRef<View>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);

  const enviar = async () => {
    setError(false);
    setEnviando(true);
    try {
      await compartirResultado(tarjeta, { resultados, contestadas, total: TOTAL });
    } catch {
      setError(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={s.velo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCerrar} accessibilityLabel="Cerrar" />
        <View style={{ borderRadius: 18, overflow: 'hidden', boxShadow: S.flotante }}>
          <TarjetaResultado ref={tarjeta} resultados={resultados} contestadas={contestadas} total={TOTAL} ancho={ancho} />
        </View>
        <View style={[s.pieFila, { justifyContent: 'center', gap: 8, marginTop: 18 }]}>
          <Pulsable onPress={enviar} disabled={enviando} style={[s.boton, enviando && { opacity: 0.6 }]} vibracion="ligera" accessibilityRole="button">
            {enviando ? <ActivityIndicator size="small" color={C.sobreTinta} /> : <Icono nombre="descargar" tam={15} color={C.sobreTinta} peso="bold" />}
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>{esWeb ? 'Compartir o guardar imagen' : 'Compartir imagen'}</Text>
          </Pulsable>
          <Pulsable onPress={onCerrar} style={s.pildora} accessibilityRole="button">
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>Cerrar</Text>
          </Pulsable>
        </View>
        {error && <Text style={[T.meta, { color: C.sobreTinta, marginTop: 10 }]}>No se ha podido crear la imagen.</Text>}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  contenedor: { paddingHorizontal: M, paddingTop: 12, paddingBottom: 48, width: '100%', maxWidth: 560, alignSelf: 'center' },
  volver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: C.tinta,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: R.boton,
    boxShadow: S.boton,
  },
  pildora: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  progresoFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  deshacer: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: R.pildora, backgroundColor: C.tarjeta, boxShadow: S.tarjeta },
  barra: { height: 8, borderRadius: 4, backgroundColor: C.linea, overflow: 'hidden', marginTop: 8 },
  barraLlena: { height: '100%', borderRadius: 4, backgroundColor: C.tinta },
  pila: { height: 390, marginTop: 22 },
  modos: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
  modo: { flexGrow: 1, flexBasis: 260, borderRadius: R.tarjeta, padding: 20, gap: 8 },
  modoBoton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 12, borderRadius: R.boton, marginTop: 8 },
  velo: { flex: 1, backgroundColor: 'rgba(18,24,38,0.6)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  compartir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: R.boton,
    backgroundColor: C.amarillo,
  },
  celebrar: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: R.tarjeta + 4, backgroundColor: C.tinta, alignItems: 'center', justifyContent: 'center', gap: 4, boxShadow: S.flotante },
  botones: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 28, marginTop: 26 },
  botonResp: { alignItems: 'center', gap: 6 },
  circulo: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.tarjeta, alignItems: 'center', justifyContent: 'center', boxShadow: S.flotante },
  circuloPeq: { width: 50, height: 50, borderRadius: 25 },
  temas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  tema: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 11, borderRadius: R.pildora, backgroundColor: C.tarjeta, boxShadow: S.tarjeta },
  temaActivo: { backgroundColor: C.tinta, boxShadow: S.boton },
  pieFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, flexWrap: 'wrap' },
  filaResultado: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  postura: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  aviso: { marginTop: 12, backgroundColor: C.avisoFondo, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 },
  compartirBoton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 11, borderRadius: R.boton, backgroundColor: C.amarillo },
  dosColumnas: { flexDirection: 'row', alignItems: 'flex-start', gap: 32 },
  colRanking: { width: 360, flexShrink: 0 },
  borde: { borderWidth: 2.5, borderColor: 'transparent' },
  seleccionado: { borderColor: C.tinta },
  grupo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  cuenta: { backgroundColor: C.relleno, borderRadius: R.pildora, paddingHorizontal: 8, paddingVertical: 1 },
  frase: { gap: 6, backgroundColor: C.fondo, borderRadius: 14, padding: 14 },
  fraseSuelta: { backgroundColor: C.tarjeta, boxShadow: S.tarjeta, borderRadius: R.tarjeta, padding: 16 },
  chips: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  chipResp: { borderRadius: R.pildora, paddingHorizontal: 9, paddingVertical: 3 },
  dialogo: { width: '100%', maxWidth: 380, backgroundColor: C.tarjeta, borderRadius: R.tarjeta, padding: 22, gap: 8, boxShadow: S.flotante },
  verMas: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderRadius: R.pildora, backgroundColor: C.relleno },
});
