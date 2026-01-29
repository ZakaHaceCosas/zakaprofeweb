<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../../../components/Button.svelte";
    import Input from "../../../components/Input.svelte";

    let bin = "";
    let dec = "";
    let hex = "";

    onMount(() => {
        console.log(window.location.search);
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const val = params.get("val") ?? "";

        if (val === "" || isNaN(Number(val))) return;

        handleInputChange(2, val);
    });

    function handleInputChange(field: 1 | 2 | 3, value: string) {
        if (field == 1) {
            dec = Number("0b" + value).toString(10);
            bin = value;
            hex = Number("0b" + value).toString(16);
        } else if (field == 2) {
            dec = value;
            bin = Number(value).toString(2);
            hex = Number(value).toString(16);
        } else {
            dec = Number("0x" + value).toString(10);
            bin = Number("0x" + value).toString(2);
            hex = value;
        }
    }

    function share() {
        navigator.clipboard.writeText(
            `https://profe.zhc.es/apps/convertir-binario-decimal-hexadecimal?val=${dec}`
        );
    }

    export const prerender = true;
</script>

<svelte:head>
    <title>Convertidor entre binario, decimal, y hexadecimal</title>
    <meta
        name="description"
        content="Un convertidor entre binario, decimal, y hexadecimal. Escribes en un formato y automáticamente recibes el resultado en los otros dos."
    />
</svelte:head>

<main>
    <h1>Convertidor entre binario, decimal, y hexadecimal</h1>
    <br />
    <p>
        Escribe un número en cualquiera de las tres cajas (una para bin., otra para dec., y otra
        para hex.) y te muestra dicho número en los tres formatos.<br /><br />
    </p>
    <div class="flex w-full flex-row gap-2">
        <Input
            type="number"
            pattern="[10]*"
            inputmode="numeric"
            name="bin"
            bind:value={bin}
            oninput={(e) => {
                handleInputChange(1, e.currentTarget.value);
                const newParams = `?val=${dec}`;
                history.replaceState(null, "", newParams);
            }}
            title="Número binario"
            required
            channel="ZakaTeka"
            tail="w-full! flex-1 sm:flex-3"
            label="Binario"
        />
        <Input
            type="number"
            name="dec"
            bind:value={dec}
            oninput={(e) => {
                handleInputChange(2, e.currentTarget.value);
                const newParams = `?val=${dec}`;
                history.replaceState(null, "", newParams);
            }}
            title="Número decimal"
            required
            tail="w-full! flex-1 sm:flex-3"
            channel="ZakaTeka"
            label="Decimal"
        />
        <Input
            type="text"
            name="hex"
            bind:value={hex}
            oninput={(e) => {
                handleInputChange(3, e.currentTarget.value);
                const newParams = `?val=${dec}`;
                history.replaceState(null, "", newParams);
            }}
            title="Número hexadecimal"
            required
            channel="ZakaTeka"
            tail="w-full! flex-1 sm:flex-3"
            label="Hexadecimal"
        />
    </div>
    <div
        id="share-popover"
        class="absolute mx-auto mt-[80vh] border-2 border-(--fff25) p-4"
        popover
    >
        ¡Enlace copiado al portapapeles!
    </div>

    {#if !(bin === "" || dec === "" || hex === "")}
        <br />
        {#if bin !== bin.replace(/[^10]/g, "") && bin !== "NaN"}
            <p style="color: red!important">
                Oye, genio, que en binario solo puedes poner unos y ceros.
            </p>
            <br />
        {/if}
        {#if hex !== hex.replace(/[^0123456789AaBbCcDdEeFf]/g, "") && hex !== "NaN"}
            <p style="color: red!important">
                Oye, genio, que en hexadecimal solo puedes poner del 0 al 9 y de la A a la F.
            </p>
            <br />
        {/if}
        <div class="flex w-full flex-row items-center justify-center gap-10">
            <span class="font-mono! text-3xl font-bold text-(--ZakaTeka)">
                {bin}
            </span>
            <b>·</b>
            <span class="font-mono! text-3xl font-bold text-(--ZakaTeka)">
                {dec}
            </span>
            <b>·</b>
            <span class="font-mono! text-3xl font-bold text-(--ZakaTeka)">
                {hex.toUpperCase()}
            </span>
        </div>
    {/if}
    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button
            callback={share}
            popovertarget="share-popover"
            channel="ZakaTeka"
            title="Generar un enlace para compartir el resultado."
            ><b>&nearr;</b> Compartir
        </Button>
    </div>
</main>
