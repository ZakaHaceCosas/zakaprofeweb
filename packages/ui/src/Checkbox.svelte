<script lang="ts">
    import type { Snippet } from "svelte";

    let { checked, onchange, onkeydown, id, children, tail } = $props<{
        checked: boolean;
        onchange: (
            e: Event & {
                currentTarget: EventTarget & HTMLInputElement;
            }
        ) => void;
        onkeydown: (
            e: KeyboardEvent & {
                currentTarget: EventTarget & HTMLInputElement;
            }
        ) => void;
        id: string;
        children: Snippet;
        tail?: string;
    }>();

    const className = $derived("flex flex-row gap-2 " + tail);
</script>

<div class={className}>
    <input type="checkbox" name={id} {id} bind:checked {onchange} {onkeydown} />
    <label class="whitespace-nowrap" for={id}>{@render children?.()}</label>
</div>
