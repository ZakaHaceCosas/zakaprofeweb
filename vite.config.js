import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { glob } from "glob";
import { zpwappCodeGen } from "./tools/zpw-app-runtime";

function zpwapp() {
    return {
        async buildStart() {
            const archivos = await glob("../../apps/**/*.zpwapp"); // tiene q ser así pq se ejecuta desde cada app, no desde la raíz
            await Promise.all(archivos.map(zpwappCodeGen));
        },
        // @ts-ignore
        async handleHotUpdate({ file }) {
            if (file.endsWith(".zpwapp")) {
                await zpwappCodeGen(file);
            }
        },
    };
}

export default defineConfig({
    plugins: [zpwapp(), tailwindcss(), sveltekit()],
    assetsInclude: ["**/*.zpwapp"],
});
