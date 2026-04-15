<!-- markdownlint-disable md007 md033 md036 md024 -->

# ZakaProfe WEB · Registro de cambios

## 4.0.0-beta (15/04/2026 - Primera parte)

<br/>

**Actualizaciones visibles para el usuario**

<br/>

### Cambios rompedores

- Ahora, para ser más coherentes, cada canal tiene su propia web. El contenido de «ZakaTeka» se ha movido de _profe.zhc.es_ (donde siempre estuvo) a _teka.zhc.es_ (donde debería haber estado desde un principio).

### Mejoras significativas

- Ahora el tema claro u oscuro no lo tienes que seleccionar; tomará el esquema de colores de tu sistema.

### Correcciones

- [ZPW/PROFE] [Apps/Calculadora de Nóminas] Corregido un fallo en que el primer grupo de cotización no era usable.

<br/>

**Actualizaciones internas (desarrollo)**

<br/>

- Partida la web en dos, ahora es un monorepo.
      <!-- - Ahora todas las aplicaciones, en lugar de ser código independiente, están basadas en el [pensar nombre en clave aquí], dando mayor consistencia y estabilidad. -->

## 3.5.0 (06/04/2026)

<br/>

**Actualizaciones visibles para el usuario**

<br/>

### Mejoras significativas

- Renovada la página de inicio para mostrar más contenido, estar mejor redactada y lucir mucho mejor.
- Mejorada bastante la adaptabilidad móvil.
    - Las aplicaciones, aunque han mejorado, aún necesitan algo de trabajo. Para la próxima versión renovaré el diseño de todas las aplicaciones para ser (a parte de mejor, en general) correctamente adaptativo.
- Mejorado el buscador, ahora tiene menos errores y muestra más contenido en pantalla. Además, ahora muestra algún dato más (como las visitas de cada video o su duración).
- Mejorada bastante la accesibilidad desde teléfonos.

### Nuevas aplicaciones

- Añadida una aplicación para ZakaProfe (asignatura Matemáticas) para calcular sumatorios y productorios.
- Añadida una aplicación (asignatura Itinerario Personal para la Empleabilidad) para calcular una calculadora de liquidaciones de nóminas.
- Añadido una aplicación para ZakaTeka (asignatura Sistemas Operativos), un analizador de sintaxis de scripting Windows (CMD, que es lo que está en el currículo en vez de PowerShell por alguna razón; no tiene sentido pero es más fácil).
- Ahora se puede ver el registro de cambios desde la propia web.
- Añadido soporte para «comentarios» en la web; se usan para reportar fallas y sugerir mejoras de forma rápida. Se envían de inmediato, pero no aparecen en público hasta que yo los revise (y opcionalmente responda).
    - (Con el poco tráfico que recibe la web parecen un poco inútiles (y por ahora lo son), pero en verano pretendo promocionarla todo lo posible, así que vienen bien.)

### Cambios en las aplicaciones

- Mejorada la calculadora de nóminas:
    - Ahora valida la base que proveas contra el S.M.I.
    - Ahora hace bien los cálculos en base al año (antes asumía que tiene 365 días, ahora mira si este año es bisiesto para usar 366).
    - Ahora permite especificar si el contrato es temporal (afecta al cálculo).
    - Si para las pagas extra tienes un contrato con una cantidad "mas la antigüedad", ahora puedes hacer que se sume la prorrata calculada.
    - Redondeados los números en la explicación del cálculo.
    - Está mejor diseñada en general.

### Otros cambios

- Corregidos fallos visuales menores.
- Ajustado los tamaños de texto para mejor legibilidad.
- Quitado el horario de la sección de contacto, no soy una empresa y no tengo porqué creerme tanto. Contacta cuando quieras, supongo.
- Quitada la sección para las clases particulares. No está cancelado, pero mañana no va a ser, no tiene mucho sentido el spoiler ahí.
- Semi-automatizadas las actualizaciones de datos para el buscador y demás.

<br/>

**Actualizaciones internas (desarrollo)**

<br/>

- Actualizadas todas las partes que usaban sintaxis Svelte Legacy para que usen Svelte Runes.
- Ahora en teoría el prerenderizado de Svelte debería ir.
- Quitados algunos estilos CSS innecesarios, debería mejorar un poquito el rendimiento.
- Optimizadas la mayoría de imágenes cambiando el formato de WebP a AVIF, deberían cargar mejor.

## 3.4.0 (08/03/2026)

Actualizaciones visibles para el usuario:

