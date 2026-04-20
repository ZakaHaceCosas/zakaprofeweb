<script lang="ts">
    import { type ParameterForField, type ParameterValueObject } from "@zpw/types/types";
    import Select from "../Select.svelte";
    import Input from "../Input.svelte";
    import Textarea from "../Textarea.svelte";

    const {
        param,
        onchange,
        onkeydown,
        values,
    }: {
        param: ParameterForField;
        onchange: (() => void) | undefined;
        onkeydown: ((e: KeyboardEvent) => void) | undefined;
        values: ParameterValueObject;
    } = $props();
</script>

{#if typeof values[param.key] == "string"}
    {#if param.type == "text"}
        <Input
            type="text"
            name={param.id}
            bind:value={values[param.key] as string}
            {onkeydown}
            title={param.title}
            required={param.req == undefined ? true : param.req}
            tail={param.tail}
        />
    {:else if param.type == "textarea"}
        <Textarea
            title={param.title}
            required={param.req == undefined ? true : param.req}
            name={param.id}
            bind:value={values[param.key] as string}
        />
    {:else}
        <Select
            id={param.id}
            {onchange}
            tail={param.tail}
            title={param.title}
            options={param.options!}
            bind:value={values[param.key] as string}
            required={param.req == undefined ? true : param.req}
        />
    {/if}
{:else}{/if}
