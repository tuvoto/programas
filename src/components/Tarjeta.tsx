import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { C, R, S } from '../theme';

// Superficie blanca con sombra suave: la pieza básica del estilo.
export default function Tarjeta({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: C.tarjeta, borderRadius: R.tarjeta, padding: 16, boxShadow: S.tarjeta }, style]}>
      {children}
    </View>
  );
}
