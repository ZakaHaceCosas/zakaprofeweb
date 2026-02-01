<script lang="ts">
    import { normalize } from "strings-utils";
    import Textarea from "../../../components/Textarea.svelte";
    import Button from "../../../components/Button.svelte";
    import { onMount } from "svelte";

    let text = "";
    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/contador-palabras?txt=${encodeURIComponent(btoa(text))}`
        );
    }

    onMount(() => {
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const val = params.get("txt") ?? "";

        if (val === "") return;
        text = atob(decodeURIComponent(val));
    });

    export const prerender = true;
</script>

<svelte:head>
    <title>Contador de palabras</title>
    <meta name="description" content="Un contador de palabras, letras, y párrafos." />
</svelte:head>

<main>
    <h1>Contador de palabras (y de caracteres, y de párrafos...)</h1>
    <br />
    <p>
        Por algún motivo no todos los editores de documentos tienen un contador de palabras, dato
        que te interesará saber para entregar trabajos.<br /><br />Este contador mide palabras,
        caracteres, y párrafos por ti. Solo pega aquí tu texto (o empieza a escribir) y baja abajo
        del todo, se muestra al instante sin ningún clic.<br /><br />
    </p>

    <Textarea
        name="texto"
        value={text}
        oninput={(e) => {
            text = e.currentTarget.value;
            const newParams = `?txt=${encodeURIComponent(btoa(text))}`;
            history.replaceState(null, "", newParams);
        }}
        title="Pega o escribe aquí tu texto"
        required
        rows={15}
        channel="ZakaProfe"
    />

    <Button
        callback={share}
        channel="ZakaProfe"
        popovertarget="share-popover"
        title="Generar un enlace para compartir el resultado."><b>&nearr;</b> Compartir</Button
    >
    <div
        id="share-popover"
        class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4"
        popover
    >
        ¡Enlace copiado al portapapeles! Incluye todo el texto que tengas escrito aquí.
    </div>

    {#if text.trim() !== ""}
        <br />
        <h3 id="result" class="flex flex-row items-center gap-2">
            Esto tiene
            <span style="font-size: xx-large; font-weight: 700; color: var(--ZakaProfe);">
                {normalize(text).split(" ").length}
            </span>
            palabras
        </h3>
        {#if text.length > 2069}
            <br />
            <p style="opacity: 0.5;">(hostia que largo, ¿no?)</p>
        {/if}
        <br />
        <p>Además de eso, tiene:</p>
        <ul>
            <li><b>{normalize(text).length}</b> caracteres sin contar espacios redundantes</li>
            <li>
                <b>{normalize(text).replaceAll(" ", "").length}</b> caracteres sin contar espacios
            </li>
            <li><b>{text.length}</b> caracteres contando todo</li>
            <li><b>{text.split("\n\n").length}</b> párrafos</li>
            <li>
                <b>{text.split("\n").length}</b> párrafos usando un solo salto de línea (recuerda usar
                dos)
            </li>
            <li>
                <b>{(normalize(text).split(" ").length / 200).toFixed(2)} minutos</b> de lectura (aproximado,
                estimado para español promedio)
            </li>
        </ul>
    {/if}
</main>
