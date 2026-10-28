import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Partido, sePresentaEn } from '../data/partidos';
import { provinciaPorId, Provincia } from '../data/provincias';
import { DIPUTADOS } from '../data/escanos';
import { BOE_LISTAS, listaDe } from '../data/listas';
import { useProvincia } from '../lib/provincia';
import { propuestasDe } from '../data/propuestas';
import { TEMAS } from '../data/temas';
import { SIN_FOTOS } from '../lib/noticiasCore';
import { haceCuanto, useNoticias } from '../lib/useNoticias';
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
            <BloquePapeleta p={p} />
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

// «En tu papeleta de Granada»: si has elegido provincia en Partidos y el
// partido se presenta allí, sus candidatos al Congreso y al Senado.
function BloquePapeleta({ p }: { p: Partido }) {
  const provincia = provinciaPorId(useProvincia());
  if (!provincia || !sePresentaEn(p, provincia)) return null;
  return <Papeleta p={p} provincia={provincia} />;
}

function Papeleta({ p, provincia }: { p: Partido; provincia: Provincia }) {
  const [abierta, setAbierta] = useState(false);
  const lista = listaDe(p.id, provincia.nombre);
  const diputados = DIPUTADOS[provincia.nombre];
  return (
    <Tarjeta style={{ gap: 10 }}>
      <Text style={[T.subseccion, { color: C.tinta }]} accessibilityRole="header">
        En tu papeleta de {provincia.nombre}
      </Text>
      <Text style={[T.meta, { color: C.suave, fontFamily: F.textoSemi }]}>Congreso · se eligen {diputados}</Text>
      {!lista ? (
        <Text style={[T.cuerpo, { color: C.avisoTexto }]}>
          Los nombres de los candidatos se publican en el BOE: las candidaturas presentadas, el 28 de octubre, y las
          definitivas, el 3 de noviembre. Aparecerán aquí.
        </Text>
      ) : (
        <>
          {!abierta ? (
            <View style={{ gap: 1 }}>
              <Text style={[T.cuerpoSemi, { color: C.tinta, fontSize: 18 }]}>{lista.congreso[0]}</Text>
              <Text style={[T.meta, { color: C.suave }]}>Cabeza de lista</Text>
            </View>
          ) : (
            <View style={{ gap: 6 }}>
              {lista.congreso.map((n, i) => (
                <View key={n} style={{ flexDirection: 'row', gap: 10 }}>
                  <Text style={[T.cuerpoSemi, { color: C.suave, width: 22, textAlign: 'right' }]}>{i + 1}</Text>
                  <Text style={[i === 0 ? T.cuerpoSemi : T.cuerpo, { color: C.tinta, flex: 1 }]}>{n}</Text>
                </View>
              ))}
              {lista.suplentes.length > 0 && (
                <>
                  <Text style={[T.meta, { color: C.suave, fontFamily: F.textoSemi, marginTop: 4 }]}>Suplentes</Text>
                  <Text style={[T.cuerpo, { color: C.tinta }]}>{lista.suplentes.join(' · ')}</Text>
                </>
              )}
            </View>
          )}
          <Pulsable onPress={() => setAbierta(!abierta)} style={s.verLista} vibracion="seleccion" accessibilityRole="button" accessibilityState={{ expanded: abierta }}>
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14, flex: 1 }]}>
              {abierta
                ? 'Ocultar la lista'
                : `Ver la lista completa (${lista.congreso.length}${lista.suplentes.length ? ` + ${lista.suplentes.length} suplentes` : ''})`}
            </Text>
            <View style={{ transform: [{ rotate: abierta ? '-90deg' : '90deg' }] }}>
              <Icono nombre="next" tam={14} color={C.tinta} peso="bold" />
            </View>
          </Pulsable>
          {lista.senado.length > 0 && (
            <View style={{ gap: 4, borderTopWidth: 1, borderTopColor: C.linea, paddingTop: 10 }}>
              <Text style={[T.meta, { color: C.suave, fontFamily: F.textoSemi }]}>
                Senado{lista.senadoCandidatura ? ` · en la candidatura ${lista.senadoCandidatura}` : ''}
              </Text>
              <Text style={[T.cuerpo, { color: C.tinta }]}>{lista.senado.join(' · ')}</Text>
            </View>
          )}
          {!BOE_LISTAS.proclamadas && (
            <Text style={[T.meta, { color: C.suave }]}>Candidaturas presentadas. Las definitivas se publican el 3 de noviembre.</Text>
          )}
          {BOE_LISTAS.url && (
            <Pulsable onPress={() => Linking.openURL(BOE_LISTAS.url!)} style={{ alignSelf: 'flex-start' }} accessibilityRole="link">
              <Text style={[T.meta, { color: C.suave, textDecorationLine: 'underline' }]}>Fuente: BOE</Text>
            </Pulsable>
          )}
        </>
      )}
    </Tarjeta>
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
      {!p.programa.url && (
        <Text style={[T.meta, { color: C.avisoTexto }]}>
          {p.anterior?.archivo
            ? 'Aún no ha publicado su programa para el 29-N. Mientras, aquí tienes el de 2023.'
            : 'Aún no ha publicado su programa para el 29-N.'}
        </Text>
      )}
      {archivo || hayPropuestas ? (
        <>
          {hayPropuestas && (
            <Opcion
              titulo="Propuestas por temas"
              tono={2}
              texto="Por temas, también en PDF."
              onPress={() => setSelector(true)}
            />
          )}
          {hayPropuestas && (
            <Opcion
              titulo="Cara a cara"
              tono={1}
              icono="comparar"
              texto="Con otro partido, tema a tema."
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
        <Text style={[T.cuerpo, { color: C.suave }]}>Aparecerá aquí en cuanto lo publique.</Text>
      )}
    </Tarjeta>
  );
}

