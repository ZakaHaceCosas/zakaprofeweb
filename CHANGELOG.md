# ZPW Changelog

## 2.1.0

Actualizaciones visibles para el usuario:

- Se mejoró significativamente la experiencia de usuario optimizando las imágenes a WEBP (14mb de ahorro).
- Se añadió un buscador. Es muy simple, pero bastante más rápido que el de YouTube.
- Se hizo que la barra de navegación use iconos en móvil.
- Ahora la misma página tiene varias rutas comunes (p ej. `/home` y `/inicio`) válidas.
- Ahora la bola de status tiene una animación simple :)

Actualizaciones internas (desarrollo):

- Ahora las strings se validan con `string-utils` (nueva dep.) en vez de `.trim().toLowerCase()` para más precision.

## 2.0.0 (08/02/2025)

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
