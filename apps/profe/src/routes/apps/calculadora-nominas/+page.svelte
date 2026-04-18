<svelte:options runes={true} />

<script lang="ts">
    import { onMount } from "svelte";
    import { sumArray } from "@zhc.js/number-utils";
    import Button from "@zpw/ui/Button";
    import Input from "@zpw/ui/Input";
    import Table from "@zpw/ui/Table";
    import Checkbox from "@zpw/ui/Checkbox";
    import { yearSize } from "$lib/stuff";
    import Select from "@zpw/ui/Select";

    const basesCotContingenciasComunes = {
        0: [
            "Ingenieros y Licenciados. Personal de alta dirección no incluido en el artículo 1.3.c del Estatuto de los Trabajadores",
            1929.0,
            4909.5,
        ],
        1: ["Ingenieros Técnicos, Peritos y Ayudantes Titulados", 1599.6, 4909.5],
        2: ["Jefes Administrativos y de Taller", 1391.7, 4909.5],
        3: ["Ayudantes no Titulados", 1381.2, 4909.5],
        4: ["Oficiales Administrativos", 1381.2, 4909.5],
        5: ["Subalternos", 1381.2, 4909.5],
        6: ["Auxiliares Administrativos", 1381.2, 4909.5],
        7: ["Oficiales de primera y segunda", 46.04, 163.65],
        8: ["Oficiales de tercera y Especialistas", 46.04, 163.65],
        9: ["Peones", 46.04, 163.65],
        10: [
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
        sumarProrrataAPagaExtra: boolean;
        esTemporal: boolean;
    } = $state({
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
        sumarProrrataAPagaExtra: false,
        esTemporal: false,
    });

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
            horasExtraFuerzaMayor: number;
            restoHorasExtra: number;
            irpf: number;
        };
        neto: number;
        bccc: number;
        bccp: number;
        totalRobado: number;
        grupoCot: keyof typeof basesCotContingenciasComunes;
    } = $state(null);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const nominaParam = params.get("nomina");

        if (!nominaParam) {
            history.replaceState(null, "", window.location.pathname);
            return;
        }

        try {
            devengo = JSON.parse(decodeURIComponent(atob(nominaParam)));
        } catch (error) {
            console.error(error);
            history.replaceState(null, "", window.location.pathname);
        }
    });

    const num = (v: string) => {
        const n = Number(v);
        return isNaN(n) ? 0 : n;
    };

    function calculateWage() {
        try {
            const newParams = `?nomina=${encodeURIComponent(btoa(JSON.stringify(devengo)))}`;
            history.replaceState(null, "", newParams);

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

            if (!base) throw "El salario base es obligatorio.";

            if (base < 1221) throw "El salario base no puede ser menor al S.M.I. de 1221 euros.";

            if (!bcDiaria(grupoCot) && !bcMensual(grupoCot))
                throw "Tienes que especificar un grupo de cotización válido.";

            if (extrasCnt < 2)
                throw "Por ley te corresponden al menos dos pagas extras. Pusiste menos.";
            if (extrasVal < base)
                throw "Las pagas extras deben ser, al menos, iguales al sueldo base.";
            if (irpf == 0) throw "Tienes que especificar el porcentaje de IRPF a pagar.";

            let salarioPeriodo = 0;

            if (bcMensual(grupoCot)) salarioPeriodo = base;
            else salarioPeriodo = base * t;

            let sumLongevidad = 0;

            const anos = num(devengo.anos);
            longevidad.forEach((v) => {
                for (let i = v[0]; i <= anos; i += v[0]) {
                    if (v[0] <= 0) break;
                    sumLongevidad += p(salarioPeriodo, v[1]);
                }
            });

            let prorrateoExtras = 0;

            if (extrasCnt > 0 && extrasVal > 0) {
                const totalExtrasAnual =
                    extrasCnt * (extrasVal + (devengo.sumarProrrataAPagaExtra ? sumLongevidad : 0));
                prorrateoExtras = totalExtrasAnual / (bcMensual(grupoCot) ? 12 : yearSize());
            }

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
                desempleo: p(bccp, devengo.esTemporal ? 1.6 : 1.55),
                mei: p(bccc, 0.15),
                fp: p(bccp, 0.1),
                horasExtraFuerzaMayor: p(horasForzosas, 2),
                restoHorasExtra: p(horasAdicionales, 4.7),
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
</script>

<svelte:head>
    <title>Calculadora de nóminas (España)</title>
    <meta name="description" content="Calcula nóminas en base a la legislación vigente." />
</svelte:head>

<h1>Calculadora de nóminas españolas</h1>
<br />
<p>
    Una calculadora de nóminas salariales. Trata de mantenerse actualiza con la legislación vigente
    y de tomar en cuenta todas las variables posibles para la mayor precisión.<br />Contacte conmigo
    para reportar errores, contenido desactualizado y demás.
    <b>Nota: Aún faltan algunas cosas y ya soy consciente de ello.</b>
    Lo estoy trabajando poco a poco.<br /><br />
    Los campos opcionales se pueden dejar en blanco, no hace falta poner un cero. No están explícitamente
    señalados, pero se sobrentienden (el salario base no es opcional, el plus de nocturnidad sí, por ejemplo)<br
    /><br />
</p>
<h2>Información del contrato</h2>
<br />
<div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
    <code class="flex-none font-mono! whitespace-nowrap"
        >Grupo de cot. (<abbr
            title="Base de Cotización de las Contingencias Comunes (BCCC) de la seguridad social"
        >
            BCCC
        </abbr>)</code
    >

    <Select
        id="grupo_cot"
        value={devengo.grupo_cot}
        onchange={(e) => {
            devengo.grupo_cot = e.currentTarget.value;
        }}
        title="Grupo profesional"
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) calculateWage();
        }}
        options={Object.entries(basesCotContingenciasComunes).map((o, i) => {
            return {
                value: i.toString(),
                label: `[GRUPO ${i.toString().padStart(2, "0")}, ${bcDiaria(Number(i)) ? "COT. DIARIA" : "COT. AL MES"}] ${o[1][0]}`,
            };
        })}
    />
