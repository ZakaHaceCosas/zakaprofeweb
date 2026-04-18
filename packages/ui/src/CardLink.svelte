<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        body,
        target,
        svg,
    }: {
        title: string;
        body: string;
        target: string;
        svg?: Snippet;
    } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href={target} class="group no-underline! hover:text-(--accent)" {title}>
    <div
        class="flex flex-col gap-2 border-2! border-(--fff25)! bg-(--blk) p-4! group-hover:bg-(--blk-hov)"
    >
        <div class="flex flex-row items-center gap-2">
            <span class="group-hover:fill-(--accent)!">
                {@render svg?.()}
            </span>
            <h3 class="leading-[100%]">{title}</h3>
        </div>
        <p>{body}</p>
    </div>
</a>
