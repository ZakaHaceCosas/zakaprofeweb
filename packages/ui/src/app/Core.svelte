<script lang="ts">
    import type { Parameter, ParameterForField, ParameterValueObject } from "@zpw/types/types";
    import Button from "@zpw/ui/Button";
    import { onMount, type Snippet } from "svelte";
    import FieldRenderer from "./FieldRenderer.svelte";
    import { toKebabCase, splitCamelOrPascalCase } from "@zhc.js/string-utils";
    import { tick } from "svelte";

    let loading = $state(true);

    let {
        values = $bindable({}),
        params: _params,
        method,
        labels,
        applet,
        channel,
        result,
        replaceState,
    }: {
        values: ParameterValueObject;
        applet: string;
        params: (Parameter | Parameter[])[];
        method: (params: ParameterValueObject) => void;
        labels: {
            title: string;
            desc: string[];
            calc: string;
            calcLite: string;
        };
        channel: "profe" | "teka";
        result: Snippet;
        /** importa esto de `$app/navigation` y pásaselo a `Core`, le hace falta para aplicar URLParams sin que SvelteKit le pegue */
        replaceState: (url: string, state: any) => void;
    } = $props();

    const paramCallback = (v: Parameter): ParameterForField | null => {
        const finalParam = { ...v, id: toKebabCase(splitCamelOrPascalCase(v.key).join(" ")) };
        if (!v.depends) return finalParam;
        const dependencies = v.depends.map((d) => {
            if (d.type == "is-truthy" || d.type == "is-falsy") {
                return !!values[d.dependency];
            } else if (d.type == "is") {
                return values[d.dependency] == d.value;
            } else if (d.type == "is-not") {
                return values[d.dependency] != d.value;
            }
        });
        if (!dependencies.every(Boolean)) return null;
        return finalParam;
    };
    const params: (ParameterForField | ParameterForField[])[] = $derived(
        _params
            .map((v: Parameter | Parameter[]) =>
                Array.isArray(v) ? v.map(paramCallback).filter((p) => p != null) : paramCallback(v)
            )
            .filter((p) => p != null)
    );

    onMount(async () => {
        if (!window.location.search) {
            loading = false;
            return;
        }

        const URLParams = new URLSearchParams(window.location.search);
        const flatParams = _params.flat();
        const updates: ParameterValueObject = {};
        flatParams.forEach((p: Parameter) => {
            const val = URLParams.get(p.key);
            if (!val || val.trim() === "") return;
            updates[p.key] = p.list ? JSON.parse(atob(val)) : val;
        });
        values = { ...values, ...updates };

        if (
            _params
                .flat()
                .filter((v: Parameter) => v.req)
                .every((v: Parameter) => values[v.key] !== undefined)
        ) {
            await calculate();
        }

        loading = false;
    });

    export async function calculate(throws = true): Promise<void> {
        try {
            method(values);
            // esto está pq el `.depends` de los params jode un poco la gestión de estado
            // no sé explicarlo muy bien pero en resumen hay una especie de race-condition entre
            // - cargar default state del usuario de `<Core />` (actualiza el estado)
            // - cargar de la URL (actualiza el estado)
            // - leer condiciones para las dependencias (depende del estado)
            // - leer valores para la nueva URL (depende del estado)
            // todo pasa a la vez, por eso esta cosa que nos fuerza a usar async
            // también es por este problema que uso un objeto de updates en vez de mutar
            // `values` directamente, hacer eso (en un bucle, como hacía antes) son
            // VARIAS mutaciones y eso lo hace mucho peor, mejor aplicar de una vez
            // y ya.
            await tick();
            replaceState(genURL(false), {});
        } catch (e) {
            if (throws) alert(e);
        }
    }

    let sharePopover = $state<null | 0 | string>(null);

    function genURL(abs: boolean = true): string {
        return `${abs ? `https://${channel}.zhc.es/apps/` : ""}${applet}?${Object.entries(values)
            .filter(([_, v]) => v !== undefined && v !== "")
            .map(
                ([k, v]) =>
                    `${k}=${encodeURIComponent(typeof v === "string" ? v : btoa(JSON.stringify(v)))}`
            )
            .join("&")}`;
    }

    async function share(): Promise<void> {
        const url = genURL();
        try {
            await navigator.clipboard.writeText(url);
            sharePopover = 0;
        } catch (e) {
            console.log(e);
            sharePopover = url;
        }
        setTimeout(() => {
            sharePopover = null;
        }, 5000);
    }
</script>

<svelte:head>
    <title>{labels.title}</title>
    <meta name="title" content={labels.title} />
    <meta name="description" content={labels.desc[0]} />
</svelte:head>

{#if loading}
    <h1>Cargando applet «{labels.title}»</h1>
{:else}
    <h1>{labels.title}</h1>
    <br />
    <p>
        {#each labels.desc as d, i (i)}{d}<br /><br />{/each}
    </p>
    {#each params as param, idx (idx)}
        {#if Array.isArray(param)}
            <div class="flex w-full flex-row gap-2">
                {#each param as p, i (i)}
                    <FieldRenderer paramList={param} param={p} {values} {i} {calculate} />
                {/each}
            </div>
            <br />
        {:else}
            <FieldRenderer {param} {values} {calculate} />
            <br />
        {/if}
    {/each}
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button onclick={async () => await calculate()} title={labels.calcLite}
            ><b>&starf;</b> {labels.calc}</Button
        >
        <Button
            onclick={async () => await share()}
            title="Generar un enlace para compartir el resultado."
        >
            <b>&nearr;</b> Compartir
        </Button>
    </div>
    <br />
    {@render result?.()}
    {#if sharePopover != null}
        <div class="absolute right-8 border-2 border-(--fff25) bg-(--blk) p-4">
            {#if sharePopover == 0}¡Enlace copiado al portapapeles!{:else}Enlace generado, aunque tu
                navegador no nos deja copiarlo a tu portapapeles por alguna razón. Copia el enlace
                tú mismo:<br />{sharePopover}.{/if}
        </div>
    {/if}
{/if}
