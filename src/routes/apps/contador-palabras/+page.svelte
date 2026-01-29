<script lang="ts">
    import { normalize } from "strings-utils";

    let text = "";

    export const prerender = true;
</script>

<svelte:head>
    <title>Calculadora de notas</title>
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

    <textarea
        name="texto"
        bind:value={text}
        on:input={(e) => (text = e.currentTarget.value)}
        placeholder="Pega aquí tu texto"
        required
        rows="15"
    ></textarea>

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
                <b>{normalize(text).split(" ").length / 200} minutos</b> de lectura (aproximado, estimado
                para español promedio)
            </li>
        </ul>
    {/if}
</main>
