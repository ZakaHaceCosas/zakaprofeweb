<script lang="ts">
    import { ZPVDs } from "$lib/db";
    import type { IVideo, PlayerStep } from "@zpw/types/types";
    import Player from "@zpw/ui/Player";
    import { onMount } from "svelte";

    let loading = $state(true);
    type LoadedVideo = IVideo & { id: string };
    let video = $state<LoadedVideo | null>(null);
    let steps = $state<PlayerStep[]>([
        {
            timestamp: 35,
            action: {
                title: "Foo",
                desc: "Bar",
                type: "check",
            },
        },
    ]);
    onMount(() => {
        const id = new URLSearchParams(window.location.search).get("v") ?? "";
        const v = ZPVDs.find((v) => v.url.endsWith(id));
        if (!v) {
            loading = false;
            return;
        }
        video = { ...v, id };
        loading = false;
    });
</script>

{#if loading}
    <h1>Cargando ZPW...</h1>
{:else if !video}
    <h1>No se ha detectado un video.</h1>
    <p>
        A no ser que hayas quitado manualmente el <code>?v=123...</code> de la URL (que es lo que identifica
        el video), esto es un fallo mío y deberías informarme para poder corregirlo.
    </p>
{:else}
    <Player intro={34} videoId={video.id} {steps} />
{/if}
