import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { zpwapp } from "./tools/zpw-app-runtime";

export default defineConfig({
    plugins: [zpwapp(), tailwindcss(), sveltekit()],
    assetsInclude: ["**/*.zpwapp"],
});
