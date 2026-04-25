<script lang="ts">
    import { evaluate } from "mathjs";
    import Core from "@zpw/ui/app/Core";
    import type { ParameterValueObject } from "@zpw/types/types";
    import { validateAgainst } from "@zhc.js/string-utils";

    let res = $state<string | null>(null);
    let values = $state<{
        expr: string;
        nVal: string;
        iVal: string;
        op: string;
    }>({
        expr: "",
        nVal: "",
        iVal: "",
        op: "",
    });

    function method(params: ParameterValueObject) {
        const { op, nVal, iVal, expr } = params;
        if (!op) throw "No se especificó un tipo de operador (sumatorio o productorio).";
        if (!validateAgainst(op, ["∑", "∏"]))
            throw "El operador especificado no es válido. Posiblemente un error de la página.";
        if (!iVal) throw "No se dió un valor de «i».";
        if (!nVal) throw "No se dió un valor de «n».";
        if (!expr || typeof expr != "string") throw "No se dió una expresión válida.";
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

<Core
    channel="profe"
    bind:values
    {method}
    params={[
        [
            {
                key: "op",
                type: "select",
                title: "Elige un acumulador…",
                onchange: "calc-no-throw",
                options: [
                    { value: "∑", label: "Sumatorio (∑)" },
                    { value: "∏", label: "Productorio (∏)" },
                ],
            },
            {
                key: "nVal",
                type: "text",
                title: "Parámetro de arriba (n)",
                req: true,
                tail: "w-full! flex-1 sm:flex-3",
            },
            {
                key: "iVal",
                type: "text",
                title: "Parámetro de abajo (i)",
                req: true,
                tail: "w-full! flex-1 sm:flex-3",
            },
            {
                key: "expr",
                type: "text",
                title: "Expresión, o f(i)",
                req: true,
                tail: "w-full! flex-1 sm:flex-3",
            },
        ],
    ]}
    applet="acumuladores"
    labels={{
        title: "Calculadora de acumulación",
        desc: [
            "Una calculadora que trabaja con operadores de acumulación matemática (sumatorio y productorio).",
        ],
        calc: `Calcular ${values.op == "∑" ? "sumatorio" : "productorio"}`,
        calcLite: "Calcula el operador deseado y muestra el resultado.",
    }}
>
    {#snippet result()}
        {#if res != null}
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
    {/snippet}
</Core>
