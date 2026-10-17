// Temas para comparar los programas. Puedes añadir, quitar o renombrar
// temas libremente: la app los muestra todos automáticamente.

import type { NombreIcono } from '../components/Icono';

export type Tema = {
  id: string;
  nombre: string;
  icono: NombreIcono; // ver src/components/Icono.tsx
};

export const TEMAS: Tema[] = [
  { id: 'vivienda', nombre: 'Vivienda', icono: 'vivienda' },
  { id: 'empleo', nombre: 'Empleo y salarios', icono: 'empleo' },
  { id: 'sanidad', nombre: 'Sanidad', icono: 'sanidad' },
  { id: 'educacion', nombre: 'Educación y universidad', icono: 'educacion' },
  { id: 'impuestos', nombre: 'Impuestos y economía', icono: 'impuestos' },
  { id: 'pensiones', nombre: 'Pensiones', icono: 'pensiones' },
  { id: 'inmigracion', nombre: 'Inmigración', icono: 'inmigracion' },
  { id: 'medioambiente', nombre: 'Medio ambiente y energía', icono: 'medioambiente' },
  { id: 'juventud', nombre: 'Juventud', icono: 'juventud' },
  { id: 'igualdad', nombre: 'Igualdad', icono: 'igualdad' },
  { id: 'territorial', nombre: 'Modelo territorial', icono: 'territorial' },
  { id: 'exterior', nombre: 'Política exterior y defensa', icono: 'exterior' },
];

export function temaPorId(id: string): Tema | undefined {
  return TEMAS.find((t) => t.id === id);
}
