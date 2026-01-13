<script lang="ts">
    import { ALL_VDs, type IVideo } from "../../lib/db";
    import { validate, normalize, pluralOrNot, similarity } from "strings-utils";

    let search = $state("");
    let results: IVideo[] = $state([]);

    $effect(() => {
        if (!validate(search) || search.length < 3) return;

        results = ALL_VDs.filter(
            (v) =>
                normalize(v.title, { strict: true }).includes(search)
                || normalize(v.topic, { strict: true }).includes(search)
                || normalize(v.level, { strict: true }).includes(search)
        ).sort((a, b) => similarity(a.title, search) - similarity(b.title, search));
    });
</script>

<main>
    <h1>Buscador de vídeos</h1>
    <br />
    <p>
        Es más rápido que el propio buscador de YouTube y tiene enlace directo a cada video, por lo
        que te será útil.
    </p>
    <hr />
    <input
        type="text"
        placeholder="Busca un video..."
        onchange={(e) => {
            search = normalize(e.currentTarget.value, { strict: true });
        }}
        aria-label="Buscar videos"
    />

    {#if search.length > 2}
        <br />
        <p class="disclaimer" aria-live="polite">
            {pluralOrNot("Encontrado", results.length)}{" "}
            <b>{results.length}</b>{" "}
            {pluralOrNot("video", results.length)}.
        </p>
        <br />
        {#if results && results.length != 0}
            {#each results as v}
                <div class="result">
                    <img src={v.thumbnail} alt={`${v.title}, ${v.topic}, ${v.level}`} />
                    <div class="result-content">
                        <h2 class="text-3xl">{v.title}</h2>
                        <hr style="margin: 0px;" />
                        <p class="disclaimer">
                            {v.topic} · {v.level} ·
                            <span
                                title="La S indica la temporada a la que pertenece el video; cada cambio significativo en la calidad de producción se sube el número, básicamente. Siendo 0 mis primeros videos y 4 los más nuevos."
                                >S{v.season}</span
                            ><br />Parecido a lo que has buscado en un {(
                                similarity(v.title, search) * 100
                            ).toPrecision(4)}%.
                        </p>
                        <a
                            class={v.channel === "ZakaTeka" ? "btn-zt" : "btn"}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver en YouTube &gt;
                        </a>
                    </div>
                </div>
                <br />
            {/each}
        {:else}
            <p>Ningún resultado para <b>{search}</b>.</p>
        {/if}
    {:else}
        <br />
        <p>Escribe al menos 3 caracteres y dale a ENTER para buscar.</p>
    {/if}
</main>
