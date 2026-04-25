<script lang="ts">
    import { average, sumArray } from "@zhc.js/number-utils";
    import { validate } from "@zhc.js/string-utils";
    import { IsParameterATuple, type ParameterValueObject } from "@zpw/types/types";
    import Core from "@zpw/ui/app/Core";
    import Table from "@zpw/ui/Table";
    import { num } from "@zpw/utils";

    type EntradaTablaFrecuencias = {
        xi: number;
        fi: number;
        Fi: number;
        hi: number;
        Hi: number;
        per: number;
        perAc: number;
        xiFi: number;
        xiFi2: number;
    };

    type EstudioUnidimensional = {
        N: number;
        moda: number;
        avg: number;
        dm: number;
        dt: number;
        varianza: number;
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

    function estudiarVariableUnidimensional(
        datos: [number, number][],
        N: number
    ): EntradaTablaFrecuencias[] {
        const array: EntradaTablaFrecuencias[] = [];
        let accFi = datos[0][1];
        let accHi = datos[0][1] / N;
        let accPer = (datos[0][1] / N) * 100;
        for (const dato of datos) {
            const hi = dato[1] / N;
            const per = (dato[1] / N) * 100;
            array.push({
                xi: dato[0],
                fi: dato[1],
                Fi: accFi,
                hi,
                Hi: accHi,
                per,
                perAc: accPer,
                xiFi: dato[0] * dato[1],
                xiFi2: (dato[0] ^ 2) * dato[1],
            });
            accFi += dato[1];
            accHi += hi;
            accPer += per;
        }
        return array;
    }

    function obtenerParamsVariable(data: [number, number][]): EstudioUnidimensional {
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
        const moda = data.sort((a, b) => b[1] - a[1])[0][0];

        const dm = sumDM / N;
        const varianza = sumVar / N;
        const dt = Math.sqrt(dm);

        return { N, moda, avg, dm, varianza, dt };
    }

    function method(params: ParameterValueObject) {
        const { level, data, dataBi } = params;
        if (!IsParameterATuple(data) || !IsParameterATuple(dataBi))
            throw "Error interno (asignación ilegal), reporta esto por favor.";
        const datos: [number, number][] = data.map((v) => [num(v[0]), num(v[1])]);
        if (level == "uni") {
            const estudio = obtenerParamsVariable(datos);
            res = {
                tabla: estudiarVariableUnidimensional(datos, estudio.N),
                estudio,
            };
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
        const estudioX = obtenerParamsVariable(datos);
        const estudioY = obtenerParamsVariable(datosBi);
        res = {
            x: {
                tabla: estudiarVariableUnidimensional(datos, estudioX.N),
                estudio: estudioX,
            },
            y: {
                tabla: estudiarVariableUnidimensional(datosBi, estudioY.N),
                estudio: estudioY,
            },
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
                                v.xiFi2,
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
                            } satisfies Record<keyof EstudioUnidimensional, string>
                        )[v[0] as keyof EstudioUnidimensional]!,
                        v[1],
                    ])}
                />
            {/if}
        {/if}
    {/snippet}
</Core>
