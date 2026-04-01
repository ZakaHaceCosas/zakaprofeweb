<script lang="ts">
    import { resolve } from "$app/paths";
    import type { Snippet } from "svelte";
    import type { MouseEventHandler } from "svelte/elements";

    let {
        href,
        onclick,
        channel,
        tail = "",
        popovertarget,
        title,
        disabled = false,
        children,
    } = $props<{
        href?: string;
        onclick?: MouseEventHandler<HTMLButtonElement>;
        channel: "ZakaProfe" | "ZakaTeka";
        tail?: string;
        popovertarget?: string;
        title: string;
        disabled?: boolean;
        children: Snippet;
    }>();

    const className = $derived(
        `flex-1 w-full p-4 cursor-pointer border-2 border-(--fff25) p-3 hover:bg-(--blk) focus-visible:bg-(--blk) no-underline text-center"
            ${channel === "ZakaProfe" ? "hover:text-(--ZakaProfe) bg-(--ZakaProfe) text-white focus-visible:text-(--ZakaProfe) outline-(--ZakaProfe)" : " bg-(--ZakaTeka) focus-visible:text-(--ZakaTeka)  outline-(--ZakaTeka) hover:text-(--ZakaTeka)  text-(--blk)"} ${tail}`
    );
</script>

{#if href}
    <a
        href={resolve(href)}
        class={className}
        target="_blank"
        rel="noopener noreferrer"
        {title}
        aria-label={title}
    >
        {@render children?.()}
    </a>
{:else}
    <button {onclick} class={className} {popovertarget} {title} aria-label={title} {disabled}>
        {@render children?.()}
    </button>
{/if}
