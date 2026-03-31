<!-- [TODO] ESTO NO ESTÁ ACABADO -->
<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../../../components/Button.svelte";
    import Input from "../../../components/Input.svelte";
    import Table from "../../../components/Table.svelte";
    import Checkbox from "../../../components/Checkbox.svelte";
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
    };

    let resultado: null | {} = null;

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

    function calculateWage() {
        try {
            const newParams = `?finiquito=${encodeURIComponent(btoa(JSON.stringify(deuda)))}`;
            history.replaceState(null, "", newParams);

            const now = new Date(deuda.end);
            const base = num(deuda.base);
            const daysSinceLastPayout = num(deuda.daysLastExtra);
            const extra = num(deuda.extras);
            const daysInd = num(deuda.daysInd);
            const workedMonths = num(deuda.meses);
            const enjoyedDays = num(deuda.enjoyedDays);

            const daysSince = (month: number) =>
                Math.ceil(
                    Math.abs(new Date(yearSize(), month, 1).getTime() - now.getTime())
                        / (1000 * 60 * 60 * 24)
                );
            const daysSinceYear = daysSince(0);
            const daysSinceMonth = daysSince(now.getMonth());
            // TODO: no sé si esto es así
            // tengo apuntes de clase que dicen esto, pero el libro dice que es el salario ANUAL : 365
            // eso incluiría las pagas extra...
            // YA VERÉ COMO LO HAGO, de momento estoy programando esto para hacer mi tarea con ello, ya lo ajustaré
            const dailyWage = (base * daysSinceMonth) / 30;

            const pendingWage = dailyWage * daysSinceMonth;
            const extraPayouts: number = deuda.isSemestral
                ? (daysSinceLastPayout * extra)
                  / (daysSinceYear > (yearSize() == 366 ? 182 : 181)
                      ? yearSize() == 366
                          ? 182
                          : 181
                      : 184)
                : (daysSinceLastPayout * extra) / yearSize();

            // TODO: soportar valores diferentes a 30 si el tio tiene vacaciones raras
            const vacation = dailyWage * ((daysSinceYear * 30) / yearSize() - enjoyedDays);

            const ind = deuda.isBad ? dailyWage * daysInd * (workedMonths / 12) : null;

            resultado = {
                vacation,
                extraPayouts,
                pendingWage,
                ind,
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
            if (e.shiftKey) calculateWage();
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
            if (e.shiftKey) calculateWage();
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
            if (e.shiftKey) calculateWage();
            else {
                document.getElementById("sal_base")?.focus();
            }
        }}>¿Te han avisado fuera de plazo? [TODO] (aún no implementado)</Checkbox
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
                if (e.shiftKey) calculateWage();
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
                if (e.shiftKey) calculateWage();
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
                if (e.shiftKey) calculateWage();
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
                if (e.shiftKey) calculateWage();
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
                if (e.shiftKey) calculateWage();
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
                    if (e.shiftKey) calculateWage();
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
                    if (e.shiftKey) calculateWage();
                    else {
                        document.getElementById("end_date")!.focus();
                    }
                }}
            />
        </div>
    {/if}

    {#if resultado}
        <Table table={Object.entries(resultado)} channel="ZakaProfe" />
    {/if}

    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button
            onclick={calculateWage}
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
</main>
