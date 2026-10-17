// Web en el móvil: invita a «instalar» la web en la pantalla de inicio, para
// abrirla con su icono y a pantalla completa, como una app.
//   - Android (Chrome y similares): botón que abre el diálogo del navegador.
//   - iPhone (Safari): el sistema no tiene botón, así que se explica el gesto.
// No aparece en el ordenador, si ya está instalada ni si se ha cerrado antes.
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Pulsable from './Pulsable';
import Icono from './Icono';
import { C, R, S, T } from '../theme';

type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const CLAVE = 'programas:instalar-cerrado';

function cerradoAntes() {
  try {
    return localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
}

export default function InstalarWeb() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null);
  const [modo, setModo] = useState<'android' | 'iphone' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const instalada =
      window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
    const tactil = window.matchMedia?.('(pointer: coarse)').matches;
    if (instalada || !tactil || cerradoAntes()) return;

    const ua = navigator.userAgent;
    // Safari de iPhone (no los navegadores dentro de Instagram, WhatsApp…, que no pueden instalar).
    const iphone = /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Instagram|FBAN|FBAV|WhatsApp/.test(ua);
    if (iphone) setModo('iphone');

    const alPoder = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalar);
      setModo('android');
    };
    const alInstalar = () => setModo(null);
    window.addEventListener('beforeinstallprompt', alPoder);
    window.addEventListener('appinstalled', alInstalar);
    return () => {
      window.removeEventListener('beforeinstallprompt', alPoder);
      window.removeEventListener('appinstalled', alInstalar);
    };
  }, []);

  if (!modo) return null;

  const cerrar = () => {
    try {
      localStorage.setItem(CLAVE, '1');
    } catch {
      // Sin almacenamiento: solo se oculta esta vez.
    }
    setModo(null);
  };

  const instalar = async () => {
    if (!evento) return;
    await evento.prompt();
    await evento.userChoice.catch(() => null);
    setEvento(null);
    setModo(null);
  };

  return (
    <View style={s.tarjeta}>
      <View style={s.fila}>
        <View style={s.urna}>
          <View style={s.ranura} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[T.tarjeta, { color: C.tinta }]}>Tenla en tu pantalla de inicio</Text>
          <Text style={[T.meta, { color: C.suave }]}>
            {modo === 'android'
              ? 'Se abre con su icono y a pantalla completa, como una app.'
              : 'Pulsa el botón Compartir de Safari y elige «Añadir a pantalla de inicio».'}
          </Text>
        </View>
      </View>
      <View style={s.acciones}>
        {modo === 'android' && (
          <Pulsable onPress={instalar} style={s.boton} vibracion="ligera" accessibilityRole="button">
            <Icono nombre="descargar" tam={15} color={C.sobreTinta} peso="bold" />
            <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>Instalar</Text>
          </Pulsable>
        )}
        <Pulsable onPress={cerrar} style={s.cerrar} accessibilityRole="button">
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Ahora no</Text>
        </Pulsable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tarjeta: { marginTop: 12, backgroundColor: C.tarjeta, borderRadius: R.tarjeta, padding: 16, gap: 14, boxShadow: S.tarjeta },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  urna: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.tinta, justifyContent: 'center', paddingHorizontal: 11 },
  ranura: { height: 7, borderRadius: 2, backgroundColor: C.amarillo, marginTop: -6 },
  acciones: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  boton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.tinta, paddingHorizontal: 16, paddingVertical: 10, borderRadius: R.boton },
  cerrar: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: R.boton, backgroundColor: C.relleno },
});
