<script lang="ts">
    import Button from "@zpw/ui/Button";
    import Input from "@zpw/ui/Input";
    import Select from "@zpw/ui/Select";
    import type { IVideo } from "@zpw/types/types";
    import { ZP_SUBJECTS, ZT_SUBJECTS, ZP_COURSES, ZT_COURSES } from "@zpw/types/types";
    import { normalize, pluralOrNot, similarity } from "@zhc.js/string-utils";

    type SIVideo = IVideo & { similarity: number };
    let search = $state("");
    let selectedSubject = $state<string | "">("");
    let selectedCourse = $state<string | "">("");
    let results: SIVideo[] = $state([]);
    const { videos, channel } = $props<{ videos: IVideo[]; channel: "ZakaProfe" | "ZakaTeka" }>();

    const [SUBJECTS, COURSES] = $derived(
        channel === "ZakaProfe" ? [ZP_SUBJECTS, ZP_COURSES] : [ZT_SUBJECTS, ZT_COURSES]
    );

    $effect(() => {
        const query = normalize(search.trim(), { keepSpaces: true });
        const words = query.split(/\s+/).filter((w) => w.length > 0);
        const hasQuery = words.length > 0 && search.length >= 3;

        results = videos
            .filter((v: IVideo) => {
                if (selectedSubject && v.subject !== selectedSubject) return false;
                if (selectedCourse && v.level !== selectedCourse) return false;
                return true;
            })
            .map((v: IVideo) => {
                if (!hasQuery) return { ...v, similarity: 1 };

                const titleTokens = normalize(v.title, { keepSpaces: true })
                    .split(/\s+/)
                    .filter((t) => t.length > 0);

                const score =
                    words.reduce((sum, word) => {
                        const best = Math.max(
                            ...titleTokens.map((token) => {
                                if (token === word) return 1;
                                if (token.includes(word) || word.includes(token)) return 0.9;
                                return similarity(token, word);
                            })
                        );
                        return sum + best;
                    }, 0) / words.length;

                return { ...v, similarity: score * 100 };
            })
            .filter((v: SIVideo) => !hasQuery || v.similarity > 40)
            .sort((a: SIVideo, b: SIVideo) => b.similarity - a.similarity);
    });
</script>

<svelte:head>
    <title>Buscador de vídeos</title>
</svelte:head>

<h1>Buscador de vídeos</h1>
<br />
<p>
    Es más rápido que el propio buscador de YouTube y tiene enlace directo a cada video, por lo que
    te será útil.
</p>
<hr />
<div class="flex w-full flex-col gap-2 md:flex-row">
    <Select
        bind:value={selectedSubject}
        nullable
        options={[
            { value: "", label: "Todas las asignaturas" },
            ...SUBJECTS.map((c) => {
                return { value: c, label: c };
            }),
        ]}
        title="Elige una asignatura"
        id="asig-select"
    />

    <Select
        bind:value={selectedCourse}
        nullable
        options={[
            { value: "", label: "Todos los cursos" },
            ...COURSES.map((c) => {
                return { value: c, label: c };
            }),
        ]}
        title="Elige un curso"
        id="course-select"
    />

    <Input
        required
        bind:value={search}
        type="text"
        name="query"
        title="Busca por título del video..."
    />
</div>

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
                                {v.subject} · {v.level} · {v.duration} · <b>S{v.season}</b>
                            </p>
                        </div>
                        <Button
                            href={v.url}
                            title="Redirigir a YouTube para ver este video."
                            tail="h-auto mt-auto flex-1"
                        >
                            Ver en YouTube &gt;&gt;&gt;
                        </Button>
                        <p class="text-sm opacity-50">
                            <b>{v.seen}</b> vistas, <b>{v.likes}</b>
                            «me gusta». Coincide un <b>{v.similarity.toFixed(2)}</b>%.
                        </p>
                    </div>
                </div>
            {/each}
        </div>
        <br />
        <p class="text-sm opacity-50">
            La S indica la temporada a la que pertenece el video; cada cambio significativo en la
            calidad de producción se sube el número, básicamente. Va desde el 0 (mis primeros
            videos) hasta el 5 (los más nuevos y mejores).
            <br /><br />
            Los datos de visitas y «me gusta» no son en tiempo real, se actualizan cada cierto tiempo
            para evitar consumo de red. Puedes ver lo más reciente en YouTube, aunque no suelen cambiar
            con frecuencia.
            <br />
            Recuerda que, en todos videos, el porcentaje de espectadores que expresan su opinión suele
            ser bajo. 100 visitas y solo 15 «me gustas» no significan que a las otras 85 personas no les
            haya gustado el video, no suele ser así.
        </p>
    {:else}
        <p>Ningún resultado para <b>{search}</b>.</p>
    {/if}
{:else}
    <br />
    <p>Escribe al menos 3 caracteres y buscará automáticamente.</p>
{/if}
