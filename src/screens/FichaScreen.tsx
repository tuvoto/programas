import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { urlPagina } from '../lib/web';
import { PARTIDOS } from '../data/partidos';
import { Propuesta } from '../data/propuestas';
import { Ficha } from '../lib/ficha';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import { C, F, M, R, S, T } from '../theme';

type Props = { ficha: Ficha; onVolver: () => void };

export default function FichaScreen({ ficha, onVolver }: Props) {
  const { partido: p, tema, principales, otras } = ficha;
  const total = principales.length + otras.length;
  // PDF publicado con la web: cada «Página N» lo abre por esa página.
  const archivo = ficha.edicion === 2023 ? p.anterior?.archivo : undefined; // PDF publicado con la web
  // Primero se ve el PDF y desde ahí se descarga.
  const verPdf = () => router.push(`/documento?partido=${p.id}&temas=${tema.id}`);

  return (
    <ScrollView contentContainerStyle={s.contenedor}>
      <View style={s.barra}>
        <Pulsable onPress={onVolver} style={s.volver} accessibilityRole="button" accessibilityLabel={`Volver a ${tema.nombre}`}>
          <Icono nombre="back" tam={16} color={C.tinta} peso="bold" />
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 14 }]} numberOfLines={1}>
            {tema.nombre}
          </Text>
        </Pulsable>
      </View>

      {/* La ficha, con aspecto de documento */}
      <View style={s.hoja}>
        <View style={s.partido}>
          <Marca color={p.color} tam={12} />
          <Text style={[T.tarjeta, { color: C.tinta }]}>{p.siglas}</Text>
        </View>
        <Text style={[T.titulo, { color: C.tinta, marginTop: 10 }]} accessibilityRole="header">
          {tema.nombre}
        </Text>

        <View style={s.datos}>
          {p.candidato && <Dato nombre="Candidato" valor={p.candidato} />}
          {ficha.fuente && <Dato nombre="Fuente" valor={ficha.fuente} />}
          <Dato nombre="Propuestas" valor={String(total)} />
        </View>

        {total > 0 && (
          <View style={s.acciones}>
            <Pulsable onPress={verPdf} style={s.boton} vibracion="ligera" accessibilityRole="link">
              <Icono nombre="documento" tam={16} color={C.sobreTinta} peso="bold" />
              <Text style={[T.etiqueta, { color: C.sobreTinta, fontSize: 14 }]}>Ver y descargar PDF</Text>
            </Pulsable>
          </View>
        )}

        {total === 0 ? (
          <Text style={[T.cuerpo, { color: C.suave, marginTop: 24 }]}>
            No hay propuestas de {p.siglas} sobre este tema.
          </Text>
        ) : (
          <>
            <Seccion titulo="Propuestas principales" propuestas={principales} desde={1} archivo={archivo} />
            {otras.length > 0 && <Seccion titulo="Otras propuestas" propuestas={otras} desde={principales.length + 1} archivo={archivo} />}
          </>
        )}

      </View>

      {/* Saltar a la ficha de otro partido sobre el mismo tema */}
      <Text style={[T.etiqueta, { color: C.suave, marginTop: 24, fontSize: 13 }]}>
        Otros partidos
      </Text>
      <View style={s.otros}>
        {PARTIDOS.filter((o) => o.id !== p.id).map((o) => (
          <Pulsable
            key={o.id}
            onPress={() => router.replace(`/ficha/${tema.id}/${o.id}`)}
            style={s.chip}
            escala={0.94}
            vibracion="seleccion"
            accessibilityRole="link"
          >
            <Marca color={o.color} tam={9} />
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>{o.siglas}</Text>
          </Pulsable>
        ))}
      </View>
    </ScrollView>
  );
}

function Dato({ nombre, valor }: { nombre: string; valor: string }) {
  return (
    <View style={s.dato}>
      <Text style={[T.meta, { color: C.suave, width: 88 }]}>{nombre}</Text>
      <Text style={[T.meta, { color: C.tinta, flex: 1 }]}>{valor}</Text>
    </View>
  );
}

function Seccion({ titulo, propuestas, desde, archivo }: { titulo: string; propuestas: Propuesta[]; desde: number; archivo?: string }) {
  return (
    <View style={{ marginTop: 26 }}>
      <Text style={[T.seccion, { color: C.tinta, fontSize: 19 }]} accessibilityRole="header">
        {titulo}
      </Text>
      <View style={{ marginTop: 6 }}>
        {propuestas.map((pr, i) => (
          <View key={i} style={[s.item, i > 0 && s.itemLinea]}>
            <Text style={[T.cuerpoSemi, s.num]}>{desde + i}</Text>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[T.cuerpo, { color: C.tinta }]}>{pr.resumen}</Text>
              {pr.pagina != null &&
                (archivo ? (
                  <Pulsable
                    onPress={() => Linking.openURL(urlPagina(archivo, pr.pagina!))}
                    style={s.enlacePagina}
                    escala={0.96}
                    accessibilityRole="link"
                    accessibilityLabel={`Abrir el programa por la página ${pr.pagina}`}
                  >
                    <Text style={[T.meta, { color: C.tinta, fontFamily: F.textoSemi, textDecorationLine: 'underline' }]}>
                      Página {pr.pagina} del programa
                    </Text>
                    <Icono nombre="enlace" tam={12} color={C.suave} peso="bold" />
                  </Pulsable>
                ) : (
                  <Text style={[T.meta, { color: C.suave, fontFamily: F.textoMedia }]}>
                    Página {pr.pagina} del programa
                  </Text>
                ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  contenedor: { paddingHorizontal: M, paddingTop: 12, paddingBottom: 48, width: '100%', maxWidth: 760, alignSelf: 'center' },
  barra: { flexDirection: 'row' },
  volver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 9,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
    maxWidth: '100%',
  },
  hoja: { marginTop: 18, backgroundColor: C.tarjeta, borderRadius: R.tarjeta, boxShadow: S.tarjeta, padding: 22 },
  partido: { flexDirection: 'row', alignItems: 'center', gap: 9, flexWrap: 'wrap' },
  datos: { marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: C.relleno, gap: 6 },
  dato: { flexDirection: 'row', gap: 8 },
  acciones: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.tinta,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: R.boton,
    boxShadow: S.boton,
  },
  item: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  enlacePagina: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  itemLinea: { borderTopWidth: 1, borderTopColor: C.linea },
  num: { width: 22, color: C.suave, fontVariant: ['tabular-nums'] },
  otros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    minHeight: 38,
    borderRadius: R.pildora,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
});
