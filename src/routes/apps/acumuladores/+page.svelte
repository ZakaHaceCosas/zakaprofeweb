<script lang="ts">
    import { onMount } from "svelte";
    import Button from "$lib/Button.svelte";
    import Input from "$lib/Input.svelte";
    import { evaluate } from "mathjs";
    import Select from "$lib/Select.svelte";

    let expr = "";
    let nVal = "";
    let iVal = "";
    let op: "" | "∑" | "∏" = "";
    let res: null | string = null;

    onMount(() => {
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const paramExpr = params.get("expr") ?? "";
        expr = decodeURIComponent(paramExpr);
        const paramI = params.get("i") ?? "";
        iVal = paramI;
        const paramN = params.get("n") ?? "";
        nVal = paramN;
        const paramOp = decodeURIComponent(params.get("op") ?? "");
        if (paramOp == "∑" || paramOp == "∏") op = paramOp;
        if (expr !== "" && op !== "" && nVal !== "" && iVal !== "") calculate();
    });

    function calculate(throws: boolean = true) {
        try {
            if (!op) throw "No se especificó un tipo de operador (sumatorio o productorio).";
            if (!iVal) throw "No se dió un valor de «i».";
            if (!nVal) throw "No se dió un valor de «n».";
            if (!expr) throw "No se dió una expresión.";
            const expression = (v: number) => evaluate(expr.replace("i", v.toString()));
            const n = Number(nVal);
            const i = Number(iVal);
            let acc = op == "∑" ? 0 : 1;
            for (let i2 = Number(i); i2 <= n; i2++) {
                if (op == "∑") acc += expression(i2);
                else acc *= expression(i2);
            }
            res = acc.toString();
            const newParams = `?expr=${encodeURIComponent(expr)}&op=${encodeURIComponent(op)}&n=${nVal}&i=${iVal}`;
            history.replaceState(null, "", newParams);
        } catch (e) {
            if (throws) alert(e);
        }
    }

    function share() {
        // TODO: extraer la lógica de compartido a un componente y manejar params faltantes
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/acumuladores?expr=${encodeURIComponent(expr)}&op=${encodeURIComponent(op!)}&n=${nVal}&i=${iVal}`
        );
    }
</script>

<svelte:head>
    <title>Calculador de acumulación</title>
    <meta
        name="description"
        content="Una calculadora que trabaja con operadores de acumulación matemática (sumatorio y productorio)."
    />
</svelte:head>

<h1>Calculador de acumulación</h1>
<br />
<p>Agrega sumatorios y productorios.<br /><br /></p>
<div class="flex w-full flex-row gap-2">
    <Select
        channel="ZakaProfe"
        id="op-val"
        onchange={() => {
            calculate(false);
        }}
        title="Elige un acumulador..."
        options={[
            {
                value: "∑",
                label: "Sumatorio (∑)",
            },
            {
                value: "∏",
                label: "Productorio (∏)",
            },
        ]}
        bind:value={op}
    />
    <Input
        type="text"
        name="n-val"
        bind:value={nVal}
        oninput={(e) => (nVal = e.currentTarget.value)}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            calculate();
        }}
        title="Parámetro de arriba (n)"
        required
        tail="w-full! flex-1 sm:flex-3"
        channel="ZakaProfe"
    />
    <Input
        type="text"
        name="i-val"
        bind:value={iVal}
        oninput={(e) => (iVal = e.currentTarget.value)}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            calculate();
        }}
        title="Parámetro de abajo (i)"
        required
        tail="w-full! flex-1 sm:flex-3"
        channel="ZakaProfe"
    />
    <Input
        type="text"
        name="expr-val"
        bind:value={expr}
        oninput={(e) => (expr = e.currentTarget.value)}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            calculate();
        }}
        title="Expresión, o f(i)"
        required
        tail="w-full! flex-1 sm:flex-3"
        channel="ZakaProfe"
    />
</div>

<br />
<div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
    <Button onclick={() => calculate()} channel="ZakaProfe" title="Calcular el operador."
        ><b>&starf;</b> Calcular {op == "∑" ? "sumatorio" : "productorio"}</Button
    >
    <Button
        onclick={share}
        popovertarget="share-popover"
        channel="ZakaProfe"
        title="Generar un enlace para compartir el resultado."><b>&nearr;</b> Compartir</Button
    >
</div>
<div id="share-popover" class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4" popover>
    ¡Enlace copiado al portapapeles!
</div>

{#if res}
    <div
        class="mx-auto flex flex-row items-center justify-center gap-4 font-serif text-5xl text-(--ZakaProfe)"
    >
        <div class="flex flex-col items-center justify-center">
            <p class="text-xl">{nVal}</p>
            <p>{op}</p>
            <p class="text-xl">{iVal}</p>
        </div>
        <p class="text-left"><i>{expr}</i>=<b>{res}</b></p>
        <div></div>
    </div>
{/if}
