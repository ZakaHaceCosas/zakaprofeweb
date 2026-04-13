<script lang="ts">
    import Layout from "@zpw/ui/global/Layout";
    import "../app.css";

    let { children } = $props();
</script>

<Layout channel="ZakaProfe">{@render children?.()}</Layout>
