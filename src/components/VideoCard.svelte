<script lang="ts">
    import type { IVideo } from "$lib/db";
    import Link from "./Link.svelte";

    export let video: IVideo;
</script>

<Link
    href={video.url}
    channel="ZakaProfe"
    tail="text-white!"
    title={"Ver " + video.title + " en YouTube"}
>
    <div
        class="group relative flex aspect-video w-full flex-1 flex-col overflow-hidden border-2 border-(--fff25)"
    >
        <img class="pointer-events-none!" src={video.thumbnail} alt={video.title} />
        <div
            class="absolute flex aspect-video w-full items-center justify-center bg-(--overlay) p-4 text-center opacity-0 group-hover:opacity-100"
        >
            <p class="text-white">
                <b>{video.title}</b> &gt;&gt;&gt;
            </p>
        </div>
    </div>
</Link>
