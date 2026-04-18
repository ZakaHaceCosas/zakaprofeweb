/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { glob } from "glob";
import path from "path";
import fs from "fs";

// #T
import type { Param } from "@zpw/types/types";
function zpw_input<T>(n: 1 | 0 = 0) {
    return "" as any as T;
}
const values: Record<string, string> = {};
type MDef = { title: string; desc: string[]; calc: string; calcLite: string };
type IDef = (Param | Param[])[];

class ZPWAPP {
    public sveltePath: string;
    public serverPath: string;
    private where: string;

    constructor(filepath: string) {
        filepath = filepath.replaceAll("\\", "/");
        this.where = filepath;
        const parts = filepath.split("/");
        const name = parts.pop()!.split(".")[0];
        const dir = parts.join("/") + "/" + name + "/";

        this.serverPath = dir + "+page.server.ts";
        this.sveltePath = dir + "+page.svelte";
        this.prepare();
    }

    private prepare(): void {
        const self = fs.readFileSync(path.join(process.cwd(), "/../../tools/zpw-app-runtime.ts"), {
            encoding: "utf-8",
        });
        const split = self.split("\n");
        const types = split.slice(split.indexOf("// #T") + 1, split.indexOf("class ZPWAPP {") - 1);
        const origin = fs.readFileSync(this.where, { encoding: "utf-8" });
        fs.writeFileSync(
            this.where,
            types.join("\n")
                + "\n"
                + origin.split("\n").slice(origin.split("\n").indexOf("/*S*/")).join("\n"),
            { encoding: "utf-8" }
        );
    }

    private prepareSvelte(input: string): string {
        const inputLines = input.split("\n").filter((l) => l.includes("zpw_input"));
        const preparedInputLines = inputLines.map((i) => {
            const n = i.replace("const ", "").split(" =")[0]! + (i.includes("(1)") ? "?" : "");
            const decl = i
                .split("= ")[1]!
                .replace("zpw_input<", "")
                .replace(">", "")
                .replace("()", "")
                .replace("(1)", "");
            return [n, decl];
        });
        const props = `let values: {${preparedInputLines.map((v) => `${v[0]}: string/*${v[1]}*/`).join(",")}} = $state({${preparedInputLines.map((v) => `${v[0].replace("?", "")}: ""`).join(",")}});`;
        return `import Core from "@zpw/ui/app/Core";\n${props}\n${input
            .trim()
            .split("\n")
            .filter((v) => !v.includes("zpw_input"))
            .join("\n")}`;
    }
    private prepareMarkup(inputQ: string, inputM: string): string {
        return `\n<Core params={${inputQ}} labels={${inputM}} app="${this.where.split("/").at(-1)?.split(".")[0]}" channel="${this.where.includes("profe") ? "profe" : "teka"}" bind:values {method}/>`;
    }

    private convert(): string {
        const origin = fs.readFileSync(this.where, { encoding: "utf-8" });
        // NOTE: por culpa de que el regex este existe no puedes poner urls en el archivo
        const shit = origin
            .replace(/\/\/.*/g, "")
            .trim()
            .split("/*S*/");
        const [rawSvelte, markupGenerator] = shit[1].split("/*_*/");
        const svelte = this.prepareSvelte(rawSvelte);
        const form = this.prepareMarkup(
            markupGenerator.split(";")[0].replace("const Q: IDef = ", "").trim(),
            markupGenerator.split(";")[1].replace("const M: MDef = ", "").trim()
        );
        // tengo crisis existenciales programando, a veces uso inglés y a veces español
        return `<script lang="ts">/* THIS IS GENERATED CODE, built with the ZPWAPP engine. Look for a .ZPWAPP file one directory above with the same name as this directory, the code for this app is there.*/\n${svelte}</script>${form}`;
    }

    public build(): void {
        fs.mkdirSync(path.dirname(this.sveltePath), { recursive: true });
        fs.writeFileSync(this.sveltePath, this.convert(), { encoding: "utf-8" });
        fs.writeFileSync(this.serverPath, "export const prerender = true;\n", {
            encoding: "utf-8",
        });
    }
}

async function zpwappCodeGen(filepath: string) {
    const app = new ZPWAPP(filepath);
    app.build();
}

export function zpwapp() {
    return {
        name: "zpwapp-code_gen-sys",
        async buildStart() {
            const archivos = await glob("../../apps/**/*.zpwapp"); // tiene q ser así pq se ejecuta desde cada app, no desde la raíz
            await Promise.all(archivos.map(zpwappCodeGen));
        },
        async handleHotUpdate({ file }: { file: string }) {
            if (file.endsWith(".zpwapp")) {
                await zpwappCodeGen(file);
            }
        },
    };
}
