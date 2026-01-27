<script lang="ts">
    export let href: string | undefined = undefined;
    export let callback: (() => any) | undefined = undefined;
    export let channel: "ZakaProfe" | "ZakaTeka";
    export let popovertarget: string | undefined = undefined;
    export let tail: string = "";

    const className =
        "flex-1 w-full p-4 cursor-pointer border-2 border-(--fff25) hover:bg-(--blk) focus-visible:bg-(--blk)"
        + (channel === "ZakaProfe" ? " bg-(--ZakaProfe) " : " bg-(--ZakaTeka) ")
        + (channel === "ZakaProfe" ? " hover:text-(--ZakaProfe) " : " hover:text-(--ZakaTeka) ")
        + (channel === "ZakaProfe"
            ? " focus-visible:text-(--ZakaProfe) "
            : " focus-visible:text-(--ZakaTeka) ")
        + (channel === "ZakaProfe" ? " text-white " : " text-(--blk) ")
        + tail;
</script>

{#if href}
    <a {href} class={className} target="_blank" rel="noopener noreferrer">
        <slot />
    </a>
{:else}
    <button on:click={callback} class={className} {popovertarget}>
        <slot />
    </button>
{/if}
