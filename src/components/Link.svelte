<script lang="ts">
    import type { Snippet } from "svelte";

    const {
        href,
        channel,
        tail = "",
        title,
        children,
    } = $props<{
        href: string | (() => any);
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
    href={typeof href === "string" ? href : undefined}
    onclick={typeof href === "function" ? href : undefined}
    class={className}
    target="_blank"
    rel="noopener noreferrer"
    {title}
    aria-label={title}
>
    {@render children?.()}
</a>
