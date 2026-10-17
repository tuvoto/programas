// Web: el documento tal cual saldrá en el PDF, en un marco dentro de la página.
import { createElement } from 'react';
import { View } from 'react-native';

export default function VistaDocumento({ html }: { html: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#E9ECF2' }}>
      {createElement('iframe', {
        srcDoc: html,
        title: 'Vista previa del documento',
        sandbox: '',
        style: { border: 0, width: '100%', height: '100%', flex: 1, background: '#E9ECF2' },
      })}
    </View>
  );
}
