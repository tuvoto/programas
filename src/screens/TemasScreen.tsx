import { useEffect, useState } from 'react';
import { Image, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TEMAS, Tema } from '../data/temas';
import { PARTIDOS, Partido } from '../data/partidos';
import { edicionVigente, numPropuestasTema, partidoTrataTema, vigentes } from '../data/propuestas';
import { BOE_CANDIDATURAS } from '../data/candidaturas';
import { CONFIG, FUENTES_OFICIALES } from '../config';
import Marca from '../components/Marca';
import Pulsable from '../components/Pulsable';
import Icono from '../components/Icono';
import Tarjeta from '../components/Tarjeta';
import { Paralaje, Revelar, ScrollAnimado } from '../components/Revelar';
import CuentaAtras from '../components/CuentaAtras';
import DescargarApp from '../components/DescargarApp';
import { C, F, HUECO_BARRA, M, R, S, T, plural, ANCHO_MAX, ANCHO_LECTURA, CENTRADO, nivel, esWeb } from '../theme';

// Ordenador de sobremesa con el mapa de diputados por provincia (datos del BOE),
// para la portada de la web en pantallas anchas.
const ORDENADOR = require('../../assets/portada/web-ordenador.png');

type Props = { onAbrirTema: (tema: Tema) => void };

// Días de calendario entre hoy (fecha del móvil u ordenador) y el 29 de
// noviembre. Se cuentan fechas, no horas: así el número cambia justo a
// medianoche, también la semana del cambio de hora (25 de octubre).
const DIA_ELECCIONES = Date.UTC(2026, 10, 29);
const diasHastaElecciones = () => {
  const h = new Date();
  const hoy = Date.UTC(h.getFullYear(), h.getMonth(), h.getDate());
  // Negativo cuando ya han pasado: entonces la cuenta atrás no se muestra.
  return Math.round((DIA_ELECCIONES - hoy) / 86_400_000);
};

const SEPARACION = 12;

// En las tarjetas de tema solo salen los partidos con programa cargado: un
// cuadrado vacío significa «su programa no trata el tema», no «falta el programa».
const CON_PROGRAMA = PARTIDOS.filter((p) => edicionVigente(p.id) !== null);

