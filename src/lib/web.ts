import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { CONFIG } from '../config';

// Dirección completa de un archivo publicado con la web (carpeta public/).
// En la web se usa la misma dirección desde la que se está viendo la página,
// así funciona igual en local (npx expo start) que en GitHub Pages.
export function urlPublica(ruta: string): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const base = window.location.pathname.startsWith('/programas') ? '/programas' : '';
    return `${window.location.origin}${base}/${ruta}`;
  }
  // En modo prueba (Expo Go) los archivos salen del propio ordenador, que es
  // quien sirve la app; así se pueden abrir antes de publicar la web.
  const host = Constants.expoConfig?.hostUri;
  if (__DEV__ && host) return `http://${host}/${ruta}`;
  return `${CONFIG.webUrl}/${ruta}`;
}

// PDF del programa abierto por una página concreta (los visores de PDF de
// los navegadores entienden «#page=N»).
export function urlPagina(archivo: string, pagina: number): string {
  return `${urlPublica(archivo)}#page=${pagina}`;
}
