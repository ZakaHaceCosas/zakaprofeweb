<script lang="ts">
    import "../app.css";
    // import favicon from "$lib/assets/favicon.svg";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    // import { setLocale } from "$lib/paraglide/runtime";

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
            root.style.setProperty("--ng2", "#1F1F1F");
            root.style.setProperty("--txt", "#FFFFFF");
            root.style.setProperty("--blk", "#1F1F1F");
            root.style.setProperty("--blkSha", "#000000");
            root.style.setProperty("--grey", "#AAA");
            root.style.setProperty("--fff25", "#FFFFFF25");
            root.style.setProperty("--overlay", "#00000099");
        } else {
            root.style.setProperty("--ng1", "#F0F0F0");
            root.style.setProperty("--ng2", "#FEFEFE");
            root.style.setProperty("--txt", "#000000");
            root.style.setProperty("--blk", "#FFFFFF");
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

<svelte:head>
    <title>ZakaProfe & ZakaTeka</title>
    <!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

<nav>
    <img src="logo-horizon.webp" alt="Logotipo de ZakaProfe" id="zp-logo-nav" />
    <div class="urls">
        <button onclick={() => goto("/")} class="react-button-as-href">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">
                <path
                    d="M 15 2 A 1 1 0 0 0 14.300781 2.2851562 L 3.3925781 11.207031 A 1 1 0 0 0 3.3554688 11.236328 L 3.3183594 11.267578 L 3.3183594 11.269531 A 1 1 0 0 0 3 12 A 1 1 0 0 0 4 13 L 5 13 L 5 24 C 5 25.105 5.895 26 7 26 L 23 26 C 24.105 26 25 25.105 25 24 L 25 13 L 26 13 A 1 1 0 0 0 27 12 A 1 1 0 0 0 26.681641 11.267578 L 26.666016 11.255859 A 1 1 0 0 0 26.597656 11.199219 L 25 9.8925781 L 25 6 C 25 5.448 24.552 5 24 5 L 23 5 C 22.448 5 22 5.448 22 6 L 22 7.4394531 L 15.677734 2.2675781 A 1 1 0 0 0 15 2 z M 18 15 L 22 15 L 22 23 L 18 23 L 18 15 z"
                />
            </svg>
            <p>Inicio</p>
        </button>
        <button onclick={() => goto("/search")} class="react-button-as-href">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">
                <path
                    d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"
                />
            </svg>
            <p>Buscador</p>
        </button>
        <button onclick={() => goto("/calculadora-notas")} class="react-button-as-href">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 90 86"
                fill="none"
            >
                <path
                    d="M43.1534 1.43986C43.8365 -0.202726 46.1635 -0.202728 46.8466 1.43986L57.756 27.6692C58.0441 28.3617 58.6953 28.8348 59.4429 28.8947L87.7596 31.1649C89.5329 31.307 90.252 33.5201 88.9009 34.6774L67.3265 53.1582C66.7569 53.6461 66.5082 54.4116 66.6822 55.1411L73.2735 82.7735C73.6863 84.5039 71.8038 85.8717 70.2856 84.9444L46.0425 70.1368C45.4025 69.7458 44.5975 69.7458 43.9575 70.1368L19.7144 84.9444C18.1962 85.8717 16.3137 84.504 16.7265 82.7735L23.3178 55.1411C23.4918 54.4116 23.2431 53.6461 22.6735 53.1582L1.09909 34.6774C-0.251987 33.5201 0.467064 31.307 2.24037 31.1649L30.5571 28.8947C31.3047 28.8348 31.9559 28.3617 32.244 27.6692L43.1534 1.43986Z"
                    fill="white"
                />
            </svg>
            <p>Calculadora de notas</p>
        </button>
        <button
            onclick={() => {
                if (theme === "dark") theme = "light";
                else theme = "dark";
            }}
            class="react-button-as-href"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
            >
                <circle cx="12" cy="12" r="9" stroke="#33363F" stroke-width="2" />
                <path
                    d="M18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364L12 12L18.364 5.63604Z"
                    fill="#33363F"
                />
            </svg>
            <p>Cambiar tema</p>
        </button>
    </div>
</nav>

{@render children?.()}

<footer>
    <p>
        &copy; <b>ZakaProfe 2023-2026.</b><br />Todos los elementos de marca y otros diseños de
        "ZakaProfe", "ZakaTeka", y derivados, son propiedad intelectual. Se reservan todos los
        derechos de autor, queda prohibida la reutilización, modificación, o redistribución de estos
        y otros materiales asociados sin autorización expresa.
    </p>
    <p class="text-end"><b>ZakaProfe WEBv3.0</b></p>
</footer>