// Icono de la web del medio, pequeño y sin modificar, junto a su nombre: solo
// sirve para identificar de dónde es la noticia. Se carga desde la web del
// medio; si no hay o no carga, se muestra solo el nombre.
function IconoMedio({ url }: { url?: string }) {
  const [falla, setFalla] = useState(false);
  if (!url || falla) return null;
  return (
    <Image
      source={{ uri: url }}
      style={s.iconoMedio}
      resizeMode="contain"
      onError={() => setFalla(true)}
      accessibilityIgnoresInvertColors
      alt=""
    />
  );
}

// Foto de la noticia en pequeño, cargada desde la web del medio. Si no hay o
// no carga, no se muestra nada.
function FotoNoticia({ imagen }: { imagen?: string }) {
  const [falla, setFalla] = useState(false);
  if (!imagen || falla) return null;
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

function BloqueNoticias({ p }: { p: Partido }) {
  const { estado, reintentar } = useNoticias(p.id);
  return (
    <Tarjeta style={{ gap: 4 }}>
      <Text style={[T.subseccion, { color: C.tinta }]} accessibilityRole="header">
        Noticias
      </Text>
      <Text style={[T.meta, { color: C.suave }]}>De los últimos 7 días.</Text>

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
                    <IconoMedio url={estado.iconos[n.medio]} />
                    <Text style={[T.etiqueta, { color: C.tinta }]}>{n.medio}</Text>
                    <Text style={[T.meta, { color: C.suave, fontSize: 12.5 }]}>{haceCuanto(n.fecha)}</Text>
                  </View>
                  <Text style={[T.cuerpo, { color: C.tinta, fontFamily: F.textoMedia }]}>{n.titulo}</Text>
                </View>
                {!SIN_FOTOS.includes(n.medio) && <FotoNoticia imagen={n.imagen} />}
              </Pulsable>
            ))}
          </View>
        ))}

      {estado.tipo === 'ok' && (
        <Text style={[T.meta, { color: C.suave, fontSize: 12.5, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.linea }]}>
          Actualizado {haceCuanto(estado.actualizado)}. Titulares y fotos enlazados desde cada medio. Si eres un medio y no
          quieres aparecer, escríbenos a tuvotoapp@gmail.com y lo quitamos.
        </Text>
      )}
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  iconoMedio: { width: 18, height: 18, borderRadius: 4 },
  miniatura: { width: 96, height: 72, borderRadius: 12, backgroundColor: C.relleno },
  verLista: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.relleno, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 12 },
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
  centro: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  aviso: { marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: C.avisoFondo },
  pildora: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: R.pildora, backgroundColor: C.relleno },
});
