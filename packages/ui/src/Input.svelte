<script lang="ts">
    let {
        oninput,
        onkeydown,
        tail = "",
        title,
        type,
        name,
        value = $bindable(""),
        required = false,
        pattern,
        inputmode,
        style,
        id,
        label,
        disabled,
    }: {
        oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
        onkeydown?: (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => void;
        tail?: string;
        title: string;
        type: string;
        name: string;
        value: string | number;
        required: boolean;
        pattern?: string;
        inputmode?: "numeric";
        style?: string;
        id?: string;
        label?: string;
        disabled?: boolean;
    } = $props();

    const className = $derived(
        `font-mono p-4 border-2 border-(--fff25) w-full text-(--txt) bg-(--blk) outline-(--accent) ${tail} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
    );
</script>

<div class="w-full">
    {#if label}
        <label class="mb-2 text-sm opacity-50" for={name}>{label}</label>
        <br />
    {/if}
    <input
        {type}
        {style}
        class={className}
        {pattern}
        {id}
        {title}
        {name}
        {inputmode}
        aria-label={title}
        bind:value
        placeholder={title}
        {required}
        {oninput}
        {onkeydown}
        {disabled}
    />
</div>
