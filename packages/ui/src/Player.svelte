<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Button from "./Button.svelte";
    import type { PlayerStep } from "@zpw/types/types";

    let {
        videoId,
        steps,
        intro,
    }: {
        videoId: string;
        steps: PlayerStep[];
        intro: number;
    } = $props();

    let container: HTMLDivElement;
    let player: YT.Player;
    let done: number[] = $state([]);
    let nextDone: number = $state(0);

    onMount(() => {
        if (window.YT) {
            initPlayer();
            return;
        }

        window.onYouTubeIframeAPIReady = initPlayer;

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    });

    onDestroy(() => {
        clearInterval(interval);
        player?.destroy();
    });

    let interval: ReturnType<typeof setInterval>;
    let isDoingStuff: boolean = $state(false);
    let lastTime = $state(0);
    let jumped = $state(false);
    let canSkipIntro = $state(true);

    function initPlayer() {
        player = new YT.Player(container, {
            videoId,
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    }

    function onPlayerReady() {
        interval = setInterval(() => {
            const time = player.getCurrentTime();
            // más de 3s de diferencia es seguramente salto manual
            if (time - lastTime > 3) {
                jumped = true;
                player.seekTo(lastTime, true);
                setTimeout(() => (jumped = false), 15000);
            } else {
                lastTime = time;
            }
            if (time > intro && canSkipIntro) canSkipIntro = false;
            const nextStep = steps[nextDone];
            if (nextStep && time >= nextStep.timestamp && !isDoingStuff) {
                player.pauseVideo();
                isDoingStuff = true;
            }
        }, 1000);
    }

    function onPlayerStateChange(e: YT.OnStateChangeEvent) {
        if (e.data === YT.PlayerState.PLAYING && isDoingStuff) {
            player.pauseVideo();
            player.seekTo(lastTime, true);
        }
    }

    function unlockNext() {
        done = [...done, nextDone];
        nextDone++;
        isDoingStuff = false;
        player.playVideo();
    }

    function skipIntro() {
        lastTime = intro;
        player.seekTo(intro, true);
    }
</script>

{#if jumped}
    <div
        class="fixed right-1/24 bottom-12 flex flex-1 flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4"
    >
        <p>
            Nota: Adelantar el video puede causar «bugs» o fallos en el gestor de actividades.
            Abstente de hacerlo.
        </p>
    </div>
{/if}
<div class="flex h-full w-full flex-row gap-4">
    <div class="aspect-video h-full" style="flex: 3" bind:this={container}></div>
    <div class="flex flex-1 flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4">
        {#if isDoingStuff}
            <Button title="Siguiente paso" onclick={unlockNext}>Listo</Button>
        {:else}
            <div class="h-full"><h3>{nextDone == 0 ? "¡Empecemos!" : "Sigue mirando"}</h3></div>
            {#if canSkipIntro}
                <Button title="Saltar intro" onclick={skipIntro}>¿Saltarte la intro?</Button>
            {/if}
        {/if}
    </div>
</div>
