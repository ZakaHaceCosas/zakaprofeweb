<script lang="ts">
    import VideoCard from "./VideoCard.svelte";
    import { type IVideo } from "@zpw/types/types";
    import { SvelteSet } from "svelte/reactivity";

    let videos = $state<IVideo[]>([]);

    let { list } = $props<{ list: IVideo[] }>();

    $effect(() => {
        if (list.length < 4) return;
        const indices = new SvelteSet<number>();
        while (indices.size < 4) {
            indices.add(Math.floor(Math.random() * list.length));
        }
        videos = [...indices].map((i) => list[i]);
    });
</script>

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
    {#each videos as video, idx (idx)}
        <VideoCard {video} />
    {/each}
</div>
