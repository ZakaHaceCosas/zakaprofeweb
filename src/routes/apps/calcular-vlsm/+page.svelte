<script lang="ts">
    import { isValidIP } from "@zhc.js/string-utils";
    import { onMount } from "svelte";
    import Button from "$lib/Button.svelte";
    import Input from "$lib/Input.svelte";
    import Table from "$lib/Table.svelte";

    let ipAddress = "";
    let val:
        | null
        | {
              target: number;
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
        prepare();
    }

    function deleteRange(index: number) {
        if (!ranges[index] && ranges[index] !== "") return;
        ranges.splice(index, 1);
        ranges = [...ranges];
        prepare();
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

    function prepare() {
        if (!ipAddress || !ranges[0]) throw "Faltan una IP y al menos un rango válidos.";
        if (!isValidIP(ipAddress)) throw "La IP no está bien escrita o no es válida.";
        history.replaceState(
            null,
            "",
            `?ip=${encodeURIComponent(ipAddress)}&ranges=${ranges.join(",")}`
        );
        return true;
    }

    function calculateVLSM() {
        try {
            prepare();

            let originalIpAddress = ipAddress;
            val = [];

            ranges
                .map((r) => Number(r) + 2)
                .sort((a, b) => b - a)
                .forEach((range, idx) => {
                    if (isNaN(range) || range < 2) throw `El rango ${idx} es inválido.`;

                    let pow = 0;
                    while (Math.pow(2, pow) < range) pow++;

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
                        target: range - 2,
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
    <Input
        type="text"
        name="ip"
        bind:value={ipAddress}
        oninput={(e) => (ipAddress = e.currentTarget.value)}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            document.getElementById("rng-inp-0")?.focus();
        }}
        title="Introduce una IPv4, como 192.168.0.1"
        required
        channel="ZakaTeka"
        tail="w-full!"
    />
    <br />
    {#each ranges as range, index (index)}
        <div class="mb-3 flex w-full flex-row items-center gap-3">
            <code class="font-mono!">#{index}</code>

            <Input
                id={`rng-inp-${index}`}
                type="number"
                name="range"
                bind:value={range}
                oninput={(e) => handleInputChange(index, e.currentTarget.value)}
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    if (e.shiftKey) calculateVLSM();
                    else {
                        if (index + 1 == ranges.length) addRange();
                        setTimeout(() => {
                            document.getElementById(`rng-inp-${index + 1}`)?.focus();
                        }, 100);
                    }
                }}
                title="Introduce un número de dispositivos para este rango"
                required
                tail="w-full! flex-1 md:flex-6"
                channel="ZakaTeka"
            />

            <Button
                title="Eliminar este rango."
                tail="flex-1!"
                channel="ZakaTeka"
                onclick={() => deleteRange(index)}>Eliminar</Button
            >
        </div>
    {/each}
    <code class="text-sm opacity-50"
        ><kbd class="bg-gray-600 px-1.5 py-1">ENTER</kbd> para pasar a la siguiente entrada (añadirá
        otro rango si hace falta) ·
        <kbd class="bg-gray-600 px-1.5 py-1">SHIFT</kbd>
        +
        <kbd class="bg-gray-600 px-1.5 py-1">ENTER</kbd> para calcular</code
    >
    <br />
    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button onclick={addRange} channel="ZakaTeka" title="Agregar un nuevo rango a la lista."
            ><b>+</b> Agregar Rango</Button
        >
        <Button onclick={calculateVLSM} channel="ZakaTeka" title="Calcular el VLSM."
            ><b>&starf;</b> Calcular VLSM</Button
        >
        <Button
            onclick={share}
            channel="ZakaTeka"
            popovertarget="share-popover"
            title="Generar un enlace para compartir el resultado."
            ><b>&nearr;</b> Compartir
        </Button>
    </div>
    <div
        id="share-popover"
        class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4"
        popover
    >
        ¡Enlace copiado al portapapeles!
    </div>

    {#if val !== null}
        <br />
        {#each val as range, idx (idx)}
            <h2 class="font-mono!">
                Rango {idx}
                <span class="text-lg opacity-70">{range.target} dispositivos</span>
            </h2>
            <br />
            <Table
                channel="ZakaTeka"
                table={[
                    ["Dirección de red", range.networkAddress],
                    ["Dirección de broadcast", range.broadcastAddress],
                    ["Máscara de red", range.mask],
                    ["Rango utilizable", `${range.usable[0]} — ${range.usable[1]}`],
                    [
                        "Número de hosts útiles",
                        `${range.usableHosts[0]} (${range.usableHosts[1]} - 2)`,
                    ],
                    [
                        "Número de hosts en total",
                        `${range.usableHosts[0] + 2} (${range.usableHosts[1]})`,
                    ],
                ]}
            />
            <br />
        {/each}
    {/if}
</main>
