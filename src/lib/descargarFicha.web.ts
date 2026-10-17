// Web: abre el diálogo de impresión del navegador con la ficha ya maquetada.
// Desde ahí se elige «Guardar como PDF».
import { Documento } from './ficha';

export async function descargarDocumento(d: Documento): Promise<void> {
  const marco = document.createElement('iframe');
  marco.setAttribute('aria-hidden', 'true');
  Object.assign(marco.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(marco);

  await new Promise<void>((listo) => {
    marco.onload = () => listo();
    marco.srcdoc = d.html;
  });

  const win = marco.contentWindow!;
  // Espera a las fuentes para que el PDF no salga con la tipografía de reserva.
  await Promise.race([win.document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]);

  // Chrome y Safari proponen como nombre del PDF el título de la página.
  const tituloAnterior = document.title;
  document.title = d.nombre;
  const limpiar = () => {
    document.title = tituloAnterior;
    marco.remove();
  };
  win.addEventListener('afterprint', () => setTimeout(limpiar, 100), { once: true });
  win.focus();
  win.print();
  // Por si el navegador no lanza «afterprint».
  setTimeout(() => marco.isConnected && limpiar(), 60_000);
}
