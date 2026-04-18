<script lang="ts">
    let {
        oninput = undefined,
        onkeydown = undefined,
        tail = "",
        title,
        rows = 10,
        name,
        value = $bindable(""),
        required = false,
        style = undefined,
        id = undefined,
        label = undefined,
    }: {
        oninput?: (e: Event & { currentTarget: HTMLTextAreaElement }) => void;
        onkeydown?: (e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) => void;
        tail?: string;
        title: string;
        rows?: number;
        name: string;
        value?: string | number;
        required?: boolean;
        style?: string;
        id?: string;
        label?: string;
    } = $props();

    const className = $derived(
        `p-4 border-2 border-(--fff25) w-full text-(--txt) font-mono bg-(--blk) gap-3 outline-(--accent) ${tail}`
    );
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
        {oninput}
        {onkeydown}
        {rows}
    ></textarea>
</div>
