<script lang="ts">
    import { isValidIP } from "strings-utils";
    import { onMount } from "svelte";
    import Button from "../../../components/Button.svelte";
    import Input from "../../../components/Input.svelte";
    import Table from "../../../components/Table.svelte";
    import { isBetween } from "numeric-utils";

    let ipAddress = "";
    let val:
        | null
        | {
              ipAddress: string;
              mask: string;
              cidr: string;
              networkAddress: string;
              broadcastAddress: string;
              usable: [string, string];
              usableHosts: [number, string];
          }[] = null;
    let ranges: string = "";

    onMount(() => {
        console.log(window.location.search);
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const iRanges = (params.get("ranges") ?? "").trim();
        if (iRanges !== "") {
            ranges = iRanges;
        }
        const ip = params.get("ip") ?? "";
        ipAddress = decodeURIComponent(ip);

        if (ip !== "" && ranges != "") calculateFLSM();
    });

    function nextIpFromBroadcast(broadcast: string[]): string {
        const ip = broadcast.map(Number);
        for (let i = 3; i >= 0; i--) {
            ip[i]++;
            if (ip[i] <= 255) break;
            ip[i] = 0;
        }
        return ip.join(".");
    }

    function calculateFLSM() {
        try {
            const [ip, _cidr] = ipAddress.split("/");

            if (!ip || !_cidr || !isValidIP(ip))
                throw "La IP con CIDR no está bien escrita o no es válida.";
            const cidr = Number(_cidr);
            if (isNaN(cidr))
                throw "El CIDR no parece un número (se te habrá colado alguna letra o algo que sobra).";
            if (!isBetween(cidr, 0, 32)) throw "El CIDR debería estar entre 0 y 32.";
            const rangeCnt = Number(ranges);
            if (isNaN(rangeCnt))
                throw "El número de rangos debería ser eso, un número; es otra cosa.";

            let originalIpAddress = ipAddress;
            val = [];

            let pow = 0;

            for (let i = 0; i < rangeCnt; i++) {
                while (Math.pow(2, pow) < rangeCnt) pow++;
            }

            for (let j = 0; j < rangeCnt; j++) {
                const newCidr = cidr + pow;
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
                    networkAddress.push(Number("0b" + networkBits.slice(i, i + 8)).toString(10));
                }
                const broadcastBits = binIp.join("").slice(0, newCidr) + "1".repeat(32 - newCidr);
                const broadcastAddress: string[] = [];
                for (let i = 0; i < 32; i += 8) {
                    broadcastAddress.push(
                        Number("0b" + broadcastBits.slice(i, i + 8)).toString(10)
                    );
                }

                val!.push({
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
            }

            ipAddress = originalIpAddress;
        } catch (e) {
            alert(e);
        }
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/calcular-flsm?ip=${encodeURIComponent(ipAddress)}&ranges=${ranges}`
        );
    }

    export const prerender = true;
</script>

<svelte:head>
    <title>Calculadora de FLSM</title>
    <meta
        name="description"
        content="Calcula por tí todas las divisiones FLSM a partir de una dirección IP y diferentes cantidades de dispositivos por división."
    />
</svelte:head>

<main>
    <h1>Calculadora de FLSM</h1>
    <br />
    <p>
        Escribe una IP con CIDR e introduce cuántas subredes deberían existir, y dale a calcular.
        Usará FLSM para dividir la red por tí.<br /><br />
    </p>
    <br />
    <div class="mb-3 flex w-full flex-row items-center gap-3">
        <Input
            type="text"
            name="ip"
            bind:value={ipAddress}
            oninput={(e) => (ipAddress = e.currentTarget.value)}
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                history.replaceState(
                    null,
                    "",
                    `?ip=${encodeURIComponent(ipAddress)}&ranges=${ranges}`
                );
                if (e.shiftKey) calculateFLSM();
                else document.getElementById("rngInput")?.focus();
            }}
            title="Introduce una IPv4 con CIDR, como 192.168.0.1/24"
            required
            channel="ZakaTeka"
            tail="w-full!"
        />
        <Input
            type="number"
            name="range"
            id="rngInput"
            bind:value={ranges}
            oninput={(e) => (ranges = e.currentTarget.value)}
            onkeydown={(e) => {
                if (e.key !== "Enter") return;
                history.replaceState(
                    null,
                    "",
                    `?ip=${encodeURIComponent(ipAddress)}&ranges=${ranges}`
                );
                calculateFLSM();
            }}
            title="Introduce la cantidad de subredes que necesitas"
            required
            channel="ZakaTeka"
        />
    </div>

    <code class="text-sm opacity-50"
        ><kbd class="bg-gray-600 px-1.5 py-1">ENTER</kbd> para pasar a la siguiente entrada (o
        calcular si has terminado) ·
        <kbd class="bg-gray-600 px-1.5 py-1">SHIFT</kbd>
        +
        <kbd class="bg-gray-600 px-1.5 py-1">ENTER</kbd> para calcular</code
    >

    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button callback={calculateFLSM} channel="ZakaTeka" title="Calcular el FLSM."
            ><b>&starf;</b> Calcular FLSM</Button
        >
        <Button
            callback={share}
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
        {#each val as range, rangeIdx}
            <h2>Rango #{rangeIdx}</h2>
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
