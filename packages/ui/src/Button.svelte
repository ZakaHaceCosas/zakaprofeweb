<script lang="ts">
    /* eslint-disable svelte/no-navigation-without-resolve */
    import type { Snippet } from "svelte";
    import type { MouseEventHandler } from "svelte/elements";

    let {
        href,
        onclick,
        tail = "",
        popovertarget,
        title,
        disabled = false,
        children,
    } = $props<{
        href?: string;
        onclick?: MouseEventHandler<HTMLButtonElement>;
        tail?: string;
        popovertarget?: string;
        title: string;
        disabled?: boolean;
        children: Snippet;
    }>();

    const className = $derived(
        `flex-1 w-full p-4 cursor-pointer border-2 border-(--fff25) p-3 hover:bg-(--blk) focus-visible:bg-(--blk) no-underline text-center hover:text-(--accent) bg-(--accent) text-(--acc-txt) focus-visible:text-(--accent) outline-(--accent) ${tail}`
    );
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
        {@render children?.()}
    </a>
{:else}
    <button {onclick} class={className} {popovertarget} {title} aria-label={title} {disabled}>
        {@render children?.()}
    </button>
{/if}
