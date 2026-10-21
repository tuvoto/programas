import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Partido } from '../data/partidos';
import { comunidadPorId } from '../data/provincias';
import { propuestasDe } from '../data/propuestas';
import { TEMAS } from '../data/temas';
import { haceCuanto, useNoticias } from '../lib/useNoticias';
import { MEDIOS } from '../lib/noticiasCore';
import { urlPublica } from '../lib/web';
import Pulsable from '../components/Pulsable';
import Icono, { NombreIcono } from '../components/Icono';
import SelectorTemas from '../components/SelectorTemas';
import Tarjeta from '../components/Tarjeta';
import { C, F, M, PALETA, R, S, T, suave, textoSobre, fondoLegible, ANCHO_MAX, CENTRADO } from '../theme';

type Props = { partido: Partido; onVolver: () => void };

export default function PartidoScreen({ partido: p, onVolver }: Props) {
  const [ancho, setAncho] = useState(0);
  const dosColumnas = ancho >= 860;
  const fondo = fondoLegible(p.color);
  const sobre = textoSobre(fondo);

  return (
    <ScrollView contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(Math.min(e.nativeEvent.layout.width, ANCHO_MAX) - M * 2)}>
      <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel="Volver a partidos">
        <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
        <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]}>Partidos</Text>
      </Pulsable>

      {/* Cabecera en el color del partido */}
      <View style={[s.cabecera, { backgroundColor: fondo }]}>
        <Text style={[T.portada, { color: sobre }]} accessibilityRole="header">
          {p.siglas}
        </Text>
        {p.nombre !== p.siglas && <Text style={[T.cuerpo, { color: sobre, marginTop: 6 }]}>{p.nombre}</Text>}
        {p.territorio && (
          <Text style={[T.cuerpo, { color: sobre, marginTop: 2 }]}>{p.territorio}</Text>
        )}
        {p.candidato && (
          <Text style={[T.cuerpo, { color: sobre, marginTop: 14 }]}>
            <Text>{p.candidata ? 'Candidata' : 'Candidato'}: </Text>
            <Text style={{ fontFamily: F.textoSemi }}>{p.candidato}</Text>
          </Text>
        )}
      </View>

      {(
        <View style={[s.rejilla, !dosColumnas && { flexDirection: 'column' }]}>
          <View style={[s.columna, dosColumnas && { flex: 5 }]}>
            <BloqueCandidatura p={p} />
            <BloqueDescargas p={p} />
          </View>
          <View style={[s.columna, dosColumnas && { flex: 6 }]}>
            <BloqueNoticias p={p} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function Opcion({
  titulo,
  texto,
  tono,
  icono = 'descargar',
  onPress,
}: {
  titulo: string;
  texto: string;
  tono: number;
  icono?: NombreIcono;
  onPress: () => void;
}) {
  const color = PALETA[tono % PALETA.length];
  // Fondo de la fila: azul claro para el marino, amarillo suave para el mostaza.
  const fondo = suave(color.fondo === '#161144' ? PALETA[1].fondo : color.fondo, 0.75);
  return (
    <Pulsable
      onPress={onPress}
      style={[s.opcion, { backgroundColor: fondo }]}
      escala={0.98}
      vibracion="ligera"
      accessibilityRole="button"
    >
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[T.tarjeta, { color: C.tinta, fontFamily: F.titular, fontSize: 17.5, lineHeight: 21 }]}>{titulo}</Text>
        <Text style={[T.meta, { color: C.suave }]}>{texto}</Text>
      </View>
      <View style={s.opcionBoton}>
        <Icono nombre={icono} tam={17} color={C.sobreTinta} peso="bold" />
      </View>
    </Pulsable>
  );
}

// Dónde se presenta, qué se sabe de su candidatura y si ya hay programa para
// el 29-N. Así se ve que la ficha está al día aunque falte el programa.
function dondeSePresenta(p: Partido): string {
  const nombres = (ids: string[]) => ids.map((id) => comunidadPorId(id)?.nombre ?? id);
  const lista = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs[0]);
  if (p.comunidades) return lista(nombres(p.comunidades));
  if (p.noSePresentaEn?.length) return `Toda España salvo ${lista(nombres(p.noSePresentaEn))}`;
  return 'Toda España';
}

