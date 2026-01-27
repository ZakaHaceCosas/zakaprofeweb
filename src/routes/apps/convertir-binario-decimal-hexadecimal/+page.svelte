<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../../../components/Button.svelte";

    let bin = "";
    let dec = "";
    let hex = "";

    onMount(() => {
        console.log(window.location.search);
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const val = params.get("val") ?? "";

        if (isNaN(Number(val))) return;

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
    <title>Conversor entre binario, decimal, y hexadecimal</title>
    <meta
        name="description"
        content="Un conversor entre binario, decimal, y hexadecimal. Escribes en un formato y automáticamente recibes el resultado en los otros dos."
    />
</svelte:head>

<main>
    <h1>Conversor entre binario, decimal, y hexadecimal</h1>
    <br />
    <p>
        Escribe un número en cualquiera de las tres cajas (una para bin., otra para dec., y otra
        para hex.) y te muestra dicho número en los tres formatos.<br /><br />
    </p>
    <div class="flex w-full flex-row gap-2">
        <input
            type="number"
            pattern="[10]*"
            inputmode="numeric"
            name="bin"
            bind:value={bin}
            on:input={(e) => handleInputChange(1, e.currentTarget.value)}
            placeholder="Binario"
            required
            class="w-full! flex-1 sm:flex-3"
        />
        <input
            type="number"
            name="dec"
            bind:value={dec}
            on:input={(e) => handleInputChange(2, e.currentTarget.value)}
            placeholder="Decimal"
            required
            class="w-full! flex-1 sm:flex-3"
        />
        <input
            type="text"
            name="hex"
            bind:value={hex}
            on:input={(e) => handleInputChange(3, e.currentTarget.value)}
            placeholder="Hexadecimal"
            required
            class="w-full! flex-1 sm:flex-3"
        />
    </div>
    <div id="share-popover" class="popover" popover>¡Enlace copiado al portapapeles!</div>

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
        <div class="flex w-full flex-row items-center justify-center gap-2">
            <h3>
                Binario
                <span style={`font-size: xx-large; font-weight: 700; color: var(--ZakaProfe)"};`}>
                    {bin}
                </span>
            </h3>
            ·
            <h3>
                Decimal
                <span style={`font-size: xx-large; font-weight: 700; color: var(--ZakaProfe)"};`}>
                    {dec}
                </span>
            </h3>
            ·
            <h3>
                Hexadecimal
                <span style={`font-size: xx-large; font-weight: 700; color: var(--ZakaProfe)"};`}>
                    {hex.toUpperCase()}
                </span>
            </h3>
        </div>
    {/if}
    <br />
    <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
        <Button callback={share} popovertarget="share-popover" channel="ZakaTeka"
            ><b>&nearr;</b> Compartir
        </Button>
    </div>
</main>
