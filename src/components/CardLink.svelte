<script lang="ts">
    import { goto } from "$app/navigation";

    export let title: string;
    export let body: string;
    export let target: string;
</script>

<a
    on:click={(e) => {
        e.preventDefault();
        goto(target);
    }}
    href={`https://profe.zhc.es/${target}`}
    class="no-underline!"
    {title}
>
    <div
        class="flex flex-col gap-4 border-2! border-(--fff25)! bg-(--blk) p-4! hover:bg-(--blk-hov)"
    >
        <div class="flex flex-row items-center gap-2">
            <slot name="svg" />
            <h3 class="text-xl leading-[100%]">{title}</h3>
        </div>
        <p>{body}</p>
    </div>
</a>
