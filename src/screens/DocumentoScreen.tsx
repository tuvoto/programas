import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Partido } from '../data/partidos';
import { Tema } from '../data/temas';
import { crearDocumento, htmlVista } from '../lib/ficha';
import { descargarDocumento } from '../lib/descargarFicha';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Marca from '../components/Marca';
import VistaDocumento from '../components/VistaDocumento';
import { C, M, R, S, T, esWeb } from '../theme';

type Props = { partido: Partido; temas: Tema[]; onVolver: () => void };

// Vista previa del PDF: se ve el documento entero y, abajo, el botón para descargarlo.
export default function DocumentoScreen({ partido: p, temas, onVolver }: Props) {
  const documento = useMemo(() => crearDocumento(p, temas), [p, temas]);
  const html = useMemo(() => htmlVista(documento), [documento]);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState(false);
  const { bottom } = useSafeAreaInsets();

  const descargar = async () => {
    setError(false);
    setGenerando(true);
    try {
      await descargarDocumento(documento);
    } catch {
      setError(true);
    } finally {
      setGenerando(false);
    }
  };

  const titulo = temas.length === 1 ? temas[0].nombre : `Propuestas de ${p.siglas}`;

  return (
    <View style={{ flex: 1 }}>
      <View style={s.arriba}>
        <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver">
          <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Volver</Text>
        </Pulsable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Marca color={p.color} tam={9} />
            <Text style={[T.meta, { color: C.suave }]} numberOfLines={1}>
              {p.siglas} · Vista previa
            </Text>
          </View>
          <Text style={[T.tarjeta, { color: C.tinta }]} numberOfLines={1} accessibilityRole="header">
            {titulo}
          </Text>
        </View>
      </View>

      <View style={s.vista}>
        <VistaDocumento html={html} />
      </View>

      <View style={[s.abajo, { paddingBottom: 12 + bottom }]}>
        <Pulsable
          onPress={descargar}
          disabled={generando}
          style={[s.boton, generando && { opacity: 0.6 }]}
          vibracion="ligera"
          accessibilityRole="button"
        >
          {generando ? (
            <ActivityIndicator size="small" color={C.sobreTinta} />
          ) : (
            <Icono nombre="descargar" tam={17} color={C.sobreTinta} peso="bold" />
          )}
          <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 15 }]}>
            {generando ? 'Preparando PDF…' : 'Descargar PDF'}
          </Text>
        </Pulsable>
        {esWeb && !error && <Text style={[T.meta, { color: C.suave, textAlign: 'center' }]}>Elige «Guardar como PDF».</Text>}
        {error && <Text style={[T.meta, { color: C.avisoTexto, textAlign: 'center' }]}>No se ha podido crear el PDF.</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  arriba: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: M, paddingTop: 12, paddingBottom: 10 },
  volver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  vista: { flex: 1, marginHorizontal: 0, overflow: 'hidden' },
  abajo: { paddingHorizontal: M, paddingTop: 12, gap: 6, backgroundColor: C.tarjeta, boxShadow: S.flotante },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.tinta,
    paddingVertical: 14,
    borderRadius: R.boton,
    boxShadow: S.boton,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});
