import { View } from 'react-native';
import { C } from '../theme';

// Urna: cuadrado en tinta con la ranura amarilla. Igual que el icono de la app.
export default function Logo({ tam = 20 }: { tam?: number }) {
  return (
    <View style={{ width: tam, height: tam, borderRadius: tam * 0.28, backgroundColor: C.tinta, justifyContent: 'center', paddingHorizontal: tam * 0.22 }}>
      <View style={{ height: Math.max(2, tam * 0.14), borderRadius: 2, backgroundColor: C.amarillo, marginTop: -tam * 0.12 }} />
    </View>
  );
}
