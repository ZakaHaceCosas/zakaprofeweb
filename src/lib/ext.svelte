<script lang="ts">
    let { children, url } = $props();
</script>

<a
    style="display: flex ; gap: 5px; align-items:center; flex: 1"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
>
    {@render children?.()}
</a>
