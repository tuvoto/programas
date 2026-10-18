# Cómo publicar «TuVoto»

Guía para publicar la web, Google Play y App Store. Los comandos son para el
**cmd de Windows**, dentro de la carpeta del proyecto.

## Calendario

| Cuándo | Google Play | App Store | Web |
|---|---|---|---|
| Sáb 17 oct | Crear cuenta y verificar identidad | Inscribirse como persona física | Crear GitHub y publicar |
| ~19–20 oct | Subir la app a **prueba cerrada** con 12 probadores | Compilar y probar en TestFlight | |
| ~21 oct | Empiezan los **14 días** de prueba | Enviar a revisión (1–2 días) | |
| ~4 nov | Pedir acceso a producción (revisión de hasta 7 días) | Publicada | |
| ~11 nov | Publicada | | |
| 13 nov | Empieza la campaña | | |

Lo que no se puede acortar son los 14 días de prueba de Google: cuanto antes
empiecen, mejor.

---

## 1. Cuentas (las haces tú en cada web)

1. **Correo nuevo** solo para la app (p. ej. `programaselectorales.app@gmail.com`).
2. **GitHub** con ese correo. El usuario forma parte de la dirección de la web.
3. **Google Play Console** (play.google.com/console): cuenta **personal**, 25 $.
   Verifica tu identidad y, después, **el acceso a un móvil Android**: instala
   la app «Play Console» en un Android prestado, entra y pulsa «Verificar».
4. **Apple Developer** (app «Apple Developer» del iPhone → Account → Enroll):
   **Individual**, 99 $/año. Como vendedor saldrá tu nombre legal.

Nunca subas contraseñas, DNI ni claves a GitHub ni las pegues en el chat.

## 2. Preparar el proyecto (una vez)

```
npm install
npm run configurar -- TU-USUARIO-GITHUB tu-correo-nuevo@gmail.com
```

Esto pone tu usuario y tu correo en `src/config.ts` y en la política de
privacidad (`public/privacidad.html`).

## 3. Publicar la web (GitHub Pages)

Necesitas **Git**: descárgalo de git-scm.com e instálalo con las opciones por
defecto. Luego, **una sola vez**, configura el nombre que saldrá en los cambios
(pon el del proyecto, no el tuyo):

```
git config --global user.name "TuVoto"
git config --global user.email tu-correo-nuevo@gmail.com
```

En github.com crea un repositorio **público** llamado `programas`, **vacío**
(sin README). Después:

```
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO-GITHUB/programas.git
git push -u origin main
npm run deploy
```

La primera vez se abrirá el navegador para que inicies sesión en GitHub.

En GitHub: **Settings → Pages → Deploy from a branch → `gh-pages` / `(root)` →
Save**. En un par de minutos estará en
`https://TU-USUARIO-GITHUB.github.io/programas/`.

Comprueba que abre:
- la web,
- `.../privacidad.html` (la piden las dos tiendas),
- **Actions → Actualizar noticias → Run workflow** (genera las noticias; luego se
  actualizan solas cada 3 horas).

## 4. Preparar EAS (compila las apps en la nube, sin Mac)

```
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest update:configure
```

`update:configure` permite cambiar el contenido (por ejemplo, añadir los
programas de 2026) sin pasar otra vez por la revisión de las tiendas
(apartado 8).

## 5. Google Play

### Compilar
```
npx eas-cli@latest build --platform android --profile production
```
Tarda unos 15–30 minutos. Al acabar, descarga el archivo **.aab** del enlace.

### Crear la app y la prueba cerrada
1. Play Console → **Crear app** → Nombre `TuVoto – Elecciones 29-N`, idioma
   **Español (España)**, **App**, **Gratis**.
2. **Probar y publicar → Pruebas → Prueba cerrada → Crear canal** (o usa
   «Alpha») → **Crear versión** → sube el `.aab`.
3. **Probadores** → crea una lista con los correos de Google de los 12
   probadores → guarda → copia el **enlace para unirse**.
4. Envíales el mensaje del apartado 7 con ese enlace.
5. Envía la versión a revisión. Cuando Google la apruebe, los probadores
   pueden instalarla. Los 14 días cuentan desde que **12 personas** están
   apuntadas a la vez.

### Contenido de la app (Play Console → Política y programas → Contenido de la app)

| Pregunta | Respuesta |
|---|---|
| Política de privacidad | `https://TU-USUARIO-GITHUB.github.io/programas/privacidad.html` |
| Acceso a la app | Toda la funcionalidad está disponible sin restricciones |
| Anuncios | No contiene anuncios |
| Clasificación del contenido | Categoría «Referencia, noticias o educativa». No a todo (violencia, sexo, lenguaje, drogas, apuestas, interacción entre usuarios, compras) |
| Público objetivo | 18 años o más |
| Seguridad de los datos | No recoge datos · No comparte datos |
| Apps de gobierno | No está desarrollada ni publicada en nombre de un organismo público |
| Apps de noticias | No: su función principal es comparar programas; los titulares son un apartado secundario con enlace a cada medio |
| Funciones financieras / salud | Ninguna |
| Estado de comerciante (DSA) | No soy comerciante (app gratuita, sin fines comerciales) |

### Ficha de Play Store
Textos en el apartado 6. Imágenes en la carpeta `tienda/android/`:
- Icono: `icono-512.png`
- Gráfico destacado: `grafico-destacado-1024x500.png`
- Capturas del teléfono: `1_inicio.png` … `5_vota.png`
- Categoría: **Libros y obras de consulta**
- Correo de contacto: el correo nuevo

### Pasados los 14 días
**Panel → Solicitar acceso a producción**. Google pregunta cómo fue la prueba:
responde con lo que te hayan dicho los probadores. Cuando lo aprueben, pasa la
versión de la prueba cerrada a **Producción**.

