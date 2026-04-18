<script lang="ts">
    import Layout from "@zpw/ui/global/Layout";
    import "../app.css";
    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";

    injectAnalytics({ mode: dev ? "development" : "production" });
    let { children } = $props();
</script>

<Layout channel="ZakaProfe">{@render children?.()}</Layout>
