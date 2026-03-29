<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Snippet } from "svelte";

    let { title, body, target, channel, svg } = $props<{
        title: string;
        body: string;
        target: string;
        svg?: Snippet;
        channel: "ZakaProfe" | "ZakaTeka";
    }>();

    const className = $derived(
        "no-underline! group "
            + (channel === "ZakaProfe" ? "hover:text-(--ZakaProfe)" : "hover:text-(--ZakaTeka)")
    );
</script>

<a
    onclick={(e) => {
        e.preventDefault();
        goto(target);
    }}
    href={`https://profe.zhc.es/${target}`}
    class={className}
    {title}
>
    <div
        class="flex flex-col gap-2 border-2! border-(--fff25)! bg-(--blk) p-4! group-hover:bg-(--blk-hov)"
    >
        <div class="flex flex-row items-center gap-2">
            <span
                class={channel === "ZakaProfe"
                    ? "group-hover:fill-(--ZakaProfe)!"
                    : "group-hover:fill-(--ZakaTeka)!"}
            >
                {@render svg?.()}
            </span>
            <h3 class="leading-[100%]">{title}</h3>
        </div>
        <p>{body}</p>
    </div>
</a>
