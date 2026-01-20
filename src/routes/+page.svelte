<script lang="ts">
    import ZakAvailable from "$lib/zakavailable.svelte";

    // import { m } from '$lib/paraglide/messages.js';
    import RandomVideoFeed from "../lib/videos.svelte";

    export const prerender = true;
</script>

<svelte:head>
    <title>ZakaProfe & ZakaTeka</title>
    <meta
        name="description"
        content="La web oficial de ZakaProfe y de ZakaTeka, dos canales de YouTube mediante los cuales doy clases :)."
    />
</svelte:head>

<main>
    <h1><span style="color: var(--ZakaProfe)">ZakaProfe</span>, salvando tus notas.</h1>
    <br />
    <p style="max-width: 75%;">
        ¡Hola! Soy <b>Zaka</b>ria, más conocido como ZakaProfe o ZakaTeka.<br /><br />
        De vez en cuando hago videos educativos (de carácter general para <i>ZakaProfe</i> y
        centrados en informática para
        <i>ZakaTeka</i>), además de ofrecer clases particulares.
    </p>
    <hr />
    <div class="flex flex-col gap-2 md:flex-row">
        <section class="flex-1" aria-labelledby="video-section-1">
            <h1 id="video-section-1">
                VIDEOS <span style="color: var(--ZakaProfe)">ZAKAPROFE</span> &gt;&gt;&gt;
            </h1>
            <br />
            <div class="flex-container">
                <h3>
                    Videos de carácter general, para todo el mundo.<br />Aquí se muestran dos
                    elegidos al azar.
                </h3>
                <RandomVideoFeed branch="PROFE" />
                <a
                    style="display: flex; alignItems: center, gap: 5"
                    href="https://www.youtube.com/@ZakaProfe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visita el canal de ZakaProfe en YouTube"
                >
                    Ver más en YouTube &gt;&gt;&gt;
                </a>
            </div>
        </section>
        <section class="flex-1" aria-labelledby="video-section-2">
            <h1 id="video-section-2">
                VIDEOS <span style="color: var(--ZakaTeka)">ZAKATEKA</span> &gt;&gt;&gt;
            </h1>
            <br />
            <div class="flex-container">
                <h3>
                    Videos centrados en informática, mi especialidad personal.<br />Aquí se muestran
                    dos elegidos al azar.
                </h3>
                <RandomVideoFeed branch="TEKA" />
                <a
                    style="display: flex; alignItems: center, gap: 5"
                    href="https://www.youtube.com/@ZakaTeka/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visita el canal de ZakaTeka en YouTube"
                >
                    Ver más en YouTube &gt;&gt;&gt;
                </a>
            </div>
        </section>
    </div>
    <hr />
    <section aria-labelledby="contact-section" class="w-full">
        <h1 id="contact-section">CONTACTO &gt;&gt;&gt;</h1>
        <br />
        <ZakAvailable />
    </section>
    <hr />
    <section aria-labelledby="classes-section" class="w-full">
        <h1 id="classes-section">CLASES PARTICULARES &gt;&gt;&gt;</h1>
        <br />
        <div class="flex-container">
            <p>
                Clases particulares y personalizadas, por videollamada y con ejercicios prácticos.
                Son de pago, aunque puedes esperarte precios MUY bajos. (aún están por determinar).<br
                /><br />Como si de una página de cursos se tratase, habrá un catálogo de
                clases/temas concretos a elegir.
            </p>
            <div class="row-ish" style="justify-content: start">
                <div class="bola-wrap">
                    <div class="bola mas-o-menos"></div>
                </div>
                <h2 class="non-bold-header mas-o-menos" style="font-size: 1.5em">
                    Aún no disponibles
                    <span style="font-size: medium; font-weight: 600">(próximamente)</span>
                </h2>
            </div>
        </div>
    </section>
</main>
