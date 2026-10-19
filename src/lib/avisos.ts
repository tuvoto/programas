// Avisos de fechas clave (iPhone y Android). Son notificaciones locales: el
// propio móvil las programa y las muestra en su fecha. No hay servidor ni se
// envía ningún dato. En la web no existen (ver avisos.web.ts).
//
// No hace falta guardar si la persona los quiere: si hay avisos programados es
// que están activados, y el permiso del sistema dice si ya se le preguntó.
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Linking, Platform } from 'react-native';
import { router, type Href } from 'expo-router';
import * as Notifications from 'expo-notifications';

export type Aviso = { id: string; fecha: string; titulo: string; texto: string; ruta: Href };

// Hora peninsular (en noviembre, UTC+1). Si cambia algún plazo, se cambia aquí
// y, al abrir la app, los avisos ya programados se vuelven a crear.
export const AVISOS: Aviso[] = [
  { id: 'tarjeta', fecha: '2026-11-02T19:00:00+01:00', titulo: 'Llega tu tarjeta censal', texto: 'Estos días te llega a casa, con tu colegio y tu mesa.', ruta: '/vota' },
  { id: 'campana', fecha: '2026-11-13T10:00:00+01:00', titulo: 'Empieza la campaña electoral', texto: 'Compara qué propone cada partido, tema a tema.', ruta: '/' },
  { id: 'correo-2', fecha: '2026-11-17T19:00:00+01:00', titulo: '¿Vas a votar por correo?', texto: 'Quedan 2 días para pedirlo en Correos.', ruta: '/voto-correo' },
  { id: 'correo-0', fecha: '2026-11-19T10:00:00+01:00', titulo: 'Último día para pedir el voto por correo', texto: 'Hoy puedes pedirlo en Correos, en persona o por internet.', ruta: '/voto-correo' },
  { id: 'enviar', fecha: '2026-11-24T19:00:00+01:00', titulo: 'Si votas por correo, mañana es el último día', texto: 'Envía tu voto en Correos como muy tarde el 25 de noviembre.', ruta: '/voto-correo' },
  { id: 'manana', fecha: '2026-11-28T19:00:00+01:00', titulo: 'Mañana se vota', texto: 'Mira dónde te toca y qué tienes que llevar.', ruta: '/vota' },
  { id: 'hoy', fecha: '2026-11-29T09:00:00+01:00', titulo: 'Hoy se vota', texto: 'Los colegios están abiertos de 9:00 a 20:00.', ruta: '/vota' },
];

export type EstadoAvisos = 'cargando' | 'sin-preguntar' | 'activados' | 'desactivados' | 'bloqueados';

const CANAL = 'fechas';
let estado: EstadoAvisos = 'cargando';
const oyentes = new Set<() => void>();
const poner = (e: EstadoAvisos) => {
  estado = e;
  oyentes.forEach((f) => f());
};

// Mientras la app está abierta, los avisos también se muestran.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

async function crearCanal() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL, {
    name: 'Fechas clave de las elecciones',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function programar() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const ahora = Date.now();
  for (const a of AVISOS) {
    const cuando = new Date(a.fecha);
    if (cuando.getTime() <= ahora) continue; // las fechas pasadas no se programan
    await Notifications.scheduleNotificationAsync({
      identifier: a.id,
      content: { title: a.titulo, body: a.texto, data: { ruta: a.ruta } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: cuando, channelId: CANAL },
    });
  }
}

// Al abrir la app: averigua el estado y, si están activados, vuelve a
// programarlos para que siempre lleven los textos y fechas de esta versión.
let comprobado = false;
async function comprobar() {
  if (comprobado) return;
  comprobado = true;
  try {
    const permiso = await Notifications.getPermissionsAsync();
    const programados = await Notifications.getAllScheduledNotificationsAsync();
    if (permiso.granted && programados.length > 0) {
      await crearCanal();
      await programar();
      poner('activados');
    } else if (permiso.status === 'undetermined') poner('sin-preguntar');
    else if (!permiso.granted && !permiso.canAskAgain) poner('bloqueados');
    else poner('desactivados');
  } catch {
    poner('desactivados');
  }
}

export async function activarAvisos(): Promise<void> {
  try {
    await crearCanal();
    const permiso = await Notifications.requestPermissionsAsync();
    if (!permiso.granted) {
      poner(permiso.canAskAgain ? 'desactivados' : 'bloqueados');
      return;
    }
    await programar();
    poner('activados');
  } catch {
    poner('desactivados');
  }
}

export async function desactivarAvisos(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } finally {
    poner('desactivados');
  }
}

// «No, gracias» en la tarjeta de inicio: no se pide permiso al sistema.
export function descartarAvisos() {
  poner('desactivados');
}

export const abrirAjustes = () => Linking.openSettings();

export const avisosDisponibles = true;

export function useAvisos(): EstadoAvisos {
  const valor = useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    () => estado,
    () => estado,
  );
  useEffect(() => {
    comprobar();
  }, []);
  return valor;
}

// Al tocar un aviso, la app se abre en la sección que toca.
export function useAbrirDesdeAviso() {
  const respuesta = Notifications.useLastNotificationResponse();
  const abierta = useRef<string | null>(null);
  useEffect(() => {
    if (!respuesta) return;
    const id = respuesta.notification.request.identifier;
    if (abierta.current === id) return;
    abierta.current = id;
    const ruta = respuesta.notification.request.content.data?.ruta;
    if (typeof ruta === 'string') router.push(ruta as Href);
  }, [respuesta]);
}
