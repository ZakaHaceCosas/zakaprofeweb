<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Button from "./Button.svelte";
    import type { IVideo, PlayerStep } from "@zpw/types/types";
    import Input from "./Input.svelte";

    let {
        video,
        steps,
        intro,
    }: {
        video: IVideo & { id: string };
        steps: PlayerStep[];
        intro: number;
    } = $props();

    type Phase =
        | { name: "watching" }
        | { name: "activity"; stepIdx: number }
        | { name: "viewing_result"; stepIdx: number; hideAt: number; hidden: boolean }
        | { name: "done" };

    let phase = $state<Phase>({ name: "watching" });
    let nextStepIdx = $state(0);
    let canSkipIntro = $state(true);
    let jumpWarning = $state(false);
    let jumpWarningTimer: ReturnType<typeof setTimeout> | null = null;

    const responses = $state<Record<number, string>>(
        Object.fromEntries(steps.map((_, i) => [i, ""]))
    );

    let container: HTMLDivElement;
    let player: YT.Player;
    let interval: ReturnType<typeof setInterval>;
    let lastTime = 0;

    const currentStep = $derived(
        phase.name === "activity" || phase.name === "viewing_result" ? steps[phase.stepIdx] : null
    );

    onMount(() => {
        if (window.YT?.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
    });

    onDestroy(() => {
        clearInterval(interval);
        player?.destroy();
    });

    function initPlayer() {
        player = new YT.Player(container, {
            videoId: video.id,
            height: 620,
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    }

    function onPlayerReady() {
        lastTime = 0;
        interval = setInterval(tick, 1000);
    }

    function tick() {
        if (phase.name !== "watching" && phase.name !== "viewing_result") return;

        const time = player.getCurrentTime();
        // más de 3s de diferencia es seguramente salto manual
        if (time - lastTime > 3) {
            triggerJumpWarning();
            player.seekTo(lastTime, true);
            return; // no actualizar lastTime, esperar al siguiente tick
        }

        lastTime = time;

        if (phase.name === "viewing_result") {
            if (time >= phase.hideAt) {
                player.pauseVideo();
                phase = { ...phase, hidden: true };
            }
            return;
        }

        if (canSkipIntro && time >= intro) {
            canSkipIntro = false;
        }

        if (nextStepIdx < steps.length) {
            const next = steps[nextStepIdx];
            if (time >= next.timestamp) {
                player.pauseVideo();
                phase = { name: "activity", stepIdx: nextStepIdx };
                return;
            }
        }
    }

    function onPlayerStateChange(e: YT.OnStateChangeEvent) {
        if (e.data !== YT.PlayerState.PLAYING) return;

        if (phase.name === "activity") {
            player.pauseVideo();
            player.seekTo(lastTime, true);
        }
    }

    function completeStep() {
        if (phase.name !== "activity") return;

        const idx = phase.stepIdx;
        const action = steps[idx];

        nextStepIdx = idx + 1;

        if (action.type === "freestanding") {
            phase = { name: "viewing_result", stepIdx: idx, hideAt: action.hideAt, hidden: false };
            player.playVideo();
            lastTime = player.getCurrentTime();
        } else {
            if (nextStepIdx >= steps.length) {
                phase = { name: "done" };
            } else {
                phase = { name: "watching" };
            }
            player.playVideo();
            lastTime = player.getCurrentTime();
        }
    }

    function skipIntro() {
        lastTime = intro;
        player.seekTo(intro, true);
        canSkipIntro = false;
    }

    function triggerJumpWarning() {
        jumpWarning = true;
        if (jumpWarningTimer) clearTimeout(jumpWarningTimer);
        jumpWarningTimer = setTimeout(() => {
            jumpWarning = false;
            jumpWarningTimer = null;
        }, 8000);
    }
</script>

<div class="flex h-full w-full flex-col gap-2">
    {#if jumpWarning}
        <div class="flex flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4">
            <p>
                Adelantar el video puede causar «bugs» o fallos en el gestor de actividades.
                Abstente de hacerlo.
            </p>
        </div>
    {/if}
    <p class="text-red-400">
        <b
            >DEMO TÉCNICA - ESTO NO ESTÁ TERMINADO, ESPERE ERRORES Y FUNCIONES INCOMPLETAS O
            DIRECTAMENTE AUSENTES.</b
        >
    </p>
    <div class="flex max-h-2/4 flex-row gap-4">
        <div class="aspect-video" style="flex: 3" bind:this={container}></div>
        <div
            class="flex flex-1 flex-col items-start gap-3 border-2 border-(--fff25) bg-(--blk) p-4"
        >
            {#if phase.name === "activity" && currentStep}
                <div class="h-full w-full">
                    <h2>{currentStep.title}</h2>
                    <h3>{currentStep.desc}</h3>
                    <br />
                    {#if currentStep.type === "freestanding"}
                        <Input
                            type="text"
                            title="Escribe aquí una respuesta"
                            name={`${phase.stepIdx}-freestanding-input`}
                            bind:value={responses[phase.stepIdx]}
                            required
                        />
                        <p>Pregunta abierta. Pon lo que consideres.</p>
                    {:else if currentStep.type === "choose"}
                        <div class="grid grid-cols-2 grid-rows-2 gap-2">
                            {#each currentStep.options as opt, idx (idx)}
                                <Button
                                    title={`Elegir la opción «${opt.label}»`}
                                    onclick={() => {
                                        responses[phase.stepIdx] = opt.correct + opt.explanation;
                                    }}
                                >
                                    {opt.label}
                                </Button>
                            {/each}
                        </div>
                        {#if responses[phase.stepIdx]}
                            <br />
                            <p
                                class={responses[phase.stepIdx].startsWith("true")
                                    ? "text-(--accent)"
                                    : "text-red-500"}
                            >
                                <b
                                    >{responses[phase.stepIdx].startsWith("true")
                                        ? "Correcto :]"
                                        : "Incorrecto :["}</b
                                >
                                {responses[phase.stepIdx].replace("true", "").replace("false", "")}
                            </p>
                        {/if}
                    {:else if currentStep.type === "tof"}
                        <div class="grid grid-cols-2 grid-rows-1 gap-2">
                            <Button
                                title="Marcar que el enunciado es verdadero"
                                onclick={() => {
                                    responses[phase.stepIdx] = "1";
                                }}
                            >
                                Verdadero
                            </Button>
                            <Button
                                title="Marcar que el enunciado es false"
                                onclick={() => {
                                    responses[phase.stepIdx] = "0";
                                }}
                            >
                                Falso
                            </Button>
                        </div>
                        {#if responses[phase.stepIdx]}
                            <br />
                            <p
                                class={(responses[phase.stepIdx] == "1") == currentStep.answer
                                    ? "text-(--accent)"
                                    : "text-red-500"}
                            >
                                <b
                                    >{(responses[phase.stepIdx] == "1") == currentStep.answer
                                        ? "Correcto :]"
                                        : "Incorrecto :["}</b
                                >
                            </p>
                        {/if}
                    {:else if currentStep.type == "input"}
                        <Input
                            type="text"
                            title="Escribe aquí una respuesta"
                            name={`${phase.stepIdx}-fixed-input`}
                            bind:value={responses[phase.stepIdx]}
                            required
                        />
                        <p>¡Piensa bien!</p>
                    {:else}
                        <p class="text-sm opacity-50">
                            Esto solo es una anotación. En cuanto la guardes en tu cabeza, puedes
                            continuar sin más.
                        </p>
                    {/if}
                </div>
                {#if currentStep.type === "freestanding" || currentStep.type === "check" || (currentStep.type === "choose" && responses[phase.stepIdx].startsWith("true")) || (currentStep.type == "tof" && responses[phase.stepIdx] && (responses[phase.stepIdx] == "1") == currentStep.answer)}
                    <Button title="Siguiente paso" onclick={completeStep}>¡Sigamos!</Button>
                {/if}
                <!--TODO:continuar y validar tras input (no freestanding)-->
            {:else if phase.name === "viewing_result" && currentStep}
                {#if currentStep.type === "freestanding"}
                    <div class="h-full w-full">
                        <h2>¡Veamos si lo tienes bien!</h2>
                        <h3>Has respondido:</h3>
                        <p>{responses[phase.stepIdx]}</p>
                        <h3>Atiende al vídeo a ver si has acertado.</h3>
                    </div>
                    {#if phase.hidden}
                        <Button
                            title="Continuar"
                            onclick={() => {
                                phase = {
                                    name: "watching",
                                };
                                player.playVideo();
                            }}>Comprendido</Button
                        >
                    {/if}
                {/if}
            {:else if phase.name === "watching"}
                <div class="h-full w-full">
                    {#if nextStepIdx === 0}
                        <h2>¡Empecemos!</h2>
                        <br />
                        <p>
                            Vamos con <b>{video.title}</b>, de parte de {video.subject}. Tardaremos {video.duration}.
                        </p>
                        <br />
                        {#if canSkipIntro}
                            <h3>Dale al video para empezar.</h3>
                            <br />
                            <p>
                                <b>Si ya has visto el video previamente</b> (o, en general, si ya te
                                haces a la idea de lo que trata el tema),
                                <b>usa el botón de abajo para omitir la introducción.</b> Unos 30 segundos
                                más o menos que te ahorrarás con eso.
                            </p>
                        {/if}
                    {:else}
                        <h2>Sigamos</h2>
                        <h3>Continúa viendo el video. ¡Presta atención a todo!</h3>
                    {/if}
                </div>
                {#if canSkipIntro}
                    <Button title="Saltar intro" onclick={skipIntro}
                        >Omitir introducción al tema</Button
                    >
                {/if}
            {:else if phase.name === "done"}
                <div class="h-full w-full">
                    <h2>Acabaste toda la práctica. Enhorabuena.</h2>
                    <h3>Sigue viendo el video hasta el final.</h3>
                </div>
            {/if}
        </div>
    </div>
    <div class="flex flex-row items-center justify-center gap-2">
        <p class="whitespace-nowrap opacity-50">El video parará en los siguientes momentos</p>
        <hr />
        {#each steps as step, i (i)}
            <p class="whitespace-nowrap" style={i >= nextStepIdx ? "color: var(--accent);" : ""}>
                <b>{step.timestamp}"</b>{step.type == "freestanding" ? ` - ${step.hideAt}"` : ""}
            </p>
            <hr />
        {/each}
    </div>
</div>
