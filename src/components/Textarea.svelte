<script lang="ts">
    let {
        oninput = undefined,
        onkeydown = undefined,
        channel,
        tail = "",
        title,
        rows = 10,
        name,
        value = $bindable(""),
        required = false,
        style = undefined,
        id = undefined,
        label = undefined,
    } = $props<{
        oninput?: (e: Event & { currentTarget: HTMLTextAreaElement }) => void;
        onkeydown?: (e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) => void;
        channel: "ZakaProfe" | "ZakaTeka";
        tail?: string;
        title: string;
        rows?: number;
        name: string;
        value?: string | number;
        required?: boolean;
        style?: string;
        id?: string;
        label?: string;
    }>();

    const className = $derived(
        `p-4 border-2 border-(--fff25) w-full text-(--txt) bg-(--blk) gap-3 ${
            channel === "ZakaProfe"
                ? "focus-visible:text-(--ZakaProfe) outline-(--ZakaProfe)"
                : "focus-visible:text-(--ZakaTeka) outline-(--ZakaTeka)"
        } ${tail}`
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
