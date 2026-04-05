<svelte:head>
    <title>Registro de cambios</title>
    <style>
        code {
            font-weight: 900;
            color: rgb(5, 135, 35);
        }
        /** Source - https://stackoverflow.com/a/11737351 & Retrieved 2026-03-29, License - CC BY-SA 3.0 */
        ul {
            list-style-type: square;
            list-style-position: inside;
        }
        ul ul {
            list-style-type: circle;
            list-style-position: inside;
            margin-left: 15px;
        }
        li {
            margin-left: 5px;
        }
    </style>
</svelte:head>

<h1>Registro de cambios</h1>
<br />
<p>
    Aquí están listadas todas las actualizaciones que he ido haciendo a la web. Útil ya que al ser
    menos costoso que hacer videos me la paso haciéndole mejoras todo el rato, que puede que no
    notes si no te las señalo ;)
</p>
<hr />
<!--ESTO SE INYECTA MEDIANTE UN SCRIPT, NO HACE FALTA TOCAR A MANO-->
<!--#CHG-->
<h2>3.5.0 (En progreso)</h2>
<hr />
<h2>Actualizaciones visibles para el usuario</h2>
<h3>Mejoras significativas</h3>
<ul>
    <li>
        Renovada la página de inicio para mostrar más contenido, estar mejor redactada y lucir mucho
        mejor.
    </li>
    <li>Mejorada bastante la adaptabilidad móvil.</li>
    <li>
        Mejorado el buscador, ahora tiene menos errores y muestra más contenido en pantalla. Además,
        ahora muestra algún dato más (como las visitas de cada video o su duración).
    </li>
    <li>Mejorada bastante la accesibilidad desde teléfonos.</li>
</ul>
<h3>Nuevas aplicaciones</h3>
<ul>
    <li>
        Añadida una aplicación para ZakaProfe (asignatura Matemáticas) para calcular sumatorios y
        productorios.
    </li>
    <li>
        Añadida una aplicación (asignatura Itinerario Personal para la Empleabilidad) para calcular
        una calculadora de liquidaciones de nóminas.
    </li>
    <li>
        Añadido una aplicación para ZakaTeka (asignatura Sistemas Operativos), un analizador de
        sintaxis de scripting Windows (CMD, que es lo que está en el currículo en vez de PowerShell
        por alguna razón; no tiene sentido pero es más fácil).
    </li>
    <li>Ahora se puede ver el registro de cambios desde la propia web.</li>
    <li>
        Añadido soporte para «comentarios» en la web; se usan para reportar fallas y sugerir mejoras
        de forma rápida. Se envían de inmediato, pero no aparecen en público hasta que yo los revise
        (y opcionalmente responda).
        <ul>
            <li>
                (Con el poco tráfico que recibe la web parecen un poco inútiles (y por ahora lo
                son), pero en verano pretendo promocionarla todo lo posible, así que vienen bien.)
            </li>
        </ul>
    </li>
</ul>
<h3>Cambios en las aplicaciones</h3>
<ul>
    <li>
        Mejorada la calculadora de nóminas:
        <ul>
            <li>Ahora valida la base que proveas contra el S.M.I.</li>
            <li>
                Ahora hace bien los cálculos en base al año (antes asumía que tiene 365 días, ahora
                mira si este año es bisiesto para usar 366).
            </li>
            <li>Ahora permite especificar si el contrato es temporal (afecta al cálculo).</li>
            <li>
                Si para las pagas extra tienes un contrato con una cantidad &quot;mas la
                antigüedad&quot;, ahora puedes hacer que se sume la prorrata calculada.
            </li>
            <li>Redondeados los números en la explicación del cálculo.</li>
            <li>Está mejor diseñada en general.</li>
        </ul>
    </li>
</ul>
<h3>Otros cambios</h3>
<ul>
    <li>Corregidos fallos visuales menores.</li>
    <li>Ajustado los tamaños de texto para mejor legibilidad.</li>
    <li>
        Quitado el horario de la sección de contacto, no soy una empresa y no tengo porqué creerme
        tanto. Contacta cuando quieras, supongo.
    </li>
    <li>
        Quitada la sección para las clases particulares. No está cancelado, pero mañana no va a ser,
        no tiene mucho sentido el spoiler ahí.
    </li>
    <li>Semi-automatizadas las actualizaciones de datos para el buscador y demás.</li>
