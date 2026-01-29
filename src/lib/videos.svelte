<script lang="ts">
    import VideoCard from "../components/VideoCard.svelte";
    import { ZPVDs, ZTVDs, type IVideo } from "./db";

    let videos = $state<{ one: null | IVideo; two: null | IVideo }>({
        one: null,
        two: null,
    });

    let { branch } = $props();

    // svelte-ignore state_referenced_locally (false positive)
    const list = branch === "PROFE" ? ZPVDs : ZTVDs;

    $effect(() => {
        const randomIndex1 = Math.floor(Math.random() * list.length);
        let randomIndex2 = Math.floor(Math.random() * list.length);
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * list.length);
        }
        videos = {
            one: list[randomIndex1],
            two: list[randomIndex2],
        };
    });
</script>

<div class="grid grid-cols-2 gap-4">
    {#if videos.one}
        <VideoCard video={videos.one} />
    {/if}
    {#if videos.two}
        <VideoCard video={videos.two} />
    {/if}
</div>
