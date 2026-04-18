<script lang="ts">
    import type { Param } from "@zpw/types/types";
    import Select from "../Select.svelte";
    import Input from "../Input.svelte";

    const {
        param,
        onchange,
        onkeydown,
        values,
    }: {
        param: Param & { id: string };
        onchange: (() => void) | undefined;
        onkeydown: ((e: KeyboardEvent) => void) | undefined;
        values: Record<string, string>;
    } = $props();
</script>

{#if param.type == "text"}<Input
        type="text"
        name={param.id}
        bind:value={values[param.key]}
        {onkeydown}
        title={param.title}
        required={param.req == undefined ? true : param.req}
        tail={param.tail}
    />{:else if param.type == "textarea"}{:else}
    <Select
        id={param.id}
        {onchange}
        tail={param.tail}
        title={param.title}
        options={param.options!}
        bind:value={values[param.key]}
        required={param.req == undefined ? true : param.req}
    />
{/if}
