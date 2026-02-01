<script lang="ts">
    export let href: string | (() => any);
    export let channel: "ZakaProfe" | "ZakaTeka";
    export let tail: string = "";
    export let title: string;

    const className =
        "cursor-pointer text-(--txt) hover:underline group"
        + (channel === "ZakaProfe" ? " hover:text-(--ZakaProfe) " : " hover:text-(--ZakaTeka) ")
        + (channel === "ZakaProfe"
            ? " focus-visible:text-(--ZakaProfe) outline-(--ZakaProfe) "
            : " focus-visible:text-(--ZakaTeka)  outline-(--ZakaTeka) ")
        + tail;
</script>

<a
    href={typeof href === "string" ? href : undefined}
    on:click={typeof href === "function" ? href : undefined}
    class={className}
    target="_blank"
    rel="noopener noreferrer"
    {title}
    aria-label={title}
>
    <slot />
</a>