export default function TemasScreen({ onAbrirTema }: Props) {
  const [ancho, setAncho] = useState(0);
  const columnas = ancho >= 900 ? 4 : 3;
  // En la web la página se genera antes (al publicarla), así que los días se
  // calculan al abrirla en el navegador para que siempre estén al día.
  const [dias, setDias] = useState<number | null>(Platform.OS === 'web' ? null : diasHastaElecciones());
  // Se recalcula cada minuto: si la página sigue abierta a medianoche, cambia sola.
  useEffect(() => {
    setDias(diasHastaElecciones());
    const t = setInterval(() => setDias(diasHastaElecciones()), 60_000);
    return () => clearInterval(t);
  }, []);
  const ancho760 = ancho >= 760;
  // Móvil: los temas, en una cuadrícula compacta de tres, justo después del buscador.
  // Hasta medir la pantalla, se supone móvil (así la web generada y la que se
  // abre en el navegador empiezan igual).
  const movil = ancho === 0 || ancho < 760;
  // Solo en la web del ordenador: el texto a la izquierda y un portátil con la web a la derecha.
  const hero = esWeb && ancho >= 1000;

  // Reparto en filas: las tarjetas de una misma fila quedan alineadas y con la misma altura.
  const filas: Tema[][] = [];
  for (let i = 0; i < TEMAS.length; i += columnas) filas.push(TEMAS.slice(i, i + columnas));

  // Buscador: lleva a /buscar.
  const buscador = (
      <Revelar>
        <Pulsable
          onPress={() => router.push('/buscar')}
          style={s.buscador}
          escala={0.98}
          vibracion="ligera"
          accessibilityRole="search"
          accessibilityLabel="Buscar una medida en los programas"
        >
          <Icono nombre="buscar" tam={20} color={C.suave} peso="bold" />
          <Text style={[T.cuerpo, { color: C.suave, flex: 1 }]} numberOfLines={1}>
            Busca una medida: alquiler, SMI, becas…
          </Text>
        </Pulsable>
      </Revelar>
  );

  return (
    <ScrollAnimado contentContainerStyle={s.contenedor} onLayout={(e) => setAncho(Math.min(e.nativeEvent.layout.width, ANCHO_MAX) - M * 2)}>
      <View style={hero ? s.hero : undefined}>
      <View style={hero ? s.heroTexto : undefined}>
      {/* Portada: se aleja despacio al hacer scroll */}
      <Paralaje>
        <Text style={[T.portada, s.portada]} accessibilityRole="header">
          Compara los programas del {/* Guion y espacios que no se parten, para que «29-N» no se separe */}
          <Text style={s.subrayado}>{'\u00A029\u2011N\u00A0'}</Text>
        </Text>
      </Paralaje>

      {/* Cuenta atrás */}
      {(dias === null || dias >= 0) && (
        <Revelar>
          <CuentaAtras dias={dias} ancho={ancho} izquierda={hero} />
        </Revelar>
      )}

      {/* Tres datos que se pueden comprobar */}
      <Revelar>
        <DatosComprobables centrado={ancho760 && !hero} />
      </Revelar>

      {/* En el móvil, el buscador va arriba; en pantallas anchas, encima de las tarjetas de temas */}
      {movil && buscador}
      </View>
      {hero && (
        <View style={s.heroImagen}>
          <Revelar>
            <Ordenador />
          </Revelar>
        </View>
      )}
      </View>

      {/* El test y los partidos ya están en el menú de arriba: sin tarjetas aquí. */}
      {/* Solo en la web, cuando la app esté publicada */}
      <DescargarApp />

      {/* Temas */}
      <Revelar style={s.seccion}>
        <View style={s.tituloSeccion}>
          <Text style={[T.seccion, { color: C.tinta }]} accessibilityRole="header" {...nivel(2)}>
            Temas
          </Text>
        </View>
        <Text style={[T.meta, { color: C.suave, maxWidth: ANCHO_LECTURA }]}>
          {movil
            ? 'Programas de 2023 hasta que salgan los del 29-N.'
            : 'Programas de 2023 hasta que salgan los del 29-N. Cuadrado relleno: el partido trata el tema.'}
        </Text>
        {!movil && <Leyenda partidos={PARTIDOS} />}
      </Revelar>

      {!movil && <View style={{ marginBottom: 16, marginTop: -2 }}>{buscador}</View>}

      {(
        <View style={s.rejilla}>
          {filas.map((fila, f) => (
            <View key={f} style={s.fila}>
              {fila.map((t, c) => (
                <Revelar key={t.id} style={s.celda} retraso={c * 80}>
                  {movil ? <TemaCompacto tema={t} onPress={() => onAbrirTema(t)} /> : <TarjetaTema tema={t} onPress={() => onAbrirTema(t)} />}
                </Revelar>
              ))}
              {/* Huecos vacíos para que la última fila no estire sus tarjetas */}
              {Array.from({ length: columnas - fila.length }, (_, i) => (
                <View key={`hueco-${i}`} style={s.celda} />
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Móvil: accesos al test y a los partidos, debajo de los temas */}
      {movil && (
        <Revelar style={s.accesos}>
          <Pulsable onPress={() => router.navigate('/test')} style={[s.acceso, { backgroundColor: C.tinta }]} escala={0.97} vibracion="ligera" accessibilityRole="link" accessibilityLabel="Hacer el test de afinidad">
            <Text style={[T.subseccion, { color: C.sobreTinta }]}>Test</Text>
            <Text style={[T.etiqueta, { color: C.amarillo, fontSize: 13 }]}>¿Con qué programa coincides? ›</Text>
          </Pulsable>
          <Pulsable onPress={() => router.navigate('/partidos')} style={[s.acceso, { backgroundColor: C.amarillo }]} escala={0.97} vibracion="ligera" accessibilityRole="link" accessibilityLabel="Ver los partidos y sus resúmenes">
            <Text style={[T.subseccion, { color: C.tinta }]}>Partidos</Text>
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13 }]}>Resúmenes y candidatos ›</Text>
          </Pulsable>
        </Revelar>
      )}

      {/* Aviso de que no es oficial y de dónde salen los datos */}
      <Revelar>
        <NoOficial />
      </Revelar>
    </ScrollAnimado>
  );
}

// Ordenador con el mapa de España por diputados (solo en la web del ordenador).
function Ordenador() {
  return (
    <View
      style={s.ordenador}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mapa de España con los diputados que elige cada provincia, de Madrid (38) y Barcelona (32) a Soria (2), Ceuta y Melilla (1 cada una)"
    >
      <View style={s.circulo} />
      <Image source={ORDENADOR} style={s.imagenOrdenador} resizeMode="contain" />
    </View>
  );
}

// Fecha del BOE en corto: «3 nov».
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fechaCorta = (iso: string) => `${Number(iso.slice(8, 10))} ${MESES[Number(iso.slice(5, 7)) - 1]}`;

// Cifras de la propia app que cualquiera puede comprobar.
function DatosComprobables({ centrado }: { centrado: boolean }) {
  const datos = [
    plural(PARTIDOS.length, 'partido', 'partidos'),
    `${plural(vigentes().length, 'propuesta', 'propuestas')} con su página`,
    BOE_CANDIDATURAS.fecha
      ? `${BOE_CANDIDATURAS.proclamadas ? 'Listas' : 'Candidaturas'} del BOE · ${fechaCorta(BOE_CANDIDATURAS.fecha)}`
      : null,
  ].filter((d): d is string => d !== null);
  return (
    <View style={[s.datos, centrado && { justifyContent: 'center' }]}>
      {datos.map((d) => (
        <View key={d} style={s.dato}>
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13 }]}>{d}</Text>
        </View>
      ))}
    </View>
  );
}

// Franja final: TuVoto no es oficial y enlaza a las fuentes oficiales.
function NoOficial() {
  return (
    <View style={s.noOficial}>
      <Text style={[T.subseccion, { color: C.tinta }]}>TuVoto no es una app oficial</Text>
      <Text style={[T.cuerpo, { color: C.suave, maxWidth: ANCHO_LECTURA }]}>
        No pertenece a ningún gobierno, organismo electoral ni partido. Cada propuesta enlaza a la página de su programa
        para que lo compruebes.
      </Text>
      <Text style={[T.etiqueta, { color: C.suave, fontSize: 13, marginTop: 6 }]}>Datos oficiales de</Text>
      <View style={s.fuentes}>
        {FUENTES_OFICIALES.map((f) => (
          <Pulsable key={f.url} onPress={() => Linking.openURL(f.url)} style={s.fuente} vibracion="ligera" accessibilityRole="link" accessibilityLabel={f.nombre}>
            <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13, textDecorationLine: 'underline' }]}>{f.corto}</Text>
          </Pulsable>
        ))}
      </View>
      <Text style={[T.meta, { color: C.suave, marginTop: 8 }]}>
        Sin registro, sin anuncios y sin seguimiento.{' '}
        <Text onPress={() => Linking.openURL(CONFIG.avisoLegalUrl)} style={{ textDecorationLine: 'underline' }} accessibilityRole="link">
          Aviso legal
        </Text>
        {' · '}
        <Text selectable>{CONFIG.contacto}</Text>
      </Text>
    </View>
  );
}

