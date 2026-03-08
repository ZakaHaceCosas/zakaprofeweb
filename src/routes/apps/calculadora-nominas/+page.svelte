<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore untyped?
    import { sumArray } from "numeric-utils";
    import Button from "../../../components/Button.svelte";
    import Input from "../../../components/Input.svelte";
    import Table from "../../../components/Table.svelte";

    const basesCotContingenciasComunes = {
        1: [
            "Ingenieros y Licenciados. Personal de alta dirección no incluido en el artículo 1.3.c del Estatuto de los Trabajadores",
            1929.0,
            4909.5,
        ],
        2: ["Ingenieros Técnicos, Peritos y Ayudantes Titulados", 1599.6, 4909.5],
        3: ["Jefes Administrativos y de Taller", 1391.7, 4909.5],
        4: ["Ayudantes no Titulados", 1381.2, 4909.5],
        5: ["Oficiales Administrativos", 1381.2, 4909.5],
        6: ["Subalternos", 1381.2, 4909.5],
        7: ["Auxiliares Administrativos", 1381.2, 4909.5],
        8: ["Oficiales de primera y segunda", 46.04, 163.65],
        9: ["Oficiales de tercera y Especialistas", 46.04, 163.65],
        10: ["Peones", 46.04, 163.65],
        11: [
            "Personas trabajadoras menores de dieciocho años, cualquiera que sea su categoría profesional",
            46.04,
            163.65,
        ],
    } as const;

    const bcDiaria = (b: number) => {
        return [8, 9, 10, 11].includes(b);
    };
    const bcMensual = (b: number) => {
        return b > 0 && b < 8;
    };

    let devengo: {
        base: string;
        /** `[cnt, paga]`*/
        extras: [string, string];
        /** `[horas extraordinarias de fuerza mayor, las otras]`*/
        hex: [string, string];
        /** `[años, paga][]` */
        longevidad: [string, string][];
        /** `[percibido, límite, excluirI.R.P.F][]` */
        pluses: [string, string, boolean][];
        especie: string;
        grupo_cot: string;
        anos: string;
        jornadaDias: string;
        irpf: string;
        noProrratear: boolean;
    } = {
        base: "",
        extras: ["", ""],
        longevidad: [["", ""]],
        pluses: [["", "", false]],
        especie: "",
        grupo_cot: "",
        anos: "", // siempre me rio, no sé porqué...
        hex: ["", ""],
        jornadaDias: "",
        irpf: "",
        noProrratear: false,
    };

    let resultado: null | {
        salarioPeriodo: number;
        prorrateoExtras: number;
        salarioEspecie: number;
        totalDevengado: number;
        plusesCotizados: number;
        plusesNoCotizados: number;
        longevidad: number;
        horasForzosas: number;
        horasAdicionales: number;
        robo: {
            contingencias: number;
            desempleo: number;
            mei: number;
            fp: number;
            hefm: number;
            rhe: number;
            irpf: number;
        };
        neto: number;
        bccc: number;
        bccp: number;
        totalRobado: number;
    } = null;

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const nominaParam = params.get("nomina");

        if (!nominaParam) {
            history.replaceState(null, "", window.location.pathname);
            return;
        }

        try {
            const decoded = decodeURIComponent(atob(nominaParam));
            console.log(decoded);
            devengo = JSON.parse(decoded);
        } catch (error) {
            console.error("Error parsing nomina parameter:", error);
            history.replaceState(null, "", window.location.pathname);
        }
    });

    function calculateWage() {
        const newParams = `?nomina=${encodeURIComponent(btoa(JSON.stringify(devengo)))}`;
        history.replaceState(null, "", newParams);

        const num = (v: string) => {
            const n = Number(v);
            return isNaN(n) ? 0 : n;
        };

        const base = num(devengo.base);
        const especie = num(devengo.especie);
        const extrasCnt = num(devengo.extras[0]);
        const extrasVal = num(devengo.extras[1]);
        const grupoCot = num(devengo.grupo_cot);
        const t = bcDiaria(grupoCot) ? num(devengo.jornadaDias) : 30;
        const horasAdicionales = num(devengo.hex[1]);
        const horasForzosas = num(devengo.hex[0]);
        const pluses: [number, number, boolean][] = devengo.pluses.map((v) => [
            num(v[0]),
            num(v[1]),
            v[2],
        ]);
        const longevidad = devengo.longevidad
            .map((v) => [num(v[0]), num(v[1])])
            .filter((v) => v[0] <= num(devengo.anos));
        const irpf = num(devengo.irpf);

        if (!base) {
            alert("El salario base es obligatorio");
            return;
        }

        if (!bcDiaria(grupoCot) && !bcMensual(grupoCot)) {
            alert("Tienes que especificar un grupo de cotización válido.");
            return;
        }

        let salarioPeriodo = 0;

        if (bcMensual(grupoCot)) salarioPeriodo = base;
        else salarioPeriodo = base * t;

        let prorrateoExtras = 0;

        if (extrasCnt > 0 && extrasVal > 0) {
            const totalExtrasAnual = extrasCnt * extrasVal;
            prorrateoExtras = totalExtrasAnual / (bcMensual(grupoCot) ? 12 : 365);
        }

        let sumLongevidad = 0;

        const anos = num(devengo.anos);
        longevidad.forEach((v) => {
            for (let i = v[0]; i <= anos; i += v[0]) {
                if (v[0] <= 0) {
                    console.warn("Incremento de longevidad inválido:", v[0]);
                    break;
                }
                sumLongevidad += p(salarioPeriodo, v[1]);
            }
        });

        const plusesCotizados = sumArray(pluses.filter((v) => v[2] == false).map((v) => v[0]));
        const plusesNoCotizados = sumArray(pluses.filter((v) => v[2] == true).map((v) => v[0]));

        const computable = salarioPeriodo + plusesCotizados;
        const bccc = computable + prorrateoExtras + sumLongevidad;
        const bccp = bccc + horasAdicionales + horasForzosas;

        function p(numero: number, porcentaje: number) {
            return (numero * porcentaje) / 100;
        }

        const robo = {
            contingencias: p(bccc, 4.7),
            desempleo: p(bccp, 1.55), // TODO: 1.60 en contratos de duración determinada o tiempo parcial
            mei: p(bccc, 0.15),
            fp: p(bccp, 0.1),
            hefm: p(horasForzosas, 2),
            rhe: p(horasAdicionales, 4.7),
            irpf: p(computable, irpf),
        };

        const totalDevengado =
            bccc
            + especie
            + horasAdicionales
            + horasForzosas
            + plusesNoCotizados
            - (devengo.noProrratear ? prorrateoExtras : 0);
        const totalRobado = Object.values(robo).reduce((prev, curr) => (prev += curr));

        resultado = {
            salarioPeriodo,
            prorrateoExtras,
            salarioEspecie: especie,
            totalDevengado,
            robo,
            totalRobado,
            plusesCotizados,
            plusesNoCotizados,
            longevidad: sumLongevidad,
            horasForzosas,
            horasAdicionales,
            neto: totalDevengado - totalRobado,
            bccc,
            bccp,
        };

        console.log(devengo, resultado);

        return;
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/calculadora-nominas?nomina=${encodeURIComponent(btoa(JSON.stringify(devengo)))}`
        );
    }

    export const prerender = true;
</script>

<svelte:head>
    <title>Calculadora de nóminas (España)</title>
    <meta name="description" content="Calcula nóminas en base a la legislación vigente." />
</svelte:head>

<main>
    <h1>Calculadora de nóminas españolas</h1>
    <br />
    <p>
        Una calculadora de nóminas salariales. Trata de mantenerse actualiza con la legislación
        vigente y de tomar en cuenta todas las variables posibles para la mayor precisión.<br
        />Contacte conmigo para reportar errores, contenido desactualizado y demás.
        <b
            >Nota: Aún faltan cosas (además de que el diseño es mejorable) y ya soy consciente de
            ello.</b
        >
        Lo estoy trabajando poco a poco.<br /><br />
        Los campos opcionales se pueden dejar en blanco, no hace falta poner un cero. No están explícitamente
        señalados, pero se sobrentienden (el salario base no es opcional, el plus de nocturnidad sí, por
        ejemplo)<br /><br />Esta calculadora se toma la libertad de asumir que vas a prorratear las
        pagas extras.<br /><br />
    </p>
    <div class="mb-1 flex w-full flex-col items-center gap-3 sm:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Salario base</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="sal_base"
            id="sal_base"
            bind:value={devengo.base}
            oninput={(e) => (devengo.base = e.currentTarget.value)}
            title="Salario base en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById("hex_1")!.focus();
                }
            }}
        />
    </div>
    <p class="mb-3">
        <b
            >Puedes poner el salario base en euros por día o por mes; en función de lo que diga tu
            contrato.</b
        >
        <br />Para que entiendas, si tienes un contrato indefinido a tiempo completo, pondrás aquí
        tu sueldo mensual, y se asumirá que te están pagando por 30 días de trabajo (tenga el mes
        28, 29, 30 o 31 días).<br />En otros casos, puede que tengas un sueldo por días (grupos
        profesionales del 8 al 11); por lo que tendrás que especificar los días que has cobrado.
    </p>

    <div class="mb-1 flex w-full flex-col items-center gap-3 sm:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Horas forzadas</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="hex_1"
            id="hex_1"
            bind:value={devengo.hex[0]}
            oninput={(e) => (devengo.hex[0] = e.currentTarget.value)}
            title="Extraordinarias de fuerza mayor en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById("hex_2")!.focus();
                }
            }}
        />
    </div>

    <div class="mb-1 flex w-full flex-col items-center gap-3 sm:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Horas extraordinarias</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="hex_2"
            id="hex_2"
            bind:value={devengo.hex[1]}
            oninput={(e) => (devengo.hex[1] = e.currentTarget.value)}
            title="Extraordinarias convencionales en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById("sal_especie")!.focus();
                }
            }}
        />
    </div>
    <p class="mb-3">
        Pon en las dos entradas de arriba cuanto has cobrado por las horas extraordinarias
        convencionales y por las de fuerza mayor.
    </p>

    <div class="mb-3 flex w-full flex-col items-center gap-3 sm:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Salario en especie</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="sal_especie"
            id="sal_especie"
            bind:value={devengo.especie}
            oninput={(e) => (devengo.especie = e.currentTarget.value)}
            title="Valor del salario en especie en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById("pagas_extra_cnt")!.focus();
                }
            }}
        />
    </div>

    <div class="mb-3 flex w-full flex-col items-center gap-3 sm:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Pagas extra</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="pagas_extra_cnt"
            id="pagas_extra_cnt"
            bind:value={devengo.extras[0]}
            oninput={(e) => (devengo.extras[0] = e.currentTarget.value)}
            title="Cantidad de pagas al año (dos o más)"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById("pagas_extra_val")!.focus();
                }
            }}
        />

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="pagas_extra_val"
            id="pagas_extra_val"
            bind:value={devengo.extras[1]}
            oninput={(e) => (devengo.extras[1] = e.currentTarget.value)}
            title="Importe de la paga en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById("no_pro")!.focus();
                }
            }}
        />

        <div class="flex flex-row gap-2">
            <input
                type="checkbox"
                name={"no_pro"}
                id={"no_pro"}
                bind:checked={devengo.noProrratear}
                onchange={(e) => {
                    devengo.noProrratear = e.currentTarget.checked;
                }}
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateWage();
                    else {
                        document.getElementById("long_t_0")?.focus();
                    }
                }}
            />
            <label class="whitespace-nowrap" for={"no_pro"}
                >¿Excluir prorrata del sueldo bruto?</label
            >
        </div>
    </div>

    {#each devengo.longevidad as plus, index}
        <div class="mb-3 flex w-full flex-col items-center gap-3 sm:flex-row">
            <code class="font-mono! whitespace-nowrap">Plus longevidad #{index + 1}</code>

            <Input
                type="number"
                bind:value={plus[0]}
                oninput={(e) => (devengo.longevidad[index][0] = e.currentTarget.value)}
                title="¿Cada cuántos años cobras este plus?"
                required
                name={"long_t_" + index}
                id={"long_t_" + index}
                tail="w-full! flex-1 sm:flex-3"
                channel="ZakaProfe"
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateWage();
                    else {
                        document.getElementById(`long_per_${index}`)?.focus();
                    }
                }}
            />

            <Input
                channel="ZakaProfe"
                tail="w-full flex-1"
                type="number"
                name={"long_per_" + index}
                id={"long_per_" + index}
                bind:value={plus[1]}
                oninput={(e) => (devengo.longevidad[index][1] = e.currentTarget.value)}
                title="Porcentaje (0 - 100) en que te incrementa el sueldo"
                required
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateWage();
                    else {
                        document.getElementById(index == 0 ? "anos" : "grupo_cot")?.focus();
                    }
                }}
            />

            <Button
                title="Eliminar este plus de longevidad"
                tail="sm:w-inherit! w-auto!"
                callback={() => {
                    devengo.longevidad.splice(index, 1);
                    devengo.longevidad = [...devengo.longevidad];
                }}
                channel="ZakaProfe"
            >
                Eliminar
            </Button>
            {#if index == 0}
                <Input
                    type="number"
                    bind:value={devengo.anos}
                    oninput={(e) => (devengo.anos = e.currentTarget.value)}
                    title="¿Cuántos años COMPLETOS tienes?"
                    required
                    name={"anos"}
                    id={"anos"}
                    tail="w-full! flex-1 sm:flex-3"
                    channel="ZakaProfe"
                    onkeydown={(e) => {
                        if (e.key !== "Enter") return;
                        if (e.shiftKey) calculateWage();
                        else {
                            document.getElementById("plus_imp_0")?.focus();
                            /* setTimeout(() => {
                                document.getElementById(`long_t_${index + 1}`)?.focus();
                            }, 100); */
                        }
                    }}
                />
                <Button
                    tail={"sm:w-inherit! w-auto!"
                        + (index == devengo.longevidad.length - 1 && devengo.longevidad.length > 1
                            ? " opacity-50 cursor-not-allowed! pointer-events-none"
                            : "")}
                    title="Añadir un plus por longevidad"
                    callback={() => {
                        devengo.longevidad = [...devengo.longevidad, ["", ""]];
                    }}
                    channel="ZakaProfe">Añadir</Button
                >
            {/if}
        </div>
    {/each}

    {#each devengo.pluses as plus, index}
        <div class="mb-3 flex w-full flex-col items-center gap-3 sm:flex-row">
            <code class="font-mono! whitespace-nowrap">Añadir plus #{index + 1}</code>

            <Input
                type="number"
                bind:value={plus[0]}
                oninput={(e) => (devengo.pluses[index][0] = e.currentTarget.value)}
                title="¿Cuánto te van a pagar?"
                required
                name={"plus_imp_" + index}
                id={"plus_imp_" + index}
                tail="w-full! flex-1 sm:flex-3"
                channel="ZakaProfe"
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateWage();
                    else {
                        document.getElementById(`plus_limite_${index}`)?.focus();
                    }
                }}
            />

            <Input
                channel="ZakaProfe"
                tail="w-full flex-1"
                type="number"
                name={"plus_limite_" + index}
                id={"plus_limite_" + index}
                bind:value={plus[1]}
                disabled
                oninput={(e) => (devengo.pluses[index][1] = e.currentTarget.value)}
                title="Mínimo para cotizar (vacío si cotiza siempre)"
                required
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateWage();
                    else document.getElementById(`plus_exc_${index}`)?.focus();
                }}
            />

            <div class="flex flex-row gap-2">
                <input
                    type="checkbox"
                    name={"plus_exc_" + index}
                    id={"plus_exc_" + index}
                    bind:checked={plus[2]}
                    onchange={(e) => {
                        devengo.pluses[index][2] = e.currentTarget.checked;
                    }}
                    onkeydown={(e) => {
                        if (e.key !== "Enter") return;
                        if (e.shiftKey) calculateWage();
                        else {
                            if (index + 1 == devengo.pluses.length) {
                                devengo.pluses = [...devengo.pluses, ["", "", false]];
                            }
                            setTimeout(() => {
                                document.getElementById(`plus_imp_${index + 1}`)?.focus();
                            }, 100);
                        }
                    }}
                />
                <label class="whitespace-nowrap" for={"plus_exc_" + index}
                    >¿Excluir del <abbr title="Impuesto a la Renta de las Personas Físicas"
                        >I.R.P.F.</abbr
                    >?</label
                >
            </div>

            <Button
                title="Eliminar este plus salarial"
                tail="sm:w-inherit! w-auto!"
                callback={() => {
                    devengo.pluses.splice(index, 1);
                    devengo.pluses = [...devengo.pluses];
                }}
                channel="ZakaProfe">Eliminar</Button
            >
            {#if index == 0}
                <Button
                    tail={"sm:w-inherit! w-auto!"
                        + (index == devengo.pluses.length - 1 && devengo.pluses.length > 1
                            ? " opacity-50 cursor-not-allowed! pointer-events-none"
                            : "")}
                    title="Añadir un plus salarial"
                    callback={() => {
                        devengo.pluses = [...devengo.pluses, ["", "", false]];
                    }}
                    channel="ZakaProfe">Añadir</Button
                >
            {/if}
        </div>
    {/each}

    <hr />

    <div class="mb-3 flex w-full flex-col items-center gap-3 sm:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap"
            ><abbr
                title="Base de Cotización de las Contingencias Comunes (BCCC) de la seguridad social"
            >
                BCCC
            </abbr></code
        >

        <select
            class="w-full"
            name="grupo_cot"
            id="grupo_cot"
            bind:value={devengo.grupo_cot}
            onchange={(e) => {
                devengo.grupo_cot = e.currentTarget.value;
            }}
            title="Grupo profesional"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
            }}
        >
            <option value="" disabled>(Elige algo)</option>
            {#each Object.entries(basesCotContingenciasComunes) as [idx, base]}
                <option value={idx}
                    >{base[0]}
                    {bcDiaria(Number(idx)) ? "[COT. DIARIA]" : "[COT. MENSUAL]"} [GRUPO {idx}]</option
                >
            {/each}
        </select>
    </div>
    {#if bcDiaria(Number(devengo.grupo_cot))}
        <div class="mb-3 flex w-full flex-col items-center gap-3 sm:flex-row">
            <code class="flex-none font-mono! whitespace-nowrap">Dias cobrados</code>

            <Input
                channel="ZakaProfe"
                type="number"
                name="jornada_d"
                id="jornada_d"
                bind:value={devengo.jornadaDias}
                oninput={(e) => (devengo.jornadaDias = e.currentTarget.value)}
                title="Días que vas a cobrar"
                required
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateWage();
                    else {
                        document.getElementById("irpf_i")!.focus();
                    }
                }}
            />
        </div>{/if}
    <div class="mb-1 flex w-full flex-col items-center gap-3 sm:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">I.R.P.F.</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="irpf_i"
            id="irpf_i"
            bind:value={devengo.irpf}
            oninput={(e) => (devengo.irpf = e.currentTarget.value)}
            title="Porcentaje de IRPF a desgravar"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                calculateWage();
            }}
        />
    </div>
    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button
            callback={calculateWage}
            channel="ZakaProfe"
            title="Calcular la nómina con los datos introducidos."
            ><b>&starf;</b> Calcular salario</Button
        >
        <Button
            callback={share}
            channel="ZakaProfe"
            popovertarget="share-popover"
            title="Generar un enlace para compartir el resultado."><b>&nearr;</b> Compartir</Button
        >
    </div>
    <div
        id="share-popover"
        class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4"
        popover
    >
        ¡Enlace copiado al portapapeles! Incluye todas las notas que tengas escritas aquí.
    </div>
    {#if resultado}
        <p>DEVENGO</p>
        <Table
            channel="ZakaProfe"
            table={[
                ["Sueldo base", resultado.salarioPeriodo],
                ["Suelto en especie", resultado.salarioEspecie],
                ["Suma de los pluses que NO cotizan", resultado.plusesNoCotizados],
                ["Suma de los pluses que SÍ cotizan", resultado.plusesCotizados],
                ["Longevidad", resultado.longevidad],
                [
                    "Prorrata de pagas extra",
                    `${resultado.prorrateoExtras.toFixed(2)}${devengo.noProrratear ? " (IGNORADA)" : ""}`,
                ],
                ["Horas extraordinarias de fuerza mayor", resultado.horasForzosas],
                ["Horas extra adicionales", resultado.horasAdicionales],
                ["=> SALARIO BRUTO", "=> " + resultado.totalDevengado],
            ]}
        />
        <p><s>ME ROBAN</s> DEDUZCO</p>
        <Table
            channel="ZakaProfe"
            table={[
                ["Contingencias comunes", resultado.robo.contingencias],
                ["Desempleo", resultado.robo.desempleo],
                ["Formación Profesional", resultado.robo.fp],
                ["Mecanismo de Equidad Intergeneracional", resultado.robo.mei],
                ["Horas extraordinarias de fuerza mayor", resultado.robo.hefm],
                ["Horas extra adicionales", resultado.robo.rhe],
                ["Impuesto a la Renta de las Personas Físicas", resultado.robo.irpf],
                ["=> TOTAL APORTACIONES A LA SEGURIDAD SOCIAL", "=> " + resultado.totalRobado],
            ]}
        />
        <p>BASES DE COTIZACIÓN</p>
        <Table
            channel="ZakaProfe"
            table={[
                ["BCCC", resultado.bccc],
                ["BCCP", resultado.bccp],
                ["HE (proveído por usted)", resultado.horasForzosas],
            ]}
        />
        <p>INGRESO NETO</p>
        <Table channel="ZakaProfe" table={[["=> LÍQUIDO A PERCIBIR", "=> " + resultado.neto]]} />
    {/if}
</main>
