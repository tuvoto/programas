// Pide una valoración en la tienda con la ventana oficial del sistema, una vez
// por sesión y solo después de terminar el test. El propio sistema limita
// cuántas veces se muestra de verdad, así que nunca molesta más de la cuenta.
import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';

let pedida = false;
export function pedirValoracion() {
  if (pedida || Platform.OS === 'web') return;
  pedida = true;
  setTimeout(() => {
    StoreReview.isAvailableAsync()
      .then((si) => (si ? StoreReview.requestReview() : undefined))
      .catch(() => {});
  }, 4000);
}