- Añadida una calculadora de nóminas para IPE. La ley española es compleja; aún no soporta todas las casuísticas e irá evolucionando con el tiempo.
- Añadida una calculadora de FLSM para redes.
- Mejorada la calculadora de notas; faltaban cosas básicas como darle a Entrar para que calcule.
- Cambiada la tipografía a Roboto (Flex y Mono), que es la tipografía oficial de ZakaProfe. Además, se ve mejor.
- Corregido (espero) el widget de contacto mostrando estados incoherentes.

Actualizaciones internas (desarrollo):

- Ahora la web no se desplegará con cada confirmación que se sube al repositorio, por lo que el repositorio refleja ahora el futuro de la página y no el estado actual.

## 3.3.2 (01/02/2026)

Actualizaciones visibles para el usuario:

- Arreglados varios fallos visual, alguno de ellos grave.
- Ahora el texto del contador de palabras también se puede compartir.

## 3.3.1 (29/01/2026)

Actualizaciones visibles para el usuario:

- Corregido algún pequeño error de lógica en algunas apps de ZakaTeka.

Actualizaciones internas (desarrollo):

- Migrados aún más componentes a Tailwind.
- Eliminada la lógica inútil de las traducciones, reduciendo así consumo y trabajo de carga.

## 3.3.0 (27/01/2026)

Actualizaciones visibles para el usuario:

- Añadida otra app de ZakaTeka, para calcular VLSM en IPs.
- Organizadas las apps por categorías.
- Arreglado un error histórico, la navegación accesible / por tabulador es invisible, volviéndose inaccesible.

Actualizaciones internas (desarrollo):

- Migrado algunos componentes a Tailwind, reduciendo el CSS que se tiene que cargar. Gradualmente se pasará todo a Tailwind para mejorar rendimiento.

## 3.2.0 (23/01/2026)

Actualizaciones visibles para el usuario:

- Ahora las apps están concentradas en una página dedicada.
- Añadidas dos apps (de ZakaTeka esta vez), para calcular IPs y números hexadecimales/binarios.
- Ahora el contador de palabras también mide el tiempo de lectura (de forma muy aproximada).
- Hecho algún ajuste visual menor.

## 3.1.0 (20/01/2026)

Actualizaciones visibles para el usuario:

- Añadido un contador de palabras como nueva app.
- Añadido mención a un futuro plan, clases particulares.
- Mejorado algún detalle visual.
- Corregido errores de redacción.

Actualizaciones internas (desarrollo):

- Añadidas descripciones SEO, con suerte así el sitio indexará mejor en Google.

## 3.0.1 (11/01/2026)

Actualizaciones visibles para el usuario:

- Ahora la calculadora de medias permite compartir las notas.
- Dicha calculadora ahora usa números del 0 al 100 en vez de decimales del 0 al 1 para las ponderaciones.
- Corregido el icono de la web.
- Actualizadas las imágenes de escritorio en el instalador de la Aplicación Web Progresiva.
- `/grades` ahora es `/calculadora-notas`.

Actualizaciones internas (desarrollo):

- Arreglado Prettier.

## 3.0.0

Actualizaciones visibles para el usuario:

- Renovado la web por COMPLETO. Muchos cambios.

Actualizaciones internas (desarrollo):

- Reescrito la web en Svelte en lugar de React.

## 2.3.2 (13/09/2025)

- La navegación (`/pag1`, `/pag2`) ya no debería dar errores.
- La app en general debería cargar más rápido (migrado React a Preact y optimizado más bruscamente las imágenes).
- Corregido el reloj de contacto (marcaba una hora menos, pero no soy canario, je je).

## 2.3.1 (18/04/2025)

Actualizaciones visibles para el usuario:

- Optimizadas las imágenes para que la pág. cargue más rápido.
- Mejorados los colores y hechas varas mejoras visuales.
- Ahora hay que presionar el footer para ver el texto de derechos de autor; así se ve mejor en móvil y molesta menos.

## 2.3.0 (17/04/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/afb17008372c6916cae4e7e68eba8c6100e0c3b1...fad2abd7ae05e61b2f5ad8a16cf9701aaded1115)

Actualizaciones visibles para el usuario:

- Añadida una calculadora de notas.
- Hechos algunos cambios visuales.

Actualizaciones internas (desarrollo):

- Eliminados archivos innecesarios.
- Configurado Prettier.

## 2.2.0 (03/03/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/61a89ebb62a0eb0f75d005ce7e6dbf51e750885b...afb17008372c6916cae4e7e68eba8c6100e0c3b1)

Actualizaciones visibles para el usuario:

- Algún ajuste visual.

Actualizaciones internas (desarrollo):

- Migrado de CRA a Vite.
- Migrado de JavaScript a TypeScript.

## 2.1.2 (19/02/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/1575d528d7be86d800a2ff11e253fd05c6bcc075...61a89ebb62a0eb0f75d005ce7e6dbf51e750885b)

Actualizaciones visibles para el usuario:

