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
        grupoCot: keyof typeof basesCotContingenciasComunes;
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
        try {
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
            const grupoCot = num(devengo.grupo_cot) as 1;
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

            if (!base) throw "El salario base es obligatorio";

            if (!bcDiaria(grupoCot) && !bcMensual(grupoCot))
                throw "Tienes que especificar un grupo de cotización válido.";

            if (extrasCnt < 2)
                throw "Oye, que por ley te corresponden al menos dos pagas extras. Pusiste menos.";
            if (extrasVal < base)
                throw "Oye, que por ley las pagas extras deben ser, al menos, iguales al sueldo base.";
            if (irpf == 0) throw "Tienes que especificar el porcentaje de IRPF a pagar.";

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
                grupoCot,
            };

            console.log(devengo, resultado);

            return;
        } catch (e) {
            alert("Error: " + e);
        }
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
        ejemplo)<br /><br />
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
        <br />Para que entiendas, si cobras mensualmente (lo normal), pon aquí tu sueldo mensual, y
        se asumirá que te están pagando por 30 días de trabajo (tenga el mes 28, 29, 30 o 31 días).<br
        />Si cobras por días (grupos de cotización del 8 al 11), pon aquí el sueldo diario. Abajo,
        cuando elijas el grupo de cotización, aparecerá una entrada para indicar los días
        trabajados.
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
        Pon en las dos entradas de arriba cuánto has cobrado por las horas extraordinarias
        convencionales y por las de fuerza mayor. Déjalo vacío si no has cobrado horas extra.
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
            >Grupo de cot. (<abbr
                title="Base de Cotización de las Contingencias Comunes (BCCC) de la seguridad social"
            >
                BCCC
            </abbr>)</code
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
        ¡Enlace copiado al portapapeles! Incluye todos los números que has añadido aquí.
    </div>
    {#if resultado}
        <br />
        <p>DEVENGO</p>
        <br />
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
                ["SALARIO BRUTO", resultado.totalDevengado],
            ]}
        />
        <br />
        <p><s>ME ROBAN</s> DEDUZCO</p>
        <br />
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
                ["TOTAL APORTACIONES A LA SEGURIDAD SOCIAL", resultado.totalRobado],
            ]}
        />
        <br />
        <p>BASES DE COTIZACIÓN</p>
        <br />
        <Table
            channel="ZakaProfe"
            table={[
                ["BCCC", resultado.bccc],
                ["BCCP", resultado.bccp],
                ["HE (proveído por usted)", resultado.horasForzosas],
            ]}
        />
        <br />
        <p>INGRESO NETO</p>
        <br />
        <Table channel="ZakaProfe" table={[["LÍQUIDO A PERCIBIR", resultado.neto]]} />
        <br />
        <h1>¿Cómo se ha calculado esto?</h1>
        <hr />

        <h2 class="text-xl">Lo que devengo</h2>
        <br />

        <p>
            - El sueldo base {#if bcMensual(resultado.grupoCot)}
                es fijo (<span class="font-serif">{devengo.base}</span>)
            {:else}
                se obtiene multiplicando la base {devengo.base} por los días {devengo.jornadaDias} (<span
                    class="font-serif"
                    >{devengo.base} ✕ {devengo.jornadaDias} =
                    <b>{resultado.salarioPeriodo}</b></span
                >).
            {/if}
        </p>

        {#if resultado.plusesCotizados > 0}
            <p>
                - Los pluses cotizables suman <b>{resultado.plusesCotizados}</b>. Se añaden al
                sueldo base para calcular la base computable (<span class="font-serif"
                    >{resultado.salarioPeriodo} + {resultado.plusesCotizados} =
                    <b>{resultado.salarioPeriodo + resultado.plusesCotizados}</b></span
                >).
            </p>
        {/if}

        {#if resultado.prorrateoExtras > 0}
            <p>
                - Tienes {devengo.extras[0]} pagas extras de {devengo.extras[1]} cada una, lo que supone
                <span class="font-serif"
                    >{devengo.extras[0]} ✕ {devengo.extras[1]} = {Number(devengo.extras[0])
                        * Number(devengo.extras[1])}</span
                >
                al año. Prorrateado {#if bcMensual(resultado.grupoCot)}entre 12 meses{:else}entre
                    365 días{/if}, corresponden <b>{resultado.prorrateoExtras}</b> por período.
                {#if devengo.noProrratear}
                    Como has indicado que las extras <em>no</em> se prorratean en nómina, este
                    importe
                    <b>se resta del devengado</b> (se abonará en el mes correspondiente).
                {/if}
            </p>
        {/if}

        {#if resultado.longevidad > 0}
            <p>
                - Por antigüedad ({devengo.anos} años en la empresa), se añaden
                <b>{resultado.longevidad}</b> al período.
            </p>
        {/if}

        {#if resultado.horasForzosas > 0}
            <p>
                - Horas extra forzosas: <b>{resultado.horasForzosas}</b>.
            </p>
        {/if}

        {#if resultado.horasAdicionales > 0}
            <p>
                - Horas extra adicionales (voluntarias): <b>{resultado.horasAdicionales}</b>.
            </p>
        {/if}

        {#if resultado.salarioEspecie > 0}
            <p>
                - Retribución en especie: <b>{resultado.salarioEspecie}</b>. Computa en el devengado
                pero
                <em>no</em> entra en las bases de cotización.
            </p>
        {/if}

        {#if resultado.plusesNoCotizados > 0}
            <p>
                - Los pluses no cotizables suman <b>{resultado.plusesNoCotizados}</b>. Forman parte
                del devengado pero <em>no</em> cotizan a la Seguridad Social.
            </p>
        {/if}

        <br />
        <h2 class="text-xl">Las bases de cotización</h2>
        <br />

        <p>
            - La <b>base computable</b> es el sueldo base más los pluses cotizables:
            <span class="font-serif"
                >{resultado.salarioPeriodo} + {resultado.plusesCotizados} =
                <b>{resultado.salarioPeriodo + resultado.plusesCotizados}</b></span
            >.
        </p>

        <p>
            - La <b>base de cotización por contingencias comunes (BCCC)</b> añade a la base
            computable el prorrateo de extras y la antigüedad:
            <span class="font-serif"
                >{resultado.salarioPeriodo + resultado.plusesCotizados} + {resultado.prorrateoExtras}
                +
                {resultado.longevidad} = <b>{resultado.bccc}</b></span
            >.
        </p>

        <p>
            - La <b>base de cotización por contingencias profesionales (BCCP)</b> añade además las
            horas extra:
            <span class="font-serif"
                >{resultado.bccc} + {resultado.horasForzosas} + {resultado.horasAdicionales} =
                <b>{resultado.bccp}</b></span
            >.
        </p>

        <br />
        <h2 class="text-xl">Lo que <s>me roban</s> cobra el Estado</h2>
        <br />

        <p>
            - <b>Contingencias comunes</b>: el 4,70 % de la BCCC (<span class="font-serif"
                >{resultado.bccc} ✕ 4,70 % = <b>{resultado.robo.contingencias.toFixed(2)}</b></span
            >).
        </p>

        <p>
            - <b>Desempleo</b>: en contratos indefinidos, el 1,55 % de la BCCP (<span
                class="font-serif"
                >{resultado.bccp} ✕ 1,55 % = <b>{resultado.robo.desempleo.toFixed(2)}</b></span
            >).
        </p>

        <p>
            - <b>Mecanismo de Equidad Intergeneracional (MEI)</b>: el 0,15 % de la BCCC (<span
                class="font-serif"
                >{resultado.bccc} ✕ 0,15 % = <b>{resultado.robo.mei.toFixed(2)}</b></span
            >).
        </p>

        <p>
            - <b>Formación Profesional</b>: el 0,10 % de la BCCP (<span class="font-serif"
                >{resultado.bccp} ✕ 0,10 % = <b>{resultado.robo.fp.toFixed(2)}</b></span
            >).
        </p>

        {#if resultado.horasForzosas > 0}
            <p>
                - <b>Horas extra forzosas</b>: el 2 % sobre {resultado.horasForzosas} (<span
                    class="font-serif"
                    >{resultado.horasForzosas} ✕ 2 % = <b>{resultado.robo.hefm.toFixed(2)}</b></span
                >).
            </p>
        {/if}

        {#if resultado.horasAdicionales > 0}
            <p>
                - <b>Horas extra voluntarias</b>: el 4,70 % sobre {resultado.horasAdicionales} (<span
                    class="font-serif"
                    >{resultado.horasAdicionales} ✕ 4,70 % =
                    <b>{resultado.robo.rhe.toFixed(2)}</b></span
                >).
            </p>
        {/if}

        <p>
            - <b>IRPF</b>: el {devengo.irpf} % sobre la base computable ({resultado.salarioPeriodo
                + resultado.plusesCotizados}) (<span class="font-serif"
                >{resultado.salarioPeriodo + resultado.plusesCotizados} ✕ {devengo.irpf} % =
                <b>{resultado.robo.irpf.toFixed(2)}</b></span
            >).
        </p>

        <br />
        <h2 class="text-xl">El resultado</h2>
        <br />

        <p>
            - <b>Total devengado</b>: {resultado.bccc}
            {#if resultado.salarioEspecie > 0}+ {resultado.salarioEspecie} (especie){/if}
            {#if resultado.horasAdicionales > 0}+ {resultado.horasAdicionales} (h. extra voluntarias){/if}
            {#if resultado.horasForzosas > 0}+ {resultado.horasForzosas} (h. extra forzosas){/if}
            {#if resultado.plusesNoCotizados > 0}+ {resultado.plusesNoCotizados} (pluses no cotizables){/if}
            {#if devengo.noProrratear && resultado.prorrateoExtras > 0}
                − {resultado.prorrateoExtras} (extras no prorrateadas)
            {/if}
            = <b>{resultado.totalDevengado.toFixed(2)}</b>.
        </p>

        <p>
            - <b>Total de deducciones</b>: {resultado.robo.contingencias.toFixed(2)} + {resultado.robo.desempleo.toFixed(
                2
            )}
            + {resultado.robo.mei.toFixed(2)} + {resultado.robo.fp.toFixed(2)}
            {#if resultado.horasForzosas > 0}+ {resultado.robo.hefm.toFixed(2)}{/if}
            {#if resultado.horasAdicionales > 0}+ {resultado.robo.rhe.toFixed(2)}{/if}
            + {resultado.robo.irpf.toFixed(2)} = <b>{resultado.totalRobado.toFixed(2)}</b>.
        </p>

        <p>
            - <b>Salario neto</b>: {resultado.totalDevengado.toFixed(2)} - {resultado.totalRobado.toFixed(
                2
            )}
            = <b>{resultado.neto.toFixed(2)}</b>.
        </p>
    {/if}
</main>
