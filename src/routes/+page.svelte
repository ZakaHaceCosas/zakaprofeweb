<script lang="ts">
    import ZakAvailable from "$lib/zakavailable.svelte";

    // import { m } from '$lib/paraglide/messages.js';
    import RandomVideoFeed from "../lib/videos.svelte";
</script>

<div class="main-layout">
    <h1><span style="color: var(--ZakaProfe)">ZakaProfe</span>, salvando tus notas.</h1>
    <br />
    <p style="max-width: 75%;">
        ¡Hola! Soy <b>Zaka</b>ria, más conocido como ZakaProfe o ZakaTeka.<br /><br />
        De vez en cuando hago videos educativos (de carácter general para <i>ZakaProfe</i> y
        centrados en informática para <i>ZakaTeka</i>)<!--, además de ofrecer clases particulares-->.
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
    <!-- <hr />
    <section aria-labelledby="classes-section" class="w-full">
        <h1 id="classes-section">CLASES PARTICULARES &gt;&gt;&gt;</h1>
        <br />
        <p><b>&gt;&gt;&gt;</b> SÓLO ZAKATEKA <b>&lt;&lt;&lt;</b></p>
        <br />
        <div class="flex-container">
            Exclusivamente para ZakaTeka (es decir, para el ámbito de la informática), doy clases
            particulares y personalizadas.<br /><br />Son por videollamada, de pago, con mínimo de
            clases por modalidad (extensible) y los días que consideres oportuno.<br /><br />Precios
            a negociar, pero puedes esperarlos de entre los más asequibles del sector.
            <br /><br /><b>Pronto disponible.</b>
        </div>
    </section> -->
</div>
