// En la web no hay avisos: las notificaciones solo existen en la app del móvil.
export type EstadoAvisos = 'cargando' | 'sin-preguntar' | 'activados' | 'desactivados' | 'bloqueados';
export const avisosDisponibles = false;
export const AVISOS: { id: string; fecha: string; titulo: string; texto: string }[] = [];
export const useAvisos = (): EstadoAvisos => 'desactivados';
export const activarAvisos = async () => {};
export const desactivarAvisos = async () => {};
export const descartarAvisos = () => {};
export const abrirAjustes = () => {};
export const useAbrirDesdeAviso = () => {};