</ul>
<hr />
<h2>Actualizaciones internas (desarrollo)</h2>
<ul>
    <li>
        Actualizadas todas las partes que usaban sintaxis Svelte Legacy para que usen Svelte Runes.
    </li>
    <li>Quitados varios <code>console.log</code> innecesarios.</li>
    <li>Ahora en teoría el prerenderizado de Svelte debería ir.</li>
    <li>Quitados algunos estilos CSS innecesarios, debería mejorar un poquito el rendimiento.</li>
    <li>Optimizadas la mayoría de imágenes, de WebP a AVIF, deberían cargar mejor.</li>
</ul>
<hr />
<h2>3.4.0 (08/03/2026)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>
        Añadida una calculadora de nóminas para IPE. La ley española es compleja; aún no soporta
        todas las casuísticas e irá evolucionando con el tiempo.
    </li>
    <li>Añadida una calculadora de FLSM para redes.</li>
    <li>
        Mejorada la calculadora de notas; faltaban cosas básicas como darle a Entrar para que
        calcule.
    </li>
    <li>
        Cambiada la tipografía a Roboto (Flex y Mono), que es la tipografía oficial de ZakaProfe.
        Además, se ve mejor.
    </li>
    <li>Corregido (espero) el widget de contacto mostrando estados incoherentes.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>
        Ahora la web no se desplegará con cada confirmación que se sube al repositorio, por lo que
        el repositorio refleja ahora el futuro de la página y no el estado actual.
    </li>
</ul>
<hr />
<h2>3.3.2 (01/02/2026)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Arreglados varios fallos visual, alguno de ellos grave.</li>
    <li>Ahora el texto del contador de palabras también se puede compartir.</li>
</ul>
<hr />
<h2>3.3.1 (29/01/2026)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Corregido algún pequeño error de lógica en algunas apps de ZakaTeka.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Migrados aún más componentes a Tailwind.</li>
    <li>
        Eliminada la lógica inútil de las traducciones, reduciendo así consumo y trabajo de carga.
    </li>
</ul>
<hr />
<h2>3.3.0 (27/01/2026)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Añadida otra app de ZakaTeka, para calcular VLSM en IPs.</li>
    <li>Organizadas las apps por categorías.</li>
    <li>
        Arreglado un error histórico, la navegación accesible / por tabulador es invisible,
        volviéndose inaccesible.
    </li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>
        Migrado algunos componentes a Tailwind, reduciendo el CSS que se tiene que cargar.
        Gradualmente se pasará todo a Tailwind para mejorar rendimiento.
    </li>
</ul>
<hr />
<h2>3.2.0 (23/01/2026)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Ahora las apps están concentradas en una página dedicada.</li>
    <li>
        Añadidas dos apps (de ZakaTeka esta vez), para calcular IPs y números
        hexadecimales/binarios.
    </li>
    <li>
        Ahora el contador de palabras también mide el tiempo de lectura (de forma muy aproximada).
    </li>
    <li>Hecho algún ajuste visual menor.</li>
</ul>
<hr />
<h2>3.1.0 (20/01/2026)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Añadido un contador de palabras como nueva app.</li>
    <li>Añadido mención a un futuro plan, clases particulares.</li>
    <li>Mejorado algún detalle visual.</li>
    <li>Corregido errores de redacción.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Añadidas descripciones SEO, con suerte así el sitio indexará mejor en Google.</li>
</ul>
<hr />
<h2>3.0.1 (11/01/2026)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Ahora la calculadora de medias permite compartir las notas.</li>
    <li>
        Dicha calculadora ahora usa números del 0 al 100 en vez de decimales del 0 al 1 para las
        ponderaciones.
    </li>
    <li>Corregido el icono de la web.</li>
    <li>
        Actualizadas las imágenes de escritorio en el instalador de la Aplicación Web Progresiva.
    </li>
    <li><code>/grades</code> ahora es <code>/calculadora-notas</code>.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Arreglado Prettier.</li>
</ul>
<hr />
<h2>3.0.0</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Renovado la web por COMPLETO. Muchos cambios.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Reescrito la web en Svelte en lugar de React.</li>
</ul>
<hr />
<h2>2.3.2 (13/09/2025)</h2>
<ul>
    <li>La navegación (<code>/pag1</code>, <code>/pag2</code>) ya no debería dar errores.</li>
    <li>
        La app en general debería cargar más rápido (migrado React a Preact y optimizado más
        bruscamente las imágenes).
    </li>
    <li>Corregido el reloj de contacto (marcaba una hora menos, pero no soy canario, je je).</li>
