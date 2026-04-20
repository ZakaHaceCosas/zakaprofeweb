<script lang="ts">
    import { average, sumArray } from "@zhc.js/number-utils";
    import { validate } from "@zhc.js/string-utils";
    import { IsParameterATuple, type ParameterValueObject } from "@zpw/types/types";
    import Core from "@zpw/ui/app/Core";
    import Table from "@zpw/ui/Table";
    import { num } from "@zpw/utils";

    type EstudioUnidimensional = {
        N: number;
        avg: number;
        dm: number;
        dt: number;
        varianza: number;
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

    function estudiarVariableUnidimensional(datos: [string, string][]): EstudioUnidimensional {
        const data = datos.map((v) => [num(v[0]), num(v[1])]);
        const fi = data.map((v) => v[1]);
        const N = sumArray(fi);
        const avg = average(fi);
        const { sumDM, sumVar } = data.reduce(
            (acc, [x, f]) => ({
                sumDM: acc.sumDM + Math.abs(x - avg) * f,
                sumVar: acc.sumVar + Math.pow(x - avg, 2) * f,
            }),
            { sumDM: 0, sumVar: 0 }
        );

        const dm = sumDM / N;
        const varianza = sumVar / N;
        const dt = Math.sqrt(dm);

        const r = { avg, N, dm, varianza, dt };
        console.log(r);
        return r;
    }

    function method(params: ParameterValueObject) {
        const { level, data, dataBi } = params;
        if (!IsParameterATuple(data) || !IsParameterATuple(dataBi))
            throw "Error interno (asignación ilegal), reporta esto por favor.";
        if (level == "uni") {
            res = estudiarVariableUnidimensional(data);
            return;
        }
        if (data.length != dataBi.length)
            throw "¿Por qué no diste la misma cantidad de datos para cada tabla marginal? Hazlo.";
        if (
            data.some((v) => !validate(v[0]) || !validate(v[1]))
            || dataBi.some((v) => !validate(v[0]) || !validate(v[1]))
        )
            throw "Hay datos vacíos en alguna de las tablas marginales. No hagas eso.";
        res = {
            x: estudiarVariableUnidimensional(data),
            y: estudiarVariableUnidimensional(dataBi),
        };
    }
</script>

<Core
    channel="profe"
    bind:values
    {method}
    params={[
        {
            key: "level",
            type: "select",
            title: "Elige un tipo de estudio...",
            options: [
                { value: "uni", label: "Unidimensional" },
                { value: "bi", label: "Bidimensional" },
            ],
        },
        {
            key: "data",
            type: "number",
            title: "Añade los datos aquí",
            list: "tuple",
        },
    ]}
    applet="estadistica"
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
            {#if values.level == "uni"}
                <Table table={Object.entries(res as EstudioUnidimensional)} />
            {/if}
        {/if}
    {/snippet}
</Core>
