// Enlaces de la web antigua que abren la app (https://tuvoto.github.io/programas/...).
// La web ahora está en https://tuvotoapp.es (sin /programas); para que esos
// enlaces abran la app hace falta una versión nueva en Google Play (app.json).
// La web vive bajo /programas; dentro de la app las rutas empiezan en /.
const PREFIJO = /^(?:https?:\/\/tuvoto\.github\.io)?\/programas(?=\/|$|\?)/i;

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    if (!PREFIJO.test(path)) return path;
    let ruta = path.replace(PREFIJO, '');
    // La web publica cada página también como .html
    ruta = ruta.replace(/\.html(?=\?|$)/, '').replace(/\/index(?=\?|$)/, '/');
    if (!ruta || ruta.startsWith('?')) ruta = '/' + ruta;
    return ruta;
  } catch {
    return '/';
  }
}
