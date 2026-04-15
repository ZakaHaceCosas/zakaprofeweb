<svelte:options runes={true} />

<script lang="ts">
    import { onMount } from "svelte";
    import Link from "@zpw/ui/Link";
    import RandomVideoFeed from "@zpw/ui/VideoTuple";
    import Contact from "@zpw/ui/Contact";
    import { type IVideo } from "../../../types/types";

    const { list, channel, metaDesc, slogan, slogans, bioLine } = $props<{
        channel: string;
        metaDesc: string;
        slogan: string;
        bioLine: string;
        slogans: [string, string, string];
        list: IVideo[];
    }>();

    let container: HTMLDivElement;
    let words: HTMLDivElement[] = [];

    // yo esto lo hice en CSS yo solito
    // que esté vive-coded esta versión JS (que se nota) es por una tontería (mover el texto de al lado con la animación) y porque es de noche y me da pereza y quiero dormir y no me voy a poner a buscar dónde pone que tengo que hacer un requestAnimationFrame(requestAnimationFrame()) para que funcione
    // tengo que retomar el curso de c#, js me tiene harto
    onMount(() => {
        const total = words.length;
        let currentIndex = 0;

        // odas abajo excepto la primera
        words.forEach((w, i) => {
            w.style.transition = "none";
            w.style.transform = `translateY(${i === 0 ? "0%" : "100%"})`;
        });

        container.style.width = words[0].offsetWidth + "px";

        function showNextWord() {
            const current = words[currentIndex];
            const nextIndex = (currentIndex + 1) % total;
            const next = words[nextIndex];

            if (!current || !next) return;

            // (coloca la siguiente justo debajo, sin animación)
            next.style.transition = "none";
            next.style.transform = "translateY(100%)";

            // qué
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    current.style.transition = "transform 0.5s ease-in-out";
                    current.style.transform = "translateY(-100%)";

                    next.style.transition = "transform 0.5s ease-in-out";
                    next.style.transform = "translateY(0%)";

                    container.style.transition = "width 0.4s ease-in-out";
                    container.style.width = next.offsetWidth + "px";
                })
            );

            currentIndex = nextIndex;
        }

        const interval = setInterval(showNextWord, 3000);
        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>{channel}</title>
    <meta name="description" content={metaDesc} />
</svelte:head>

<h1>
    <b>
        <div
            class="relative hidden h-[1.2em] overflow-hidden align-bottom sm:inline-block"
            bind:this={container}
        >
            <div class="absolute block whitespace-nowrap text-(--accent)" bind:this={words[0]}>
                {slogan}
            </div>
            <div class="absolute block whitespace-nowrap" bind:this={words[1]}>
                {slogans[0]}
            </div>
            <div class="absolute block whitespace-nowrap" bind:this={words[2]}>
                {slogans[1]}
            </div>
            <div class="absolute block whitespace-nowrap" bind:this={words[3]}>
                {slogans[2]}
            </div>
        </div>
        <div class="sm:hidden">{slogan}</div>
    </b> desde 2023.
</h1>
<br />
<p class="text-lg">
    ¡Hola! Soy <b>Zaka</b>ria, más conocido como {channel}.<br /><br />
    {bioLine}.<br /><br /><b>En esta página encontrarás cosas muy interesantes:</b>
    varias mini-aplicaciones que te pueden ayudar con cosas concretas, un buscador de videos que carga
    mucho más rápido que el de YouTube y en el futuro más cosas.
</p>
<hr />
<h2>DESCUBRE EL CANAL &gt;&gt;&gt;</h2>
<br />

