<!--[TODO] POR HACER ESTO
la idea es tener un solo componente base para evitar duplicar código entre varias apps
-->
<script lang="ts">
    import Button from "$lib/Button.svelte";
    import { onMount, type Snippet } from "svelte";

    type Param = {
        key: string;
        value: any;
        typing?: "json" | "bool" | "none";
        req?: boolean;
    };

    const values: Record<string, any> = {};

    const { children, params, calculatorMethod, labels, channel } = $props<{
        children: Snippet;
        params: Param[];
        calculatorMethod: (params: typeof values) => void;
        labels: {
            calc: string;
            calcLite: string;
        };
        channel: "ZakaProfe" | "ZakaTeka";
    }>();

    onMount(() => {
        if (!window.location.search) return;

        const URLParams = new URLSearchParams(window.location.search);
        params.forEach((p) => {
            const val = URLParams.get(p.key);
            if (!val || val.trim() == "") return;
            values.push({
                key: p.key,
                value: p.typing == "json" ? JSON.parse(val) : p.typing == "bool" ? val == "1" : val,
            });
        });

        if (params.filter((v) => v.req).every((v) => values[v.key] != undefined)) {
            calculatorMethod(values);
        }
    });

    function share() {
        navigator.clipboard.writeText(
            ""
            // `https://profe.zhc.es/apps/acumuladores?expr=${encodeURIComponent(expr)}&op=${encodeURIComponent(op!)}&n=${nVal}&i=${iVal}`
        );
    }
</script>

{@render children?.()}
<!--aquí pondrá el tio todo el formulario (hacerlo un componente es complejo porque los hay de muchos tipos; ya lo haré más adelante)-->
<br />
<div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
    <Button onclick={() => calculatorMethod(values)} {channel} title={labels.calcLite}
        ><b>&starf;</b> {labels.calc}</Button
    >
    <Button
        onclick={share}
        popovertarget="share-popover"
        {channel}
        title="Generar un enlace para compartir el resultado."
    >
        <b>&nearr;</b> Compartir
    </Button>
</div>
<div id="share-popover" class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4" popover>
    ¡Enlace copiado al portapapeles!
</div>
