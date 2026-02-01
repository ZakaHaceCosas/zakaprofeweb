<script lang="ts">
    import Button from "../../components/Button.svelte";
    import Input from "../../components/Input.svelte";
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

    export const prerender = true;
</script>

<svelte:head>
    <title>Buscador de vídeos</title>
</svelte:head>

<main>
    <h1>Buscador de vídeos</h1>
    <br />
    <p>
        Es más rápido que el propio buscador de YouTube y tiene enlace directo a cada video, por lo
        que te será útil.
    </p>
    <hr />
    <Input
        type="text"
        name="query"
        title="Busca un video..."
        oninput={(e) => {
            search = normalize(e.currentTarget.value, { strict: true });
        }}
        channel="ZakaProfe"
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
                <div
                    class="flex w-full flex-col items-start justify-start gap-3 border-2 border-(--fff25) bg-(--blk) p-3 sm:flex-row"
                >
                    <img
                        class="pointer-events-none! aspect-video w-full border-2 border-(--fff25) sm:max-w-60 lg:max-w-80"
                        src={v.thumbnail}
                        alt={`${v.title}, ${v.topic}, ${v.level}`}
                    />
                    <div class="flex flex-col gap-2">
                        <h2 class="text-3xl">{v.title}</h2>
                        <p>
                            {v.topic} · {v.level} · <b>S{v.season}</b>
                        </p>
                        <p class="text-sm opacity-50">
                            La S indica la temporada a la que pertenece el video; cada cambio
                            significativo en la calidad de producción se sube el número,
                            básicamente. Va desde el 0 (mis primeros videos) hasta el 4 (los más
                            nuevos).
                        </p>
                        <Button
                            channel={v.channel}
                            href={v.url}
                            title="Redirigir a YouTube para ver este video."
                            tail="w-auto mt-auto"
                        >
                            Ver en YouTube &gt;
                        </Button>
                    </div>
                </div>
                <br />
            {/each}
        {:else}
            <p>Ningún resultado para <b>{search}</b>.</p>
        {/if}
    {:else}
        <br />
        <p>Escribe al menos 3 caracteres y buscará automáticamente.</p>
    {/if}
</main>
