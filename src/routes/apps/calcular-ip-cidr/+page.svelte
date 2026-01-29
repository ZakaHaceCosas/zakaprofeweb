<script lang="ts">
    import { countOccurrences, isValidIP, validateAgainst } from "strings-utils";
    import { onMount } from "svelte";
    import { isBetween } from "numeric-utils";
    import Button from "../../../components/Button.svelte";
    import Input from "../../../components/Input.svelte";
    import Table from "../../../components/Table.svelte";

    let ipAddress = "";
    let val: null | {
        binIp: string;
        mask: string;
        wildcard: string;
        critical: [string, number, number, number, string] | null;
        netBits: number;
        hostBits: number;
        networkAddress: string;
        gatewayAddress: string;
        broadcastAddress: string;
        usable: [string, string];
        usableHosts: [number, string];
    } = null;

    onMount(() => {
        console.log(window.location.search);
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const ip = params.get("ip") ?? "";
        ipAddress = decodeURIComponent(ip);
        if (ip !== "") calculateIp();
    });

    function calculateIp() {
        try {
            const [ip, _cidr] = ipAddress.split("/");

            if (!ip || !_cidr || !isValidIP(ip))
                throw "La IP con CIDR no está bien escrita o no es válida.";
            const cidr = Number(_cidr);
            if (isNaN(cidr))
                throw "El CIDR no parece un número (se te habrá colado alguna letra o algo que sobra).";
            if (!isBetween(cidr, 0, 32)) throw "El CIDR debería estar entre 0 y 32.";

            const maskBin = "1".repeat(cidr) + "0".repeat(32 - cidr);
            const maskArr = [];
            for (let i = 0; i < 32; i += 8) {
                maskArr.push(maskBin.slice(i, i + 8));
            }
            const mask = maskArr.map((n) => Number("0b" + n).toString(10));
            const wildcard = [255, 255, 255, 255].map((n, i) => n - Number(mask[i]));
            const criticalIndex = mask.findIndex((n) => !validateAgainst(n, ["255", "0"]));
            const critical: [string, number, number, number, string] | null =
                criticalIndex === -1
                    ? null
                    : [
                          mask[criticalIndex],
                          criticalIndex + 1,
                          countOccurrences(Number(mask[criticalIndex]).toString(2), "1"),
                          wildcard[criticalIndex],
                          Number(mask[criticalIndex]).toString(2),
                      ];

            const binIp = ip.split(".").map((n) => Number(n).toString(2).padStart(8, "0"));
            const networkAddressBits = binIp.join("").slice(0, cidr) + "0".repeat(32 - cidr);
            const networkAddress = [];
            for (let i = 0; i < 32; i += 8) {
                networkAddress.push(Number("0b" + networkAddressBits.slice(i, i + 8)).toString(10));
            }
            const broadcastAddressBits = binIp.join("").slice(0, cidr) + "1".repeat(32 - cidr);
            const broadcastAddress: string[] = [];
            for (let i = 0; i < 32; i += 8) {
                broadcastAddress.push(
                    Number("0b" + broadcastAddressBits.slice(i, i + 8)).toString(10)
                );
            }

            const usableMax: string[] = [...broadcastAddress];
            usableMax[3] = (Number(usableMax[3]) - 1).toString(10);
            const usableMin: string[] = [...networkAddress];
            usableMin[3] = (Number(usableMin[3]) + 1).toString(10);

            const usableHosts = Math.pow(2, 32 - cidr) - 2;

            val = {
                binIp: binIp.join(" - "),
                mask: mask.join("."),
                wildcard: wildcard.join("."),
                critical,
                netBits: cidr,
                hostBits: 32 - cidr,
                networkAddress: networkAddress.join("."),
                broadcastAddress: broadcastAddress.join("."),
                usable: [usableMin.join("."), usableMax.join(".")],
                gatewayAddress: usableMin.join("."),
                usableHosts: [usableHosts, `2^${32 - cidr}`],
            };
        } catch (e) {
            alert(e);
        }
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/calcular-ip-cidr?ip=${encodeURIComponent(ipAddress)}`
        );
    }

    export const prerender = true;
</script>

<svelte:head>
    <title>Calculadora de IPs con CIDR</title>
    <meta
        name="description"
        content="Una calculadora que recibe una IP con máscara CIDR y te da TODO lo que podrías querer saber de esa IP (máscara, dirección de red, dirección de host, etc...) en un santiamén."
    />
</svelte:head>

<main>
    <h1>Calculadora de IPs con CIDR</h1>
    <br />
    <p>
        Escribe una IP con CIDR y dale a calcular. Te dará todo lo que podrías necesitar (máscara,
        dirección de red, dirección de broadcast...)<br /><br />
    </p>
    <Input
        type="text"
        name="ip"
        bind:value={ipAddress}
        oninput={(e) => {
            ipAddress = e.currentTarget.value;
            const newParams = `?ip=${encodeURIComponent(e.currentTarget.value)}`;
            history.replaceState(null, "", newParams);
        }}
        onkeydown={(e) => {
            if (e.key !== "Enter") return;
            calculateIp();
        }}
        title="Introduce una IP con el CIDR, como 192.168.0.1/28"
        required
        tail="w-full! flex-1 sm:flex-3"
        channel="ZakaTeka"
    />

    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button callback={calculateIp} channel="ZakaTeka" title="Calcular la IP."
            ><b>&starf;</b> Calcular IP</Button
        >
        <Button
            callback={share}
            popovertarget="share-popover"
            channel="ZakaTeka"
            title="Generar un enlace para compartir el resultado."><b>&nearr;</b> Compartir</Button
        >
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
        <Table
            channel="ZakaTeka"
            table={[
                ["Dirección de red", val.networkAddress],
                ["Dirección de broadcast", val.broadcastAddress],
                ["Dirección de gateway", val.gatewayAddress],
                ["IP en formato binario", val.binIp],
                ["Máscara de red", val.mask],
                ["Wildcard", val.wildcard],
                ["Rango utilizable", `${val.usable[0]} — ${val.usable[1]}`],
                ["Número de hosts útiles", `${val.usableHosts[0]} (${val.usableHosts[1]} - 2)`],
                ["Número de hosts en total", `${val.usableHosts[0] + 2} (${val.usableHosts[1]})`],
                [
                    "Octeto crítico",
                    val.critical
                        ? `${val.critical[0]} (posición ${val.critical[1]} en la IP, ${val.critical[2]} bits críticos [${val.critical[4]}] y núm. base ${val.critical[3]})`
                        : "No hay",
                ],
                ["Bits de red", val.netBits],
                ["Bits de host", val.hostBits],
            ]}
        />
    {/if}
</main>
