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
            timestamp: 37,
            action: {
                title: "Check de ejemplo",
                desc: "Los checks son sencillamente pausas para mostrar algo que el estudiante debería leer.",
                type: "check",
            },
        },
        {
            timestamp: 45,
            action: {
                title: "Responde",
                desc: "¿Qué crees que es?",
                type: "freestanding",
                hideAt: 52,
            },
        },
        {
            timestamp: 77,
            action: {
                title: "¿Cuál NO es parte de un estudio?",
                desc: "Elige la opción correspondiente",
                type: "choose",
                options: [
                    {
                        label: "Población",
                        correct: false,
                        explanation: "La población sí es parte de un estudio.",
                    },
                    {
                        label: "Muestra",
                        correct: false,
                        explanation: "La muestra sí es parte de un estudio.",
                    },
                    {
                        label: "Juan Manuel Moreno Bonilla presidente de la Junta de Andalucía",
                        correct: true,
                        explanation:
                            "Juan Manuel Moreno Bonilla presidente de la Junta de Andalucía NO es parte de un estudio estadístico. Es un personaje público que nada que ver.",
                    },
                    {
                        label: "Variable",
                        correct: false,
                        explanation: "La variable sí es parte de un estudio.",
                    },
                ],
            },
        },
    ]);
    onMount(() => {
        const id = new URLSearchParams(window.location.search).get("v") ?? "";
        if (id == "") {
            loading = false;
            return;
        }
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
    <Player intro={34} {video} {steps} />
{/if}
