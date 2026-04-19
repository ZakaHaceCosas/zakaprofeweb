<script lang="ts">
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";

    const {
        id,
        title,
        children,
        buttonLabel,
    }: { id: string; title: string; children?: Snippet; buttonLabel: string } = $props();
</script>

<dialog
    class="animate-in fade-in zoom-in backdrop:animate-in backdrop:fade-in m-auto h-fit w-full max-w-xl border-2 border-(--fff25) bg-(--blk) p-0 text-(--txt) duration-200 backdrop:bg-black/75 backdrop:backdrop-blur-sm backdrop:duration-300 starting:scale-95 starting:opacity-0 backdrop:starting:opacity-0"
    {id}
>
    <div class="flex flex-col gap-1 overflow-hidden p-6">
        <h2 class="text-lg font-semibold">{title}</h2>
        <hr />
        {@render children?.()}
        <br />
        <Button
            title="Cerrar este modal."
            onclick={() => (document.getElementById(id) as HTMLDialogElement).close()}
            >{buttonLabel}</Button
        >
    </div>
</dialog>
