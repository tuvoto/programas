// iPhone y Android: hace una foto de la tarjeta del resultado (1080 × 1920)
// y abre el menú del sistema para enviarla o guardarla.
import { RefObject } from 'react';
import { PixelRatio, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Resultado } from '../data/test';

export async function compartirResultado(vista: RefObject<View | null>, _datos: { resultados: Resultado[]; contestadas: number; total: number }) {
  if (!vista.current) throw new Error('Sin tarjeta');
  const uri = await captureRef(vista, {
    format: 'png',
    quality: 1,
    width: 1080 / PixelRatio.get(),
    height: 1920 / PixelRatio.get(),
    result: 'tmpfile',
  });
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'Mi resultado en TuVoto' });
}
