<script>
    import Comments from "$lib/Comments.svelte";
</script>

<svelte:head>
    <title>Reportes y sugerencias</title>
</svelte:head>

<h1>¿Algo no funciona bien aquí?</h1>
<br />
<p>
    <b>Página de reporte de errores y envío de sugerencias.</b> En vez de mandar un correo o pasar por
    Instagram, puedes hacer un reporte desde aquí de forma anónima. Se enviará de inmediato, y (tras revisarlo
    yo) aparecerá públicamente para evitar reportes duplicados. También verás que dejo respuestas a comentarios
    en algunos casos (donde pone «Zaka:» y está destacado de azul).
</p>
<hr />
<Comments pageId="bugTracker" />
