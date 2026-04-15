<script lang="ts">
    import Button from "@zpw/ui/Button";
    import { onMount, type Snippet } from "svelte";

    type Param = {
        key: string;
        typing?: "json" | "bool" | "none";
        req?: boolean;
    };

    const {
        values = $bindable({}),
        children,
        params,
        calculatorMethod,
        labels,
        app,
    } = $props<{
        values: Record<string, string>;
        children: Snippet;
        app: string;
        params: Param[];
        calculatorMethod: (params: Record<string, string>) => void;
        labels: {
            calc: string;
            calcLite: string;
        };
    }>();

    onMount(() => {
        if (!window.location.search) return;

        const URLParams = new URLSearchParams(window.location.search);
        params.forEach((p: Param) => {
            const val = URLParams.get(p.key);
            if (!val || val.trim() === "") return;
            values[p.key] =
                p.typing == "json" ? JSON.parse(val) : p.typing == "bool" ? val == "1" : val;
        });

        if (params.filter((v: Param) => v.req).every((v: Param) => values[v.key] !== undefined)) {
            calculate();
        }
    });

    export function calculate(throws = true) {
        try {
            calculatorMethod(values);
            history.replaceState(null, "", genURL(false));
        } catch (e) {
            if (throws) alert(e);
        }
    }

    let sharePopover = $state<null | 0 | string>(null);

    function genURL(abs: boolean = true): string {
        // TODO: multi-app
        return `${abs ? "https://profe.zhc.es/apps/" : ""}${app}?${Object.entries(values)
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

{@render children()}
<!--aquí pondrá el tio todo el formulario (hacerlo un componente es complejo porque los hay de muchos tipos; ya lo haré más adelante)-->
<br />
<div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
    <Button onclick={() => calculate()} title={labels.calcLite}><b>&starf;</b> {labels.calc}</Button
    >
    <Button onclick={share} title="Generar un enlace para compartir el resultado.">
        <b>&nearr;</b> Compartir
    </Button>
</div>
{#if sharePopover != null}
    <div class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4">
        {#if sharePopover == 0}¡Enlace copiado al portapapeles!{:else}Enlace generado, aunque tu
            navegador no nos deja copiarlo a tu portapapeles por alguna razón. Cópialo tú.<br
            />{sharePopover}.{/if}
    </div>
{/if}
