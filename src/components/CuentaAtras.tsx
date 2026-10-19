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
  return (
    <View style={[g.fila, ancha && g.filaAncha, dias === null && { opacity: 0 }]} accessible accessibilityLabel={etiqueta}>
      <Text style={[g.numero, { fontSize: tam, lineHeight: tam * 0.9 }]}>{dias === 0 ? 'Hoy' : String(dias ?? 41)}</Text>
      <View style={g.lado}>
        <Text style={[T.seccion, { color: C.tinta, fontSize: ancha ? 28 : 22, lineHeight: ancha ? 32 : 26 }]}>
          {dias === 0 ? 'se vota.' : dias === 1 ? 'día para votar.' : 'días para votar.'}
        </Text>
        <Text style={[T.cuerpo, { color: C.suave }]}>Elecciones generales, domingo 29 de noviembre.</Text>
        <View style={g.raya} />
      </View>
    </View>
  );
}

const g = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 18, marginBottom: 6 },
  filaAncha: { justifyContent: 'center', gap: 28, marginTop: 28, marginBottom: 16 },
  numero: { fontFamily: F.titular, color: C.tinta, letterSpacing: -4, fontVariant: ['tabular-nums'] },
  lado: { flexShrink: 1, gap: 4 },
  raya: { height: 6, width: 56, borderRadius: 3, backgroundColor: C.amarillo, marginTop: 8 },
});
