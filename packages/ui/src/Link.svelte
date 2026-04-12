<script lang="ts">
    /* eslint-disable svelte/no-navigation-without-resolve */
    import type { Snippet } from "svelte";
    import type { MouseEventHandler } from "svelte/elements";

    const {
        href,
        tail = "",
        title,
        children,
    } = $props<{
        href: string | MouseEventHandler<HTMLAnchorElement>;
        tail?: string;
        title: string;
        children: Snippet;
    }>();

    const className = $derived(
        `cursor-pointer text-(--txt) hover:underline group hover:text-(--accent) focus-visible:text-(--accent) outline-(--accent) ${tail}`
    );
</script>

<a
    href={typeof href === "string" ? href : undefined}
    onclick={typeof href === "string" ? undefined : href}
    class={className}
    target="_blank"
    rel="noopener noreferrer"
    {title}
    aria-label={title}
>
    {@render children?.()}
</a>
