<script lang="ts">
    export let href: string | undefined = undefined;
    export let callback: (() => any) | undefined = undefined;
    export let channel: "ZakaProfe" | "ZakaTeka";
    export let popovertarget: string | undefined = undefined;
    export let tail: string = "";
    export let title: string;

    const className =
        "flex-1 w-full p-4 cursor-pointer border-2 border-(--fff25) p-3 hover:bg-(--blk) focus-visible:bg-(--blk) no-underline text-center"
        + (channel === "ZakaProfe" ? " bg-(--ZakaProfe) " : " bg-(--ZakaTeka) ")
        + (channel === "ZakaProfe" ? " hover:text-(--ZakaProfe) " : " hover:text-(--ZakaTeka) ")
        + (channel === "ZakaProfe"
            ? " focus-visible:text-(--ZakaProfe) outline-(--ZakaProfe) "
            : " focus-visible:text-(--ZakaTeka)  outline-(--ZakaTeka) ")
        + (channel === "ZakaProfe" ? " text-white " : " text-(--blk) ")
        + tail;
</script>

{#if href}
    <a
        {href}
        class={className}
        target="_blank"
        rel="noopener noreferrer"
        {title}
        aria-label={title}
    >
        <slot />
    </a>
{:else}
    <button on:click={callback} class={className} {popovertarget} {title} aria-label={title}>
        <slot />
    </button>
{/if}