## 6. Textos de las fichas

**Nombre** (máx. 30): `TuVoto – Elecciones 29-N`

En la pantalla del móvil, debajo del icono, saldrá solo **TuVoto**. Para las próximas elecciones basta con cambiar la parte de «Elecciones 29-N».

**Subtítulo App Store** (máx. 30): `Compara programas electorales`

**Descripción breve Google Play** (máx. 80):
`Compara por temas los programas de las elecciones generales del 29-N.`

**Palabras clave App Store** (máx. 100):
`elecciones,generales,programa,electoral,partidos,propuestas,votar,voto,correo,test,afinidad,congreso`

**Texto promocional App Store** (máx. 170):
`Compara qué propone cada partido en vivienda, empleo, sanidad y otros 9 temas, y haz el test para ver con qué programa coincides.`

**Descripción** (las dos tiendas):

```
TuVoto compara por temas lo que proponen los partidos para las elecciones generales del 29 de noviembre de 2026.

• 12 temas: vivienda, empleo, sanidad, educación, impuestos, pensiones, inmigración, medio ambiente, juventud, igualdad, modelo territorial y política exterior.
• Las propuestas de cada partido, resumidas y con la página del programa original para comprobarlas.
• Fichas en PDF para ver y descargar.
• Test de afinidad: 50 frases para deslizar y ver con qué programa coincides más. No es una recomendación de voto.
• Página de cada partido con su programa completo y titulares recientes de prensa.
• Guía para votar: fechas clave, voto por correo, qué llevar, voto desde el extranjero y mesas electorales.

Mientras los partidos publican sus programas para el 29-N, la app muestra sus programas de las elecciones de 2023, señalados como tales. Se irán actualizando a medida que se publiquen los nuevos.

APP INDEPENDIENTE
Esta app no representa a ningún partido político, gobierno ni organismo público. Las propuestas se resumen de los programas oficiales de cada partido, con el mismo criterio para todos.

FUENTES OFICIALES
• Ministerio del Interior: https://infoelectoral.interior.gob.es
• Junta Electoral Central: https://www.juntaelectoralcentral.es
• BOE: https://www.boe.es

Sin registro, sin publicidad y sin recoger datos personales.
```

## 7. Mensaje para los 12 probadores

```
¡Hola! Estoy publicando una app para comparar los programas electorales del 29-N y Google me pide que 12 personas con Android la prueben durante 14 días antes de publicarla. ¿Me ayudas?

1. Pásame el correo de la cuenta de Google que usas en el Play Store.
2. Cuando te mande el enlace, ábrelo en el móvil y pulsa «Convertirse en tester».
3. Instala la app desde el Play Store (el mismo enlace te lleva).
4. No la desinstales durante 14 días. Si la abres de vez en cuando y me dices qué te parece, mejor todavía.

Es gratis, no tiene anuncios y no recoge ningún dato. ¡Gracias!
```

## 8. App Store

Cuando Apple apruebe tu inscripción:

```
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios --latest
```

EAS te pedirá iniciar sesión con tu Apple ID y crea los certificados solo.
`submit` sube la app a App Store Connect (si te pregunta, deja que cree la app
con el identificador `es.programaselectorales.app`).

1. **Pruébala con TestFlight** en tu iPhone antes de enviarla.
2. En [App Store Connect](https://appstoreconnect.apple.com), completa:
   - Textos del apartado 6 y capturas de `tienda/iphone/` (tamaño 6,9").
   - Categoría principal **Referencia**, secundaria **Educación**.
   - **Privacidad de la app** → «No se recopilan datos».
   - URL de la política de privacidad y **URL de soporte**: la web.
   - **Clasificación por edades**: «Ninguno» en todo.
   - Copyright: `2026 TuVoto`.
   - **Notas para la revisión** (en inglés o español):
     ```
     Independent informational app, not affiliated with any party or government. It compares, by topic, the electoral programmes of Spanish parties for the general election of 29 November 2026. Until parties publish their 2026 programmes, it shows their 2023 programmes, clearly labelled as such, with the page of the original PDF for each proposal. News headlines come from public RSS feeds and link to the original outlet. No login, no ads, no data collection.
     ```
3. **Enviar a revisión**. Suele tardar uno o dos días.

## 9. Actualizar el contenido después

Cuando salgan los programas de 2026, se cambian las propuestas en
`src/data/propuestas.ts` y:

```
npm run deploy
npx eas-cli@latest update --channel production --environment production --message "Programa de X para 2026"
```

La web se actualiza al momento y las apps reciben el cambio la próxima vez que
se abren, sin nueva revisión. Solo hace falta compilar de nuevo si cambia el
icono o se añade una librería nativa.

## 10. Neutralidad

- El mismo nivel de detalle y un número parecido de propuestas por partido y tema.
- Resúmenes descriptivos, sin adjetivos valorativos, siempre con la página.
- Si alguien señala un error, corrígelo enseguida con `eas update`.

## 11. Que la web salga en Google (opcional, recomendado)

La web genera una página propia por cada tema, partido y ficha, con su título
y descripción, y un `sitemap.xml` con todas. Para que Google la encuentre antes:

1. Entra en **search.google.com/search-console** con el Gmail de TuVoto.
2. **Añadir propiedad → Prefijo de la URL** → `https://tuvoto.github.io/programas/`.
3. Elige verificar con **Etiqueta HTML**. Copia solo el código que va en
   `content="…"` y pégalo en `src/config.ts`, en `googleVerificacion: '…'`.
4. `npm run deploy` y, en Search Console, pulsa **Verificar**.
5. **Sitemaps** → escribe `sitemap.xml` → **Enviar**.

Google tarda unos días en empezar a mostrar las páginas.
