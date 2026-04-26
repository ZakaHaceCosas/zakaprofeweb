<script lang="ts">
    import Chart from "chart.js/auto";
    import { average, isEven, sumArray } from "@zhc.js/number-utils";
    import { validate } from "@zhc.js/string-utils";
    import { IsParameterATuple, type ParameterValueObject } from "@zpw/types/types";
    import Core from "@zpw/ui/app/Core";
    import Table from "@zpw/ui/Table";
    import { num } from "@zpw/utils";
    import { replaceState } from "$app/navigation";

    type EntradaTablaFrecuencias = {
        xi: number;
        fi: number;
        Fi: number;
        hi: number;
        Hi: number;
        per: number;
        perAc: number;
        xiFi: number;
        xi2Fi: number;
    };

    type EstudioUnidimensional = {
        N: number;
        moda: number;
        median: number;
        rango: number;
        avg: number;
        dm: number;
        varianza: number;
        dt: number;
        cv: number;
    };

    type EstudioCompleto = {
        tabla: EntradaTablaFrecuencias[];
        estudio: EstudioUnidimensional;
    };

    let res = $state<EstudioCompleto | { x: EstudioCompleto; y: EstudioCompleto } | null>(null);
    let values = $state<{
        level: "uni" | "bi";
        data: [string, string][];
        dataBi: [string, string][];
    }>({
        level: "uni",
        data: [["", ""]],
        dataBi: [["", ""]],
    });

    function estudiarVariableUnidimensional(datos: [number, number][]): EstudioCompleto {
        const tabla: EntradaTablaFrecuencias[] = [];
        const fi = datos.map((v) => v[1]);
        const N = sumArray(fi);
        const sumXiFi = datos.reduce((acc, [x, f]) => acc + x * f, 0);
        const avg = sumXiFi / N;
        let accFi = 0;
        let accHi = 0;
        let accPer = 0;
        for (const dato of datos) {
            accFi += dato[1];
            accHi += dato[1] / N;
            accPer += (dato[1] / N) * 100;
            const hi = dato[1] / N;
            const per = (dato[1] / N) * 100;
            tabla.push({
                xi: dato[0],
                fi: dato[1],
                Fi: accFi,
                hi,
                Hi: accHi,
                per,
                perAc: accPer,
                xiFi: dato[0] * dato[1],
                xi2Fi: Math.pow(dato[0], 2) * dato[1],
            });
        }

        const { sumDM, sumVar } = datos.reduce(
            (acc, [x, f]) => ({
                sumDM: acc.sumDM + Math.abs(x - avg) * f,
                sumVar: acc.sumVar + Math.pow(x - avg, 2) * f,
            }),
            { sumDM: 0, sumVar: 0 }
        );
        const moda = [...datos].sort((a, b) => b[1] - a[1])[0][0];
        const median = (() => {
            if (isEven(N)) {
                const n = N / 2;
                const i = tabla.findIndex((v) => v.Fi >= n);
                if (tabla[i].Fi === n) {
                    return average([tabla[i].xi, tabla[i + 1].xi]);
                }
                return tabla[i].xi;
            }
            return tabla.find((v) => v.Fi >= (N + 1) / 2)!.xi;
        })();
        const rango = tabla.at(-1)!.xi - tabla.at(0)!.xi;
        const dm = sumDM / N;
        const varianza = sumVar / N;
        const dt = Math.sqrt(varianza);
        const cv = dt / avg;

        return { estudio: { N, avg, moda, median, rango, dm, varianza, dt, cv }, tabla };
    }

    function method(params: ParameterValueObject) {
        const { level, data, dataBi } = params;
        if (!IsParameterATuple(data) || !IsParameterATuple(dataBi))
            throw "Error interno (asignación ilegal), reporta esto por favor.";
        const datos: [number, number][] = data.map((v) => [num(v[0]), num(v[1])]);
        if (level == "uni") {
            res = estudiarVariableUnidimensional(datos);
            return;
        }
        if (data.length != dataBi.length)
            throw "¿Por qué no diste la misma cantidad de datos para cada tabla marginal? Hazlo.";
        if (
            data.some((v) => !validate(v[0]) || !validate(v[1]))
            || dataBi.some((v) => !validate(v[0]) || !validate(v[1]))
        )
            throw "Hay datos vacíos en alguna de las tablas marginales. No hagas eso.";
        const datosBi: [number, number][] = dataBi.map((v) => [num(v[0]), num(v[1])]);
        res = {
            x: estudiarVariableUnidimensional(datos),
            y: estudiarVariableUnidimensional(datosBi),
        };
    }

    let chart: HTMLCanvasElement | undefined = $state();

    $effect(() => {
        if (!chart || !res) return;
        if ("x" in res) return;
        console.log("chart element:", chart);
        const ctx = chart.getContext("2d");
        console.log("ctx:", ctx);

        new Chart(ctx!, {
            type: "bar",
            options: {
                font: {
                    family: "Roboto",
                },
            },
            data: {
                labels: res.tabla.map((row) => `xi ${row.xi}`),
                datasets: [
                    {
                        label: "Valor de fi",
                        data: res.tabla.map((row) => row.fi),
                    },
                ],
            },
        });
    });
</script>

<Core
    {replaceState}
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
            list: {
                pairs: true,
                title: ["xi", "fi"],
            },
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
                <h2>Tabla de frecuencias</h2>
                <br />
                <Table
                    keys={["xi", "fi", "Fi", "hi", "Hi", "%", "% acc", "xi * fi", "xi² * fi"]}
                    data={Object.values(
                        (res as EstudioCompleto).tabla
                            .map((v) => [
                                v.xi,
                                v.fi,
                                v.Fi,
                                v.hi,
                                v.Hi,
                                v.per,
                                v.perAc,
                                v.xiFi,
                                v.xi2Fi,
                            ])
                            .sort((a, b) => a[0] - b[0])
                    )}
                />
                <br />
                <h2>Parámetros de centralización y de dispersión</h2>
                <br />
                <Table
                    keys={["Parámetro", "Valor calculado"]}
                    data={Object.entries((res as EstudioCompleto).estudio).map((v) => [
                        (
                            {
                                avg: "Media aritmética",
                                moda: "Moda (valor de xi)",
                                N: "Total de elementos (N)",
                                dm: "Desviación Media",
                                dt: "Desviación Típica",
                                varianza: "Varianza",
                                rango: "Rango",
                                cv: "Coeficiente de Variación",
                                median: "Mediana",
                            } satisfies Record<keyof EstudioUnidimensional, string>
                        )[v[0] as keyof EstudioUnidimensional]!,
                        v[1],
                    ])}
                />
                <br />
                <h2>Gráfico de barras</h2>
                <br />
                <canvas bind:this={chart}></canvas>
            {/if}
        {/if}
    {/snippet}
</Core>
