<script lang="ts">
    import { goto } from "$app/navigation";

    export let title: string;
    export let body: string;
    export let target: string;
    export let channel: "ZakaProfe" | "ZakaTeka";

    const className =
        "no-underline! group "
        + (channel === "ZakaProfe" ? "hover:text-(--ZakaProfe)" : "hover:text-(--ZakaTeka)");

    export const prerender = true;
</script>

<a
    on:click={(e) => {
        e.preventDefault();
        goto(target);
    }}
    href={`https://profe.zhc.es/${target}`}
    class={className}
    {title}
>
    <div
        class="flex flex-col gap-4 border-2! border-(--fff25)! bg-(--blk) p-4! group-hover:bg-(--blk-hov)"
    >
        <div class="flex flex-row items-center gap-2">
            <span
                class={channel === "ZakaProfe"
                    ? "group-hover:fill-(--ZakaProfe)!"
                    : "group-hover:fill-(--ZakaTeka)!"}
            >
                <slot name="svg" />
            </span>
            <h3 class="text-xl leading-[100%]">{title}</h3>
        </div>
        <p>{body}</p>
    </div>
</a>