</div>
{#if bcDiaria(Number(devengo.grupo_cot))}
    <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Dias cobrados</code>

        <Input
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
<div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
    <code class="flex-none font-mono! whitespace-nowrap"
        ><abbr title="Impuesto a la Renta de las Personas Físicas">I.R.P.F.</abbr></code
    >

    <Input
        tail="w-full flex-1"
        type="number"
        name="irpf_i"
        id="irpf_i"
        bind:value={devengo.irpf}
        oninput={(e) => (devengo.irpf = e.currentTarget.value)}
        title="Porcentaje de IRPF a desgravar"
        required
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) calculateWage();
            else {
                document.getElementById("sal_base")!.focus();
            }
        }}
    />
</div>
<Checkbox
    tail="mb-3"
    id="is_temp"
    checked={devengo.esTemporal}
    onchange={(e) => {
        devengo.esTemporal = e.currentTarget.checked;
    }}
    onkeydown={(e) => {
        if (e.key !== "Enter") return;
        if (e.shiftKey) calculateWage();
        else {
            document.getElementById("sal_base")?.focus();
        }
    }}>¿Es un contrato temporal/de duración definida?</Checkbox
>
<hr />
<h2>Cuánto te quieren pagar</h2>
<br />
<div class="mb-1 flex w-full flex-col items-center gap-3 md:flex-row">
    <code class="flex-none font-mono! whitespace-nowrap"
        >Salario base {bcMensual(num(devengo.grupo_cot)) ? "mensual" : "diario"}</code
    >

    <Input
        tail="w-full flex-1"
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

<div class="mb-1 flex w-full flex-col items-center gap-3 md:flex-row">
    <code class="flex-none font-mono! whitespace-nowrap"
        ><abbr title="Horas Extraordinarias de Fuerza Mayor">HE de FM</abbr></code
    >

    <Input
        tail="w-full flex-1"
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

    <code class="flex-none font-mono! whitespace-nowrap"
        ><abbr title="Horas Extraordinarias Convencionales">HEC</abbr></code
    >

    <Input
        tail="w-full flex-1"
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
    Horas Extraordinarias <b>de Fuerza Mayor</b> y <b>Convencionales</b>, respectivamente.
