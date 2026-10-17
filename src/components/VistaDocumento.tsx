// iPhone y Android: el documento tal cual saldrá en el PDF, dentro de un visor web.
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { C } from '../theme';

export default function VistaDocumento({ html }: { html: string }) {
  return (
    <WebView
      source={{ html }}
      originWhitelist={['*']}
      style={s.vista}
      startInLoadingState
      renderLoading={() => (
        <View style={s.cargando}>
          <ActivityIndicator color={C.suave} />
        </View>
      )}
      // Los enlaces del documento no navegan dentro del visor.
      onShouldStartLoadWithRequest={(r) => r.url === 'about:blank' || r.url.startsWith('data:') || r.navigationType !== 'click'}
    />
  );
}

const s = StyleSheet.create({
  vista: { flex: 1, backgroundColor: '#E9ECF2' },
  cargando: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9ECF2' },
});
