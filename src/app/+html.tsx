import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
import { CONFIG } from '../config';

// Plantilla HTML de cada página de la web (solo se usa al generar la web
// estática). Cada pantalla añade su propio título y descripción con <Meta>.
const BASE = new URL(CONFIG.webUrl).pathname.replace(/\/$/, ''); // «/programas»

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />

        {/* Vista previa al compartir el enlace (WhatsApp, Instagram, X, Telegram…) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TuVoto" />
        <meta property="og:image" content={`${CONFIG.webUrl}/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="TuVoto. Compara por temas los programas de las elecciones generales" />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Iconos de la web. No es instalable como app: la app se descarga de las tiendas. */}
        <link rel="icon" type="image/png" sizes="192x192" href={`${BASE}/icono-192.png`} />
        <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
        <meta name="theme-color" content="#161144" />
        {CONFIG.googleVerificacion ? <meta name="google-site-verification" content={CONFIG.googleVerificacion} /> : null}
        {/* Contador de visitas anónimo, sin cookies (ver política de privacidad) */}
        {CONFIG.goatcounter ? (
          <script data-goatcounter={`https://${CONFIG.goatcounter}.goatcounter.com/count`} async src="https://gc.zgo.at/count.js" />
        ) : null}

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#F3F5F9}[tabindex]:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid #161144;outline-offset:3px}input:focus,textarea:focus{outline:none}[tabindex]:focus:not(:focus-visible){outline:none}@media (hover:hover) and (pointer:fine){[data-pulsable]{transition:filter 150ms ease}[data-pulsable]:hover{filter:brightness(0.96)}}@media (prefers-reduced-motion:reduce){[data-pulsable]{transition:none}}' }} />
      </head>
      <body>
        <noscript>Para usar TuVoto hay que activar JavaScript.</noscript>
        {children}
      </body>
    </html>
  );
}
