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
# tu favorito:
bun commit # ejecuta todos los guiones zpw:* necesarios antes de una confirmación
```

También están `bun lint` y `bun format`; estos son más obvios.

A partir de aquí hay dos rutas, según si vas a contribuir a una APP o a cualquier otra cosa

### Para cualquier otra cosa

No hay pautas específicas, haz algo guay y servirá.

### Para apps

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

let core = $state<ReturnType<typeof import("@zpw/ui/app/Core").default>>();
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

<svelte:head>
    <title>(App)</title>
    <meta
        name="description"
        content="(Desc. app)."
    />
</svelte:head>

<Core
    {method}
    channel="..."
    bind:values
    bind:this={core}
    params={
        ...
    }
    app="..."
    labels={{
        calc: "...",
        calcLite: "...",
    }}
>
    <h1>(Nombre app)</h1>
    <br />
    <p>(Describe aquí la app)</p>
    <br /><br />
    <!-- inputs de la app, resultados y demás -->
</Core>
```

Donde cada cosa es:

- TODO
