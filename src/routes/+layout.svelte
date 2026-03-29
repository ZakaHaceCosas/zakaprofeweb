<script lang="ts">
    import "../app.css";
    // import favicon from "$lib/assets/favicon.svg";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let { children } = $props();

    // nos hacemos los interesantes
    console.log(
        "%cZakaProfe%c, Salvando tus notas 👍 <=> %cZakaTeka%c, Teknología que entiendes 👍",
        "color: white; background: #0099ff; padding: 5px 10px; font-size: 16px; font-weight: bold;",
        "font-size: 15px;",
        "color: black; background: #feb100; padding: 5px 10px; font-size: 16px; font-weight: bold;",
        "font-size: 15px;"
    );
    console.log(
        [
            "%cNo sé que haces husmeando en la consola, aquí sólo debería entrar yo.",
            "Tu deberías estar suscribiéndose a ZakaProfe: https://www.youtube.com/@ZakaProfe,",
            "deberías estar suscribiéndose a ZakaTeka: https://www.youtube.com/@ZakaTeka",
            "y deberías estar siguiéndome en Instagram: https://instagram.com/zhc.zakaprofe",
        ].join("\n"),
        "color: black; background-color: white; font-style: italic;"
    );
    console.info(
        "%cSi por lo que sea sabes bien lo que haces, podrías contribuir a esta web en GitHub :D %c(github.com/ZakaHaceCosas/zakaprofeweb).",
        "color: black; background-color: white; font-style: italic;",
        "color: green; font-style: italic;"
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
        const loadTheme = (() => {
            const savedTheme = document.cookie.split("; ").find((row) => row.startsWith("theme="));
            return savedTheme ? (savedTheme.split("=")[1] as "dark" | "light") : "dark";
        })();

        swapTheme(loadTheme);
    });

    $effect(() => {
        swapTheme(theme);
    });
</script>

<nav
    class="flex flex-col items-center justify-between border-b-2 border-b-(--fff25) bg-(--blk) p-4 shadow-[0px_0px_15px_10px_var(--blkSha)] sm:flex-row"
>
    <a href="/">
        <img
            class="pointer-events-none!"
            src="/logo-horizon.webp"
            alt="Logotipo de ZakaProfe"
            style="height: 50px; object-fit: scale-down;"
        />
    </a>
    <div class="flex w-full flex-row items-center justify-center gap-2.5 sm:justify-end">
        <button
            onclick={() => goto("/")}
            class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="25px" height="25px">
                <path
                    d="M 15 2 A 1 1 0 0 0 14.300781 2.2851562 L 3.3925781 11.207031 A 1 1 0 0 0 3.3554688 11.236328 L 3.3183594 11.267578 L 3.3183594 11.269531 A 1 1 0 0 0 3 12 A 1 1 0 0 0 4 13 L 5 13 L 5 24 C 5 25.105 5.895 26 7 26 L 23 26 C 24.105 26 25 25.105 25 24 L 25 13 L 26 13 A 1 1 0 0 0 27 12 A 1 1 0 0 0 26.681641 11.267578 L 26.666016 11.255859 A 1 1 0 0 0 26.597656 11.199219 L 25 9.8925781 L 25 6 C 25 5.448 24.552 5 24 5 L 23 5 C 22.448 5 22 5.448 22 6 L 22 7.4394531 L 15.677734 2.2675781 A 1 1 0 0 0 15 2 z M 18 15 L 22 15 L 22 23 L 18 23 L 18 15 z"
                    fill="currentColor"
                />
            </svg>
            <p class="hidden sm:block">Inicio</p>
        </button>
        <button
            onclick={() => goto("/search")}
            class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="25px" height="25px">
                <path
                    d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"
                    fill="currentColor"
                />
            </svg>
            <p class="hidden sm:block">Buscador</p>
        </button>
        <button
            onclick={() => goto("/apps")}
            class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25)"
        >
            <svg width="25px" height="25px" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6.10352e-05H20V20.0001H0V6.10352e-05Z" fill="currentColor" />
                <path d="M24 10L34 0L44 10L34 20L24 10Z" fill="currentColor" />
                <path d="M0 24.0001H20V44.0001H0V24.0001Z" fill="currentColor" />
                <path d="M24 24.0001H44V44.0001H24V24.0001Z" fill="currentColor" />
            </svg>
            <p class="hidden sm:block">Aplicaciones</p>
        </button>
        <button
            onclick={() => {
                if (theme === "dark") theme = "light";
                else theme = "dark";
            }}
            class="text-var(--txt) flex cursor-pointer flex-row items-center justify-center gap-1.25 bg-transparent p-2.5 no-underline hover:bg-(--fff25)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="#33363F" stroke-width="2" />
                <path
                    d="M18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364L12 12L18.364 5.63604Z"
                    fill="#FFF"
                />
            </svg>
            <p class="hidden sm:block">Tema</p>
        </button>
    </div>
</nav>

{@render children?.()}

<footer
    class="flex flex-col items-center justify-between gap-4 border-t-2 border-t-(--fff25) bg-(--blk) p-4 text-sm font-medium text-(--grey) shadow-[0px_0px_-15px_10px_var(--blkSha)] sm:flex-row sm:gap-0"
>
    <p class="sm:flex-3">
        &copy; <b>ZakaProfe 2023-2026.</b><br />Todos los elementos de marca y otros diseños de
        «ZakaProfe», «ZakaTeka», y derivados, son propiedad intelectual.<br />Se reservan todos los
        derechos de autor, queda prohibida la reutilización, modificación, o redistribución de estos
        y otros materiales asociados sin autorización expresa.
    </p>
    <p class="sm:flex-2 sm:text-end">
        <b>ZakaProfe WEB v3.5.0</b> ·
        <a href="/changelog" class="underline">¿Qué hay de nuevo en esta versión?</a>
        · <a href="/bugs" class="underline">Reportar un fallo</a>
    </p>
</footer>
