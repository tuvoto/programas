import { View } from 'react-native';
import { C } from '../theme';

// Cuadrado de color de un partido. Todos del mismo tamaño: ningún partido
// pesa visualmente más que otro. "vacia" = el partido no trata el tema.
export default function Marca({
  color,
  tam = 10,
  vacia = false,
}: {
  color: string;
  tam?: number;
  vacia?: boolean;
}) {
  return (
    <View
      style={{
        width: tam,
        height: tam,
        borderRadius: Math.max(2, tam / 4),
        backgroundColor: vacia ? 'transparent' : color,
        borderWidth: vacia ? 1.5 : 0,
        borderColor: C.vacia,
      }}
    />
  );
}
