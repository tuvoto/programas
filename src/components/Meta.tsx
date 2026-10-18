import Head from 'expo-router/head';
import { CONFIG } from '../config';

// Título y descripción de cada página para Google y para la vista previa al
// compartir el enlace. En el móvil no tiene efecto visible.
export default function Meta({ titulo, descripcion, ruta }: { titulo: string; descripcion: string; ruta: string }) {
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
