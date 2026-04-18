<script lang="ts">
    import type { Param } from "@zpw/types/types";
    import Button from "@zpw/ui/Button";
    import { onMount, type Snippet } from "svelte";
    import Field from "./Field.svelte";
    import { toKebabCase, splitCamelOrPascalCase } from "@zhc.js/string-utils";

    let loading = $state(true);

    const {
        values = $bindable({}),
        params: _params,
        method,
        labels,
        app,
        channel,
        result,
    }: {
        values: Record<string, string>;
        app: string;
        params: (Param | Param[])[];
        method: (params: Record<string, string>) => void;
        labels: {
            title: string;
            desc: string[];
            calc: string;
            calcLite: string;
        };
        channel: "profe" | "teka";
        result: Snippet;
    } = $props();

    const paramCallback = (v: Param) => {
        return { ...v, id: toKebabCase(splitCamelOrPascalCase(v.key).join(" ")) };
    };
    const params = $derived(
        _params.map((v: Param | Param[]) =>
            Array.isArray(v) ? v.map(paramCallback) : paramCallback(v)
        )
    );

    onMount(() => {
        if (!window.location.search) {
            loading = false;
            return;
        }

        const URLParams = new URLSearchParams(window.location.search);
        const flatParams = params.flat();
        flatParams.forEach((p: Param) => {
            const val = URLParams.get(p.key);
            if (!val || val.trim() === "") return;
            values[p.key] = val;
        });

        if (
            flatParams.filter((v: Param) => v.req).every((v: Param) => values[v.key] !== undefined)
        ) {
            calculate();
        }

        loading = false;
    });

    export function calculate(throws = true) {
        try {
            method(values);
            history.replaceState(null, "", genURL(false));
        } catch (e) {
            if (throws) alert(e);
        }
    }

    let sharePopover = $state<null | 0 | string>(null);

    function genURL(abs: boolean = true): string {
        return `${abs ? `https://${channel}.zhc.es/apps/` : ""}${app}?${Object.entries(values)
            .map(
                ([k, v]) =>
                    `${k}=${encodeURIComponent(typeof v === "string" ? v : JSON.stringify(v))}`
            )
            .join("&")}`;
    }

    function share(): void {
        const url = genURL();
        try {
            navigator.clipboard.writeText(url);
            sharePopover = 0;
        } catch {
            sharePopover = url;
        }
    }
</script>

<svelte:head>
    <title>{labels.title}</title>
    <meta name="title" content={labels.title} />
    <meta name="description" content={labels.desc[0]} />
</svelte:head>

{#if loading}
    <h1>Cargando ZPWAPP «{labels.title}»</h1>
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
                    <Field
                        param={p}
                        onchange={p.onchange == "none"
                            ? undefined
                            : () => calculate(p.onchange == "calc")}
                        onkeydown={(e) => {
                            if (p.onenter == "none") return;
                            if (e.key !== "Enter") return;
                            if (e.shiftKey) calculate(p.onchange == "calc");
                            else {
                                document.getElementById(param[i + 1].id)?.focus();
                            }
                        }}
                        {values}
                    />
                {/each}
            </div>
        {:else}
            <Field
                {param}
                onchange={param.onchange == "none"
                    ? undefined
                    : () => calculate(param.onchange == "calc")}
                onkeydown={() => {}}
                {values}
            />
        {/if}
    {/each}
    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button onclick={() => calculate()} title={labels.calcLite}
            ><b>&starf;</b> {labels.calc}</Button
        >
        <Button onclick={share} title="Generar un enlace para compartir el resultado.">
            <b>&nearr;</b> Compartir
        </Button>
    </div>
    <br />
    {@render result?.()}
    {#if sharePopover != null}
        <div class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4">
            {#if sharePopover == 0}¡Enlace copiado al portapapeles!{:else}Enlace generado, aunque tu
                navegador no nos deja copiarlo a tu portapapeles por alguna razón. Cópialo tú.<br
                />{sharePopover}.{/if}
        </div>
    {/if}
{/if}
