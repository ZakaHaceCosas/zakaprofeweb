<svelte:options runes={true} />

<script lang="ts">
    import CardLink from "@zpw/ui/CardLink";
    import Link from "@zpw/ui/Link";
</script>

<svelte:head>
    <title>Applets</title>
    <meta
        name="description"
        content="Pequeñas aplicaciones útiles para varias asignaturas de tus clases de informática, hechas por ZakaTeka."
    />
</svelte:head>

<h1>Applets de ZakaTeka</h1>
<br />
<p>
    Pequeñas aplicaciones web que te pueden ser de gran utilidad para cositas varias relacionadas
    con clase. Hechas a mano por ZakaTeka.<br /><br /><b
        >Si tienes sugerencias de applets nuevos, mejoras a las existentes o algún error del que te
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
        <span class="text-(--accent)">ZakaTeka</span> · Sistemas Operativos Mono-puestos
    </p>
    <hr />
</div>
<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    <CardLink
        target="apps/windows-cmd-parser"
        title="Analizador sintáctico de Windows CMD"
        body="Te permite escribir secuencias de comandos, analizarlas y predecir su salida."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="none"
                style="-webkit-print-color-adjust::exact"
                viewBox="4179 -1217 19 18.01"
                ><path d="m4184-1212 4 4-4 4m4 0h5" /><path
                    stroke="currentColor"
                    d="m4184-1212 4 4-4 4m4 0h5"
                    style="fill:none;fill-opacity:none;stroke-width:2;stroke-opacity:1"
                /></svg
            >{/snippet}
    </CardLink>
</div>
<div class="flex w-full flex-row items-center gap-4">
    <p class="whitespace-nowrap">
        <span class="text-(--accent)">ZakaTeka</span> · Redes Locales
    </p>
    <hr />
