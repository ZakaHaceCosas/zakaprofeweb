<script lang="ts">
    import type { ChangeEventHandler, KeyboardEventHandler } from "svelte/elements";

    let {
        value = $bindable(""),
        id,
        title,
        onchange,
        onkeydown,
        options,
        tail,
        disabled = false,
        nullable = false,
    } = $props<{
        value: string;
        id: string;
        title: string;
        onchange?: ChangeEventHandler<HTMLSelectElement>;
        onkeydown?: KeyboardEventHandler<HTMLSelectElement>;
        options: { value: string; label: string }[];
        tail?: string;
        disabled?: boolean;
        nullable?: boolean;
    }>();

    const className = $derived(
        `font-mono border-2 border-(--fff25) w-full text-(--txt) bg-(--blk) outline-(--accent) ${tail} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
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
    {#if !nullable}<option value="" disabled>(Elige algo)</option>{/if}
    {#each options as opt, idx (idx)}
        <option value={opt.value}>{opt.label}</option>
    {/each}
</select>
