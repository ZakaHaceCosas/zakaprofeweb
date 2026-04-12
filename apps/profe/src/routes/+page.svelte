<script lang="ts">
    import { ZPVDs } from "$lib/db";
    import Home from "@zpw/ui/global/Home";
</script>

<Home
    channel="ZakaProfe"
    metaDesc="La web oficial de ZakaProfe, quien hace videos y salva tus notas :)."
    bioLine="He dedicado un par de años a hacer videos educativos explicando las cosas como realmente te gustaría, con calma y contenido visual en condiciones."
    slogan="Salvando tus notas"
    slogans={["Explicando en condiciones", "Dando clases que sí molan", "Ayudándote a aprobar"]}
    list={ZPVDs}
/>
