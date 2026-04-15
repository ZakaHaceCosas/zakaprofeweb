<svelte:options runes={true} />

<script lang="ts">
    import CardLink from "@zpw/ui/CardLink";
    import Link from "@zpw/ui/Link";
</script>

<svelte:head>
    <title>Aplicaciones</title>
    <meta
        name="description"
        content="Pequeñas aplicaciones útiles para clase, hechas por ZakaProfe."
    />
</svelte:head>

<h1>Aplicaciones de ZakaProfe</h1>
<br />
<p>
    Pequeñas aplicaciones web que te pueden ser de gran utilidad para cositas varias relacionadas
    con clase. Hechas a mano por ZakaProfe.<br /><br /><b
        >Si tienes sugerencias de aplicaciones nuevas, de mejoras a las existentes o algún error del
        que te quieras quejar, esta web tiene un mecanismo para reportarlo ahora mismo.</b
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
                width="25"
                height="25"
                viewBox="0 0 30 25"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M0 0H20V4H0V0Z" fill="currentColor" />
                <path d="M0 14H20V18H0V14Z" fill="currentColor" />
                <path d="M0 21H20V25H0V21Z" fill="currentColor" />
                <path d="M10 7H30V11H10V7Z" fill="currentColor" />
                <path d="M22 0H30V4H22V0Z" fill="currentColor" />
                <path d="M22 14H30V18H22V14Z" fill="currentColor" />
                <path d="M22 21H30V25H22V21Z" fill="currentColor" />
                <path d="M0 7H8V11H0V7Z" fill="currentColor" />
            </svg>{/snippet}
    </CardLink>

    <CardLink
        target="apps/calculadora-notas"
        title="Calculadora de notas"
        body="Una calculadora de notas medias, tanto aritméticas (simples) como ponderadas (con peso)."
        >{#snippet svg()}<svg
                xmlns="http://www.w3.org/2000/svg"
                width="25px"
                height="25px"
                viewBox="0 0 90 86"
            >
                <path
                    d="M43.1534 1.43986C43.8365 -0.202726 46.1635 -0.202728 46.8466 1.43986L57.756 27.6692C58.0441 28.3617 58.6953 28.8348 59.4429 28.8947L87.7596 31.1649C89.5329 31.307 90.252 33.5201 88.9009 34.6774L67.3265 53.1582C66.7569 53.6461 66.5082 54.4116 66.6822 55.1411L73.2735 82.7735C73.6863 84.5039 71.8038 85.8717 70.2856 84.9444L46.0425 70.1368C45.4025 69.7458 44.5975 69.7458 43.9575 70.1368L19.7144 84.9444C18.1962 85.8717 16.3137 84.504 16.7265 82.7735L23.3178 55.1411C23.4918 54.4116 23.2431 53.6461 22.6735 53.1582L1.09909 34.6774C-0.251987 33.5201 0.467064 31.307 2.24037 31.1649L30.5571 28.8947C31.3047 28.8348 31.9559 28.3617 32.244 27.6692L43.1534 1.43986Z"
                    fill="currentColor"
                />
            </svg>{/snippet}
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
                width="25"
                height="25"
                viewBox="0 0 90 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M63.2314 31.7028L61.3804 42.9747L0 59.4215L1.02465 48.3711L63.2314 31.7028ZM59.617 53.2882L57.3684 64.9127L5.21575 78.887L6.17889 67.6069L59.617 53.2882ZM68.4389 3.39225L65.3005 21.0613C63.8466 20.5324 62.1121 19.9967 60.097 19.4541C58.1042 18.8728 55.8964 18.5294 53.4735 18.4242C51.0731 18.2801 48.5262 18.5689 45.8328 19.2906C41.5786 20.4305 38.1623 22.494 35.584 25.4811C33.0056 28.4682 31.451 32.4603 30.9202 37.4575C30.42 42.4464 31.1212 48.4912 33.0238 55.5918C34.9428 62.7536 37.362 68.3544 40.2815 72.3942C43.2233 76.3953 46.5534 79.0294 50.2717 80.2965C53.9818 81.533 57.9639 81.5813 62.2182 80.4414C64.9115 79.7197 67.2657 78.7117 69.2807 77.4173C71.2957 76.1229 72.9983 74.7645 74.3886 73.3423C75.8095 71.9119 76.9755 70.6317 77.8865 69.502L89.5308 83.21C86.9328 86.8585 83.7106 89.9525 79.8642 92.4921C76.0097 95.0011 71.7104 96.8911 66.9665 98.1623C58.9477 100.311 51.3386 100.316 44.1393 98.1773C36.9624 96 30.6699 91.7978 25.2618 85.5709C19.8455 79.3134 15.776 71.104 13.0533 60.9428C10.3389 50.8122 9.75847 41.668 11.3122 33.5101C12.8658 25.3522 16.206 18.5361 21.3327 13.062C26.4818 7.54908 33.0658 3.7183 41.0846 1.56968C46.0121 0.249339 50.7692 -0.238044 55.3559 0.107526C59.9426 0.453101 64.3036 1.54801 68.4389 3.39225Z"
                    fill="currentColor"
                />
            </svg>{/snippet}
    </CardLink>

    <CardLink
        target="apps/calculadora-finiquitos"
        title="Calculadora de finiquitos"
        body="Calcula cuánto se debe pagar por una liquidación de contrato."
        >{#snippet svg()}<svg
                width="25"
                height="25"
                viewBox="0 0 90 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M63.2314 31.7028L61.3804 42.9747L0 59.4215L1.02465 48.3711L63.2314 31.7028ZM59.617 53.2882L57.3684 64.9127L5.21575 78.887L6.17889 67.6069L59.617 53.2882ZM68.4389 3.39225L65.3005 21.0613C63.8466 20.5324 62.1121 19.9967 60.097 19.4541C58.1042 18.8728 55.8964 18.5294 53.4735 18.4242C51.0731 18.2801 48.5262 18.5689 45.8328 19.2906C41.5786 20.4305 38.1623 22.494 35.584 25.4811C33.0056 28.4682 31.451 32.4603 30.9202 37.4575C30.42 42.4464 31.1212 48.4912 33.0238 55.5918C34.9428 62.7536 37.362 68.3544 40.2815 72.3942C43.2233 76.3953 46.5534 79.0294 50.2717 80.2965C53.9818 81.533 57.9639 81.5813 62.2182 80.4414C64.9115 79.7197 67.2657 78.7117 69.2807 77.4173C71.2957 76.1229 72.9983 74.7645 74.3886 73.3423C75.8095 71.9119 76.9755 70.6317 77.8865 69.502L89.5308 83.21C86.9328 86.8585 83.7106 89.9525 79.8642 92.4921C76.0097 95.0011 71.7104 96.8911 66.9665 98.1623C58.9477 100.311 51.3386 100.316 44.1393 98.1773C36.9624 96 30.6699 91.7978 25.2618 85.5709C19.8455 79.3134 15.776 71.104 13.0533 60.9428C10.3389 50.8122 9.75847 41.668 11.3122 33.5101C12.8658 25.3522 16.206 18.5361 21.3327 13.062C26.4818 7.54908 33.0658 3.7183 41.0846 1.56968C46.0121 0.249339 50.7692 -0.238044 55.3559 0.107526C59.9426 0.453101 64.3036 1.54801 68.4389 3.39225Z"
                    fill="currentColor"
                />
            </svg>{/snippet}
    </CardLink>
</div>
<div class="flex w-full flex-row items-center gap-4">
    <p class="whitespace-nowrap">
        <span class="text-(--accent)">ZakaProfe</span> · Matemáticas
    </p>
    <hr />
</div>
<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    <CardLink
        target="apps/acumuladores"
        title="Calculadora de acumuladores"
        body="Calcula rápidamente un sumatorio o productorio."
        >{#snippet svg()}<svg
                width="25"
                xmlns="http://www.w3.org/2000/svg"
                height="25"
                id="screenshot-a87215a7-8c6b-8099-8007-d1da17189188"
                viewBox="-745.467 -545 16.327 20"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
            >
                <g id="shape-a87215a7-8c6b-8099-8007-d1da17189188">
                    <g class="fills" id="fills-a87215a7-8c6b-8099-8007-d1da17189188">
                        <path
                            d="M-745.4674682617188,-545L-730.4674682617188,-545L-730.0692138671875,-539.970458984375L-730.6296997070312,-539.970458984375C-730.6985473632812,-540.9635620117188,-730.86572265625,-541.72314453125,-731.1311645507812,-542.2492065429688C-731.3966674804688,-542.7752685546875,-731.760498046875,-543.1563110351562,-732.2225952148438,-543.3922729492188C-732.6847534179688,-543.6282958984375,-733.4172973632812,-543.7462768554688,-734.4202270507812,-543.7462768554688L-741.2491455078125,-543.7462768554688L-735.15771484375,-535.92919921875L-742.08984375,-527.7433471679688L-734.4940185546875,-527.7433471679688C-733.117431640625,-527.7433471679688,-732.0653076171875,-527.9645385742188,-731.337646484375,-528.4070434570312C-730.6100463867188,-528.8495483398438,-730.0643310546875,-529.7738037109375,-729.7005004882812,-531.179931640625L-729.1400146484375,-531.0471801757812L-729.9954833984375,-525L-745.4674682617188,-525L-745.4674682617188,-525.5309448242188L-737.768310546875,-534.6165161132812L-745.4674682617188,-544.468994140625L-745.4674682617188,-545Z"
                            style="stroke-opacity: 1; stroke: none; font-family: &quot;Times New Roman&quot;; stroke-width: 1px; stroke-linejoin: miter; font-style: normal; font-weight: normal; font-size: 2050.28px; stroke-linecap: butt; fill-opacity: 1;"
                            fill="currentColor"
                        />
                    </g>
                </g>
            </svg>{/snippet}
    </CardLink>
</div>