</ul>
<hr />
<h2>2.3.1 (18/04/2025)</h2>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Optimizadas las imágenes para que la pág. cargue más rápido.</li>
    <li>Mejorados los colores y hechas varas mejoras visuales.</li>
    <li>
        Ahora hay que presionar el footer para ver el texto de derechos de autor; así se ve mejor en
        móvil y molesta menos.
    </li>
</ul>
<hr />
<h2>2.3.0 (17/04/2025)</h2>
<p>
    <a
        href="https://github.com/ZakaHaceCosas/zakaprofeweb/compare/afb17008372c6916cae4e7e68eba8c6100e0c3b1...fad2abd7ae05e61b2f5ad8a16cf9701aaded1115"
        >Comparación de cambios</a
    >
</p>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Añadida una calculadora de notas.</li>
    <li>Hechos algunos cambios visuales.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Eliminados archivos innecesarios.</li>
    <li>Configurado Prettier.</li>
</ul>
<hr />
<h2>2.2.0 (03/03/2025)</h2>
<p>
    <a
        href="https://github.com/ZakaHaceCosas/zakaprofeweb/compare/61a89ebb62a0eb0f75d005ce7e6dbf51e750885b...afb17008372c6916cae4e7e68eba8c6100e0c3b1"
        >Comparación de cambios</a
    >
</p>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Algún ajuste visual.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Migrado de CRA a Vite.</li>
    <li>Migrado de JavaScript a TypeScript.</li>
</ul>
<hr />
<h2>2.1.2 (19/02/2025)</h2>
<p>
    <a
        href="https://github.com/ZakaHaceCosas/zakaprofeweb/compare/1575d528d7be86d800a2ff11e253fd05c6bcc075...61a89ebb62a0eb0f75d005ce7e6dbf51e750885b"
        >Comparación de cambios</a
    >
</p>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>
        Se mejoró el buscador.
        <ul>
            <li>Se ve visualmente mejor.</li>
            <li>
                Valida mejor la entrada, y ahora acepta nivel («3º eso» o «4º eso» para buscar).
            </li>
            <li>Se corrigió «encontrados 1 videos».</li>
        </ul>
    </li>
    <li>Ahora el tema por defecto es el oscuro, para que no te exploten los ojos.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Agrupados correctamente los videos por temporadas.</li>
</ul>
<hr />
<h2>2.1.1 (14/02/2025)</h2>
<p>
    <a
        href="https://github.com/ZakaHaceCosas/zakaprofeweb/compare/b1717088db022e6b228dd93e958c746c01354a97...1575d528d7be86d800a2ff11e253fd05c6bcc075"
        >Comparación de cambios</a
    >
</p>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>
        Se cambiaron ligeramente los estilos (ahora son sin degradados + se arregló el overlay de
        los videos en móvil + otros ajustes menores).
    </li>
    <li>Se mejoró el buscador, ahora luce mejor, valida mejor la entrada, y rinde mejor.</li>
    <li>Se optimizó un poco más la página eliminando estilos CSS no usados.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Eliminado <code>pdfPro</code> y <code>pdfNah</code> del array de videos.</li>
</ul>
<hr />
<h2>2.1.0 (12/02/2025)</h2>
<p>
    <a
        href="https://github.com/ZakaHaceCosas/zakaprofeweb/compare/75761b525181b5244963e83dd67c73cf0fd81103...b1717088db022e6b228dd93e958c746c01354a97"
        >Comparación de cambios</a
    >.
</p>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>
        Se optimizó un montón la página
        <ul>
            <li>Todas las imágenes PNG ahora son WEBP (14mb de ahorro).</li>
            <li>Se eliminó CSS no usado.</li>
            <li>Se eliminó también JS y una página entera no usados.</li>
        </ul>
    </li>
    <li>Se añadió un buscador. Es muy simple, pero bastante más rápido que el de YouTube.</li>
    <li>Se hizo que la barra de navegación use iconos en móvil.</li>
    <li>
        Ahora la misma página tiene varias rutas comunes (p ej. <code>/home</code> y
        <code>/inicio</code>) válidas.
    </li>
    <li>Ahora la bola de status tiene una animación simple :)</li>
    <li>
        La página «Estudia más» fue ocultada por completo. El código aún existe, pero es ahora 100%
        inaccesible y dicho código ya no está en el repositorio.
    </li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>
        Ahora las strings se validan con <code>string-utils</code> (nueva dep.) en vez de
        <code>.trim().toLowerCase()</code> para más precision.
    </li>
