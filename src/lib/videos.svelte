<script lang="ts">
    import { ZPVDs, ZTVDs, type IVideo } from "./db";
    import ExternalLink from "./ext.svelte";

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

<div class="randoms">
    {#if videos.one}
        <ExternalLink url={videos.one.url}>
            <div class="video">
                <img src={videos.one.thumbnail} alt={videos.one.title} />
                <div class="overlay">
                    <p>
                        <b>{videos.one.title}</b> &gt;&gt;&gt;
                    </p>
                </div>
            </div>
        </ExternalLink>
    {/if}
    {#if videos.two}
        <ExternalLink url={videos.two.url}>
            <div class="video">
                <img src={videos.two.thumbnail} alt={videos.two.title} />
                <div class="overlay">
                    <p>
                        <b>{videos.two.title}</b> &gt;&gt;&gt;
                    </p>
                </div>
            </div>
        </ExternalLink>
    {/if}
</div>
