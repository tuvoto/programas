import { ReactElement, ReactNode, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Paralaje, Revelar, ScrollAnimado } from '../components/Revelar';
import { router } from 'expo-router';
import { CONFIG, FUENTES_OFICIALES } from '../config';
import { MEDIOS } from '../lib/noticiasCore';
import Desplegable from '../components/Desplegable';
import AvisosTarjeta from '../components/AvisosTarjeta';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import { C, F, HUECO_BARRA, M, R, T, ANCHO_MAX, ANCHO_LECTURA, CENTRADO } from '../theme';

// Pestaña «Vota»: guía práctica para votar el 29-N y, al final, información
// sobre la app. Todo en desplegables para que no sea un muro de texto.
//
// Fuentes de los datos (comprobados en octubre de 2026):
//   - Calendario electoral de la Junta Electoral Central (eg2026_calendario.pdf)
//   - Nota de prensa del INE sobre el censo para el 29-N
//   - Ministerio del Interior / La Moncloa (voto por correo y voto desde el extranjero)
//   - Consulados de España (exteriores.gob.es): plazos CERA y ERTA del 29-N

// Fechas clave, en orden.
const FECHAS = [
  { fecha: '12–19 oct', texto: 'Consulta del censo y reclamaciones' },
  { fecha: '31 oct–4 nov', texto: 'Sorteo de los miembros de mesa' },
  { fecha: 'Desde 2 nov', texto: 'Llegan las tarjetas censales, con tu mesa' },
  { fecha: '13–27 nov', texto: 'Campaña electoral' },
  { fecha: '19 nov', texto: 'Último día para pedir el voto por correo' },
  { fecha: '25 nov', texto: 'Último día para enviar el voto por correo' },
  { fecha: '28 nov', texto: 'Jornada de reflexión' },
  { fecha: '29 nov', texto: 'Elecciones, de 9:00 a 20:00', destacada: true },
];

const P = ({ children }: { children: ReactNode }) => <Text style={[T.cuerpo, { color: C.tinta }]}>{children}</Text>;
const B = ({ children }: { children: ReactNode }) => <Text style={{ fontFamily: F.textoSemi }}>{children}</Text>;
const Nota = ({ children }: { children: ReactNode }) => <Text style={[T.meta, { color: C.suave }]}>{children}</Text>;

function Punto({ children }: { children: ReactNode }) {
  return (
    <View style={s.punto}>
      <View style={s.bolita} />
      <Text style={[T.cuerpo, { color: C.tinta, flex: 1 }]}>{children}</Text>
    </View>
  );
}

function Enlace({ texto, url }: { texto: string; url: string }) {
  return (
    <Pulsable onPress={() => Linking.openURL(url)} style={s.enlace} accessibilityRole="link" vibracion="ligera">
      <Text style={[T.cuerpoSemi, { color: C.tinta, flexShrink: 1 }]}>{texto}</Text>
      <Icono nombre="enlace" tam={14} color={C.suave} peso="bold" />
    </Pulsable>
  );
}