function fechaLarga(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${d} de ${meses[m - 1]} de ${a}`;
}

function BloqueCandidatura({ p }: { p: Partido }) {
  const publicado = !!p.programa.url;
  return (
    <Tarjeta style={{ gap: 12 }}>
      <Text style={[T.subseccion, { color: C.tinta }]} accessibilityRole="header">
        Candidatura
      </Text>
      <Dato titulo="Dónde se presenta" texto={dondeSePresenta(p)} />
      {p.nota && <Dato titulo="Lo que se sabe" texto={p.nota} />}
      <Dato
        titulo="Programa para el 29-N"
        texto={
          publicado
            ? p.programa.fechaPublicacion
              ? `Publicado el ${fechaLarga(p.programa.fechaPublicacion)}.`
              : 'Publicado.'
            : p.anterior?.archivo
              ? 'Todavía no lo ha publicado. Mientras, puedes consultar su programa de 2023.'
              : 'Todavía no lo ha publicado. Aparecerá aquí en cuanto lo haga.'
        }
        aviso={!publicado}
      />
    </Tarjeta>
  );
}

function Dato({ titulo, texto, aviso }: { titulo: string; texto: string; aviso?: boolean }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={[T.meta, { color: C.suave, fontFamily: F.textoSemi }]}>{titulo}</Text>
      <Text style={[T.cuerpo, { color: aviso ? C.avisoTexto : C.tinta }]}>{texto}</Text>
    </View>
  );
}

// Dos descargas: un PDF con sus propuestas de los temas que elijas y el programa completo.
function BloqueDescargas({ p }: { p: Partido }) {
  const [selector, setSelector] = useState(false);
  const archivo = p.programa.url ?? (p.anterior?.archivo ? urlPublica(p.anterior.archivo) : null);
  const hayPropuestas = TEMAS.some((t) => propuestasDe(p.id, t.id).length > 0);

  return (
    <Tarjeta style={{ gap: 10 }}>
      <Text style={[T.subseccion, { color: C.tinta }]} accessibilityRole="header">
        Descargas
      </Text>
      {archivo || hayPropuestas ? (
        <>
          {hayPropuestas && (
            <Opcion
              titulo="Propuestas por temas"
              tono={2}
              texto="Elige los temas, míralas y descárgalas en PDF."
              onPress={() => setSelector(true)}
            />
          )}
          {hayPropuestas && (
            <Opcion
              titulo="Cara a cara"
              tono={1}
              icono="comparar"
              texto={`Compara a ${p.siglas} con otro partido, tema a tema.`}
              onPress={() => router.push(`/cara-a-cara?a=${p.id}`)}
            />
          )}
          {archivo && (
            <Opcion
              titulo="Programa electoral completo"
              tono={0}
              texto={p.anterior?.documento ? `${p.anterior.documento}.` : 'El PDF original del partido.'}
              onPress={() => Linking.openURL(archivo)}
            />
          )}
          <SelectorTemas partido={p} visible={selector} onCerrar={() => setSelector(false)} />
        </>
      ) : (
        <Text style={[T.cuerpo, { color: C.suave }]}>Programa aún no disponible.</Text>
      )}
    </Tarjeta>
  );
}

// Foto de la noticia en pequeño. Si el medio no la da o no carga, un cuadro
// con el nombre corto del medio, para que todas las noticias queden alineadas.
function Miniatura({ imagen, medio }: { imagen?: string; medio: string }) {
  const [falla, setFalla] = useState(false);
  if (imagen && !falla) {
    return (
      <Image
        source={{ uri: imagen }}
        style={s.miniatura}
        resizeMode="cover"
        onError={() => setFalla(true)}
        accessibilityIgnoresInvertColors
        alt=""
      />
    );
  }
  const corto = MEDIOS.find((m) => m.medio === medio)?.corto ?? medio.slice(0, 4);
  return (
    <View style={[s.miniatura, s.sinFoto]}>
      <Text style={[T.etiqueta, { color: C.suave, fontSize: 13 }]}>{corto}</Text>
    </View>
  );
}

function BloqueNoticias({ p }: { p: Partido }) {
  const { estado, reintentar } = useNoticias(p.id);
  return (
    <Tarjeta style={{ gap: 4 }}>
      <Text style={[T.subseccion, { color: C.tinta }]} accessibilityRole="header">
        Noticias
      </Text>
      <Text style={[T.meta, { color: C.suave }]}>Últimos 7 días, de {estado.tipo === 'ok' && estado.medios.length ? estado.medios.length : MEDIOS.length} medios, por orden de fecha.</Text>

      {estado.tipo === 'cargando' && (
        <View style={s.centro}>
          <ActivityIndicator color={C.suave} />
          <Text style={[T.meta, { color: C.suave }]}>Cargando noticias…</Text>
        </View>
      )}

      {estado.tipo === 'sin-archivo' && (
        <View style={s.aviso}>
          <Text style={[T.meta, { color: C.avisoTexto }]}>
            {__DEV__
              ? 'Estás viendo la versión de prueba. En la web, las noticias aparecen cuando está publicada en GitHub (se actualizan solas cada 3 horas). Para verlas ahora en tu ordenador, ejecuta «npm run noticias» y recarga la página.'
              : 'Las noticias todavía no están disponibles. Vuelve a mirar en un rato.'}
          </Text>
        </View>
      )}

      {estado.tipo === 'error' && (
        <View style={[s.centro, { alignItems: 'flex-start' }]}>
          <Text style={[T.cuerpo, { color: C.suave }]}>
            No se han podido cargar las noticias. Comprueba la conexión e inténtalo otra vez.
          </Text>
          <Pulsable onPress={reintentar} style={s.pildora} vibracion="ligera" accessibilityRole="button">
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>Reintentar</Text>
          </Pulsable>
        </View>
      )}

      {estado.tipo === 'ok' &&
        (estado.noticias.length === 0 ? (
          <Text style={[T.cuerpo, { color: C.suave, marginTop: 12 }]}>
            No hay titulares recientes sobre {p.siglas} en los medios consultados.
          </Text>
        ) : (
          <View style={{ marginTop: 6 }}>
            {estado.noticias.map((n, i) => (
              <Pulsable
                key={n.url}
                onPress={() => Linking.openURL(n.url)}
                style={[s.noticia, i > 0 && s.linea]}
                escala={0.98}
                accessibilityRole="link"
                accessibilityLabel={`${n.titulo}. ${n.medio}, ${haceCuanto(n.fecha)}`}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={[T.etiqueta, { color: C.tinta }]}>{n.medio}</Text>
                    <Text style={[T.meta, { color: C.suave, fontSize: 12.5 }]}>{haceCuanto(n.fecha)}</Text>
                  </View>
                  <Text style={[T.cuerpo, { color: C.tinta, fontFamily: F.textoMedia }]}>{n.titulo}</Text>
                </View>
                <Miniatura imagen={n.imagen} medio={n.medio} />
              </Pulsable>
            ))}
          </View>
        ))}

      {estado.tipo === 'ok' && (
        <Text style={[T.meta, { color: C.suave, fontSize: 12.5, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.linea }]}>
          Actualizado {haceCuanto(estado.actualizado)}.
        </Text>
      )}
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  contenedor: { ...CENTRADO, paddingHorizontal: M, paddingTop: 12, paddingBottom: 48 },
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
  cabecera: { marginTop: 18, borderRadius: R.tarjeta, padding: 22, boxShadow: S.flotante },
  rejilla: { flexDirection: 'row', gap: 12, marginTop: 12, alignItems: 'flex-start' },
  columna: { gap: 12, minWidth: 0, alignSelf: 'stretch' },
  opcion: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 16 },
  opcionBoton: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.tinta, alignItems: 'center', justifyContent: 'center' },
  linea: { borderTopWidth: 1, borderTopColor: C.linea },
  noticia: { flexDirection: 'row', gap: 14, paddingVertical: 12, alignItems: 'flex-start' },
  miniatura: { width: 96, height: 72, borderRadius: 12, backgroundColor: C.relleno },
  sinFoto: { alignItems: 'center', justifyContent: 'center' },
  centro: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  aviso: { marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: C.avisoFondo },
  pildora: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: R.pildora, backgroundColor: C.relleno },
});
