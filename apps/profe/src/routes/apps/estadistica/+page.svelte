<script lang="ts">
    import type { ParameterValueObject } from "@zpw/types/types";
    import Core from "@zpw/ui/app/Core";

    type EstudioUnidimensional = {
        DM: number;
        Varianza: number;
    };

    let res = $state<
        EstudioUnidimensional | { x: EstudioUnidimensional; y: EstudioUnidimensional } | null
    >(null);
    let values = $state<{
        level: "uni" | "bi";
        data: [string, string][];
        dataBi: [string, string][];
    }>({
        level: "uni",
        data: [["", ""]],
        dataBi: [["", ""]],
    });

    function method(params: ParameterValueObject) {
        values.pairs.forEach((p) => {
            const a = w == "DM" ? Math.abs(p[0] - avg) : Math.pow(p[0] - avg, 2);
            i += a * p[1];
        });

        i = i / 74;
        console.log(i);
        if (w == "Varian") console.log(Math.sqrt(i));
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
                title: "Elige un acumulador...",
                onchange: "calc-no-throw",
                options: [
                    { value: "∑", label: "Sumatorio (∑)" },
                    { value: "∏", label: "Productorio (∏)" },
                ],
            },
        ],
    ]}
    applet="acumuladores"
    labels={{
        title: "Calculadora para estadística",
        desc: [
            "Calculadora completa para estudios estadísticos unidimensionales o bidimensionales.",
            "Una calculadora que, recibiendo datos de un estudio estadístico, genera todas las tablas, parámetros y gráficas que pudieras necesitar.",
        ],
        calc: "Analizar",
        calcLite: "Computar los datos proveídos y hacer todo el trabajo.",
    }}
>
    {#snippet result()}
        {#if res != null}
            <h1>TODO</h1>
        {/if}
    {/snippet}
</Core>