// Tema en el móvil: icono y nombre, en una cuadrícula de tres.
function TemaCompacto({ tema: t, onPress }: { tema: Tema; onPress: () => void }) {
  const [pulsada, setPulsada] = useState(false);
  const n = numPropuestasTema(t.id);
  return (
    <Pulsable
      onPress={onPress}
      onPressIn={() => setPulsada(true)}
      onPressOut={() => setPulsada(false)}
      style={[s.temaCompacto, pulsada && s.temaPulsada]}
      accessibilityRole="link"
      accessibilityLabel={`${t.nombre}. ${n === 0 ? 'Sin propuestas todavía' : plural(n, 'propuesta', 'propuestas')}`}
      vibracion="ligera"
    >
      <View style={[s.icono, { width: 38, height: 38, borderRadius: 11 }]}>
        <Icono nombre={t.icono} tam={20} color={C.tinta} />
      </View>
      <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13, lineHeight: 16, textAlign: 'center' }]}>{t.nombre}</Text>
    </Pulsable>
  );
}

function Leyenda({ partidos }: { partidos: Partido[] }) {
  return (
    <View style={[s.leyenda, { marginTop: 8 }]}>
      {partidos.map((p) => (
        <View key={p.id} style={s.leyendaItem}>
          <Marca color={p.color} tam={10} />
          <Text style={[T.etiqueta, { color: C.tinta, fontSize: 13.5 }]}>{p.siglas}</Text>
        </View>
      ))}
    </View>
  );
}

