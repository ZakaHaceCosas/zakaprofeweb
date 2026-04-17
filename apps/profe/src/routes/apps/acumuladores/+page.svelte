<script lang="ts">
    import Input from "@zpw/ui/Input";
    import { evaluate } from "mathjs";
    import Select from "@zpw/ui/Select";
    import Core from "@zpw/ui/app/Core";

    let core = $state<ReturnType<typeof import("@zpw/ui/app/Core").default>>();
    let res = $state<string | null>(null);
    let values = $state<{
        expr: string;
        nVal: string;
        iVal: string;
        op: "" | "∑" | "∏";
    }>({
        expr: "",
        nVal: "",
        iVal: "",
        op: "",
    });

    function method(params: Record<string, string>) {
        const { op, nVal, iVal, expr } = params as typeof values;
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
    }
</script>

<svelte:head>
    <title>Calculador de acumulación</title>
    <meta
        name="description"
        content="Una calculadora que trabaja con operadores de acumulación matemática (sumatorio y productorio)."
    />
</svelte:head>

<Core
    channel="profe"
    bind:values
    bind:this={core}
    {method}
    params={[
        {
            key: "expr",
        },
        {
            key: "op",
        },
        {
            key: "nVal",
        },
        {
            key: "iVal",
        },
    ]}
    app="acumuladores"
    labels={{
        calc: `Calcular ${values.op == "∑" ? "sumatorio" : "productorio"}`,
        calcLite: "Calcula el operador deseado y muestra el resultado.",
    }}
>
    <h1>Calculador de acumulación</h1>
    <br />
    <p>Agrega sumatorios y productorios.<br /><br /></p>
    <div class="flex w-full flex-row gap-2">
        <Select
            id="op-val"
            onchange={() => {
                core?.calculate(false);
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
            bind:value={values.op}
        />
        <Input
            type="text"
            name="n-val"
            bind:value={values.nVal}
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                core?.calculate();
            }}
            title="Parámetro de arriba (n)"
            required
            tail="w-full! flex-1 sm:flex-3"
        />
        <Input
            type="text"
            name="i-val"
            bind:value={values.iVal}
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                core?.calculate();
            }}
            title="Parámetro de abajo (i)"
            required
            tail="w-full! flex-1 sm:flex-3"
        />
        <Input
            type="text"
            name="expr-val"
            bind:value={values.expr}
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                core?.calculate();
            }}
            title="Expresión, o f(i)"
            required
            tail="w-full! flex-1 sm:flex-3"
        />
    </div>

    {#if res}
        <div
            class="mx-auto flex flex-row items-center justify-center gap-4 font-serif text-5xl text-(--accent)"
        >
            <div class="flex flex-col items-center justify-center">
                <p class="text-xl">{values.nVal}</p>
                <p>{values.op}</p>
                <p class="text-xl">{values.iVal}</p>
            </div>
            <p class="text-left"><i>{values.expr}</i>=<b>{res}</b></p>
            <div></div>
        </div>
    {/if}
</Core>
