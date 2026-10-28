// Imagen del resultado del test para compartir (formato historia, 9:16).
// Deja libres arriba y abajo las franjas que tapan Instagram y WhatsApp.
// Se dibuja con medidas relativas al ancho, para verla en pequeño en pantalla
// y exportarla a 1080 × 1920. Salen todos los partidos del test, ordenados por
// coincidencia, y el aviso de que no es una recomendación de voto.
import { forwardRef } from 'react';
import { Text as TextoRN, TextProps, View } from 'react-native';
import { partidoPorId } from '../data/partidos';
import { Resultado } from '../data/test';
import { CONFIG } from '../config';
import { C, F } from '../theme';

type Props = { resultados: Resultado[]; contestadas: number; total: number; ancho: number };

// La imagen tiene medidas fijas: el texto no crece con el tamaño de letra del
// móvil ni lleva el margen extra que Android añade a cada línea.
function Text({ style, ...props }: TextProps) {
  return <TextoRN {...props} allowFontScaling={false} style={[{ includeFontPadding: false }, style]} />;
}

export const webCorta = () => CONFIG.webUrl.replace(/^https?:\/\//, '');

const TarjetaResultado = forwardRef<View, Props>(function TarjetaResultado({ resultados, contestadas, total, ancho }, ref) {
  const u = ancho / 360; // 1 unidad = 3 px en la imagen final
  // Con más de 4 partidos (los de tu comunidad), todo un poco más compacto
  // para que quepa sin pisar el aviso de abajo.
  // Como mucho, los 6 primeros: con más no se leen bien en una historia.
  const lista = resultados.slice(0, 6);
  const n = lista.length;
  const resto = resultados.length - n;
  const k = n <= 4 ? 1 : n === 5 ? 0.85 : 0.7;
  return (
    <View
      ref={ref}
      collapsable={false}
      style={{ width: ancho, height: ancho * (16 / 9), backgroundColor: C.tinta, paddingHorizontal: 28 * u, paddingTop: (n <= 4 ? 88 : 72) * u, paddingBottom: (n <= 4 ? 116 : 100) * u, justifyContent: 'space-between' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 * u }}>
        <View style={{ width: 30 * u, height: 30 * u, borderRadius: 8.5 * u, backgroundColor: '#F7F4E6', justifyContent: 'center', paddingHorizontal: 7 * u }}>
          <View style={{ height: 4.5 * u, borderRadius: 1.5 * u, backgroundColor: C.amarillo, marginTop: -4 * u }} />
        </View>
        <Text style={{ fontFamily: F.titular, fontSize: 15 * u, lineHeight: 18 * u, color: C.sobreTinta }}>TuVoto</Text>
      </View>

      <View style={{ gap: 26 * k * u }}>
        <View style={{ gap: 8 * u }}>
          <Text style={{ fontFamily: F.titular, fontSize: (n <= 4 ? 34 : 30) * u, lineHeight: (n <= 4 ? 36 : 32) * u, letterSpacing: -0.8 * u, color: C.sobreTinta }}>
            Mi resultado en el test de afinidad
          </Text>
          <Text style={{ fontFamily: F.texto, fontSize: 13 * u, lineHeight: 18 * u, color: C.sobreTintaSuave }}>
            {contestadas} de {total} frases respondidas · programas de 2023{resto > 0 ? ` · los ${n} primeros de ${resultados.length} partidos` : ''}
          </Text>
        </View>

        <View style={{ gap: 18 * k * u }}>
          {lista.map((r) => {
            const p = partidoPorId(r.partidoId);
            if (!p) return null;
            return (
              <View key={r.partidoId} style={{ gap: 7 * k * u }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 * u }}>
                  <View style={{ width: 11 * u, height: 11 * u, borderRadius: 3 * u, backgroundColor: p.color }} />
                  <Text style={{ flex: 1, fontFamily: F.textoSemi, fontSize: 17 * Math.max(k, 0.9) * u, lineHeight: 21 * Math.max(k, 0.9) * u, color: C.sobreTinta }} numberOfLines={1}>{p.siglas}</Text>
                  <Text style={{ fontFamily: F.titular, fontSize: 22 * Math.max(k, 0.9) * u, lineHeight: 26 * Math.max(k, 0.9) * u, color: C.sobreTinta, fontVariant: ['tabular-nums'] }}>
                    {r.preguntas ? `${r.porcentaje} %` : '—'}
                  </Text>
                </View>
                <View style={{ height: 9 * u, borderRadius: 4.5 * u, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
                  <View style={{ width: `${r.porcentaje}%`, height: '100%', borderRadius: 4.5 * u, backgroundColor: p.color }} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 6 * u, marginTop: 22 * u }}>
        <Text style={{ fontFamily: F.textoSemi, fontSize: 13 * u, lineHeight: 18 * u, color: C.sobreTinta }}>No es una recomendación de voto.</Text>
        <Text style={{ fontFamily: F.texto, fontSize: 13 * u, lineHeight: 18 * u, color: C.sobreTintaSuave }}>
          Haz el test en {webCorta()}
        </Text>
      </View>
    </View>
  );
});

export default TarjetaResultado;
