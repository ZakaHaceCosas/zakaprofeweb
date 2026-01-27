<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../../../components/Button.svelte";

    interface Nota {
        nota: string;
        pondering: string;
    }

    let notas: Nota[] = [{ nota: "", pondering: "" }];
    let average: number | null = null;

    onMount(() => {
        console.log(window.location.search);
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        let modified = false;
        for (const [_, value] of params) {
            const [nota, ponder] = value.split(",").map((i) => parseFloat(i));

            if (isNaN(nota) || isNaN(ponder)) continue;

            if (!modified) {
                modified = true;
                notas = [];
            }
            notas.push({ nota: nota.toString(), pondering: ponder.toString() });
            notas = [...notas];
        }
    });

    function handleInputChange(index: number, field: keyof Nota, value: string) {
        if (!notas[index]) return;
        notas[index][field] = value;
        notas = [...notas];
    }

    function addNota() {
        notas = [...notas, { nota: "", pondering: "" }];
    }

    function deleteNota(index: number) {
        if (!notas[index]) return;
        notas.splice(index, 1);
        notas = [...notas];
    }

    // todas 100 o todas iguales
    $: isPonderingOne =
        (notas.every((n) => parseFloat(n.pondering) === 100)
            || notas.every((n) => parseFloat(n.pondering) === parseFloat(notas[0].pondering)))
        && notas.length > 1;

    function calculateAverage() {
        if (notas.every((n) => parseFloat(n.pondering) === 100)) {
            average = notas.reduce((a, n) => a + parseFloat(n.nota), 0) / notas.length;
            return;
        }

        let sumaNotas = 0;
        let sumaPonderaciones = 0;

        notas.forEach((n) => {
            if (
                !isNaN(parseFloat(n.nota))
                && !isNaN(parseFloat(n.pondering))
                && parseFloat(n.pondering) >= 0
            ) {
                const weight = parseFloat(n.pondering) / 100;
                sumaNotas += parseFloat(n.nota) * weight;
                sumaPonderaciones += weight;
            }
        });

        // sumar floats es una mierda
        if (Math.abs(sumaPonderaciones - 1) > 0.001) {
            average = null;
            return;
        }

        average = sumaNotas;
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/calculadora-notas?${notas.map((v, i) => `${i + 1}=${v.nota},${v.pondering}`).join("&")}`
        );
    }

    export const prerender = true;
</script>

<svelte:head>
    <title>Calculadora de notas</title>
    <meta
        name="description"
        content="Una calculadora de notas medias, tanto aritméticas (simples) como ponderadas (con peso)."
    />
</svelte:head>

<main>
    <h1>Calculadora de notas medias (aritmética y ponderada)</h1>
    <br />
    <p>
        Dale un valor de entre 0 y 100 a cada ponderación y pon la nota que quieras. Luego dale a
        "Calcular Promedio" y obtendrás tu media.
        <br /><br />
        Por ponerte un ejemplo de cómo se hace: en exámenes, si dos exámenes valían un 40% de la nota
        final y un tercero valía un 20%, pondrías como ponderaciones 40, 40, y 20, y te calculará la media.
        <br /><br />
        Las ponderaciones deberían sumar 100, a menos que pongas "100" a <i>todas</i>, caso en que
        se calcula una media aritmética (es un atajo para asumir que todas las notas valen lo
        mismo).<br /><br />
    </p>
    {#each notas as nota, index}
        <div class="mb-3 flex w-full flex-col items-center gap-3 sm:flex-row">
            <code>Nota {index + 1}</code>

            <input
                type="number"
                name="nota"
                bind:value={nota.nota}
                on:input={(e) => handleInputChange(index, "nota", e.currentTarget.value)}
                placeholder="Nota"
                required
                class="w-full! flex-1 sm:flex-3"
            />

            <input
                class="w-full flex-1"
                style="
                    background-color: {nota.pondering !== ''
                && (parseFloat(nota.pondering) <= 0 || parseFloat(nota.pondering) > 100)
                    ? '#FFc832'
                    : ''};
                "
                type="number"
                name="pondering"
                id={"ponder_" + index}
                bind:value={nota.pondering}
                on:input={(e) => handleInputChange(index, "pondering", e.currentTarget.value)}
                placeholder="Ponderación (0 - 100)"
                required
            />

            <Button
                tail="sm:w-inherit! w-auto!"
                callback={() => deleteNota(index)}
                channel="ZakaProfe">Eliminar</Button
            >
        </div>
    {/each}

    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button callback={addNota} channel="ZakaProfe"><b>+</b> Agregar Nota</Button>
        <Button callback={calculateAverage} channel="ZakaProfe"
            ><b>&starf;</b> Calcular Promedio</Button
        >
        <Button callback={share} channel="ZakaProfe" popovertarget="share-popover"
            ><b>&nearr;</b> Compartir</Button
        >
    </div>
    <div id="share-popover" class="popover" popover>
        ¡Enlace copiado al portapapeles! Incluye todas las notas que tengas escritas aquí.
    </div>

    {#if isPonderingOne}
        <br />
        <p>Media aritmética. Todas las notas valen por igual.</p>
    {/if}

    {#if !isPonderingOne && notas.filter((n) => !isNaN(parseFloat(n.pondering))).length != 0 && notas
            .filter((n) => !isNaN(parseFloat(n.pondering)))
            .reduce((a, b) => a + parseFloat(b.pondering), 0) !== 100}
        <br />
        <p>
            ¡Ojo! El valor podría no ser lógico, mira que las ponderaciones sumen 100 (no lo hacen).
        </p>
    {/if}

    {#if average !== null}
        <br />
        <h3 id="result" class="flex flex-row items-center gap-2">
            La media sería de
            <span
                style={`font-size: xx-large; font-weight: 700; color: ${average < 5 ? "#ff3232" : "var(--ZakaProfe)"};`}
            >
                {average.toFixed(2)}
            </span>
        </h3>
        {#if average < 5}
            <p>(nada que no se pueda remontar)</p>
        {/if}
    {/if}
</main>
