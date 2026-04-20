<svelte:options runes={true} />

<script lang="ts">
    import CardLink from "@zpw/ui/CardLink";
    import Link from "@zpw/ui/Link";
</script>

<svelte:head>
    <title>Applets</title>
    <meta
        name="description"
        content="Pequeñas aplicaciones útiles para clase, hechas por ZakaProfe."
    />
</svelte:head>

<h1>Applets de ZakaProfe</h1>
<br />
<p>
    Pequeñas aplicaciones web que te pueden ser de gran utilidad para cositas varias relacionadas
    con clase. Hechas a mano por ZakaProfe.<br /><br /><b
        >Si tienes sugerencias de applets nuevos, mejoras a los existentes o algún error del que te
        quieras quejar, esta web tiene un mecanismo para reportarlo ahora mismo.</b
    >
    Haz
    <Link href="/bugs" tail="underline" title="Ir a la sección de contacto de la página de inicio"
        >clic aquí para ir a la página de comentarios</Link
    >
    y cuéntame ;)<br /><br />
</p>
<!--apps-->
<div class="flex w-full flex-row items-center gap-4">
    <p class="whitespace-nowrap">
        <span class="text-(--accent)">ZakaProfe</span> · Matemáticas
    </p>
    <hr />
</div>
<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    <CardLink
        target="apps/estadistica"
        title="Calculadora de estadística"
        body="Calcula parámetros y genera gráficas para un estudio estadístico."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                fill="none"
                viewBox="0 0 11 11"
                ><rect
                    width="3"
                    height="5"
                    y="6"
                    fill="currentColor"
                    class="fills"
                    rx="0"
                    ry="0"
                    style="fill-opacity:1"
                /><rect
                    width="3"
                    height="8"
                    x="4"
                    y="3"
                    fill="currentColor"
                    class="fills"
                    rx="0"
                    ry="0"
                    style="fill-opacity:1"
                /><rect
                    width="3"
                    height="11"
                    x="8"
                    fill="currentColor"
                    class="fills"
                    rx="0"
                    ry="0"
                    style="fill-opacity:1"
                /></svg
            >{/snippet}
    </CardLink>

    <CardLink
        target="apps/acumuladores"
        title="Calculadora de acumuladores"
        body="Calcula rápidamente un sumatorio o productorio."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="-745.467 -545 16.327 20"
                ><path
                    fill="currentColor"
                    d="M-745.467-545h15l.398 5.03h-.56q-.105-1.49-.502-2.28-.399-.788-1.092-1.142t-2.197-.354h-6.83l6.092 7.817-6.932 8.186h7.596q2.065 0 3.156-.664t1.637-2.773l.561.133-.855 6.047h-15.472v-.53l7.699-9.087-7.7-9.852z"
                    class="fills"
                    style="stroke-opacity:1;stroke:none;font-family:&quot;Times New Roman&quot;;stroke-width:1px;stroke-linejoin:miter;font-style:normal;font-weight:400;font-size:2050.28px;stroke-linecap:butt;fill-opacity:1"
                /></svg
            >{/snippet}
    </CardLink>
</div>
<div class="flex w-full flex-row items-center gap-4">
    <p class="whitespace-nowrap">
        <span class="text-(--accent)">ZakaProfe</span> · Utilidades pluri-asignatura
    </p>
    <hr />
