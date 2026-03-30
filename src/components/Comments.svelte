<script lang="ts">
    import { onMount } from "svelte";
    import Textarea from "./Textarea.svelte";
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";

    type Comment = {
        approved: true;
        created_at: number;
        id: string;
        ip_hash: string;
        page_id: string;
        text: string;
        author: string | null;
        admin_res: string | null;
        is_wm: boolean;
    };

    const { pageId } = $props<{
        pageId: string;
    }>();

    let comments: Comment[] = $state([]);
    let text = $state("");
    let author = $state("");
    let resp: true | null | string = $state(null);
    let loading = $state(false);

    async function load() {
        loading = true;
        const res = await fetch(`/api?comments=${pageId}`);
        comments = await res.json();
        loading = false;
    }

    async function submit() {
        if (!text.trim()) return;
        loading = true;

        const res = await fetch("/api?comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, author, pageId }),
        });

        loading = false;

        if (res.ok) {
            text = "";
            resp = true;
            await load();
        } else {
            const data = await res.json();
            resp = data.error;
        }
    }

    onMount(load);
</script>

<div class="flex w-full flex-col gap-2">
    <h3>Comentarios aquí</h3>

    <Textarea
        rows={2}
        value={text}
        oninput={(e) => (text = e.currentTarget.value)}
        channel="ZakaProfe"
        title="Escribe aquí tu comentario"
        name="comment"
    />
    <Input
        type="text"
        name="username"
        channel="ZakaProfe"
        title="¿Cómo te llamas? Opcional, y no tiene que ser un nombre real"
        value={author}
        oninput={(e) => (author = e.currentTarget.value)}
        required={false}
    />
    <Button callback={submit} disabled={loading} channel="ZakaProfe" title="Comentar">
        Enviar
    </Button>

    {#if loading}
        <p>(Cargando datos...)</p>
    {/if}
    {#if resp}
        {#if typeof resp == "string"}
            <p class="text-red-500">
                Error: {resp}
            </p>{:else}
            <p class="text-teal-500">
                ¡Enviado! Pronto lo leeré. Tras ello, aparecerá aquí (salvo que se considere
                inapropiado, que lo dudo). Gracias por tus comentarios.
            </p>{/if}
    {/if}
    {#each comments as c}
        <div class="flex flex-col gap-1 bg-(--blk) p-3 text-(--txt)">
            <p class="wrap-break-word" style="white-space: pre-line;">{c.text}</p>
            <div class="text-sm text-gray-400">
                {c.author ?? "[Anónimo]"}
                ·
                {new Date(c.created_at).toLocaleString()}
            </div>
            {#if c.is_wm}
                <div class="text-sm text-blue-400">
                    Se ha verificado que este comentario viene directamente de esta web, es
                    informativo más que nada.
                </div>
            {/if}
            {#if c.admin_res}
                <div class="mt-2 border-l-4 border-(--ZakaProfe) bg-(--ng1) p-2 text-(--txt)">
                    Zaka:
                    {c.admin_res}
                </div>
            {/if}
        </div>
    {/each}
</div>