</p>

<div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
    <code class="flex-none font-mono! whitespace-nowrap">Salario en especie</code>

    <Input
        tail="w-full flex-1"
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

<div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
    <code class="flex-none font-mono! whitespace-nowrap">Pagas extra</code>

    <Input
        tail="w-full flex-1"
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

    <Checkbox
        id="no_pro"
        checked={devengo.noProrratear}
        onchange={(e) => {
            devengo.noProrratear = e.currentTarget.checked;
        }}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) calculateWage();
            else {
                document.getElementById("long_t_0")?.focus();
            }
        }}>¿Excluir prorrata del sueldo bruto?</Checkbox
    >
</div>

{#each devengo.longevidad as plus, index (index)}
    <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
        <code class="font-mono! whitespace-nowrap">Plus longevidad #{index + 1}</code>

        <Input
            type="number"
            bind:value={plus[0]}
            oninput={(e) => (devengo.longevidad[index][0] = e.currentTarget.value)}
            title="¿Cada cuántos años cobras este plus?"
            required
            name={"long_t_" + index}
            id={"long_t_" + index}
            tail="w-full! flex-1 md:flex-3"
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById(`long_per_${index}`)?.focus();
                }
            }}
        />

        <Input
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
            tail="md:w-inherit! w-auto!"
            onclick={() => {
                devengo.longevidad.splice(index, 1);
                devengo.longevidad = [...devengo.longevidad];
            }}
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
                name="anos"
                id="anos"
                tail="w-full! flex-1 md:flex-3"
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateWage();
                    else {
                        document.getElementById("sumar_pro_pe")?.focus();
                        /* setTimeout(() => {
                                document.getElementById(`long_t_${index + 1}`)?.focus();
                            }, 100); */
                    }
                }}
            />
            <Button
                tail={"md:w-inherit! w-auto!"
                    + (index == devengo.longevidad.length - 1 && devengo.longevidad.length > 1
                        ? " opacity-50 cursor-not-allowed! pointer-events-none"
                        : "")}
                title="Añadir un plus por longevidad"
                onclick={() => {
                    devengo.longevidad = [...devengo.longevidad, ["", ""]];
                }}>Añadir</Button
            >
        {/if}
    </div>
{/each}

<Checkbox
    tail="mb-3"
    id="sumar_pro_pe"
    checked={devengo.sumarProrrataAPagaExtra}
    onchange={(e) => {
        devengo.sumarProrrataAPagaExtra = e.currentTarget.checked;
    }}
    onkeydown={(e) => {
        if (e.key !== "Enter") return;
        if (e.shiftKey) calculateWage();
        else {
            document.getElementById("plus_imp_0")?.focus();
        }
    }}>¿Sumar las prorratas a la paga extra?</Checkbox
>