- Se mejoró el buscador.
    - Se ve visualmente mejor.
    - Valida mejor la entrada, y ahora acepta nivel («3º eso» o «4º eso» para buscar).
    - Se corrigió «encontrados 1 videos».
- Ahora el tema por defecto es el oscuro, para que no te exploten los ojos.

Actualizaciones internas (desarrollo):

- Agrupados correctamente los videos por temporadas.

## 2.1.1 (14/02/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/b1717088db022e6b228dd93e958c746c01354a97...1575d528d7be86d800a2ff11e253fd05c6bcc075)

Actualizaciones visibles para el usuario:

- Se cambiaron ligeramente los estilos (ahora son sin degradados + se arregló el overlay de los videos en móvil + otros ajustes menores).
- Se mejoró el buscador, ahora luce mejor, valida mejor la entrada, y rinde mejor.
- Se optimizó un poco más la página eliminando estilos CSS no usados.

Actualizaciones internas (desarrollo):

- Eliminado `pdfPro` y `pdfNah` del array de videos.

## 2.1.0 (12/02/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/75761b525181b5244963e83dd67c73cf0fd81103...b1717088db022e6b228dd93e958c746c01354a97).

Actualizaciones visibles para el usuario:

- Se optimizó un montón la página
    - Todas las imágenes PNG ahora son WEBP (14mb de ahorro).
    - Se eliminó CSS no usado.
    - Se eliminó también JS y una página entera no usados.
- Se añadió un buscador. Es muy simple, pero bastante más rápido que el de YouTube.
- Se hizo que la barra de navegación use iconos en móvil.
- Ahora la misma página tiene varias rutas comunes (p ej. `/home` y `/inicio`) válidas.
- Ahora la bola de status tiene una animación simple :)
- La página «Estudia más» fue ocultada por completo. El código aún existe, pero es ahora 100% inaccesible y dicho código ya no está en el repositorio.

Actualizaciones internas (desarrollo):

- Ahora las strings se validan con `string-utils` (nueva dep.) en vez de `.trim().toLowerCase()` para más precision.

## 2.0.0 (08/02/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/5457f06689b7b1510067c6a3d077bcb6fb17bc34...75761b525181b5244963e83dd67c73cf0fd81103).

- ¡El sitio web ha vuelto!

Actualizaciones visibles para el usuario:

- Se actualizó y volvió a implementar el componente de disponibilidad.
- Ahora la página 404 muestra el pathname solicitado.
- La página «Estudia más» ahora está sin usar y no está referenciada. Aún existe y su pathname ha sido cambiado a `/estudia`.
- Se mejoró el rendimiento (CSS más pequeño, menos cosas que cargar, imágenes más pequeñas...).
- Se mejoró el estilo en general, ajustando diseños, colores, etc...
- Ahora la página es completamente compatible con dispositivos móviles, mostrando todo el contenido y el logo en la barra de navegación.
- Se eliminó soporte para navegadores viejos.
- Se añadió Vercel analytics para medir el rendimiento de la web (esto no afecta a los usuarios).
- Pequeñas mejoras de accesibilidad.

Actualizaciones internas (desarrollo):

- Actualizado a React 19.
- Formateado todo el código.
- Establecido `pnpm` como el gestor de paquetes predeterminado del proyecto.
- Mejorado el código fuente de hace años (funciones redundantes, cosas no usadas, etc...).
- Eliminados algunos estilos compatibles con navegadores antiguos (a los usuarios con tecnologías ancestrales que les den).
- Eliminadas clases de CSS y tags HTML redundantes.
- Reorganizadas las miniaturas.

## 1.1.4

- Rebrand.
- Añadido formateado.

## 1.1.3

- Mejoras visuales.

## 1.1.2

- Actualizado `index.js` para que coincida con la sintaxis de React 18.

## 1.1.1

- Añadido (de nuevo) un aviso a la nueva sección de PDFs.
- Añadido el número de versión a la propia página.
- Corregidos algunos errores visuales.

## 1.1.0

- Implementación propia de `/paginado`, para hacer las páginas más fáciles de seguir.
- Muchos cambios visuales, para hacer el diseño más responsive.
- Añadida una página de `404`.
- Mejorado el diseño del modal.
- Añadidos los props `id` y `curso` a los elementos del array `videos.js`.
- Otros cambios menores y correcciones.

## 1.0.2

- Cambios en OpenGraph, añadidos Twitter tags...

## 1.0.1

- Añadido un aviso a la nueva sección de PDFs alertando que los PDFs aún no están listos.
- Cambiado _Coming soon_ por _Pronto disponible_, ya que la web está en español.
- Cambios visuales muy pequeños.

## 1.0.0

- ¡Lanzamiento estable!
