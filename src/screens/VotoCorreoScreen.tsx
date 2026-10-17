import { ReactNode } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import { C, F, M, R, S, T } from '../theme';

// Plazos del Real Decreto 806/2026 de convocatoria (BOE del 6 de octubre de 2026).
// Fuentes: Ministerio del Interior / La Moncloa y Correos.
const PLAZOS = [
  { fecha: '9 nov', texto: 'Empieza el envío de la documentación' },
  { fecha: '19 nov', texto: 'Último día para pedirlo' },
  { fecha: '25 nov', texto: 'Último día para enviar tu voto' },
  { fecha: '29 nov', texto: 'Elecciones' },
];

const FUENTES = [
  { nombre: 'Correos: voto por correo para el 29 de noviembre', url: 'https://www.correos.com/en/sala-prensa/ya-se-puede-solicitar-el-voto-por-correo-para-las-elecciones-generales-del-29-de-noviembre/' },
  { nombre: 'La Moncloa: cómo solicitar el voto por correo', url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/Paginas/voto-por-correo-elecciones-generales-29n.aspx' },
  { nombre: 'Ministerio del Interior – Infoelectoral', url: 'https://infoelectoral.interior.gob.es' },
];

function Paso({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <View style={s.paso}>
      <View style={s.numero}>
        <Text style={[T.cuerpoSemi, { color: C.sobreTinta }]}>{n}</Text>
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={[T.tarjeta, { color: C.tinta, fontSize: 18, lineHeight: 23 }]}>{titulo}</Text>
        {children}
      </View>
    </View>
  );
}

const P = ({ children }: { children: ReactNode }) => <Text style={[T.cuerpo, { color: C.tinta }]}>{children}</Text>;
const B = ({ children }: { children: ReactNode }) => <Text style={{ fontFamily: F.textoSemi }}>{children}</Text>;

export default function VotoCorreoScreen({ onVolver }: { onVolver: () => void }) {
  return (
    <ScrollView contentContainerStyle={s.contenedor}>
      <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver">
        <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Vota</Text>
      </Pulsable>

      <Text style={[T.titulo, { color: C.tinta, marginTop: 22 }]} accessibilityRole="header">
        Cómo votar por correo
      </Text>
      <Text style={[T.cuerpo, { color: C.suave, marginTop: 8 }]}>
        Si el 29 de noviembre no vas a poder ir a tu colegio electoral, puedes votar antes desde Correos.
      </Text>

      {/* Fechas clave, en orden cronológico */}
      <View style={s.plazos}>
        {PLAZOS.map((p) => (
          <View key={p.fecha} style={s.plazo}>
            <Text style={[T.seccion, { color: C.tinta, fontSize: 20 }]}>{p.fecha}</Text>
            <Text style={[T.meta, { color: C.suave }]}>{p.texto}</Text>
          </View>
        ))}
      </View>

      <Tarjeta style={{ marginTop: 16, gap: 18, padding: 20 }}>
        <Paso n={1} titulo="Pídelo en Correos, hasta el 19 de noviembre">
          <P>
            <B>En una oficina de Correos:</B> ve en persona con tu DNI, pasaporte o carné de conducir y rellena el
            impreso. Puedes pedir cita previa en la web o la app de Correos.
          </P>
          <P>
            <B>Por internet:</B> en la web de Correos, con DNI electrónico o certificado digital.
          </P>
          <P>Indica dónde quieres recibir la documentación: tu casa, el trabajo u otra dirección.</P>
          <Text style={[T.meta, { color: C.suave }]}>
            Si por enfermedad o discapacidad no puedes ir, otra persona puede pedirlo por ti con un poder ante notario
            y un certificado médico oficial.
          </Text>
        </Paso>

        <Paso n={2} titulo="Recibe la documentación, desde el 9 de noviembre">
          <P>
            Te llegan las papeletas, los sobres y un certificado de que estás en el censo. Correos te lo entrega en mano,
            así que ten el DNI a mano; si no estás, te dejan un aviso para recogerlo en la oficina.
          </P>
        </Paso>

        <Paso n={3} titulo="Prepara tu voto">
          <P>Mete la papeleta que elijas en el sobre de votación. Si lo dejas vacío, es un voto en blanco.</P>
          <P>
            Después mete <B>el sobre de votación y el certificado del censo</B> en el sobre grande dirigido a tu mesa
            electoral.
          </P>
          <View style={s.aviso}>
            <Text style={[T.meta, { color: C.avisoTexto }]}>
              No metas tu DNI ni una fotocopia dentro del sobre de votación: la mesa anularía el voto.
            </Text>
          </View>
        </Paso>

        <Paso n={4} titulo="Envíalo, hasta el 25 de noviembre">
          <P>
            Lleva el sobre a cualquier oficina de Correos y envíalo por <B>correo certificado</B>. Es gratis. Te pedirán
            identificarte.
          </P>
          <Text style={[T.meta, { color: C.suave }]}>
            Si no puedes ir tú, otra persona puede llevarlo con una autorización firmada por ti y una fotocopia de tu
            DNI. Correos tiene un modelo de autorización.
          </Text>
        </Paso>
      </Tarjeta>

      <Tarjeta style={{ marginTop: 12, gap: 8 }}>
        <Text style={[T.tarjeta, { color: C.tinta }]}>Ten en cuenta</Text>
        <P>
          Si te aceptan el voto por correo, <B>ya no puedes votar en persona</B> el 29 de noviembre.
        </P>
      </Tarjeta>

      <Tarjeta style={{ marginTop: 12, gap: 8 }}>
        <Text style={[T.tarjeta, { color: C.tinta }]}>Si vas a estar fuera de España</Text>
        <P>
          Si vives en España pero estás temporalmente en el extranjero (por ejemplo, de Erasmus), inscríbete en el
          consulado como no residente y pide allí el voto <B>en persona antes del 31 de octubre</B>. Te enviarán la
          documentación a partir del 3 de noviembre y tendrás que mandar el voto por correo certificado como muy tarde
          el 25 de noviembre.
        </P>
        <Text style={[T.meta, { color: C.suave }]}>
          Si vives fuera de forma habitual, el procedimiento es distinto: consulta en tu consulado.
        </Text>
      </Tarjeta>

      <Tarjeta style={{ marginTop: 12, gap: 8 }}>
        <Text style={[T.tarjeta, { color: C.tinta }]}>Información oficial</Text>
        <View style={s.enlaces}>
          {FUENTES.map((f, i) => (
            <Pulsable
              key={f.url}
              onPress={() => Linking.openURL(f.url)}
              style={[s.enlace, i > 0 && { borderTopWidth: 1, borderTopColor: C.linea }]}
              accessibilityRole="link"
              vibracion="ligera"
            >
              <Text style={[T.cuerpoSemi, { color: C.tinta, flexShrink: 1 }]}>{f.nombre}</Text>
              <Icono nombre="enlace" tam={14} color={C.suave} peso="bold" />
            </Pulsable>
          ))}
        </View>
        <Text style={[T.meta, { color: C.suave, fontSize: 12.5 }]}>
          Plazos del decreto de convocatoria de las elecciones (BOE del 6 de octubre de 2026). Ante cualquier duda,
          prevalece la información oficial.
        </Text>
      </Tarjeta>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  contenedor: { paddingHorizontal: M, paddingTop: 12, paddingBottom: 48, width: '100%', maxWidth: 720, alignSelf: 'center' },
  volver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  plazos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  plazo: { flexGrow: 1, flexBasis: 140, backgroundColor: C.tarjeta, borderRadius: 16, padding: 14, gap: 2, boxShadow: S.tarjeta },
  paso: { flexDirection: 'row', gap: 14 },
  numero: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.tinta, alignItems: 'center', justifyContent: 'center' },
  aviso: { padding: 10, borderRadius: 12, backgroundColor: C.avisoFondo },
  enlaces: { borderRadius: 14, backgroundColor: C.relleno, paddingHorizontal: 14 },
  enlace: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 13 },
});
