import { Platform } from 'react-native';
import Head from 'expo-router/head';
import { CONFIG } from '../config';

// Título y descripción de cada página para Google y para la vista previa al
// compartir el enlace. Solo en la web: en iPhone, expo-router/head muestra una
// alerta pidiendo configurar Handoff, así que en el móvil no se pinta.
export default function Meta({ titulo, descripcion, ruta }: { titulo: string; descripcion: string; ruta: string }) {
  if (Platform.OS !== 'web') return null;
  const completo = titulo === 'TuVoto' ? 'TuVoto: compara los programas electorales del 29-N' : `${titulo} · TuVoto`;
  const url = `${CONFIG.webUrl}${ruta}`;
  return (
    <Head>
      <title>{completo}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={completo} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:url" content={url} />
    </Head>
  );
}