<div class="flex w-full flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4">
    <h3>
        <b>
            {#if channel == "ZakaProfe"}Videos para la <abbr
                    title="Educación Secundaria Obligatoria">E.S.O.</abbr
                >, varias asignaturas.{:else}Videos para informáticos, asignaturas de <abbr
                    title="Formación Profesional de Grado Medio en Sistemas Microinformáticos y Redes"
                    >GM S.M.R.</abbr
                >{/if}
        </b>
    </h3>
    <p>
        Aquí se muestran cuatro videos elegidos al azar, puedes pulsarlos para verlos ahora si
        quieres.
    </p>
    <RandomVideoFeed {list} />
    <Link
        href="https://www.youtube.com/@{channel}/"
        title="Visita el canal de {channel} en YouTube"
    >
        Ver todos los videos ({list.length}) en YouTube &gt;&gt;&gt;
    </Link>
</div>
<hr />
<section aria-labelledby="contact-section" class="w-full">
    <h2 id="contact-section">CONTACTO &gt;&gt;&gt;</h2>
    <p>Te mereces poder preguntar directamente si no entiendes algo de un video.</p>
    <br />
    <Contact {channel} />
</section>
<hr />

<section aria-labelledby="about-section" class="w-full">
    <h2 id="about-section">ACERCA DE &gt;&gt;&gt;</h2>
    <p>
        Acerca de mí y de este canal. <span class="opacity-50"
            >La gente no suele leerse esto, ni es importante, pero bueno. Quizás a ti sí te
            interesa.</span
        >
    </p>
    <br />
    {#if channel == "ZakaProfe"}
        <div class="flex-1 bg-(--ZakaProfe) p-4">
            <p class="text-white">
                Acerca de <b>ZakaProfe, el que «salva tus notas»</b>. Con ese eslogan empecé en 2023
                a hacer videos. Nació como una forma de ayudar a mis compañeros y nada más, pero ha
                crecido hasta más de 300 visitas en algún video.
                <br /><br />
                <b>Este canal tiene videos para secundaria</b>, de múltiples asignaturas típicas
                (mates, lengua, física...) y lo caracteriza
                <b>la calidad de producción excepcional</b>, porque ¿para qué grabarme frente a una
                pizarra con lo cutre que queda eso? Una presentación con ~200 diapositivas de
                animaciones profesionales hechas a mano (no es broma...) es mucho más visual y se
                entiende mejor. Me lo tomo tan innecesariamente en serio que si usas el buscador de
                este sitio para ver videos (o te vas a las listas de reproducción del canal en
                YouTube) verás que está agrupado por temporadas, las cuales mido precisamente en
                base a la calidad de producción (cada mejora significativa marca una nueva
                temporada).<br /><br />No es un canal activo, lo sé y lo siento. Teniendo estudios
                (que no tienen nada que ver con lo que enseño aquí) es difícil sacar tiempo o
                incluso encontrar la teoría (porque los libros de la ESO no se encuentran tan
                fácilmente). Eso no significa que el canal esté muerto o que nunca vaya a subir
                cosas; prometido. Al menos tienes esta web, que sí se actualiza frecuentemente.
            </p>
        </div>
    {:else}
        <div class="flex-1 bg-(--ZakaTeka) p-4">
            <p class="text-black">
                Acerca de <b>ZakaTeka, el que te enseña «teknología que entiendes»</b>. Sí,
                teknología escrito con K y no con C, es una <i>licencia artística</i> que me he
                otorgado a mi mismo (se llaman así, ¿no?).<br /><br />Ahora mismo estudio
                informática, es mi pasión y, aunque esté mal que yo lo diga, se me da bastante bien
                (solo observa la pedazo de página web profesional que estás viendo para un canal que
                ni 100 seguidores tiene...). Me encanta enseñar este tipo de cosas, sobre todo
                porque a cualquiera, vaya a trabajar de ello o no, le viene bien tener algo de
                cultura tecnológica en el mundo en el que vivimos (y no me vengas con que la IA va a
                reemplazar todo eso, que te digo yo que no).<br /><br /><b
                    >Este canal tiene videos para cualquier grado de informática (SMR, DAW, DAM o
                    ASIR)</b
                >, cosa que se dice muy rápido porque casi no tiene videos. Al estudiar yo mismo un
                grado de estos (SMR concretamente) estoy falto de tiempo y no he podido hacer tantos
                como quería cuando empecé a estudiar esto, pero llegarán las vacaciones y puedes
                esperarte entonces muchísimo contenido.<br /><br />En este canal no están esas
                «animaciones excepcionales» de ZakaProfe, la producción la hago con otro programa y
                es más sencilla (aunque estoy mejorando aquí también), me centro más en que se
                entienda y sea fácil de ver.
            </p>
        </div>
    {/if}
</section>
