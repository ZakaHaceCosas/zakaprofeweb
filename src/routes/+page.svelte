<svelte:options runes={true} />

<script lang="ts">
    import { ZPVDs, ZTVDs } from "$lib/db";
    import { onMount } from "svelte";
    import Link from "$lib/Link.svelte";
    import RandomVideoFeed from "$lib/VideoTuple.svelte";
    import ZakAvailable from "$lib/ZakAvailable.svelte";

    // eslint-disable no-unassigned-vars (sí se asigna con un bind: pero no me lo detecta)
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
    <title>ZakaProfe & ZakaTeka</title>
    <meta
        name="description"
        content="La web oficial de ZakaProfe y de ZakaTeka, dos canales de YouTube mediante los cuales doy clases :)."
    />
</svelte:head>

<h1>
    <b>
        <div
            class="relative hidden h-[1.2em] overflow-hidden align-bottom sm:inline-block"
            bind:this={container}
        >
            <div class="absolute block whitespace-nowrap text-(--ZakaProfe)" bind:this={words[0]}>
                Salvando tus notas
            </div>
            <div class="absolute block whitespace-nowrap" bind:this={words[1]}>
                Explicando en condiciones
            </div>
            <div class="absolute block whitespace-nowrap" bind:this={words[2]}>
                Dando clases que sí molan
            </div>
            <div class="absolute block whitespace-nowrap" bind:this={words[3]}>
                Ayudándote a aprobar
            </div>
        </div>
        <div class="sm:hidden">Salvando tus notas</div>
    </b> desde 2023.
</h1>
<br />
<p class="text-lg">
    ¡Hola! Soy <b>Zaka</b>ria, más conocido como ZakaProfe.<br /><br />
    He dedicado un par de años a hacer videos educativos explicando las cosas como realmente te gustaría,
    con calma y contenido visual en condiciones.<br /><br /><b
        >En esta página encontrarás cosas muy interesantes:</b
    >
    varias mini-aplicaciones que te pueden ayudar con cosas concretas, un buscador de videos que carga
    mucho más rápido que el de YouTube y en el futuro más cosas en las que estoy trabajando (más aplicaciones,
    algún programa de clases particulares, etcétera).<br /><span class="text-sm opacity-50"
        >(Y no, el mío no es un canal «muerto», vale que llevo la vida sin subir videos de
        ZakaProfe, pero porque <i>actualmente</i> no puedo; ya regresará vuestro canal favorito, confiad)</span
    >
</p>
<hr />
<h2>DESCUBRE LOS CANALES &gt;&gt;&gt;</h2>
<span class="text-sm opacity-75">(¡sí, canales en plural!)</span>
<br />
<p>Tienes dos canales de YouTube diferentes para explorar.</p>
<br />
<div class="flex flex-col gap-2 md:flex-row">
    <section class="flex-1" aria-labelledby="video-section-1">
        <h3 id="video-section-1">
            <span style="color: var(--ZakaProfe)">ZAKAPROFE</span> &gt;&gt;&gt;
        </h3>
        <p>El canal principal, y el que da nombre a este sitio.</p>
        <br />
        <div class="flex flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4">
            <h3>
                <b
                    >Videos para la <abbr title="Educación Secundaria Obligatoria">E.S.O.</abbr>,
                    varias asignaturas.</b
                >
            </h3>
            <p>
                Aquí se muestran dos videos elegidos al azar, puedes pulsarlos para verlos ahora si
                quieres.
            </p>
            <RandomVideoFeed branch="PROFE" />
            <Link
                href="https://www.youtube.com/@ZakaProfe/"
                title="Visita el canal de ZakaProfe en YouTube"
                channel="ZakaProfe"
            >
                Ver todos los videos ({ZPVDs.length}) en YouTube &gt;&gt;&gt;
            </Link>
        </div>
    </section>
    <section class="flex-1" aria-labelledby="video-section-2">
        <h3 id="video-section-2">
            <span style="color: var(--ZakaTeka)">ZAKATEKA</span> &gt;&gt;&gt;
        </h3>
        <p>Un nuevo miembro de la familia. Más de nicho.</p>
        <br />
        <div class="flex flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4">
            <h3>
                <b
                    >Videos para informáticos, asignaturas de <abbr
                        title="Formación Profesional de Grado Medio en Sistemas Microinformáticos y Redes"
                        >GM S.M.R.</abbr
                    ></b
                >
            </h3>
            <p>
                Aquí se muestran dos videos elegidos al azar, puedes pulsarlos para verlos ahora si
                quieres.
            </p>
            <RandomVideoFeed branch="TEKA" />
            <Link
                href="https://www.youtube.com/@ZakaTeka/"
                title="Visita el canal de ZakaTeka en YouTube"
                channel="ZakaTeka"
            >
                Ver todos los videos ({ZTVDs.length}) en YouTube &gt;&gt;&gt;
            </Link>
        </div>
    </section>
</div>
<br />
<details>
    <summary class="cursor-pointer bg-(--blk) p-2 hover:bg-(--blk-hov)"
        >Clic aquí para una descripción más extensa de cada canal, que dudo que te la leas, pero en
        algún lado tenía que ponerla.</summary
    ><br />
    <p>Demos algo de contexto, por si te apetece leer un poco:</p>
    <br />
    <div class="flex w-full flex-col gap-2 md:flex-row">
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
                temporada).<br /><br />Si vas a YouTube ahora, verás que la última subida fue hace
                muchos meses, lo sé y lo siento. Quienes me conocen en persona también me lo suelen
                comentar. <u>No</u>, no está abandonado o algo. Pasa que teniendo estudios que no
                tienen nada que ver, es difícil sacar tiempo o incluso encontrar la teoría (porque
                los libros de la ESO no se encuentran tan fácilmente). Tengo una pila de videos
                incompletos que nunca pude subir y de ideas que no llegué a empezar, y cuando sea el
                momento llegarán. Prometido. Al menos tienes esta web, esto sí que se actualiza
                frecuentemente.
            </p>
        </div>
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
    </div>
</details>
<hr />
<section aria-labelledby="contact-section" class="w-full">
    <h2 id="contact-section">CONTACTO &gt;&gt;&gt;</h2>
    <p>Te mereces poder preguntar directamente si no entiendes algo de un video.</p>
    <br />
    <ZakAvailable />
</section>
<!--<hr />
<section aria-labelledby="classes-section" class="w-full">
    <h2 id="classes-section">CLASES PARTICULARES &gt;&gt;&gt;</h2>
    <p>(Sección reservada para uso futuro.)</p>
    <br />
    <div class="flex flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4">
        <p>
            Clases particulares y personalizadas, por videollamada y con ejercicios prácticos. Son
            de pago, aunque puedes esperarte precios MUY bajos. (aún están por determinar).<br /><br
            />Como si de una página de cursos se tratase, habrá un catálogo de clases/temas
            concretos a elegir.<br /><br />Para esto aún queda mucho tiempo, puedes ignorarlo de
            momento.
        </p>
        <Bola color="mas-o-menos" text="Aún no disponibles" small="próximamente" />
    </div>
</section>
-->
