<script lang="ts">
    import type { Param } from "@zpw/types/types";
    import Select from "../Select.svelte";
    import * as s from "@zhc.js/string-utils";
    import Input from "../Input.svelte";

    const { param, onchange, onkeydown, values } = $props<{
        param: Param;
        onchange: (() => void) | undefined;
        onkeydown: (() => void) | undefined;
        values: Record<string, string>;
    }>();

    const id = $derived(s.toKebabCase(s.splitCamelOrPascalCase(param.key).join(" ")));
</script>

{#if param.type == "text"}<Input
        type="text"
        name={id}
        bind:value={values[param.key]}
        {onkeydown}
        title={param.title}
        required={param.req == undefined ? true : param.req}
        tail={param.tail}
    />{:else if param.type == "textarea"}{:else}
    <Select
        {id}
        {onchange}
        tail={param.tail}
        title={param.title}
        options={param.options}
        bind:value={values[param.key]}
        required={param.req == undefined ? true : param.req}
    />
{/if}
