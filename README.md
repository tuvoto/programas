# TuVoto

Web y app móvil (Expo / React Native) para comparar por temas los programas
electorales de las elecciones generales del 29 de noviembre de 2026.
Un solo código para las tres plataformas: **web, iOS y Android**.

## Probarla

Instala **Node.js** (versión LTS) y, dentro de esta carpeta:

```
npm install
npx expo start
```

- **En el navegador:** pulsa `w` en la terminal.
- **En tu iPhone (sin Mac):** instala **Expo Go** desde la App Store y escanea
  el QR con la cámara. Ordenador y móvil en la misma wifi (si no, usa
  `npx expo start --tunnel`).

Cada vez que guardas un cambio, se recarga sola.

## Publicar la web (gratis, con GitHub Pages)

1. Crea un repositorio en GitHub llamado **`programas`** y sube este proyecto.
   Si le pones otro nombre, cambia `experiments.baseUrl` en `app.json` a
   `"/nombre-del-repo"`.
2. Ejecuta:
   ```
   npm run deploy
   ```
   Compila la web y la sube a la rama `gh-pages`.
3. En GitHub: **Settings → Pages → Deploy from a branch → `gh-pages` / root → Save**.
4. Estará en `https://TU-USUARIO.github.io/programas/`, con la política de
   privacidad en `.../privacidad.html`.

5. Antes, ejecuta `npm run configurar -- TU-USUARIO correo@ejemplo.com` para poner
   tu usuario de GitHub y tu correo de contacto. La app del móvil descarga de esa
   web los programas en PDF y las noticias.

Cada vez que añadas propuestas, vuelve a ejecutar `npm run deploy`.

### Noticias de cada partido

La página de cada partido muestra titulares recientes sacados de los RSS
públicos de varios medios (lista en `src/lib/noticiasCore.ts`). No hace falta
servidor:

- **En la web:** GitHub Actions (`.github/workflows/noticias.yml`) genera
  `noticias.json` cada 3 horas y lo sube a la rama `gh-pages`. Funciona solo
  en cuanto subas el proyecto a GitHub; para lanzarlo a mano: pestaña
  **Actions → Actualizar noticias → Run workflow**.
- **En el móvil:** lee ese mismo archivo y, si no está disponible, consulta los
  RSS directamente.
- **En local** (`npx expo start` en el navegador) no se ven noticias hasta que
  generes el archivo con `npm run noticias` (necesita Node 22.6 o posterior).

### Programas completos en PDF

Los PDF de 2023 están en `public/programas/` y se publican con la web. Son los
mismos archivos de los que salen los números de página que cita la app, así
que en las fichas cada «Página N» abre el programa por esa página.

Cada tema tiene su propia dirección (p. ej. `/programas/tema/vivienda`),
así que se pueden compartir enlaces directos a un tema.

## Publicar en las tiendas

Paso a paso en **PUBLICAR.md**.

## Dónde está cada cosa

| Archivo | Para qué |
|---|---|
| `src/data/partidos.ts` | Partidos, candidatos, estado de la candidatura y enlace al programa |
| `src/data/temas.ts` | Los temas que se comparan (añade o quita los que quieras) |
| `src/data/propuestas.ts` | Las propuestas de cada partido por tema (vacío hasta que salgan los programas) |
| `src/config.ts` | Dirección de la web publicada, política de privacidad y correo de contacto |
| `src/lib/noticiasCore.ts` | Medios y criterio de búsqueda de las noticias |
| `public/programas/` | Programas completos en PDF |
| `src/app/` | Las rutas (cada archivo es una pantalla / una dirección web) |
| `src/screens/` | El contenido de cada pantalla |
| `src/theme.ts` | Colores, fuentes y tamaños de texto de toda la app |
| `src/components/` | Piezas comunes: marcas de partido, iconos, botones |
| `public/privacidad.html` | Política de privacidad (se publica junto con la web) |

## Calendario que afecta a los datos

- **16 oct**: fin del plazo para registrar coaliciones (aclara Frente Amplio / Podemos).
- **2–3 nov**: proclamación de candidaturas y publicación en el BOE. Revisa
  `partidos.ts` y marca las candidaturas como `confirmada`; añade los
  partidos autonómicos que se presenten.
- **13–27 nov**: campaña. Los programas suelen salir justo antes o al principio.