</div>
<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    <CardLink
        target="apps/convertir-binario-decimal-hexadecimal"
        title="Convertidor binario &hArr; hexadecimal &hArr; decimal"
        body="Convierte entre binario, decimal, y hexadecimal."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 32 26"
                ><path
                    fill="currentColor"
                    d="M3 17.333V23h7.667v3H0v-8.667zm29 0V26H21.333v-3H29v-5.667zM10.667 0v3H3v5.667H0V0zM32 0v8.667h-3V3h-7.667V0zM13.214 7.16v11.68h-2.47V9.504h-.067L8.002 11.18V8.99l2.891-1.83zm6.071 11.936q-1.47-.006-2.532-.724-1.055-.72-1.625-2.082-.565-1.362-.56-3.279 0-1.912.565-3.256.57-1.346 1.626-2.048Q17.819 7 19.285 7t2.52.707q1.062.708 1.632 2.053.57 1.34.565 3.251 0 1.921-.57 3.285-.566 1.364-1.62 2.082-1.056.718-2.527.718m0-2.047q1.004 0 1.603-1.01t.593-3.028q0-1.328-.274-2.213-.268-.884-.764-1.329a1.67 1.67 0 0 0-1.158-.444q-.998 0-1.597.998-.598.997-.604 2.988 0 1.346.268 2.247.273.896.77 1.346.495.445 1.163.445"
                /></svg
            >{/snippet}
    </CardLink>
    <CardLink
        target="apps/calcular-vlsm"
        title="Calculadora de VLSM para IPs"
        body="Escribes una IP y varios rangos de dispositivos, y divide todo con VLSM por ti."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 180 140"
                ><path
                    fill="currentColor"
                    d="M90 70c0-22.091-17.909-40-40-40S10 47.909 10 70s17.909 40 40 40v10C22.386 120 0 97.614 0 70s22.386-50 50-50 50 22.386 50 50-22.386 50-50 50v-10c22.091 0 40-17.909 40-40m85-50c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15v5c-11.046 0-20-8.954-20-20s8.954-20 20-20 20 8.954 20 20-8.954 20-20 20v-5c8.284 0 15-6.716 15-15m0 100c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15v5c-11.046 0-20-8.954-20-20s8.954-20 20-20 20 8.954 20 20-8.954 20-20 20v-5c8.284 0 15-6.716 15-15"
                /><path
                    fill="currentColor"
                    d="m100.32 42.895.684 1.88-7.576 2.757-.684-1.88zm8.523-3.102.684 1.88-7.576 2.757-.684-1.88zm8.522-3.102.684 1.88-7.576 2.757-.684-1.88zm8.523-3.102.684 1.88-7.576 2.757-.684-1.88zm8.522-3.102.684 1.88-7.575 2.757-.684-1.88zm8.522-3.102.684 1.88-7.575 2.757-.684-1.88zM99.688 95.346l-.684 1.88-7.576-2.758.684-1.879zm8.523 3.102-.684 1.88-7.576-2.758.684-1.88zm8.522 3.102-.684 1.88-7.576-2.758.684-1.88zm8.523 3.102-.684 1.88-7.576-2.758.684-1.879zm8.522 3.102-.684 1.879-7.575-2.757.684-1.879zm8.523 3.102-.685 1.879-7.575-2.757.684-1.879z"
                /></svg
            >{/snippet}
    </CardLink>
    <CardLink
        target="apps/calcular-ip-cidr"
        title="Calculadora de IPs con CIDR"
        body="Escribes una IP con CIDR y recibes toda la información de esa IP."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 47 15"
                ><path
                    fill="currentColor"
                    d="M6.491.199v14.545H3.416V3.118h-.085L0 5.206V2.479L3.6.199zM13.611 0q1.122 0 2.16.376 1.043.377 1.86 1.2.825.826 1.3 2.188.483 1.357.49 3.331 0 1.855-.42 3.31-.412 1.449-1.185 2.464a5.2 5.2 0 0 1-1.868 1.549q-1.095.525-2.443.525-1.456 0-2.571-.56a4.8 4.8 0 0 1-1.797-1.542 4.8 4.8 0 0 1-.817-2.202h3.033q.178.796.745 1.236.57.433 1.407.433 1.42 0 2.159-1.235.737-1.244.746-3.402h-.1a3.5 3.5 0 0 1-.88 1.1q-.555.455-1.272.704a4.6 4.6 0 0 1-1.513.248q-1.285 0-2.294-.604a4.33 4.33 0 0 1-1.59-1.662Q8.177 6.4 8.177 5.043q-.008-1.464.675-2.607a4.75 4.75 0 0 1 1.903-1.79Q11.985-.006 13.61 0m.022 2.415q-.718 0-1.279.34-.555.341-.88.917a2.55 2.55 0 0 0-.313 1.285q0 .718.313 1.293.319.568.866.91.554.333 1.264.333a2.44 2.44 0 0 0 1.776-.746 2.6 2.6 0 0 0 .532-.817q.192-.46.192-.98a2.6 2.6 0 0 0-.326-1.264 2.5 2.5 0 0 0-.881-.923 2.35 2.35 0 0 0-1.264-.348m6.32 12.329v-2.216l5.177-4.794q.66-.64 1.108-1.15a4.4 4.4 0 0 0 .69-1.002q.233-.496.233-1.072 0-.64-.29-1.1a1.9 1.9 0 0 0-.796-.718 2.5 2.5 0 0 0-1.144-.256q-.668 0-1.164.27a1.86 1.86 0 0 0-.767.774q-.27.504-.27 1.2h-2.92q0-1.426.647-2.478A4.3 4.3 0 0 1 22.267.575Q23.432 0 24.952 0q1.562 0 2.72.554 1.165.547 1.81 1.52.648.973.647 2.23a4.3 4.3 0 0 1-.327 1.626q-.32.804-1.143 1.783-.824.974-2.322 2.337l-2.124 2.08v.1h6.108v2.514zm19.776-.114-1.648-1.633 5.526-5.525-5.526-5.519 1.648-1.64 7.159 7.159zm-7.458-4.09V8.225h12.323l-2.33 2.315zm0-3.821V4.403h9.993l2.33 2.316z"
                /></svg
            >{/snippet}
    </CardLink>
    <CardLink
        target="apps/calcular-flsm"
        title="Calculadora de FLSM para IPs"
        body="Escribes una IP con CIDR y varios rangos de dispositivos, y divide todo con FLSM por ti."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="none"
                viewBox="0 0 140 140"
                ><path
                    fill="currentColor"
                    d="M105 70c0-19.33-15.67-35-35-35S35 50.67 35 70s15.67 35 35 35v15c-27.614 0-50-22.386-50-50s22.386-50 50-50 50 22.386 50 50-22.386 50-50 50v-15c19.33 0 35-15.67 35-35"
                /><path
                    fill="currentColor"
                    d="M85 70c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15v15c-16.568 0-30-13.431-30-30 0-16.568 13.432-30 30-30 16.569 0 30 13.432 30 30 0 16.569-13.431 30-30 30V85c8.284 0 15-6.716 15-15M70 0a70 70 0 0 1 70 70h-15.4a54.6 54.6 0 0 0-15.52-38.13l-.472-.478a54.6 54.6 0 0 0-17.094-11.575l-.62-.26A54.6 54.6 0 0 0 70 15.4zM15.4 70A54.6 54.6 0 0 0 70 124.6V140l-.861-.005a70 70 0 0 1-25.13-4.999l-.797-.324a70 70 0 0 1-22.097-14.569l-.612-.606a70 70 0 0 1-14.84-21.915l-.335-.794A70 70 0 0 1 0 70z"
                /></svg
            >{/snippet}
    </CardLink>
</div>
