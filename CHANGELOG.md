# ZPW Changelog

## 2.1.2 (19/02/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/1575d528d7be86d800a2ff11e253fd05c6bcc075...61a89ebb62a0eb0f75d005ce7e6dbf51e750885b)

Actualizaciones visibles para el usuario:

- Se mejoró el buscador.
  - Se ve visualmente mejor.
  - Valida mejor la entrada, y ahora acepta nivel ("3º eso" o "4º eso" para buscar).
  - Se corrigió "encontrados 1 videos".
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
- La página "Estudia más" fue ocultada por completo. El código aún existe, pero es ahora 100% inaccesible y dicho código ya no está en el repositorio.

Actualizaciones internas (desarrollo):

- Ahora las strings se validan con `string-utils` (nueva dep.) en vez de `.trim().toLowerCase()` para más precision.

## 2.0.0 (08/02/2025)

[Comparación de cambios](https://github.com/ZakaHaceCosas/zakaprofeweb/compare/5457f06689b7b1510067c6a3d077bcb6fb17bc34...75761b525181b5244963e83dd67c73cf0fd81103).

- ¡El sitio web ha vuelto!

Actualizaciones visibles para el usuario:

- Se actualizó y volvió a implementar el componente de disponibilidad.
- Ahora la página 404 muestra el pathname solicitado.
- La página "Estudia más" ahora está sin usar y no está referenciada. Aún existe y su pathname ha sido cambiado a `/estudia`.
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

- Implementación propia de `/paginación`, para hacer las páginas más fáciles de seguir.
- Muchos cambios visuales, para hacer el diseño más responsive.
- Añadida una página de `404`.
- Mejorado el diseño del modal.
- Añadidos los props `id` y `curso` a los elementos del array `videos.js`.
- Otros cambios menores y correcciones.

## 1.0.2

- Cambios en OpenGraph, añadidos Twitter tags...

## 1.0.1

- Añadido un aviso a la nueva sección de PDFs alertando que los PDFs aún no están listos.
- Cambiado *Coming soon* por *Pronto disponible*, ya que la web está en español.
- Cambios visuales muy pequeños.

## 1.0.0

- ¡Lanzamiento estable!
