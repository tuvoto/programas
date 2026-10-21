// iPhone y Android: hace una foto de la tarjeta del resultado (1080 × 1920)
// y abre el menú del sistema para enviarla o guardarla.
import { RefObject } from 'react';
import { PixelRatio, Platform, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Resultado } from '../data/test';

export async function compartirResultado(vista: RefObject<View | null>, _datos: { resultados: Resultado[]; contestadas: number; total: number }) {
  if (!vista.current) throw new Error('Sin tarjeta');
  // En Android el tamaño final va en píxeles reales; en iPhone, en puntos (el
  // sistema lo multiplica por la densidad de la pantalla). Así sale 1080 × 1920
  // en los dos: antes, en Android salía de unos 400 píxeles y se veía borrosa.
  const escala = Platform.OS === 'android' ? 1 : PixelRatio.get();
  const uri = await captureRef(vista, {
    format: 'png',
    quality: 1,
    width: 1080 / escala,
    height: 1920 / escala,
    result: 'tmpfile',
  });
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'Mi resultado en TuVoto' });
}