</div>
<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    <CardLink
        target="apps/contador-palabras"
        title="Contador de palabras"
        body="Un contador de palabras, letras, y párrafos."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 30 25"
                ><path
                    fill="currentColor"
                    d="M0 0h20v4H0zm0 14h20v4H0zm0 7h20v4H0zM10 7h20v4H10zm12-7h8v4h-8zm0 14h8v4h-8zm0 7h8v4h-8zM0 7h8v4H0z"
                /></svg
            >{/snippet}
    </CardLink>

    <CardLink
        target="apps/calculadora-notas"
        title="Calculadora de notas"
        body="Una calculadora de notas medias, tanto aritméticas (simples) como ponderadas (con peso)."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 90 86"
                ><path
                    fill="currentColor"
                    d="M43.153 1.44c.684-1.643 3.01-1.643 3.694 0l10.909 26.23a2 2 0 0 0 1.687 1.225l28.317 2.27c1.773.142 2.492 2.355 1.14 3.512L67.327 53.158a2 2 0 0 0-.644 1.983l6.591 27.633c.413 1.73-1.47 3.098-2.987 2.17L46.042 70.137a2 2 0 0 0-2.084 0L19.714 84.944c-1.518.928-3.4-.44-2.987-2.17l6.59-27.633a2 2 0 0 0-.643-1.983L1.099 34.678C-.252 33.52.467 31.306 2.24 31.164l28.317-2.27a2 2 0 0 0 1.687-1.226z"
                /></svg
            >{/snippet}
    </CardLink>
</div>
<div class="flex w-full flex-row items-center gap-4">
    <p class="whitespace-nowrap">
        <span class="text-(--accent)">ZakaProfe</span> · Itinerario Personal para la Empleabilidad
    </p>
    <hr />
</div>
<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    <CardLink
        target="apps/calculadora-nominas"
        title="Calculadora de nóminas"
        body="Recibe varios datos y calcula una nómina en base a la legislación española."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="none"
                viewBox="0 0 90 100"
                ><path
                    fill="currentColor"
                    d="m63.231 31.703-1.85 11.272L0 59.422l1.025-11.05zm-3.614 21.585-2.249 11.625L5.216 78.887l.963-11.28zm8.822-49.896L65.3 21.062q-2.181-.794-5.204-1.608-2.989-.872-6.623-1.03-3.6-.216-7.641.867-6.38 1.71-10.249 6.19-3.867 4.481-4.664 11.977-.75 7.482 2.104 18.134 2.878 10.743 7.258 16.802 4.412 6.002 9.99 7.902 5.565 1.855 11.946.145 4.04-1.082 7.063-3.024t5.108-4.075q2.13-2.145 3.498-3.84L89.53 83.21q-3.897 5.474-9.667 9.282-5.781 3.765-12.898 5.67-12.027 3.223-22.827.015-10.766-3.266-18.877-12.606-8.124-9.387-12.209-24.628-4.072-15.196-1.74-27.433 2.33-12.237 10.02-20.448 7.724-8.27 19.752-11.492 7.39-1.98 14.27-1.462 6.882.518 13.084 3.284"
                /></svg
            >{/snippet}
    </CardLink>

    <CardLink
        target="apps/calculadora-finiquitos"
        title="Calculadora de finiquitos"
        body="Calcula cuánto se debe pagar por una liquidación de contrato."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="none"
                viewBox="0 0 90 100"
                ><path
                    fill="currentColor"
                    d="m63.231 31.703-1.85 11.272L0 59.422l1.025-11.05zm-3.614 21.585-2.249 11.625L5.216 78.887l.963-11.28zm8.822-49.896L65.3 21.062q-2.181-.794-5.204-1.608-2.989-.872-6.623-1.03-3.6-.216-7.641.867-6.38 1.71-10.249 6.19-3.867 4.481-4.664 11.977-.75 7.482 2.104 18.134 2.878 10.743 7.258 16.802 4.412 6.002 9.99 7.902 5.565 1.855 11.946.145 4.04-1.082 7.063-3.024t5.108-4.075q2.13-2.145 3.498-3.84L89.53 83.21q-3.897 5.474-9.667 9.282-5.781 3.765-12.898 5.67-12.027 3.223-22.827.015-10.766-3.266-18.877-12.606-8.124-9.387-12.209-24.628-4.072-15.196-1.74-27.433 2.33-12.237 10.02-20.448 7.724-8.27 19.752-11.492 7.39-1.98 14.27-1.462 6.882.518 13.084 3.284"
                /></svg
            >{/snippet}
    </CardLink>
</div>
