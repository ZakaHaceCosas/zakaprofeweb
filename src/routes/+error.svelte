<script lang="ts">
    import { page } from "$app/state";
</script>

<main>
    <h1>Error HTTP {page.status}</h1>
    <p>Mensaje: «{page.error?.message ?? "(No hay mensaje, de hecho. Esto es raro. Avísame.)"}»</p>
</main>
