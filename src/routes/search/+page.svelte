<script lang="ts">
    import Button from "../../components/Button.svelte";
    import Input from "../../components/Input.svelte";
    import { ZPVDs, ZTVDs, type IVideo } from "../../lib/db";
    import { validate, normalize, pluralOrNot, similarity } from "strings-utils";

    let search = $state("");
    let results: (IVideo & { similarity: number })[] = $state([]);

    $effect(() => {
        if (!validate(search) || search.length < 3) return;

        results = [...ZPVDs, ...ZTVDs]
            .map((v) => {
                const normalizedTitle = normalize(v.title, { strict: true });
                const normalizedSubject = normalize(v.subject, { strict: true });
                const normalizedLevel = normalize(v.level, { strict: true });

                const similarityScore = search
                    .toLowerCase()
                    .split(/\s+/)
                    .reduce((sum, word) => {
                        // no sé como coño hacer que esto filtre por asignaturas
                        // tipo que si contiene "mat", "mate" o cosas así no muestre cosas de física
                        // ya lo pensaré, TODO
                        const titleSim = similarity(normalizedTitle, word);
                        const subjectSim = similarity(normalizedSubject, word);
                        const levelSim = similarity(normalizedLevel, word);

                        return sum + titleSim + subjectSim + levelSim;
                    }, 0);

                return { ...v, similarity: (similarityScore * 100) / 3 };
            })
            .filter((v) => v && v.similarity > 0)
            .sort((a, b) => b!.similarity - a!.similarity);
    });
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
        required
        value={search}
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
            {pluralOrNot("Encontrado", results.length)} <b>{results.length}</b>
            {pluralOrNot("video", results.length)}.
        </p>
        <br />
        {#if results && results.length != 0}
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                {#each results as v (v.url)}
                    <div class="flex flex-col gap-3 border-2 border-(--fff25) bg-(--blk) p-3">
                        <img
                            class="pointer-events-none! aspect-video w-full border-2 border-(--fff25)"
                            src={v.thumbnail}
                            alt={`${v.title}, ${v.subject}, ${v.level}`}
                        />
                        <div class="flex flex-1 flex-col justify-between gap-2">
                            <div class="flex-10">
                                <h2>{v.title}</h2>
                                <p>
                                    {v.subject} · {v.level} · <b>S{v.season}</b>
                                </p>
                            </div>
                            <Button
                                channel={v.channel}
                                href={v.url}
                                title="Redirigir a YouTube para ver este video."
                                tail="h-auto mt-auto flex-1"
                            >
                                Ver en YouTube &gt;
                            </Button>
                            <p class="text-sm opacity-50">
                                <b>{v.duration}</b><br /><b>{v.seen}</b> visualizaciones y
                                <b>{v.likes}</b>
                                «me gusta»<br />Se parece en un <b>{v.similarity.toFixed(2)}</b>% a
                                lo que escribiste.
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
            <br />
            <p class="text-sm opacity-50">
                La S indica la temporada a la que pertenece el video; cada cambio significativo en
                la calidad de producción se sube el número, básicamente. Va desde el 0 (mis primeros
                videos) hasta el 4 (los más nuevos y mejores).
                <br /><br />
                Los datos de visitas y «me gusta» no son en tiempo real, se actualizan aproximadamente
                cada quince días (mucho tiempo para evitar consumo de red). Puedes ver lo más reciente
                en YouTube, aunque no suelen cambiar con frecuencia.
                <br /><br />
                Recuerda que, en todos videos, el porcentaje de espectadores que expresan su opinión suele
                ser bajo. 100 visitas y solo 15 «me gustas» no significan que a las otras 85 personas
                no les haya gustado el video, no suele ser así.
            </p>
        {:else}
            <p>Ningún resultado para <b>{search}</b>.</p>
        {/if}
    {:else}
        <br />
        <p>Escribe al menos 3 caracteres y buscará automáticamente.</p>
    {/if}
</main>
