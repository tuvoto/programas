import { useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { PARTIDOS, partidoPorId } from '../data/partidos';
import { edicionVigente } from '../data/propuestas';
import { temaPorId } from '../data/temas';
import { buscar, trozos, SUGERENCIAS, Resultado } from '../lib/buscar';
import { urlPagina } from '../lib/web';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import { C, F, M, R, S, T, ANCHO_LECTURA, CENTRADO, plural } from '../theme';

type Props = { inicial?: string; onVolver: () => void };

// Buscador: escribe una palabra y ve qué propone cada partido sobre ella.
export default function BuscarScreen({ inicial = '', onVolver }: Props) {
  const [consulta, setConsulta] = useState(inicial);
  const campo = useRef<TextInput>(null);
  const [foco, setFoco] = useState(false);
  useEffect(() => {
    if (inicial) setConsulta(inicial);
  }, [inicial]);

  // En la web, la búsqueda queda en la dirección (?q=…) para poder compartirla.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (consulta.trim()) url.searchParams.set('q', consulta.trim());
    else url.searchParams.delete('q');
    window.history.replaceState(window.history.state, '', url.toString());
  }, [consulta]);

  const resultados = useMemo(() => buscar(consulta), [consulta]);
  const porPartido = useMemo(() => {
    const m = new Map<string, Resultado[]>();
    for (const r of resultados) m.set(r.propuesta.partidoId, [...(m.get(r.propuesta.partidoId) ?? []), r]);
    return PARTIDOS.filter((p) => m.has(p.id)).map((p) => ({ partido: p, lista: m.get(p.id)! }));
  }, [resultados]);
  // Partidos con programa cargado que no dicen nada sobre lo buscado.
  const sinMencion = PARTIDOS.filter((p) => edicionVigente(p.id) && !porPartido.some((g) => g.partido.id === p.id));
  const buscando = consulta.trim().length >= 2;

  return (
    <ScrollView contentContainerStyle={s.contenedor} keyboardShouldPersistTaps="handled">
      <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver">
        <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Volver</Text>
      </Pulsable>

      <Text style={[T.titulo, { color: C.tinta, marginTop: 22 }]} accessibilityRole="header">
        Buscar en los programas
      </Text>
      <Text style={[T.cuerpo, { color: C.suave, marginTop: 6, maxWidth: ANCHO_LECTURA }]}>
        Escribe una medida y mira qué propone cada partido sobre ella.
      </Text>

      <View style={[s.campo, foco && s.campoFoco]}>
        <Icono nombre="buscar" tam={20} color={C.suave} peso="bold" />
        <TextInput
          ref={campo}
          value={consulta}
          onChangeText={setConsulta}
          placeholder="Por ejemplo: alquiler, SMI, becas…"
          placeholderTextColor={C.suave}
          style={s.input}
          autoFocus={!inicial}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel="Buscar en los programas"
          clearButtonMode="never"
          onFocus={() => setFoco(true)}
          onBlur={() => setFoco(false)}
        />
        {consulta.length > 0 && (
          <Pulsable
            onPress={() => {
              setConsulta('');
              campo.current?.focus();
            }}
            style={s.borrar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Borrar la búsqueda"
          >
            <Icono nombre="cerrar" tam={12} color={C.sobreTinta} peso="bold" />
          </Pulsable>
        )}
      </View>

      {!buscando ? (
        <View style={{ marginTop: 18 }}>
          <Text style={[T.etiqueta, { color: C.suave, fontSize: 13 }]}>Prueba con</Text>
          <View style={s.sugerencias}>
            {SUGERENCIAS.map((q) => (
              <Pulsable key={q} onPress={() => setConsulta(q)} style={s.chip} escala={0.95} vibracion="seleccion" accessibilityRole="button">
                <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>{q}</Text>
              </Pulsable>
            ))}
          </View>
        </View>
      ) : resultados.length === 0 ? (
        <Text style={[T.cuerpo, { color: C.suave, marginTop: 20, maxWidth: ANCHO_LECTURA }]}>
          Ningún programa habla de «{consulta.trim()}» en las propuestas resumidas. Prueba con otra palabra o con un sinónimo.
        </Text>
      ) : (
        <View style={{ marginTop: 18, gap: 12 }}>
          <Text style={[T.meta, { color: C.suave }]} accessibilityLiveRegion="polite">
            {plural(resultados.length, 'propuesta', 'propuestas')} de {plural(porPartido.length, 'partido', 'partidos')}
          </Text>
          {porPartido.map(({ partido: p, lista }) => {
            const archivo = edicionVigente(p.id) === 2023 ? p.anterior?.archivo : undefined;
            return (
              <Tarjeta key={p.id} style={{ gap: 12 }}>
                <Pulsable onPress={() => router.push(`/partido/${p.id}`)} style={s.cabecera} escala={0.98} accessibilityRole="link">
                  <Marca color={p.color} tam={12} />
                  <Text style={[T.tarjeta, { color: C.tinta, fontSize: 18, flexShrink: 1 }]}>{p.siglas}</Text>
                  {edicionVigente(p.id) === 2023 && (
                    <View style={s.edicion}>
                      <Text style={[T.etiqueta, { color: C.suave }]}>Programa de 2023</Text>
                    </View>
                  )}
                </Pulsable>
                {lista.map(({ propuesta: pr, claves }, i) => (
                  <View key={i} style={s.propuesta}>
                    <Text style={[T.etiqueta, { color: C.suave }]}>{temaPorId(pr.temaId)?.nombre}</Text>
                    <Text style={[T.cuerpo, { color: C.tinta }]}>
                      {trozos(pr.resumen, claves).map((tr, k) =>
                        tr.marcado ? (
                          <Text key={k} style={s.marcado}>
                            {tr.t}
                          </Text>
                        ) : (
                          tr.t
                        ),
                      )}
                      {pr.pagina != null && '  '}
                      {pr.pagina != null &&
                        (archivo ? (
                          <Text
                            onPress={() => Linking.openURL(urlPagina(archivo, pr.pagina!))}
                            accessibilityRole="link"
                            accessibilityLabel={`Abrir el programa por la página ${pr.pagina}`}
                            style={[T.meta, { color: C.tinta, fontFamily: F.textoSemi, textDecorationLine: 'underline' }]}
                          >{`pág. ${pr.pagina}`}</Text>
                        ) : (
                          <Text style={[T.meta, { color: C.suave }]}>{`pág. ${pr.pagina}`}</Text>
                        ))}
                    </Text>
                  </View>
                ))}
              </Tarjeta>
            );
          })}
          {sinMencion.length > 0 && (
            <Text style={[T.meta, { color: C.suave, marginTop: 4, maxWidth: ANCHO_LECTURA }]}>
              Sin propuestas resumidas sobre esto: {sinMencion.map((p) => p.siglas).join(', ')}. Puede que su programa completo
              sí lo mencione.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  contenedor: { ...CENTRADO, paddingHorizontal: M, paddingTop: 12, paddingBottom: 48 },
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
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    paddingLeft: 16,
    paddingRight: 10,
    minHeight: 54,
    borderRadius: R.boton + 4,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
    maxWidth: ANCHO_LECTURA,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  // El campo enmarcado en azul marino mientras se escribe.
  campoFoco: { borderColor: C.tinta },
  // 16 px: en el iPhone, un tamaño menor hace zoom al escribir.
  input: { flex: 1, fontFamily: F.texto, fontSize: 17, color: C.tinta, paddingVertical: 14, minWidth: 0 },
  borrar: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.suave, alignItems: 'center', justifyContent: 'center' },
  sugerencias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { paddingHorizontal: 14, minHeight: 40, justifyContent: 'center', borderRadius: R.pildora, backgroundColor: C.tarjeta, boxShadow: S.tarjeta },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  edicion: { marginLeft: 'auto', backgroundColor: C.relleno, borderRadius: R.pildora, paddingHorizontal: 9, paddingVertical: 3 },
  propuesta: { gap: 3, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.linea, paddingTop: 12 },
  marcado: { backgroundColor: C.avisoFondo, fontFamily: F.textoSemi },
});
