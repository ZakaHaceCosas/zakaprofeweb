<script lang="ts">
    export let oninput: ((e: Event & { currentTarget: HTMLTextAreaElement }) => void) | undefined =
        undefined;
    export let onkeydown:
        | ((e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) => void)
        | undefined = undefined;

    export let channel: "ZakaProfe" | "ZakaTeka";
    export let tail: string = "";
    export let title: string;
    export let rows: number = 10;
    export let name: string;
    export let value: string | number = "";
    export let required: boolean = false;
    export let style: string | undefined = undefined;
    export let id: string | undefined = undefined;
    export let label: string | undefined = undefined;

    const className =
        "p-4 border-2 border-(--fff25) w-full text-(--txt) bg-(--blk) gap-3 "
        + (channel === "ZakaProfe"
            ? " focus-visible:text-(--ZakaProfe) outline-(--ZakaProfe) "
            : " focus-visible:text-(--ZakaTeka)  outline-(--ZakaTeka) ")
        + tail;
</script>

<div class="w-full">
    {#if label}
        <label class="mb-2 text-sm opacity-50" for={name}>{label}</label>
        <br />
    {/if}
    <textarea
        {style}
        class={className}
        {id}
        {title}
        {name}
        aria-label={title}
        bind:value
        placeholder={title}
        {required}
        on:input={oninput}
        on:keydown={onkeydown}
        {rows}
    ></textarea>
</div>