function TarjetaTema({ tema: t, onPress }: { tema: Tema; onPress: () => void }) {
  // Gris clarito mientras el dedo está encima.
  const [pulsada, setPulsada] = useState(false);
  const n = numPropuestasTema(t.id);
  const estado = n === 0 ? 'Sin propuestas todavía' : plural(n, 'propuesta', 'propuestas');
  return (
    <Pulsable
      onPress={onPress}
      onPressIn={() => setPulsada(true)}
      onPressOut={() => setPulsada(false)}
      style={[s.tema, pulsada && s.temaPulsada]}
      accessibilityRole="link"
      accessibilityLabel={`${t.nombre}. ${estado}`}
      vibracion="ligera"
    >
      <View style={s.icono}>
        <Icono nombre={t.icono} tam={22} color={C.tinta} />
      </View>
      <Text style={[T.tarjeta, { color: C.tinta }]}>{t.nombre}</Text>
      {/* Pie pegado abajo: así los cuadrados quedan a la misma altura en toda la fila */}
      <View style={{ gap: 6, marginTop: 'auto' }}>
        <View style={s.marcas}>
          {CON_PROGRAMA.map((p) => (
            <Marca key={p.id} color={p.color} tam={8} vacia={!partidoTrataTema(p.id, t.id)} />
          ))}
        </View>
        <Text style={[T.meta, { color: C.suave, fontSize: 12.5, lineHeight: 16 }]}>{estado}</Text>
      </View>
    </Pulsable>
  );
}

const s = StyleSheet.create({
  contenedor: { ...CENTRADO,
    paddingHorizontal: M,
    paddingTop: 12,
    paddingBottom: HUECO_BARRA,
  },
  portada: { color: C.tinta, marginTop: 22, marginBottom: 4, maxWidth: 640 },
  subrayado: { backgroundColor: C.amarillo },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    paddingHorizontal: 18,
    minHeight: 54,
    borderRadius: R.boton + 4,
    backgroundColor: C.tarjeta,
    boxShadow: S.tarjeta,
  },
  leyenda: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 6 },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seccion: { marginTop: 28, marginBottom: 12, gap: 2 },
  tituloSeccion: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rejilla: { gap: SEPARACION },
  fila: { flexDirection: 'row', gap: SEPARACION, alignItems: 'stretch' },
  celda: { flex: 1, minWidth: 0 },
  tema: {
    flex: 1,
    backgroundColor: C.tarjeta,
    borderRadius: R.tarjeta,
    padding: 14,
    gap: 12,
    minHeight: 136,
    boxShadow: S.tarjeta,
  },
  icono: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.relleno,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temaPulsada: { backgroundColor: '#E8EBF0' },
  marcas: { flexDirection: 'row', gap: 3 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 56 },
  heroTexto: { flex: 1, minWidth: 0 },
  heroImagen: { width: 500, flexShrink: 0, paddingTop: 24 },
  ordenador: { width: 500, position: 'relative' },
  imagenOrdenador: { width: 500, height: 346 },
  circulo: { position: 'absolute', right: -50, top: -50, width: 380, height: 380, borderRadius: 190, backgroundColor: C.fondoPartidos, opacity: 0.3 },
  temaCompacto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 96,
    paddingHorizontal: 6,
    paddingVertical: 12,
    backgroundColor: C.tarjeta,
    borderRadius: R.tarjeta,
    boxShadow: S.tarjeta,
  },
  datos: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  dato: { backgroundColor: C.tarjeta, borderWidth: 1, borderColor: C.linea, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 6 },
  accesos: { flexDirection: 'row', gap: 10, marginTop: 14 },
  acceso: { flex: 1, borderRadius: R.tarjeta, padding: 14, gap: 4, minHeight: 84, justifyContent: 'space-between' },
  noOficial: {
    marginTop: 24,
    backgroundColor: C.tarjeta,
    borderRadius: R.tarjeta,
    borderLeftWidth: 5,
    borderLeftColor: C.amarillo,
    padding: 16,
    gap: 4,
    boxShadow: S.tarjeta,
  },
  fuentes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  fuente: { backgroundColor: C.relleno, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9 },
});
