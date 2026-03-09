<script lang="ts">
    export let checked: boolean;
    export let onchange: (
        e: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => void;
    export let onkeydown: (
        e: KeyboardEvent & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => void;
    export let id: string;
    export let children;
    export let tail: string | undefined = undefined;

    const className = "flex flex-row gap-2 " + tail;
</script>

<div class={className}>
    <input type="checkbox" name={id} {id} bind:checked {onchange} {onkeydown} />
    <label class="whitespace-nowrap" for={id}>{@render children?.()}</label>
</div>