</ul>
<hr />
<h2>2.0.0 (08/02/2025)</h2>
<p>
    <a
        href="https://github.com/ZakaHaceCosas/zakaprofeweb/compare/5457f06689b7b1510067c6a3d077bcb6fb17bc34...75761b525181b5244963e83dd67c73cf0fd81103"
        >Comparación de cambios</a
    >.
</p>
<ul>
    <li>¡El sitio web ha vuelto!</li>
</ul>
<h3>Actualizaciones visibles para el usuario:</h3>
<ul>
    <li>Se actualizó y volvió a implementar el componente de disponibilidad.</li>
    <li>Ahora la página 404 muestra el pathname solicitado.</li>
    <li>
        La página «Estudia más» ahora está sin usar y no está referenciada. Aún existe y su pathname
        ha sido cambiado a <code>/estudia</code>.
    </li>
    <li>
        Se mejoró el rendimiento (CSS más pequeño, menos cosas que cargar, imágenes más
        pequeñas...).
    </li>
    <li>Se mejoró el estilo en general, ajustando diseños, colores, etc...</li>
    <li>
        Ahora la página es completamente compatible con dispositivos móviles, mostrando todo el
        contenido y el logo en la barra de navegación.
    </li>
    <li>Se eliminó soporte para navegadores viejos.</li>
    <li>
        Se añadió Vercel analytics para medir el rendimiento de la web (esto no afecta a los
        usuarios).
    </li>
    <li>Pequeñas mejoras de accesibilidad.</li>
</ul>
<h3>Actualizaciones internas (desarrollo):</h3>
<ul>
    <li>Actualizado a React 19.</li>
    <li>Formateado todo el código.</li>
    <li>Establecido <code>pnpm</code> como el gestor de paquetes predeterminado del proyecto.</li>
    <li>
        Mejorado el código fuente de hace años (funciones redundantes, cosas no usadas, etc...).
    </li>
    <li>
        Eliminados algunos estilos compatibles con navegadores antiguos (a los usuarios con
        tecnologías ancestrales que les den).
    </li>
    <li>Eliminadas clases de CSS y tags HTML redundantes.</li>
    <li>Reorganizadas las miniaturas.</li>
</ul>
<hr />
<h2>1.1.4</h2>
<ul>
    <li>Rebrand.</li>
    <li>Añadido formateado.</li>
</ul>
<hr />
<h2>1.1.3</h2>
<ul>
    <li>Mejoras visuales.</li>
</ul>
<hr />
<h2>1.1.2</h2>
<ul>
    <li>Actualizado <code>index.js</code> para que coincida con la sintaxis de React 18.</li>
</ul>
<hr />
<h2>1.1.1</h2>
<ul>
    <li>Añadido (de nuevo) un aviso a la nueva sección de PDFs.</li>
    <li>Añadido el número de versión a la propia página.</li>
    <li>Corregidos algunos errores visuales.</li>
</ul>
<hr />
<h2>1.1.0</h2>
<ul>
    <li>
        Implementación propia de <code>/paginado</code>, para hacer las páginas más fáciles de
        seguir.
    </li>
    <li>Muchos cambios visuales, para hacer el diseño más responsive.</li>
    <li>Añadida una página de <code>404</code>.</li>
    <li>Mejorado el diseño del modal.</li>
    <li>
        Añadidos los props <code>id</code> y <code>curso</code> a los elementos del array
        <code>videos.js</code>.
    </li>
    <li>Otros cambios menores y correcciones.</li>
</ul>
<hr />
<h2>1.0.2</h2>
<ul>
    <li>Cambios en OpenGraph, añadidos Twitter tags...</li>
</ul>
<hr />
<h2>1.0.1</h2>
<ul>
    <li>Añadido un aviso a la nueva sección de PDFs alertando que los PDFs aún no están listos.</li>
    <li>
        Cambiado <em>Coming soon</em> por <em>Pronto disponible</em>, ya que la web está en español.
    </li>
    <li>Cambios visuales muy pequeños.</li>
</ul>
<hr />
<h2>1.0.0</h2>
<ul>
    <li>¡Lanzamiento estable!</li>
</ul>
<!--CHG#-->
