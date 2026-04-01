<script lang="ts">
    import type { Snippet } from "svelte";
    import type { MouseEventHandler } from "svelte/elements";

    const {
        href,
        channel,
        tail = "",
        title,
        children,
    } = $props<{
        href: string | MouseEventHandler<HTMLAnchorElement>;
        channel: "ZakaProfe" | "ZakaTeka";
        tail?: string;
        title: string;
        children: Snippet;
    }>();

    const className = $derived(
        `cursor-pointer text-(--txt) hover:underline group ${channel === "ZakaProfe" ? "hover:text-(--ZakaProfe) focus-visible:text-(--ZakaProfe) outline-(--ZakaProfe)" : "hover:text-(--ZakaTeka) focus-visible:text-(--ZakaTeka) outline-(--ZakaTeka)"} ${tail}`
    );
</script>

<a
    // eslint-disable-next-line svelte/no-navigation-without-resolve
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
