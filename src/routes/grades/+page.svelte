<script lang="ts">
    interface Nota {
        nota: string;
        pondering: string;
    }

    let notas: Nota[] = [{ nota: "", pondering: "" }];
    let average: number | null = null;
    let isPonderingOne = false;

    function handleInputChange(index: number, field: keyof Nota, value: string) {
        notas[index][field] = value;
        notas = [...notas];
    }

    function addNota() {
        notas = [...notas, { nota: "", pondering: "" }];
    }

    function deleteNota(index: number) {
        notas.splice(index, 1);
        notas = [...notas];
    }

    $: isPonderingOne = notas.every((n) => parseFloat(n.pondering) === 1) && notas.length > 1;

    function calculateAverage() {
        let sumaNotas = 0;
        let sumaPonderaciones = 0;

        const pondersOne = notas.every((n) => parseFloat(n.pondering) === 1);

        if (pondersOne) {
            notas = notas.map((n) => ({
                ...n,
                pondering: (1 / notas.length).toString(),
            }));
        }

        notas.forEach((n) => {
            const notaValue = parseFloat(n.nota);
            const ponderingValue = parseFloat(n.pondering);

            if (!isNaN(notaValue) && !isNaN(ponderingValue) && ponderingValue >= 0) {
                sumaNotas += notaValue * ponderingValue;
                sumaPonderaciones += ponderingValue;
            }
        });

        average = sumaPonderaciones > 0 ? sumaNotas / sumaPonderaciones : null;
    }
</script>

<div class="main-layout">
    <h1>Calculadora de notas (aritmética y ponderada)</h1>
    <br />
    <p>
        Calculadora básica para promediar notas. <span class="opacity-50"
            >Una utilidad cualquiera que he puesto aquí porque sí, y si eso iré añadiendo más.</span
        >
        <br /><br />
        Dale un valor de entre 0 y 1 a cada ponderación y pon la nota que deseas. Luego dale a "Calcular
        promedio" y obtendrás tu media.
        <br />
        Por ejemplo, en exámenes, si dos exámenes valían un 40% de la nota final y un tercero valía un
        20%, pondrías como ponderaciones 0.4, 0.4, y 0.2.
        <br /><br />
        Las ponderaciones deberían sumar 1, a menos que pongas "1" a <i>todas</i>, caso en que se
        calcula una media aritmética.<br /><br />
    </p>
    {#each notas as nota, index}
        <div class="nota_wrapper">
            <code>Nota {index + 1}</code>

            <input
                type="number"
                name="nota"
                bind:value={nota.nota}
                on:input={(e) => handleInputChange(index, "nota", e.currentTarget.value)}
                placeholder="Nota"
                required
                class="nota_input"
            />

            <input
                class="ponder_input"
                style="
                    background-color: {parseFloat(nota.pondering) <= 0
                    ? '#FF3232'
                    : parseFloat(nota.pondering) > 1
                      ? '#FFc832'
                      : ''};
                "
                type="number"
                name="pondering"
                id={"ponder_" + index}
                bind:value={nota.pondering}
                on:input={(e) => handleInputChange(index, "pondering", e.currentTarget.value)}
                placeholder="Ponderación (0 - 1)"
                step="0.01"
                min="0"
                max="1"
                required
            />

            <button class="btn" on:click={() => deleteNota(index)}>Eliminar</button>
        </div>
    {/each}

    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <button class="btn" on:click={addNota} style="flex: 1;">Agregar Nota</button>
        <button class="btn" on:click={calculateAverage} style="flex: 1;">Calcular Promedio</button>
    </div>

    {#if isPonderingOne}
        <br />
        <p>
            Media aritmética. Ponderando con 1 como valor total ya que todas las ponderaciones son
            1. Se asume que todas las notas valen por igual.
        </p>
    {/if}

    {#if !isPonderingOne && notas.filter((n) => n.pondering.trim() !== "").length > 0 && notas
            .filter((n) => n.pondering.trim() !== "")
            .reduce((a, b) => a + parseFloat(b.pondering || "0"), 0) !== 1}
        <br />
        <p>
            ¡Ojo! El valor podría no ser lógico, mira que las ponderaciones sumen 1 (no lo hacen).
        </p>
    {/if}

    {#if average}
        <br />
        <h3 id="result" class="flex flex-row items-center gap-2">
            La media sería de
            <span style="font-size: xx-large; color: var(--ZakaProfe);">
                {average.toFixed(2)}
            </span>
        </h3>
    {/if}
</div>
