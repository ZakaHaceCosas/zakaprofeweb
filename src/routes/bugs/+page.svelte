<script>
    import Comments from "../../components/Comments.svelte";
</script>

<svelte:head>
    <title>Reportar fallos</title>
</svelte:head>

<main>
    <h1>¿Algo no funciona bien aquí?</h1>
    <br />
    <p>
        En vez de mandar un correo o pasar por Instagram, puedes hacer un reporte desde aquí de
        forma anónima. Se enviará de inmediato, y (tras revisarlo yo) aparecerá públicamente para
        evitar reportes duplicados.<br /><br />También verás que dejo respuestas a comentarios en
        algunos casos (donde pone «Zaka:» y está destacado de azul).
    </p>
    <hr />
    <Comments pageId="bugTracker" />
</main>
