# Pautas de Contribución

Pese a ser una web «sencilla» y (todavía) no muy visitada, el proceso de desarrollo es sorprendentemente complejo.

---

## Pila tecnológica

Esto es un «monorepo», ambas webs están escritas enteramente en Svelte(Kit) 5 y alojadas en Vercel, bajo los dominios [profe.zhc.es] y [teka.zhc.es].

Ambas comparten todo el código posible. La estructura de directorios es la siguiente:

```txt
(raíz del repositorio)/
├─ packages/
│  ├─ types/
│  │  ├─ types.ts [TODOS LOS TIPOS DE DATOS COMPARTIDOS]
│  ├─ ui/
│  │  ├─ src/
│  │  │  ├─ [...].svelte [COMPONENTES NORMALES]
│  │  │  ├─ global/
│  │  │  │  ├─ [...].svelte [COMPONENTES DE SITIO]
│  │  │  ├─ app/
│  │  │  │  ├─ [...].svelte [COMPONENTES ZPWAPP-RT]
├─ apps/
│  ├─ profe/ [...] [PROYECTO SVELTEKIT NORMAL]
│  ├─ teka/ [...] [PROYECTO SVELTEKIT NORMAL]
│  ...
```

Donde cada tipo de componente significa esto:

- «Normales»: Componentes típicos de UI (botones, selectores, etc...) estilizados con Tailwind.
- «De sitio»: Paginas o layouts reutilizados para cada sitio web.
- «ZPWAPP-RT»: Componentes para el futuro ZPWAPP-RT.

### Código generado

> [!NOTE]
> Esto es información sobre code-gen en el repositorio, no una indicación sobre código generado por IA o algo así. Trae el código de donde quieras, será revisado y si es malo se te responsabilizará a ti y no a ninguna IA.

Hay algunos archivos que, de hecho, están generados automáticamente via guiones de generación de código («code-gen» para abreviar).

Son estos:

- `changelog/+page.svelte`, todas las webs, guión `zpw:chg` @ `tools/changelog.ts`.
- `apps/+page.svelte`, todas las webs, guión `zpw:app` @ `tools/app-page-builder.ts`.
- `lib/db.ts`, todas las webs, guión `zpw:fch` @ `tools/fetch.ts`.
- `static/sitemap.xml`, todas las webs, guión `zpw:xml` @ `tools/sitemap.ts`.
- `packages/ui/package.json` (parcialmente), guión `zpw:typ` @ `tools/ui-typegen.ts`

No los toques. Si te parece que algo está mal, cámbialo desde el archivo code-gen.

## Idiomas

- Todo lo que no sea código en sí debe estar en español: mensajes de las confirmaciones, documentación, comentarios y textos visibles en la interfaz.
- Los nombres de variables, funciones y demás pueden estar en inglés y se recomienda (por consistencia con el lenguaje de programación; si prefieres que estén en español puedes hacerlo aunque no es preferible).

## Calidad de código

En general no tienes que preocuparte por escribir bonito, sino por simplemente ejecutar `bun format` antes de hacer una confirmación.

Se te pueden exigir cosas obvias, como que una variable debería llamarse, por ejemplo, `tablaDatos = {}` y no `tblDts = {}` o `tD = {}` o `pareja_clave_valor_con_diversos_datos_de_interés = {}`; y demás cosas que probablemente ya sepas y te hayan dicho 20 veces. Poco más.

---

## ¿Cómo programar en ZakaProfeWeb?

Lo primero es lo primero. Tras bifurcar y clonar el repositorio, que sepas que `bun run dev` no te va a funcionar.

Uso varios **guiones ZPW:\*** hechos manualmente para adaptarse a las necesidades del proyecto. Acostúmbrate a ellos:

```sh
# IMPORTANTES
bun zpw:run [app] # equiv. a bun run dev (no va)
bun zpw:upd # equiv. a bun update (nop, tampoco va)
# LOS DEMÁS (también los vas a usar, pero menos)
bun zpw:chg [app] # code-gen para changelogs
bun zpw:fch # code-gen para DB
bun zpw:img # convierte PNGs a AVIF (require avifenc instalado)
bun zpw:xml [app] # code-gen para sitemap.xml
bun zpw:app # code-gen para ZPWAPP-RT
bun zpw:typ # code-gen para exports de @zpw/ui
# tu favorito:
bun commit # ejecuta todos los guiones zpw:* necesarios antes de una confirmación
```

También están `bun lint` y `bun format`; estos son más obvios.

A partir de aquí hay dos rutas, según si vas a contribuir a una APP o a cualquier otra cosa

### Para cualquier otra cosa

No hay pautas específicas, haz algo guay y servirá.

### Para apps

