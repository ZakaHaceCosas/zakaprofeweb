<script lang="ts">
    import type { ParameterForField, ParameterValue, ParameterValueObject } from "@zpw/types/types";
    import Field from "./Field.svelte";
    import Button from "../Button.svelte";
    import Input from "../Input.svelte";

    const {
        param,
        paramList,
        calculate,
        values,
        i,
    }: {
        paramList?: ParameterForField[];
        param: ParameterForField;
        calculate: (throws: boolean) => void;
        values: ParameterValueObject;
        i?: number;
    } = $props();

    const onchange = $derived(
        param.onchange == "none" ? undefined : () => calculate(param.onchange == "calc")
    );
    const onkeydown = $derived(
        paramList && i
            ? (e: KeyboardEvent) => {
                  if (param.onenter == "none") return;
                  if (e.key !== "Enter") return;
                  if (e.shiftKey) calculate(param.onchange == "calc");
                  else {
                      document.getElementById(paramList[i + 1].id)?.focus();
                  }
              }
            : () => {}
    );

    let list: string[] | [string, string][] | null = $state(
        // svelte-ignore state_referenced_locally
        param.list
            ? param.list.pairs
                ? ((values[param.key] as [string, string][]) ?? [["", ""]])
                : ((values[param.key] as string[]) ?? [""])
            : null
    );

    $effect(() => {
        if (list !== null) {
            values[param.key] = list as ParameterValue;
        }
    });

    function handleInputChange(index: number, value: string, field?: number) {
        if (!list) return;
        const newList = [...list] as [string, string][];
        if (field !== undefined) {
            newList[index] =
                field === 0
                    ? [value, (list[index] as [string, string])[1]]
                    : [(list[index] as [string, string])[0], value];
        } else {
            (newList[index] as any) = value;
        }
        list = newList;
    }

    function addField() {
        if (!list) return;
        list = [...list, param.list && param.list.pairs ? ["", ""] : ""] as any;
    }

    function deleteField(index: number) {
        if (!list) return;
        if (!list[index]) return;
        list.splice(index, 1);
        list = [...list] as any;
    }
</script>

{#if !param.list}
    <Field {param} {onchange} {onkeydown} {values} />
{:else if param.list.pairs}
    <div class="flex w-full flex-col gap-2">
        {#each list as li, index (index)}
            <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
                <code class="font-mono!">#{index}</code>

                <Input
                    type="string"
                    value={li[0]}
                    oninput={(e) => handleInputChange(index, e.currentTarget.value, 0)}
                    title={param.list.title[0]}
                    required
                    id={`${param.id}_i${index}_v0`}
                    tail="w-full! flex-1 md:flex-3"
                    onkeydown={(e) => {
                        if (e.key !== "Enter") return;
                        if (e.shiftKey) calculate(param.onchange == "calc");
                        else {
                            setTimeout(() => {
                                document.getElementById(`${param.id}_i${index}_v1`)?.focus();
                            }, 100);
                        }
                    }}
                />
                <Input
                    tail="w-full flex-1"
                    type="string"
                    value={li[1]}
                    id={`${param.id}_i${index}_v1`}
                    oninput={(e) => handleInputChange(index, e.currentTarget.value, 1)}
                    title={param.list.title[1]}
                    required
                    onkeydown={(e) => {
                        if (e.key !== "Enter") return;
                        if (e.shiftKey) calculate(param.onchange == "calc");
                        else {
                            if (index + 1 == list!.length) addField();
                            setTimeout(() => {
                                document.getElementById(`${param.id}_i${index + 1}_v0`)?.focus();
                            }, 100);
                        }
                    }}
                />

                <Button
                    title="Eliminar pareja de datos {index + 1}"
                    tail="md:w-inherit! w-auto!"
                    onclick={() => deleteField(index)}>Eliminar</Button
                >
                {#if index == 0}
                    <Button
                        title="Añadir pareja de datos"
                        tail="md:w-inherit! w-auto!"
                        onclick={() => addField()}>Añadir</Button
                    >
                {/if}
            </div>
        {/each}
    </div>
{:else}
    <h1>TODO</h1>
{/if}
