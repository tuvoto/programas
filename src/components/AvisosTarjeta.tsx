import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { abrirAjustes, activarAvisos, AVISOS, avisosDisponibles, desactivarAvisos, useAvisos } from '../lib/avisos';
import Pulsable from './Pulsable';
import Icono from './Icono';
import Tarjeta from './Tarjeta';
import { C, F, R, T } from '../theme';

const corta = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} nov`;
};

// Tarjeta de la pestaña «Vota» para activar o quitar los avisos de fechas clave.
// Solo en la app del móvil.
export default function AvisosTarjeta() {
  const estado = useAvisos();
  const [ocupado, setOcupado] = useState(false);
  const [verFechas, setVerFechas] = useState(false);
  if (!avisosDisponibles || estado === 'cargando') return null;
  const activos = estado === 'activados';

  const pulsar = async () => {
    setOcupado(true);
    try {
      await (activos ? desactivarAvisos() : activarAvisos());
    } finally {
      setOcupado(false);
    }
  };

  return (
    <Tarjeta style={[{ gap: 12, marginTop: 16 }, !activos && { backgroundColor: C.tinta }]}>
      <View style={s.fila}>
        <View style={[s.icono, { backgroundColor: activos ? C.okFondo : C.amarillo }]}>
          <Icono nombre="campana" tam={20} color={activos ? C.okTexto : C.tinta} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[T.tarjeta, { color: activos ? C.tinta : C.sobreTinta }]}>
            {activos ? 'Avisos activados' : '¿Te avisamos de las fechas clave?'}
          </Text>
          <Text style={[T.meta, { color: activos ? C.suave : C.sobreTintaSuave }]}>
            {activos
              ? 'Te avisaremos del voto por correo, la campaña y el día de las elecciones.'
              : 'Voto por correo, campaña y día de las elecciones. Sin datos personales: los avisos los programa tu móvil.'}
          </Text>
        </View>
      </View>

      {estado === 'bloqueados' ? (
        <>
          <Text style={[T.meta, { color: C.sobreTintaSuave }]}>
            Las notificaciones de TuVoto están desactivadas en los ajustes del móvil.
          </Text>
          <Pulsable onPress={abrirAjustes} style={[s.boton, { backgroundColor: C.amarillo }]} accessibilityRole="button">
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Abrir los ajustes</Text>
          </Pulsable>
        </>
      ) : (
        <View style={s.botones}>
          <Pulsable
            onPress={pulsar}
            disabled={ocupado}
            style={[s.boton, activos ? { backgroundColor: C.relleno } : { backgroundColor: C.amarillo }]}
            vibracion="ligera"
            accessibilityRole="switch"
            accessibilityState={{ checked: activos, busy: ocupado }}
            accessibilityLabel="Avisos de fechas clave"
          >
            {ocupado && <ActivityIndicator size="small" color={C.tinta} />}
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>{activos ? 'Quitar los avisos' : 'Sí, avisadme'}</Text>
          </Pulsable>
          <Pulsable onPress={() => setVerFechas((v) => !v)} style={s.enlace} accessibilityRole="button" accessibilityState={{ expanded: verFechas }}>
            <Text style={[T.etiqueta, { color: activos ? C.tinta : C.sobreTinta, fontSize: 13.5, textDecorationLine: 'underline' }]}>
              {verFechas ? 'Ocultar fechas' : 'Ver qué avisos'}
            </Text>
          </Pulsable>
        </View>
      )}

      {verFechas && (
        <View style={{ gap: 6 }}>
          {AVISOS.map((a) => (
            <View key={a.id} style={s.aviso}>
              <Text style={[T.meta, { color: activos ? C.suave : C.sobreTintaSuave, width: 52, fontFamily: F.textoSemi }]}>{corta(a.fecha)}</Text>
              <Text style={[T.meta, { color: activos ? C.tinta : C.sobreTinta, flex: 1 }]}>{a.titulo}</Text>
            </View>
          ))}
        </View>
      )}
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  icono: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  botones: { flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  boton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 11, borderRadius: R.boton },
  enlace: { paddingVertical: 8 },
  aviso: { flexDirection: 'row', gap: 8 },
});
