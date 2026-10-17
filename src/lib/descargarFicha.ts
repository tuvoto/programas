// iPhone y Android: genera el PDF y abre el menú del sistema para guardarlo
// en Archivos, enviarlo o imprimirlo.
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Documento } from './ficha';

export async function descargarDocumento(d: Documento): Promise<void> {
  const { uri } = await Print.printToFileAsync({ html: d.html, width: 595, height: 842 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: d.nombre });
  } else {
    await Print.printAsync({ uri });
  }
}
