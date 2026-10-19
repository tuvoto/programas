import { StyleSheet, Text, View } from 'react-native';
import { C, F, T } from '../theme';

type Props = {
  dias: number | null; // null mientras se calcula en la web
  ancho: number; // ancho disponible
};

// Cuenta atrás con la cifra muy grande como protagonista; el texto acompaña.
export default function CuentaAtras({ dias, ancho }: Props) {
  const ancha = ancho >= 760;
  const tam = ancha ? 152 : 112;
  const etiqueta = dias === 0 ? 'Las elecciones son hoy' : `Faltan ${dias ?? ''} días para las elecciones del 29 de noviembre`;
  const sub = ancha ? 28 : 22;
  return (
    <View style={[g.bloque, ancha && g.bloqueAncho, dias === null && { opacity: 0 }]} accessible accessibilityLabel={etiqueta}>
      {dias !== 0 && (
        <Text style={[T.seccion, { color: C.tinta, fontSize: sub, lineHeight: sub + 4 }]}>{dias === 1 ? 'Falta' : 'Faltan'}</Text>
      )}
      <View style={[g.fila, ancha && g.filaAncha]}>
        <Text style={[g.numero, { fontSize: tam, lineHeight: tam * 0.9 }]}>{dias === 0 ? 'Hoy' : String(dias ?? 41)}</Text>
        <View style={g.lado}>
          <Text style={[T.seccion, { color: C.tinta, fontSize: sub, lineHeight: sub + 4 }]}>
            {dias === 0 ? 'son las elecciones.' : dias === 1 ? 'día para las elecciones.' : 'días para las elecciones.'}
          </Text>
          <Text style={[T.cuerpo, { color: C.suave }]}>Elecciones generales, domingo 29 de noviembre.</Text>
          <View style={g.raya} />
        </View>
      </View>
    </View>
  );
}

const g = StyleSheet.create({
  bloque: { marginTop: 18, marginBottom: 6, gap: 2 },
  bloqueAncho: { alignSelf: 'center', marginTop: 28, marginBottom: 16 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  filaAncha: { gap: 28 },
  numero: { fontFamily: F.titular, color: C.tinta, letterSpacing: -4, fontVariant: ['tabular-nums'] },
  lado: { flexShrink: 1, gap: 4 },
  raya: { height: 6, width: 56, borderRadius: 3, backgroundColor: C.amarillo, marginTop: 8 },
});
