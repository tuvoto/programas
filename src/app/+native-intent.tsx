// Enlaces de la web que abren la app (https://tuvoto.github.io/programas/...).
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
