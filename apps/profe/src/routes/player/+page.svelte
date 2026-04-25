<script lang="ts">
    import { ZPVDs } from "$lib/db";
    import type { IVideo } from "@zpw/types/types";
    import Player from "@zpw/ui/Player";
    import { onMount } from "svelte";

    let loading = $state(true);
    let video = $state<IVideo | null>(null);
    onMount(() => {
        const id: string = new URLSearchParams(window.location.search).get("v") ?? "";
        if (id == "") {
            loading = false;
            return;
        }
        const v = ZPVDs.find((v) => v.id == id);
        if (!v) {
            loading = false;
            return;
        }
        video = { ...v, id };
        loading = false;
    });
</script>

<svelte:head>
    <title>{video?.title ?? "Cargando…"}</title>
</svelte:head>

{#if loading}
    <h1>Cargando ZPW-Player…</h1>
{:else if !video}
    <h1>No se ha detectado un video.</h1>
    <p>
        A no ser que hayas quitado manualmente el <code>?v=123…</code> de la URL (que es lo que identifica
        el video), esto es un fallo mío y deberías informarme para poder corregirlo.
    </p>
{:else if !video.player}
    <h1>El video «{video.title}» no es (aún) compatible.</h1>
    <p>
        A todos los videos se les tiene que, manualmente, añadir todos los datos para que la
        práctica guiada funcione. Esto requiere mucho tiempo y yo trabajo solo&hellip;<br />No todos
        los videos tienen esta función implementada todavía. La tendrá tan pronto como pueda, ¡lo
        siento!
    </p>
{:else}
    <Player intro={34} {video} />
{/if}
