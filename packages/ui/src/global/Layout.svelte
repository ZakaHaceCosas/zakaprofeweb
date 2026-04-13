<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { resolve } from "$app/paths";

    let { children, channel } = $props<{ children: any; channel: "ZakaProfe" | "ZakaTeka" }>();

    // nos hacemos los interesantes
    console.log(
        "%cZakaProfe WEB%c versión %c4.x%c - Salvando tus notas",
        "color: white; background: #0099ff; padding: 5px 10px; font-size: 16px; font-weight: bold;",
        "font-size: 15px;",
        "color: black; background: #feb100; padding: 5px 10px; font-size: 16px; font-weight: bold;",
        "font-size: 15px;"
    );
    console.log(
        [
            "No sé que haces husmeando en la consola, aquí sólo debería entrar yo.",
            "Tu deberías estar suscribiéndose a ZakaProfe: https://www.youtube.com/@ZakaProfe y ZakaTeka: https://www.youtube.com/@ZakaTeka",
        ].join("\n")
    );
    console.info(
        "%cSi por lo que sea sabes bien lo que haces (y sabes usar Svelte (y te gustaría ayudar un poco)), podrías contribuir a esta web, es de código abierto :D %c(en github:ZakaHaceCosas/zakaprofeweb).",
        "font-weight: 700;",
        "color: lightgreen; background-color: black;"
    );

    // esto no es lo mejor, pero no sé svelte, déjame en paz
    let theme: "dark" | "light" = $state("dark");

    function swapTheme(loadTheme: "dark" | "light") {
        const root = document.documentElement;
        if (loadTheme === "dark") {
            root.style.setProperty("--ng1", "#0F0F0F");
            root.style.setProperty("--txt", "#FFFFFF");
            root.style.setProperty("--blk", "#1F1F1F");
            root.style.setProperty("--blk-hov", "#2F2F2F");
            root.style.setProperty("--blkSha", "#000000");
            root.style.setProperty("--grey", "#AAA");
            root.style.setProperty("--fff25", "#FFFFFF25");
            root.style.setProperty("--overlay", "#00000099");
        } else {
            root.style.setProperty("--ng1", "#F0F0F0");
            root.style.setProperty("--txt", "#000000");
            root.style.setProperty("--blk", "#FFFFFF");
            root.style.setProperty("--blk-hov", "#EFEFEF");
            root.style.setProperty("--blkSha", "#00000010");
            root.style.setProperty("--grey", "#777");
            root.style.setProperty("--fff25", "#00000025");
            root.style.setProperty("--overlay", "#000000AA");
        }
        theme = loadTheme;
        document.cookie = `theme=${loadTheme}; path=/; max-age=31536000; SameSite=Lax`;
    }

    onMount(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        theme = mq.matches ? "dark" : "light";
        mq.addEventListener("change", (e) => {
            theme = e.matches ? "dark" : "light";
        });
    });

    $effect(() => {
        if (browser) swapTheme(theme);
    });

    let mobileMenu = $state(false);
</script>

<nav
    class="flex flex-row items-center justify-between border-b-2 border-b-(--fff25) bg-(--blk) p-4 shadow-[0px_0px_15px_10px_var(--blkSha)]"
>
    <a href={resolve("/")}>
        <img
            class="pointer-events-none! h-12 object-scale-down"
            src="/logo_horizon.avif"
            alt="Logotipo de {channel}"
        />
    </a>
    <button
        class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25) md:hidden"
        onclick={() => {
            mobileMenu = !mobileMenu;
        }}
    >
        {mobileMenu ? "✕" : "☰"}
    </button>
    <div class="hidden w-full flex-row items-center justify-end gap-2.5 md:flex">
        <button
            aria-label="Ir al inicio"
            onclick={() => goto(resolve("/"))}
            class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="25px" height="25px">
                <path
                    d="M 15 2 A 1 1 0 0 0 14.300781 2.2851562 L 3.3925781 11.207031 A 1 1 0 0 0 3.3554688 11.236328 L 3.3183594 11.267578 L 3.3183594 11.269531 A 1 1 0 0 0 3 12 A 1 1 0 0 0 4 13 L 5 13 L 5 24 C 5 25.105 5.895 26 7 26 L 23 26 C 24.105 26 25 25.105 25 24 L 25 13 L 26 13 A 1 1 0 0 0 27 12 A 1 1 0 0 0 26.681641 11.267578 L 26.666016 11.255859 A 1 1 0 0 0 26.597656 11.199219 L 25 9.8925781 L 25 6 C 25 5.448 24.552 5 24 5 L 23 5 C 22.448 5 22 5.448 22 6 L 22 7.4394531 L 15.677734 2.2675781 A 1 1 0 0 0 15 2 z M 18 15 L 22 15 L 22 23 L 18 23 L 18 15 z"
                    fill="currentColor"
                />
            </svg>
            <p class="hidden md:block">Inicio</p>
        </button>
        <button
            aria-label="Ir al buscador"
            onclick={() => goto(resolve("/search"))}
            class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="25px" height="25px">
                <path
                    d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"
                    fill="currentColor"
                />
            </svg>
            <p class="hidden md:block">Buscador</p>
        </button>
        <button
            aria-label="Ir a aplicaciones"
            onclick={() => goto(resolve("/apps"))}
            class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25)"
        >
            <svg width="25px" height="25px" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6.10352e-05H20V20.0001H0V6.10352e-05Z" fill="currentColor" />
                <path d="M24 10L34 0L44 10L34 20L24 10Z" fill="currentColor" />
                <path d="M0 24.0001H20V44.0001H0V24.0001Z" fill="currentColor" />
                <path d="M24 24.0001H44V44.0001H24V24.0001Z" fill="currentColor" />
            </svg>
            <p class="hidden md:block">Aplicaciones</p>
        </button>
    </div>
</nav>

{#if mobileMenu}
    <div class="flex flex-col bg-(--blk) p-8">
        <h2>Navegación</h2>
        {#each [{ url: "/", title: "Inicio" }, { url: "/apps", title: `Aplicaciones de ${channel}` }, { url: "/search", title: "Buscador de videos" }] as const as link, i (i)}
            <br />
            <a
                href={resolve(link.url)}
                class="hover:text-gray-400"
                onclick={() => (mobileMenu = false)}
            >
                {link.title}
            </a>
        {/each}
    </div>
{/if}

<main class="flex flex-1 flex-col items-start justify-start p-8">{@render children?.()}</main>

<footer
    class="flex flex-col items-center justify-between gap-4 border-t-2 border-t-(--fff25) bg-(--blk) p-4 text-sm font-medium text-(--grey) shadow-[0px_0px_-15px_10px_var(--blkSha)] md:flex-row md:gap-0"
>
    <p class="md:flex-3">
        &copy; <b>{channel} 2023-2026.</b><br />Todos los elementos de marca y otros diseños de «{channel}»
        y derivados son propiedad intelectual.<br />Todos los derechos reservados. Prohibida la
        reutilización, modificación o redistribución de todos los materiales asociados sin
        autorización expresa.
    </p>
    <p class="md:flex-2 md:text-end">
        <b>ZakaProfe WEB v4.0.0 (En desarrollo)</b> ·
        <a href={resolve("/changelog")} class="underline">¿Qué hay de nuevo en esta versión?</a>
        · <a href={resolve("/bugs")} class="underline">Reportar un fallo</a>
    </p>
</footer>
