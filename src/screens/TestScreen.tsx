import { useEffect, useRef, useState } from 'react';
import { LayoutRectangle } from 'react-native';
import { ActivityIndicator, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { partidoPorId } from '../data/partidos';
import { TEMAS, temaPorId } from '../data/temas';
import { AFIRMACIONES, Afirmacion, PARTIDOS_TEST, Respuesta, Respuestas, barajar, calcular } from '../data/test';
import { urlPagina } from '../lib/web';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import TarjetaDeslizable, { Direccion, TarjetaFondo, TarjetaRef } from '../components/TarjetaDeslizable';
import { ManoDemo, PosicionesDemo, useDemo } from '../components/ManoDemo';
import TarjetaResultado from '../components/TarjetaResultado';
import { compartirResultado } from '../lib/compartirResultado';
import { C, F, M, R, S, T, esWeb } from '../theme';

const ENTRAR = FadeIn.duration(220).easing(Easing.bezier(0.23, 1, 0.32, 1));
const TOTAL = AFIRMACIONES.length;
const MAX_IMPORTANTES = 3;

const VALOR: Record<Direccion, Respuesta> = { si: 2, no: -2, igual: null };

const textoPostura = (v?: number) =>
  v == null ? 'No se pronuncia' : v >= 2 ? 'A favor' : v === 1 ? 'Algo a favor' : v === -1 ? 'Algo en contra' : 'En contra';
const textoRespuesta = (v: Respuesta | undefined) => (v === 2 ? 'Sí' : v === -2 ? 'No' : 'Me da igual');

type Fase = 'tarjetas' | 'temas' | 'resultado';

// Primera tarjeta de cada test: sirve para aprender el gesto y no cuenta.
const PRACTICA = { tema: 'Práctica', texto: 'Estoy listo para empezar el test.' };

export default function TestScreen({ onVolver }: { onVolver: () => void }) {
  const [fase, setFase] = useState<Fase>('tarjetas');
  const [orden, setOrden] = useState<Afirmacion[]>(() => barajar(AFIRMACIONES));
  const [ronda, setRonda] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [importantes, setImportantes] = useState<string[]>([]);

  const empezar = () => {
    setOrden(barajar(AFIRMACIONES));
    setRespuestas({});
    setImportantes([]);
    setRonda((r) => r + 1);
    setFase('tarjetas');
  };

  return (
    <ScrollView contentContainerStyle={s.contenedor} scrollEnabled={fase !== 'tarjetas'}>
      <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver">
        <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Volver</Text>
      </Pulsable>

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
        <Resultado respuestas={respuestas} importantes={importantes} onRepetir={empezar} />
      )}
    </ScrollView>
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
        {PARTIDOS_TEST.map((id) => partidoPorId(id)!.siglas).join(', ')}, con sus programas de 2023.
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

      <View style={s.pila} onLayout={(e) => setPila(e.nativeEvent.layout)}>
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
        {esWeb ? 'Arrastra la tarjeta, pulsa un botón o usa las flechas del teclado.' : 'Desliza la tarjeta o pulsa un botón.'}
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

function Resultado({
  respuestas,
  importantes,
  onRepetir,
}: {
  respuestas: Respuestas;
  importantes: string[];
  onRepetir: () => void;
}) {
  const resultados = calcular(respuestas, importantes);
  const contestadas = AFIRMACIONES.filter((a) => respuestas[a.id] != null).length;
  const [detalle, setDetalle] = useState(false);
  const [compartir, setCompartir] = useState(false);

  return (
    <Animated.View entering={ENTRAR}>
      <Text style={[T.titulo, { color: C.tinta, marginTop: 22 }]} accessibilityRole="header">
        Tu resultado
      </Text>
      <Text style={[T.cuerpo, { color: C.suave, marginTop: 8 }]}>
        Has respondido sí o no a {contestadas} de {TOTAL}.
        {importantes.length > 0 &&
          ` Cuentan el doble: ${importantes.map((t) => temaPorId(t)?.nombre.toLowerCase()).join(', ')}.`}
      </Text>

      {contestadas < 5 ? (
        <Tarjeta style={{ marginTop: 18 }}>
          <Text style={[T.cuerpo, { color: C.tinta }]}>
            Responde sí o no a al menos 5 frases para ver un resultado.
          </Text>
        </Tarjeta>
      ) : (
        <Tarjeta style={{ marginTop: 18, gap: 16 }}>
          {resultados.map((r) => {
            const p = partidoPorId(r.partidoId)!;
            return (
              <View key={r.partidoId} style={{ gap: 6 }} accessible accessibilityLabel={`${p.siglas}: ${r.porcentaje} %`}>
                <View style={s.filaResultado}>
                  <Marca color={p.color} tam={11} />
                  <Text style={[T.cuerpoSemi, { color: C.tinta, flex: 1 }]}>{p.siglas}</Text>
                  <Text style={[T.seccion, { color: C.tinta, fontSize: 20, fontVariant: ['tabular-nums'] }]}>
                    {r.preguntas ? `${r.porcentaje} %` : '—'}
                  </Text>
                </View>
                <View style={s.barra}>
                  <View style={[s.barraLlena, { width: `${r.porcentaje}%`, backgroundColor: p.color }]} />
                </View>
                <Text style={[T.meta, { color: C.suave, fontSize: 12.5 }]}>
                  {r.preguntas} {r.preguntas === 1 ? 'frase' : 'frases'}
                </Text>
              </View>
            );
          })}
        </Tarjeta>
      )}

      <Text style={[T.meta, { color: C.suave, marginTop: 12 }]}>
        No es una recomendación de voto.
      </Text>

      <View style={[s.pieFila, { justifyContent: 'flex-start', gap: 8 }]}>
        <Pulsable onPress={() => setDetalle((d) => !d)} style={s.boton} vibracion="ligera" accessibilityRole="button">
          <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>
            {detalle ? 'Ocultar detalle' : 'Ver frase por frase'}
          </Text>
        </Pulsable>
        <Pulsable onPress={onRepetir} style={s.pildora} accessibilityRole="button">
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>Repetir</Text>
        </Pulsable>
      </View>
      {contestadas >= 5 && (
        <Pulsable onPress={() => setCompartir(true)} style={s.compartir} vibracion="ligera" accessibilityRole="button">
          <Icono nombre="enlace" tam={16} color={C.tinta} peso="bold" />
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Compartir mi resultado</Text>
        </Pulsable>
      )}
      <VentanaCompartir
        visible={compartir}
        onCerrar={() => setCompartir(false)}
        resultados={resultados}
        contestadas={contestadas}
      />

      {detalle && (
        <View style={{ gap: 12, marginTop: 16 }}>
          {AFIRMACIONES.map((a) => (
            <Tarjeta key={a.id} style={{ gap: 10 }}>
              <Text style={[T.meta, { color: C.suave }]}>{temaPorId(a.temaId)?.nombre}</Text>
              <Text style={[T.cuerpoSemi, { color: C.tinta }]}>{a.texto}</Text>
              <Text style={[T.meta, { color: C.tinta }]}>
                Tú: <Text style={{ fontFamily: F.textoSemi }}>{textoRespuesta(respuestas[a.id])}</Text>
              </Text>
              <View style={{ gap: 8 }}>
                {PARTIDOS_TEST.map((id) => {
                  const p = partidoPorId(id)!;
                  const po = a.posturas[id];
                  const archivo = p.anterior?.archivo;
                  return (
                    <View key={id} style={s.postura}>
                      <View style={{ paddingTop: 4 }}>
                        <Marca color={p.color} tam={9} />
                      </View>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[T.meta, { color: C.tinta }]}>
                          <Text style={{ fontFamily: F.textoSemi }}>{p.siglas}: </Text>
                          {textoPostura(po?.valor)}
                        </Text>
                        {po && (
                          <Text style={[T.meta, { color: C.suave, fontSize: 12.5 }]}>
                            {po.motivo}{' '}
                            {archivo ? (
                              <Text
                                onPress={() => Linking.openURL(urlPagina(archivo, po.pagina))}
                                style={{ color: C.tinta, textDecorationLine: 'underline' }}
                                accessibilityRole="link"
                              >
                                {`pág. ${po.pagina}`}
                              </Text>
                            ) : (
                              `pág. ${po.pagina}`
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </Tarjeta>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

// Vista previa de la imagen del resultado y botón para compartirla.
function VentanaCompartir({
  visible,
  onCerrar,
  resultados,
  contestadas,
}: {
  visible: boolean;
  onCerrar: () => void;
  resultados: ReturnType<typeof calcular>;
  contestadas: number;
}) {
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
  pila: { height: 340, marginTop: 22 },
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
});