{#each devengo.pluses as plus, index (index)}
    <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
        <code class="font-mono! whitespace-nowrap">Añadir plus #{index + 1}</code>

        <Input
            type="number"
            bind:value={plus[0]}
            oninput={(e) => (devengo.pluses[index][0] = e.currentTarget.value)}
            title="¿Cuánto te van a pagar?"
            required
            name={"plus_imp_" + index}
            id={"plus_imp_" + index}
            tail="w-full! flex-1 md:flex-3"
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateWage();
                else {
                    document.getElementById(`plus_limite_${index}`)?.focus();
                }
            }}
        />

        <Input
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

        <Checkbox
            id={"plus_exc_" + index}
            checked={plus[2]}
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
            >¿Excluir del <abbr title="Impuesto a la Renta de las Personas Físicas">I.R.P.F.</abbr
            >?</Checkbox
        >

        <Button
            title="Eliminar este plus salarial"
            tail="md:w-inherit! w-auto!"
            onclick={() => {
                devengo.pluses.splice(index, 1);
                devengo.pluses = [...devengo.pluses];
            }}>Eliminar</Button
        >
        {#if index == 0}
            <Button
                tail={"md:w-inherit! w-auto!"
                    + (index == devengo.pluses.length - 1 && devengo.pluses.length > 1
                        ? " opacity-50 cursor-not-allowed! pointer-events-none"
                        : "")}
                title="Añadir un plus salarial"
                onclick={() => {
                    devengo.pluses = [...devengo.pluses, ["", "", false]];
                }}>Añadir</Button
            >
        {/if}
    </div>
{/each}

<br />
<div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
    <Button onclick={calculateWage} title="Calcular la nómina con los datos introducidos."
        ><b>&starf;</b> Calcular salario</Button
    >
    <Button
        onclick={share}
        popovertarget="share-popover"
        title="Generar un enlace para compartir el resultado."><b>&nearr;</b> Compartir</Button
    >
</div>
<div id="share-popover" class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4" popover>
    ¡Enlace copiado al portapapeles! Incluye todos los números que has añadido aquí.
</div>
{#if resultado}
    <br />
    <h2>Resultados de la nómina</h2>
    <h3>DEVENGO</h3>
    <br />
    <Table
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
    <h3><s>ME ROBAN</s> DEDUZCO</h3>
    <br />
    <Table
        table={[
            ["Contingencias comunes", resultado.robo.contingencias],
            ["Desempleo", resultado.robo.desempleo],
            ["Formación Profesional", resultado.robo.fp],
            ["Mecanismo de Equidad Intergeneracional", resultado.robo.mei],
            ["Horas extraordinarias de fuerza mayor", resultado.robo.horasExtraFuerzaMayor],
            ["Horas extra adicionales", resultado.robo.restoHorasExtra],
            ["Impuesto a la Renta de las Personas Físicas", resultado.robo.irpf],
            ["TOTAL APORTACIONES A LA SEGURIDAD SOCIAL", resultado.totalRobado],
        ]}
    />
    <br />
    <h3>BASES DE COTIZACIÓN</h3>
    <br />
    <Table
        table={[
            ["BCCC", resultado.bccc],
            ["BCCP", resultado.bccp],
            ["HE (proveído por usted)", resultado.horasForzosas],
        ]}
    />
    <br />
    <h3>INGRESO NETO</h3>
    <br />
    <Table table={[["LÍQUIDO A PERCIBIR", resultado.neto]]} />
    <br />
    <hr />
    <h2>¿Cómo se ha calculado esto?</h2>
    <br />
    <h3>Lo que devengo</h3>
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
            - Los pluses cotizables suman <b>{resultado.plusesCotizados}</b>. Se añaden al sueldo
            base para calcular la base computable (<span class="font-serif"
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
                {yearSize()} días{/if}, corresponden
            <b>{resultado.prorrateoExtras.toFixed(2)}</b>
            por período.
            {#if devengo.noProrratear}
                Como has indicado que las extras <em>no</em> se prorratean en nómina, este importe
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
            - Los pluses no cotizables suman <b>{resultado.plusesNoCotizados}</b>. Forman parte del
            devengado pero <em>no</em> cotizan a la Seguridad Social.
        </p>
    {/if}

    <br />
    <h3>Las bases de cotización</h3>
    <br />

    <p>
        - La <b>base computable</b> es el sueldo base más los pluses cotizables:
        <span class="font-serif"
            >{resultado.salarioPeriodo.toFixed(2)} + {resultado.plusesCotizados.toFixed(2)} =
            <b>{(resultado.salarioPeriodo + resultado.plusesCotizados).toFixed(2)}</b></span
        >.
    </p>

    <p>
        - La <b>base de cotización por contingencias comunes (BCCC)</b> añade a la base computable
        el prorrateo de extras y la antigüedad:
        <span class="font-serif"
            >{(resultado.salarioPeriodo + resultado.plusesCotizados).toFixed(2)} + {resultado.prorrateoExtras.toFixed(
                2
            )}
            +
            {resultado.longevidad.toFixed(2)} = <b>{resultado.bccc.toFixed(2)}</b></span
        >.
    </p>

    <p>
        - La <b>base de cotización por contingencias profesionales (BCCP)</b> añade además las horas
        extra:
        <span class="font-serif"
            >{resultado.bccc.toFixed(2)} + {resultado.horasForzosas} + {resultado.horasAdicionales}
            =
            <b>{resultado.bccp.toFixed(2)}</b></span
        >.
    </p>

    <br />
    <h3>Lo que <s>me roban</s> cobra el Estado</h3>
    <br />

    <p>
        - <b>Contingencias comunes</b>: el 4,70 % de la BCCC (<span class="font-serif"
            >{resultado.bccc.toFixed(2)} ✕ 4,70 % =
            <b>{resultado.robo.contingencias.toFixed(2)}</b></span
        >).
    </p>

    <p>
        - <b>Desempleo</b>: en contratos {devengo.esTemporal
            ? "temporales, el 1,60 %"
            : "indefinidos, el 1,55 %"}, el 1,55 % de la BCCP (<span class="font-serif"
            >{resultado.bccp.toFixed(2)} ✕ {devengo.esTemporal ? "1,60" : "1,55"} % =
            <b>{resultado.robo.desempleo.toFixed(2)}</b></span
        >).
    </p>

    <p>
        - <b>Mecanismo de Equidad Intergeneracional (MEI)</b>: el 0,15 % de la BCCC (<span
            class="font-serif"
            >{resultado.bccc.toFixed(2)} ✕ 0,15 % = <b>{resultado.robo.mei.toFixed(2)}</b></span
        >).
    </p>

    <p>
        - <b>Formación Profesional</b>: el 0,10 % de la BCCP (<span class="font-serif"
            >{resultado.bccp.toFixed(2)} ✕ 0,10 % = <b>{resultado.robo.fp.toFixed(2)}</b></span
        >).
    </p>

    {#if resultado.horasForzosas > 0}
        <p>
            - <b>Horas extra forzosas</b>: el 2 % sobre {resultado.horasForzosas} (<span
                class="font-serif"
                >{resultado.horasForzosas} ✕ 2 % =
                <b>{resultado.robo.horasExtraFuerzaMayor.toFixed(2)}</b></span
            >).
        </p>
    {/if}

    {#if resultado.horasAdicionales > 0}
        <p>
            - <b>Horas extra voluntarias</b>: el 4,70 % sobre {resultado.horasAdicionales} (<span
                class="font-serif"
                >{resultado.horasAdicionales} ✕ 4,70 % =
                <b>{resultado.robo.restoHorasExtra.toFixed(2)}</b></span
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
    <h3>El resultado</h3>
    <br />

    <p>
        - <b>Total devengado</b>: {resultado.bccc.toFixed(2)}
        {#if resultado.salarioEspecie > 0}+ {resultado.salarioEspecie} (especie){/if}
        {#if resultado.horasAdicionales > 0}+ {resultado.horasAdicionales} (h. extra voluntarias){/if}
        {#if resultado.horasForzosas > 0}+ {resultado.horasForzosas} (h. extra forzosas){/if}
        {#if resultado.plusesNoCotizados > 0}+ {resultado.plusesNoCotizados} (pluses no cotizables){/if}
        {#if devengo.noProrratear && resultado.prorrateoExtras > 0}
            - {resultado.prorrateoExtras} (extras no prorrateadas)
        {/if}
        = <b>{resultado.totalDevengado.toFixed(2)}</b>.
    </p>

    <p>
        - <b>Total de deducciones</b>: {resultado.robo.contingencias.toFixed(2)} + {resultado.robo.desempleo.toFixed(
            2
        )}
        + {resultado.robo.mei.toFixed(2)} + {resultado.robo.fp.toFixed(2)}
        {#if resultado.horasForzosas > 0}+ {resultado.robo.horasExtraFuerzaMayor.toFixed(2)}{/if}
        {#if resultado.horasAdicionales > 0}+ {resultado.robo.restoHorasExtra.toFixed(2)}{/if}
        + {resultado.robo.irpf.toFixed(2)} = <b>{resultado.totalRobado.toFixed(2)}</b>.
    </p>

    <p>
        - <b>Salario neto</b>: {resultado.totalDevengado.toFixed(2)} - {resultado.totalRobado.toFixed(
            2
        )}
        = <b>{resultado.neto.toFixed(2)}</b>.
    </p>
{/if}
