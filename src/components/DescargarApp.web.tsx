import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Pulsable from './Pulsable';
import { CONFIG } from '../config';
import { C, F, R, S, T } from '../theme';

// Web: invita a descargar la app de Google Play (avisos de fechas incluidos).
// Solo aparece cuando la app está publicada y no en iPhone o iPad, donde aún
// no hay app.
export default function DescargarApp() {
  const [mostrar, setMostrar] = useState(false);
  useEffect(() => {
    if (!CONFIG.googlePlayPublicada || typeof navigator === 'undefined') return;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setMostrar(!ios);
  }, []);
  if (!mostrar) return null;

  return (
    <View style={s.caja}>
      <View style={{ flex: 1, minWidth: 200, gap: 2 }}>
        <Text style={[T.tarjeta, { color: C.sobreTinta }]}>TuVoto también es app</Text>
        <Text style={[T.meta, { color: C.sobreTintaSuave }]}>Con avisos del voto por correo, la campaña y el día de las elecciones.</Text>
      </View>
      <Pulsable
        onPress={() => Linking.openURL(CONFIG.googlePlayUrl)}
        style={s.boton}
        vibracion="ligera"
        accessibilityRole="link"
        accessibilityLabel="Descárgala en Google Play"
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
          <Path d="M4 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 4 3.5Z" fill={C.tinta} />
        </Svg>
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14, fontFamily: F.textoSemi }]}>Descárgala en Google Play</Text>
      </Pulsable>
    </View>
  );
}

const s = StyleSheet.create({
  caja: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    padding: 16,
    borderRadius: R.tarjeta,
    backgroundColor: C.tinta,
    boxShadow: S.tarjeta,
  },
  boton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 11, borderRadius: R.boton, backgroundColor: C.amarillo },
});
