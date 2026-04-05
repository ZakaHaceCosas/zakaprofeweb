<script lang="ts">
    import type { ChangeEventHandler, KeyboardEventHandler } from "svelte/elements";

    let {
        value = $bindable(""),
        id,
        title,
        onchange,
        onkeydown,
        options,
        channel,
        tail,
        disabled = false,
    } = $props<{
        value: string;
        id: string;
        title: string;
        onchange?: ChangeEventHandler<HTMLSelectElement>;
        onkeydown?: KeyboardEventHandler<HTMLSelectElement>;
        channel: "ZakaProfe" | "ZakaTeka";
        options: { value: string; label: string }[];
        tail?: string;
        disabled?: boolean;
    }>();

    const className = $derived(
        `font-mono border-2 border-(--fff25) w-full text-(--txt) bg-(--blk) ${
            channel === "ZakaProfe" ? "outline-(--ZakaProfe)" : "outline-(--ZakaTeka)"
        } ${tail} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
    );
</script>

<select
    class={className}
    name={id}
    {id}
    bind:value
    {onchange}
    {title}
    {disabled}
    required
    {onkeydown}
>
    <option value="" disabled>(Elige algo)</option>
    {#each options as opt, idx (idx)}
        <option value={opt.value}>{opt.label}</option>
    {/each}
</select>