> [!CAUTION]
> Hay ciertos problemas con esta guía.
>
> 1. Esta es la forma *actual* de desarrollar aplicaciones de ZakaProfeWeb. Un nuevo sistema (ZPWAPP-RT) está en desarrollo, una vez terminado esto cambiará bastante.
> 2. Irónicamente, pese a lo que acabas de leer, este método es a la vez el «nuevo», y como tal la mayoría de aplicaciones aún no están migradas a este sistema, siendo mucho más arcaicas y desagradables de mantener.
>
> Más información al respecto al [final de la sección](#código-heredado-y-código-futuro-en-las-apps-de-zakaprofe).

Vale, las apps siguen esta estructura:

```txt
├─ (dentro de una web, en routes) /
│  ├─ apps/
│  │  ├─ +page.svelte [no tocar; code-gen]
│  │  ├─ (nombre-app)/
│  │  │  ├─ i.svg [icono + meta]
│  │  │  ├─ +page.server.ts [nunca cambia, no tocar]
│  │  │  ├─ +page.svelte [app en sí]
```

Cada app, al ser pequeña y no muy compleja (por su naturaleza), está siempre contenida en un solo archivo Svelte; el bloque `<script lang="ts">` suele ser suficiente.

Notarás que en `teka/apps/` existe un archivo `estadística.zpwapp`. Puedes ignorarlo de momento, quiero crear un sistema code-gen de mayor calibre para que las apps sean consistentes, _peeeeero_ eso es algo a largo plazo. No le des importancia.

De momento, el proceso es el siguiente:

Cada app tiene un archivo `i.svg` que contiene, a parte del icono SVG a mostrar en `*.zhc.es/apps`, ciertos metadatos en este formato:

```svg
<!--
asi:Matemáticas
title:Calculadora de acumuladores
body:Calcula rápidamente un sumatorio o productorio.
-->
<svg>
<!-- ... -->
</svg>
```

`asi:` indica la asignatura. Debe ser idéntico carácter por carácter en todas las apps que compartan asignatura.
`title:` y `body:` indican las cadenas a pasar a las props `title` y `body` del componente `<CardLink />` tal y como se usa en la página de `/apps`.

Al crear una app, querrás crear este SVG primero. Si no tienes un icono no importa, deja solo el comentario (debe ir siempre al principio y sin las marcas `<!--` y `-->` en lineas con texto) y ya.

Después, la app en sí puedes escribirla libremente. Lo único que se pauta es que sigas la siguiente estructura:

```svelte
<script lang="ts">
import Core from "@zpw/ui/app/Core";

let res = $state<TuTipoAquí | null>(null); // guardar el RESULTADO
let values = $state<{
    key: string;
}>({
    key: "",
}); // guardar los PARAMS / input del usuario
// deberían ser siempre strings vacíos, salvo cosas que HTML en sí te devuelva de otra forma (como checkboxes que son booleans)

function method() {
    // lógica de negocios de tu app
}
</script>

<Core
    channel="..."
    bind:values
    {method}
    params={[...]}
    app="..."
    labels={...}
>
    {#snippet result()}
        {#if res != null}
            <!--resultado aquí-->
        {/if}
    {/snippet}
</Core>
```

Donde cada cosa es lo siguiente:

| Cómo está en el ejemplo | Qué es realmente | Consideraciones |
| -- | -- | -- |
| `res = ...` | Estado donde guardarás el resultado una vez el usuario ejecute la app. | / |
| `values = ...` | Estado donde guardarás la entrada del usuario. | Todo son cadenas, aunque uses booleanos, números o estructuras complejas. Deberás adaptarte. |
| `method()` | Función que recibe los `values` y hace todos los cálculos. | Primero, al final debería establecer `res`, no devolver; segundo, ante un error, debería lanzar una cadena (no un `Error`) y no capturarla (la capturará el componente superior, descuida) |
| `<Core ... />` | Donde ocurre la magia. Gestiona todo. | Me debes una por hacer que funcione. |
| `channel="..."` | Canal al que corresponde la app. | `"profe"` o `"teka"`. |
| `bind:values` | Pasa los valores de este `.svelte` a `<Core />` y viceversa. | / |
| `params={[...]}` | Parámetros. Aquí defines todos los elementos de entrada que tendrá el formulario. | La abstracción JSON que usa esto es sencilla, pero no muy potente. Por ejemplo, actualmente sería incapaz de recrear la [calculadora de nóminas](https://profe.zhc.es/apps/calculadora-nominas) de ZakaProfe. |
| `app="..."` | Nombre único de la app. Para la URL, básicamente. | / |
| `labels={{...}}` | Texto y etiquetas que mostrar en el componente. | / |

(Más adelante se documentará más en detalle; de momento el JSDoc y los tipos te serán suficientes para manejarte.)

### Código heredado y código futuro en las apps de ZakaProfe

La palabra inglesa «overkill» define perfectamente el estado de las ZPWAPPs. Actualmente hay tres formas diferentes de hacerlas:

- Están las «clásicas» (viejas) que no siguen ningún sistema definido. Una mini app en un componente Svelte. Duplican cierta cantidad de código entre sí.
- Luego están las «modernas» (¿actuales? solo las usa una app) que usan el componente `<Core />` de `@zpw/ui/app`. Son casi perfectas, de hecho, pero requieren de un segundo archivo (el archivo de control `i.svg`).
- Y luego está el futuro sistema «ZPWAPP-RT» (no usadas por nada, salvo la app de pruebas que hay) que crean una capa de abstracción superior tratando de contener todo (incluido el contenido «de control» del SVG) en un único archivo y delegando a un pequeño sistema de code-gen el crear los diversos archivos necesarios.

Ya sé que es estúpido, parece esto Microsoft Windows...

Si vas a contribuir algo, usa el enfoque «moderno» (`<Core />` y a correr). Es lo más sano de momento. No intentes migrar aplicaciones «clásicas» a este sistema. Cuando ZPWAPP-RT sea lo suficientemente bueno, migraré yo todo. Ten en cuenta que no estará para mañana ni pasado.