export default function InfoScreen() {
  // En pantallas anchas, dos columnas.
  const [ancho, setAncho] = useState(0);
  const dosColumnas = ancho >= 760;

  const guia = [
    <Desplegable key="fechas" color={0} titulo="Fechas clave" icono="calendario" resumen="Del censo al día de las elecciones">
      <View style={{ gap: 2 }}>
        {FECHAS.map((f) => (
          <View key={f.fecha} style={s.fecha}>
            <Text style={[T.cuerpoSemi, s.fechaDia, f.destacada && { color: C.tinta }]}>{f.fecha}</Text>
            <Text style={[f.destacada ? T.cuerpoSemi : T.cuerpo, { color: C.tinta, flex: 1 }]}>{f.texto}</Text>
          </View>
        ))}
      </View>
    </Desplegable>,

    <Desplegable key="correo" color={2} titulo="Voto por correo" icono="correo" resumen="Pídelo hasta el 19 de noviembre">
      <P>
        Si ese día no puedes ir, pídelo en Correos (en persona o por internet) hasta el <B>19 de noviembre</B> y envía tu
        voto como muy tarde el <B>25 de noviembre</B>.
      </P>
      <Pulsable onPress={() => router.push('/voto-correo')} style={s.boton} vibracion="ligera" accessibilityRole="link">
        <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>Ver la guía paso a paso</Text>
        <Icono nombre="next" tam={14} color={C.sobreTinta} peso="bold" />
      </Pulsable>
    </Desplegable>,

    <Desplegable key="donde" color={1} titulo="¿Dónde voto?" icono="lugar" resumen="Tu colegio y tu mesa">
      <P>
        A partir del <B>2 de noviembre</B> te llega a casa la <B>tarjeta censal</B>, con tu colegio y tu mesa. No
        hace falta llevarla a votar.
      </P>
      <P>También puedes consultarlo:</P>
      <Punto>En la sede electrónica del INE, con Cl@ve o DNI electrónico.</Punto>
      <Punto>En tu ayuntamiento, en persona.</Punto>
      <Punto>Por teléfono, en el 900 343 232.</Punto>
      <View style={s.enlaces}>
        <Enlace texto="Consultar en el INE" url="https://sede.ine.gob.es" />
      </View>
    </Desplegable>,

    <Desplegable key="dia" color={0} titulo="El día de la votación" icono="dni" resumen="Qué llevar y cómo votar">
      <P>
        Los colegios abren de <B>9:00 a 20:00</B>. Lleva tu <B>DNI, pasaporte o carné de conducir</B>, originales y con
        foto.
      </P>
      <Punto>
        <B>Congreso:</B> papeleta blanca. Votas una lista entera de un partido, sin tachar ni añadir nada.
      </Punto>
      <Punto>
        <B>Senado:</B> papeleta de color sepia. Marcas con una cruz a los candidatos que quieras, de cualquier partido;
        en la mayoría de provincias, hasta tres.
      </Punto>
      <Punto>Cada papeleta va en su sobre, del mismo color. Un sobre vacío es un voto en blanco.</Punto>
      <Nota>Si escribes algo en la papeleta del Congreso o la tachas, el voto es nulo.</Nota>
    </Desplegable>,

    <Desplegable key="fuera" color={2} titulo="Votar desde el extranjero" icono="avion" resumen="Si vives fuera o estás de Erasmus">
      <Text style={[T.cuerpoSemi, { color: C.tinta }]}>Si vives fuera de España (CERA)</Text>
      <P>
        No hace falta pedir el voto: si estás inscrito en tu consulado, la documentación te llega a casa. Primero los
        sobres, <B>del 24 al 30 de octubre</B>, y después las papeletas, <B>del 4 al 8 de noviembre</B> (hasta el 14 si
        se recurre alguna candidatura).
      </P>
      <Punto>
        <B>En el consulado:</B> deposita tu voto en la urna <B>del 21 al 26 de noviembre</B>, con tu DNI o pasaporte.
      </Punto>
      <Punto>
        <B>Por correo:</B> envíalo por correo certificado a tu consulado. Tiene que llegar como muy tarde el{' '}
        <B>24 de noviembre</B>.
      </Punto>
      <Punto>
        Si en esas fechas estás en España, pide el voto por correo en Correos hasta el 19 de noviembre y envíalo hasta
        el 25.
      </Punto>
      <Text style={[T.cuerpoSemi, { color: C.tinta, marginTop: 6 }]}>Si vives en España y estarás fuera (ERTA)</Text>
      <P>
        Por ejemplo, de Erasmus o por trabajo: inscríbete en el consulado como no residente y pide allí el voto{' '}
        <B>en persona antes del 31 de octubre</B>. Te enviarán la documentación y tendrás que mandar el voto por correo
        certificado a tu mesa en España como muy tarde el <B>25 de noviembre</B>.
      </P>
      <Nota>Los horarios cambian en cada consulado: consúltalos en su web.</Nota>
      <View style={s.enlaces}>
        <Enlace
          texto="La Moncloa: cómo votar desde el extranjero"
          url="https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/paginas/voto-extranjero-elecciones-generales-29n.aspx"
        />
      </View>
    </Desplegable>,

    <Desplegable key="mesa" color={1} titulo="Si te toca estar en una mesa" icono="mesa" resumen="Sorteo del 31 de octubre al 4 de noviembre">
      <P>
        Los ayuntamientos sortean los miembros de cada mesa entre el <B>31 de octubre y el 4 de noviembre</B>, y lo
        notifican en los 3 días siguientes.
      </P>
      <Punto>Cada mesa tiene un presidente, dos vocales y seis suplentes.</Punto>
      <Punto>El 29 de noviembre hay que estar a las 8:00.</Punto>
      <Punto>Los titulares cobran 75 € de dieta.</Punto>
      <Punto>
        Si tienes un motivo justificado (por ejemplo, más de 65 años, embarazo avanzado o cuidar de un hijo pequeño),
        puedes alegarlo ante la Junta Electoral de Zona en los 7 días siguientes a la notificación.
      </Punto>
    </Desplegable>,
  ];

  const sobre = [
    <Desplegable key="indep" titulo="Independiente">
      <P>
        Esta app no pertenece ni está vinculada a ningún partido, candidatura, administración pública u organismo
        electoral. No pide el voto para nadie.
      </P>
    </Desplegable>,
    <Desplegable key="fuentes" titulo="De dónde sale la información">
      <P>
        Las propuestas son resúmenes de los programas electorales oficiales, con la página de la que sale cada una.
      </P>
      <View style={s.enlaces}>
        {FUENTES_OFICIALES.map((f, i) => (
          <View key={f.url} style={i > 0 && s.separador}>
            <Enlace texto={f.nombre} url={f.url} />
          </View>
        ))}
      </View>
    </Desplegable>,
    <Desplegable key="noticias" titulo="Noticias">
      <P>
        Titulares de los últimos 7 días que mencionan a cada partido o a su líder, con el mismo criterio para todos y
        ordenados por fecha. La app no los elige ni los valora.
      </P>
      <Nota>Estatales: {MEDIOS.filter((m) => !m.zona).map((m) => m.medio).join(', ')}.</Nota>
      <Nota>
        Regionales:{' '}
        {MEDIOS.filter((m) => m.zona)
          .map((m) => `${m.medio} (${m.zona})`)
          .join(', ')}
        .
      </Nota>
    </Desplegable>,
    <Desplegable key="privacidad" titulo="Privacidad">
      <P>La app no crea cuentas ni recoge datos personales. Los avisos de fechas los programa tu propio móvil.</P>
      <View style={s.enlaces}>
        <Enlace texto="Política de privacidad" url={CONFIG.privacidadUrl} />
      </View>
    </Desplegable>,
    <Desplegable key="error" titulo="¿Has visto un error?">
      <P>Si un resumen no refleja bien un programa, escríbeme y lo corrijo:</P>
      <Text selectable style={[T.cuerpoSemi, { color: C.tinta }]}>
        {CONFIG.contacto}
      </Text>
    </Desplegable>,
  ];

  // Cada bloque aparece al llegar a él; en dos columnas, el de la derecha un poco después.
  const animar = (lista: ReactElement[]) =>
    lista.map((el, i) => (
      <Revelar key={el.key} retraso={dosColumnas && i % 2 === 1 ? 80 : 0}>
        {el}
      </Revelar>
    ));

  return (
    <ScrollAnimado contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(Math.min(e.nativeEvent.layout.width, ANCHO_MAX) - M * 2)}>
      <Paralaje>
        <Text style={[T.titulo, { color: C.tinta, marginTop: 18 }]} accessibilityRole="header">
          Vota
        </Text>
      </Paralaje>
      {/* Google Play pide que quede claro que la app no es oficial y de dónde salen los datos. */}
      <Text style={[T.cuerpo, { color: C.suave, marginTop: 6, maxWidth: ANCHO_LECTURA }]}>
        TuVoto no es una app oficial ni representa a ningún organismo público. Las fechas y los trámites salen de las{' '}
        <Text style={{ fontFamily: F.textoSemi, color: C.tinta }}>fuentes oficiales</Text> que se enlazan más abajo.
      </Text>

      {/* Solo en la app del móvil */}
      <AvisosTarjeta />

      {dosColumnas ? (
        <View style={s.columnas}>
          <View style={s.columna}>{animar(guia).filter((_, i) => i % 2 === 0)}</View>
          <View style={s.columna}>{animar(guia).filter((_, i) => i % 2 === 1)}</View>
        </View>
      ) : (
        <View style={s.lista}>{animar(guia)}</View>
      )}

      <Revelar>
        <Text style={[T.seccion, { color: C.tinta, marginTop: 30 }]} accessibilityRole="header">
          Fuentes oficiales
        </Text>
        <Text style={[T.meta, { color: C.suave, marginTop: 4, maxWidth: ANCHO_LECTURA }]}>
          Consulta siempre los datos en los organismos oficiales. TuVoto no tiene relación con ninguno de ellos.
        </Text>
        <View style={[s.enlaces, { marginTop: 12, backgroundColor: C.tarjeta }]}>
          {FUENTES_OFICIALES.map((f, i) => (
            <View key={f.url} style={i > 0 && s.separador}>
              <Enlace texto={f.nombre} url={f.url} />
            </View>
          ))}
        </View>
      </Revelar>

      <Revelar>
        <Text style={[T.seccion, { color: C.tinta, marginTop: 30 }]} accessibilityRole="header">
          Sobre esta app
        </Text>
      </Revelar>
      {dosColumnas ? (
        <View style={s.columnas}>
          <View style={s.columna}>{animar(sobre).filter((_, i) => i % 2 === 0)}</View>
          <View style={s.columna}>{animar(sobre).filter((_, i) => i % 2 === 1)}</View>
        </View>
      ) : (
        <View style={s.lista}>{animar(sobre)}</View>
      )}
    </ScrollAnimado>
  );
}

const s = StyleSheet.create({
  contenedor: { ...CENTRADO, paddingHorizontal: M, paddingTop: 12, paddingBottom: HUECO_BARRA },
  lista: { gap: 10, marginTop: 16 },
  columnas: { flexDirection: 'row', gap: 12, marginTop: 16, alignItems: 'flex-start' },
  columna: { flex: 1, gap: 10, minWidth: 0 },
  fecha: { flexDirection: 'row', gap: 12, paddingVertical: 7, borderTopWidth: 1, borderTopColor: C.linea },
  fechaDia: { width: 104, color: C.suave },
  punto: { flexDirection: 'row', gap: 10 },
  bolita: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.vacia, marginTop: 9 },
  enlaces: { borderRadius: 14, backgroundColor: C.relleno, paddingHorizontal: 14 },
  separador: { borderTopWidth: 1, borderTopColor: C.linea },
  enlace: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 13 },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: C.tinta,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: R.boton,
  },
});
