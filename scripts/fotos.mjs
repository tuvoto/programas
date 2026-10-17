// Genera src/data/fotos.ts a partir de las fotos de assets/candidatos.
//
// Cómo añadir una foto:
//   1. Guarda la imagen como assets/candidatos/<id-del-partido>.jpg (o .png),
//      p. ej. psoe.jpg, pp.jpg, vox.jpg. Mejor cuadrada, mínimo 300×300.
//   2. Añade el crédito en assets/candidatos/creditos.json:
//        { "psoe": { "autor": "Nombre del autor", "licencia": "CC BY-SA 4.0" } }
//   3. Ejecuta:  npm run fotos
//
// Usa solo fotos con licencia libre (p. ej. de Wikimedia Commons) o propias.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const dir = 'assets/candidatos';
const creditos = existsSync(`${dir}/creditos.json`) ? JSON.parse(readFileSync(`${dir}/creditos.json`, 'utf8')) : {};
const fotos = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort()
  .map((f) => ({ id: f.replace(/\.[^.]+$/, ''), archivo: f }));

const lineas = fotos.map(({ id, archivo }) => {
  const c = creditos[id] ?? {};
  if (!c.autor) console.warn(`Aviso: falta el autor de ${archivo} en creditos.json`);
  return `  ${JSON.stringify(id)}: { imagen: require('../../assets/candidatos/${archivo}'), autor: ${JSON.stringify(c.autor ?? '')}, licencia: ${JSON.stringify(c.licencia ?? '')} },`;
});

writeFileSync(
  'src/data/fotos.ts',
  `// Archivo generado por «npm run fotos». No lo edites a mano.
import { ImageSourcePropType } from 'react-native';

export type Foto = { imagen: ImageSourcePropType; autor: string; licencia: string };

export const FOTOS: Record<string, Foto> = {
${lineas.join('\n')}
};
`,
);
console.log(`${fotos.length} foto(s): ${fotos.map((f) => f.id).join(', ') || 'ninguna'}`);
