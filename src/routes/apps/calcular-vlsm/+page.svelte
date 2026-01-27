<script lang="ts">
    import { isValidIP } from "strings-utils";
    import { onMount } from "svelte";
    import Button from "../../../components/Button.svelte";

    let ipAddress = "";
    let val:
        | null
        | {
              rangeIdx: number;
              ipAddress: string;
              mask: string;
              cidr: string;
              networkAddress: string;
              broadcastAddress: string;
              usable: [string, string];
              usableHosts: [number, string];
          }[] = null;

    let ranges: string[] = [""];

    onMount(() => {
        console.log(window.location.search);
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const iRanges = params.get("ranges") ?? "";
        if (iRanges !== "") {
            ranges = [];
            iRanges.split(",").forEach((v) => (ranges = [...ranges, v]));
        }
        const ip = params.get("ip") ?? "";
        ipAddress = decodeURIComponent(ip);

        if (ip !== "" && ranges.length != 0) calculateVLSM();
    });

    function handleInputChange(index: number, value: string) {
        if (!ranges[index]) return;
        ranges[index] = value;
        ranges = [...ranges];
    }

    function addRange() {
        ranges = [...ranges, ""];
    }

    function deleteRange(index: number) {
        console.log(ranges[index]);
        if (!ranges[index] && ranges[index] !== "") return;
        console.log("rem");
        ranges.splice(index, 1);
        ranges = [...ranges];
    }

    function nextIpFromBroadcast(broadcast: string[]): string {
        const ip = broadcast.map(Number);
        for (let i = 3; i >= 0; i--) {
            ip[i]++;
            if (ip[i] <= 255) break;
            ip[i] = 0;
        }
        return ip.join(".");
    }

    function calculateVLSM() {
        try {
            if (!isValidIP(ipAddress)) throw "La IP no está bien escrita o no es válida.";

            let originalIpAddress = ipAddress;
            val = [];

            ranges
                .map((r, i) => ({ r: Number(r), i }))
                .sort((a, b) => b.r - a.r)
                .forEach(({ r, i }) => {
                    if (isNaN(r) || r < 2) throw `El rango ${i + 1} es inválido.`;

                    let pow = 0;
                    while (Math.pow(2, pow) < r) pow++;

                    const newCidr = 32 - pow;
                    const maskBin = "1".repeat(newCidr) + "0".repeat(32 - newCidr);
                    const maskArr = [];
                    for (let i = 0; i < 32; i += 8) {
                        maskArr.push(maskBin.slice(i, i + 8));
                    }
                    const mask = maskArr.map((n) => Number("0b" + n).toString(10));

                    const binIp = ipAddress
                        .split(".")
                        .map((n) => Number(n).toString(2).padStart(8, "0"));

                    const networkBits = binIp.join("").slice(0, newCidr) + "0".repeat(32 - newCidr);
                    const networkAddress: string[] = [];
                    for (let i = 0; i < 32; i += 8) {
                        networkAddress.push(
                            Number("0b" + networkBits.slice(i, i + 8)).toString(10)
                        );
                    }
                    const broadcastBits =
                        binIp.join("").slice(0, newCidr) + "1".repeat(32 - newCidr);
                    const broadcastAddress: string[] = [];
                    for (let i = 0; i < 32; i += 8) {
                        broadcastAddress.push(
                            Number("0b" + broadcastBits.slice(i, i + 8)).toString(10)
                        );
                    }

                    val!.push({
                        rangeIdx: i + 1,
                        ipAddress: networkAddress.join("."),
                        cidr: newCidr.toString(),
                        networkAddress: networkAddress.join("."),
                        broadcastAddress: broadcastAddress.join("."),
                        usableHosts: [Math.pow(2, 32 - newCidr) - 2, `2^${32 - newCidr}`],
                        usable: [
                            `${networkAddress.slice(0, 3).join(".")}.${Number(networkAddress[3]) + 1}`,
                            `${broadcastAddress.slice(0, 3).join(".")}.${Number(broadcastAddress[3]) - 1}`,
                        ],
                        mask: mask.join("."),
                    });

                    ipAddress = nextIpFromBroadcast(broadcastAddress);
                });

            ipAddress = originalIpAddress;
        } catch (e) {
            alert(e);
        }
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/calcular-vlsm?ip=${encodeURIComponent(ipAddress)}&ranges=${ranges.join(",")}`
        );
    }

    export const prerender = true;
</script>

<svelte:head>
    <title>Calculadora de VLSM</title>
    <meta
        name="description"
        content="Calcula por tí todas las divisiones VLSM a partir de una dirección IP y diferentes cantidades de dispositivos por división."
    />
</svelte:head>

<main>
    <h1>Calculadora de VLSM</h1>
    <br />
    <p>
        Escribe una IP e introduce cuántos dispositivos deberían caber en cada rango, y dale a
        calcular. Usará VLSM para dividir la red por tí. No introduzcas el CIDR en la IP que
        proveas.<br /><br />
    </p>
    <input
        type="text"
        name="ip"
        bind:value={ipAddress}
        on:input={(e) => (ipAddress = e.currentTarget.value)}
        on:keydown={(e) => {
            if (e.key !== "Enter") return;
            calculateVLSM();
        }}
        placeholder="192.168.0.1"
        required
        class="w-full! flex-1 sm:flex-3"
    />
    <br />
    {#each ranges as range, index}
        <div class="mb-3 flex w-full flex-row items-center gap-3">
            <code>Rango {index + 1}</code>

            <input
                type="number"
                name="range"
                bind:value={range}
                on:input={(e) => handleInputChange(index, e.currentTarget.value)}
                on:keydown={(e) => {
                    if (e.key !== "Enter") return;
                    calculateVLSM();
                }}
                placeholder="Introduce un número de dispositivos para este rango"
                required
                class="w-full! flex-1 sm:flex-3"
            />

            <Button channel="ZakaTeka" callback={() => deleteRange(index)}>Eliminar</Button>
        </div>
    {/each}

    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button callback={addRange} channel="ZakaTeka"><b>+</b> Agregar Rango</Button>
        <Button callback={calculateVLSM} channel="ZakaTeka"><b>&starf;</b> Calcular IP</Button>
        <Button callback={share} channel="ZakaTeka" popovertarget="share-popover"
            ><b>&nearr;</b> Compartir
        </Button>
    </div>
    <div id="share-popover" class="popover" popover>¡Enlace copiado al portapapeles!</div>

    {#if val !== null}
        <br />
        {#each val as range}
            <h2 class="text-xl">Rango {range.rangeIdx}</h2>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Propiedad</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Dirección de red</td>
                        <td>{range.networkAddress}</td>
                    </tr>
                    <tr>
                        <td>Dirección de broadcast</td>
                        <td>{range.broadcastAddress}</td>
                    </tr>
                    <tr>
                        <td>Máscara de red</td>
                        <td>{range.mask}</td>
                    </tr>
                    <tr>
                        <td>Rango utilizable</td>
                        <td>{range.usable[0]} &mdash; {range.usable[1]}</td>
                    </tr>
                    <tr>
                        <td>Número de hosts útiles</td>
                        <td>{range.usableHosts[0]} ({range.usableHosts[1]} - 2)</td>
                    </tr>
                    <tr>
                        <td>Número de hosts en total</td>
                        <td>{range.usableHosts[0] + 2} ({range.usableHosts[1]})</td>
                    </tr>
                </tbody>
            </table>
            <br />
        {/each}
    {/if}
</main>
