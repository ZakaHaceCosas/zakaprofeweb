<script lang="ts">
    import { onMount } from "svelte";
    import Button from "$lib/Button.svelte";
    import Input from "$lib/Input.svelte";
    import Table from "$lib/Table.svelte";
    import Checkbox from "$lib/Checkbox.svelte";
    import { yearSize } from "$lib/stuff";

    let deuda: {
        base: string;
        extras: string;
        meses: string;
        isSemestral: boolean;
        isBad: boolean;
        isWorse: boolean;
        daysLastExtra: string;
        end: string;
        daysInd: string;
        enjoyedDays: string;
        daysAnt: string;
    } = {
        base: "",
        extras: "",
        isSemestral: false,
        isBad: false,
        isWorse: false,
        daysLastExtra: "",
        end: "",
        meses: "",
        daysInd: "",
        enjoyedDays: "",
        daysAnt: "",
    };

    let resultado: null | {
        data: {
            dailyWage: number;
            daysSinceYear: number;
            daysSinceMonth: number;
            divisorSemestral: number;
            enjoyedDays: number;
            sanctionDays: number;
            workedMonths: number;
        };
        result: {
            vacation: number;
            extraPayouts: number;
            pendingWage: number;
            ind: number;
            lateness: number;
        };
        total: number;
    } = null;

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const fqParam = params.get("finiquito");

        if (!fqParam) {
            history.replaceState(null, "", window.location.pathname);
            return;
        }

        try {
            deuda = JSON.parse(decodeURIComponent(atob(fqParam)));
        } catch (error) {
            console.error(error);
            history.replaceState(null, "", window.location.pathname);
        }
    });

    const num = (v: string) => {
        const n = Number(v);
        return isNaN(n) ? 0 : n;
    };

    function calculateLiquidation() {
        try {
            const newParams = `?finiquito=${encodeURIComponent(btoa(JSON.stringify(deuda)))}`;
            history.replaceState(null, "", newParams);

            const now = new Date(deuda.end);
            const base = num(deuda.base);
            const daysSinceLastPayout = num(deuda.daysLastExtra);
            const extra = num(deuda.extras);
            const sanctionDays = num(deuda.daysInd);
            const workedMonths = num(deuda.meses);
            const enjoyedDays = num(deuda.enjoyedDays);
            const daysLate = num(deuda.daysAnt);

            const daysSince = (dateA: Date, dateB: Date) => {
                const diffInMs = Math.abs(dateA.getTime() - dateB.getTime());
                return Math.round(diffInMs / (1000 * 60 * 60 * 24));
            };
            const daysSinceYear = daysSince(new Date(now.getFullYear(), 0, 1), now);
            const daysSinceMonth = daysSince(new Date(now.getFullYear(), now.getMonth(), 1), now);
            const dailyWage = (base * 12 + extra * 2) / 365;
            const divisorSemestral =
                daysSinceYear > (yearSize() == 366 ? 182 : 181)
                    ? yearSize() == 366
                        ? 182
                        : 181
                    : 184;

            const pendingWage = dailyWage * daysSinceMonth;
            const extraPayouts: number = deuda.isSemestral
                ? (daysSinceLastPayout * extra) / divisorSemestral
                : (daysSinceLastPayout * extra) / yearSize();

            // TODO: soportar valores diferentes a 30 si el tio tiene vacaciones raras
            const vacation = dailyWage * ((daysSinceYear * 30) / yearSize() - enjoyedDays);

            const ind = deuda.isBad ? dailyWage * sanctionDays * (workedMonths / 12) : 0;
            const lateness = deuda.isWorse ? (15 - daysLate) * dailyWage : 0;

            const result = {
                vacation,
                extraPayouts,
                pendingWage,
                ind,
                lateness,
            };
            resultado = {
                data: {
                    dailyWage,
                    daysSinceYear,
                    daysSinceMonth,
                    workedMonths,
                    enjoyedDays,
                    divisorSemestral,
                    sanctionDays,
                },
                result,
                total: Object.values(result).reduce((curr, acc) => (curr += acc), 0),
            };

            return;
        } catch (e) {
            alert("Error: " + e);
        }
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/calculadora-finiquitos?finiquito=${encodeURIComponent(btoa(JSON.stringify(deuda)))}`
        );
    }
</script>

<svelte:head>
    <title>Calculadora de finiquitos (España)</title>
    <meta name="description" content="Calcula finiquitos en base a la legislación vigente." />
</svelte:head>

<main>
    <h1>Calculadora de finiquitos españoles</h1>
    <br />
    <p>
        Una calculadora de liquidaciones de contrato laboral («finiquitos»). Trata de mantenerse
        actualizada con la legislación vigente y de tomar en cuenta todas las variables posibles
        para la mayor precisión.<br />Contacte conmigo para reportar errores, contenido
        desactualizado y demás.
    </p>
    <hr />
    <h2>Información del finiquito</h2>
    <br />
    <Checkbox
        tail="mb-3"
        id={"is_semestral"}
        checked={deuda.isSemestral}
        onchange={(e) => {
            deuda.isSemestral = e.currentTarget.checked;
        }}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) calculateLiquidation();
            else {
                document.getElementById("is_bad")?.focus();
            }
        }}>¿Las pagas extras son semestrales? (No marcar si son anuales, que es lo común)</Checkbox
    >
    <Checkbox
        tail="mb-3"
        id={"is_bad"}
        checked={deuda.isBad}
        onchange={(e) => {
            deuda.isBad = e.currentTarget.checked;
        }}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) calculateLiquidation();
            else {
                document.getElementById("is_worse")?.focus();
            }
        }}>¿Te tienen que dar una indemnización por tu terminación del contrato?</Checkbox
    >
    <Checkbox
        tail="mb-3"
        id={"is_worse"}
        checked={deuda.isWorse}
        onchange={(e) => {
            deuda.isWorse = e.currentTarget.checked;
        }}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) calculateLiquidation();
            else {
                document.getElementById("sal_base")?.focus();
            }
        }}>¿Te han avisado fuera de plazo?</Checkbox
    >
    <hr />
    <h2>Cuánto te debe la empresa</h2>
    <br />
    <div class="mb-1 flex w-full flex-col items-center gap-3 md:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Salario total mensual</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="sal_base"
            id="sal_base"
            bind:value={deuda.base}
            oninput={(e) => (deuda.base = e.currentTarget.value)}
            title="Salario base en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateLiquidation();
                else {
                    document.getElementById("pagas_extra")!.focus();
                }
            }}
        />
    </div>
    <p>Se asume que ya has calculado el sueldo mensual (suma de la base y los complementos).</p>
    <br />
    <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap">Importe pagas extra</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="pagas_extra"
            id="pagas_extra"
            bind:value={deuda.extras}
            oninput={(e) => (deuda.extras = e.currentTarget.value)}
            title="Importe de las pagas en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateLiquidation();
                else {
                    document.getElementById("pagas_extra_days")!.focus();
                }
            }}
        />

        <code class="flex-none font-mono! whitespace-nowrap">Días desde el último cobro</code>

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="pagas_extra_days"
            id="pagas_extra_days"
            bind:value={deuda.daysLastExtra}
            oninput={(e) => (deuda.daysLastExtra = e.currentTarget.value)}
            title="Días enteros tras el último cobro"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateLiquidation();
                else {
                    document.getElementById("end_date")!.focus();
                }
            }}
        />
    </div>
    <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap"
            >¿Cuándo termina oficialmente el contrato?</code
        >

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="date"
            name="end_date"
            id="end_date"
            bind:value={deuda.end}
            oninput={(e) => (deuda.end = e.currentTarget.value)}
            title="Importe de las pagas en euros"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateLiquidation();
                else {
                    document.getElementById("vac_days_enjoyed")!.focus();
                }
            }}
        />
    </div>
    <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
        <code class="flex-none font-mono! whitespace-nowrap"
            >¿Cuántos días de vacaciones has disfrutado este año?</code
        >

        <Input
            tail="w-full flex-1"
            channel="ZakaProfe"
            type="number"
            name="vac_days_enjoyed"
            id="vac_days_enjoyed"
            bind:value={deuda.enjoyedDays}
            oninput={(e) => (deuda.enjoyedDays = e.currentTarget.value)}
            title="Número de días, no hace falta que pongas nada si no has disfrutado vacaciones"
            required
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                if (e.shiftKey) calculateLiquidation();
                else {
                    document.getElementById("meses")!.focus();
                }
            }}
        />
    </div>
    {#if deuda.isBad}
        <h3>Indemnización</h3>
        <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
            <code class="flex-none font-mono! whitespace-nowrap"
                >¿Cuántos MESES has trabajado en la empresa? (Completos)</code
            >

            <Input
                tail="w-full flex-1"
                channel="ZakaProfe"
                type="number"
                name="meses"
                id="meses"
                bind:value={deuda.meses}
                oninput={(e) => (deuda.meses = e.currentTarget.value)}
                title="Consejo: Recuerda los años, eso por doce mas los meses de este año"
                required
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateLiquidation();
                    else {
                        document.getElementById("days_ind")!.focus();
                    }
                }}
            />
        </div>

        <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
            <code class="flex-none font-mono! whitespace-nowrap"
                >¿Cuántos días de indemnización son?</code
            >

            <Input
                tail="w-full flex-1"
                channel="ZakaProfe"
                type="number"
                name="days_ind"
                id="days_ind"
                bind:value={deuda.daysInd}
                oninput={(e) => (deuda.daysInd = e.currentTarget.value)}
                title="(NOTA: ya añadiré un asistente por si no te los sabes)"
                required
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateLiquidation();
                    else {
                        document.getElementById("days_ant")!.focus();
                    }
                }}
            />
        </div>
    {/if}
    {#if deuda.isWorse}
        <h3>Aviso tardío</h3>
        <div class="mb-3 flex w-full flex-col items-center gap-3 md:flex-row">
            <code class="flex-none font-mono! whitespace-nowrap"
                >¿Con cuántos días de antelación te han avisado?</code
            >

            <Input
                tail="w-full flex-1"
                channel="ZakaProfe"
                type="number"
                name="days_ant"
                id="days_ant"
                bind:value={deuda.daysAnt}
                oninput={(e) => (deuda.daysAnt = e.currentTarget.value)}
                title="Máximo 14 días, a los 15 ya es legal"
                required
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    calculateLiquidation();
                }}
            />
        </div>
    {/if}
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button
            onclick={calculateLiquidation}
            channel="ZakaProfe"
            title="Calcular el finiquito con los datos introducidos."
            ><b>&starf;</b> Calcular finiquito</Button
        >
        <Button
            onclick={share}
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
        <h2>Conceptos que te deben</h2>
        <br />
        <Table
            table={[
                ["Vacaciones", resultado.result.vacation],
                ["Días pendientes del mes", resultado.result.pendingWage],
                ["Paga extra pendiente", resultado.result.extraPayouts],
                ["Indemnización", resultado.result.ind],
                ["Aviso tardío", resultado.result.lateness],
            ]}
            channel="ZakaProfe"
        />
        <br />
        <p class="text-xl">
            Total:
            <b><span class="text-(--ZakaProfe)"> {resultado.total.toFixed(2)}</span> euros </b>
        </p>
        <br />
        <h2>¿Cómo se ha calculado esto?</h2>
        <br />
        <p>
            Tu salario diario es de
            <span class="font-serif">{resultado.data.dailyWage.toFixed(2)} €</span>. Este valor sale
            de sumar tu base anual (la mensual que nos diste, por doce) y tus dos pagas extra,
            dividido entre los {yearSize()} días del año.
        </p>
        <br />
        <h3>Salario que te queda por cobrar del mes</h3>
        <p>
            Te corresponden <span class="font-serif"
                >{resultado.result.pendingWage.toFixed(2)} €</span
            >
            por los
            <span class="font-serif">{resultado.data.daysSinceMonth}</span> días trabajados el mes del
            finiquito.
        </p>
        <br />
        <h3>Pagas extraordinarias</h3>
        <p>
            Has acumulado <span class="font-serif"
                >{resultado.result.extraPayouts.toFixed(2)} €</span
            >
            de las pagas extra que aún no se han cobrado.
            {#if deuda.isSemestral}
                Este cálculo se ajusta según el semestre actual (dividiéndose por <span
                    class="font-serif">{resultado.data.divisorSemestral}</span
                > días).
            {:else}
                Se calcula de forma proporcional a los días transcurridos del año.
            {/if}
        </p>
        <br />
        <h3>Vacaciones no disfrutadas</h3>
        <p>
            Por los <span class="font-serif">{resultado.data.daysSinceYear}</span> días que llevas
            de año, y restando los
            <span class="font-serif">{resultado.data.enjoyedDays}</span>
            días que ya tomaste, se te deben
            <span class="font-serif">{resultado.result.vacation.toFixed(2)} €</span>.
        </p>

        {#if resultado.result.ind > 0 || resultado.result.lateness > 0}
            <br />
            <h3>Conceptos adicionales</h3>
            {#if resultado.result.ind > 0}
                <p>
                    Te deben una indemnización por despido de {resultado.data.sanctionDays}.
                    <span class="font-serif"
                        >{resultado.data.dailyWage.toFixed(2)} * {resultado.data.sanctionDays} * ({resultado
                            .data.workedMonths} / 12)</span
                    >
                    da <span class="font-serif">{resultado.result.ind.toFixed(2)} €</span>.
                </p>
            {/if}
            {#if resultado.result.lateness > 0}
                <p>
                    Te han avisado tarde, cada día sin avisar se paga. Te dan <span
                        class="font-serif">{resultado.result.lateness.toFixed(2)} €</span
                    >.
                </p>
            {/if}
        {/if}
        <br />
        <p>
            <span class="text-xl">Total a percibir: </span>
            <span class="text-xl font-bold text-(--ZakaProfe)"
                >{resultado.total.toFixed(2)} euros</span
            >
        </p>
    {/if}
</main>
