import path from "path";
import fs from "fs";

// #T
function zpw_input<T>(n: 1 | 0 = 0) {
    return "" as any as T;
}
const input: Record<string, any> = {};
type IDef = {
    type: "txt" | "txtArea" | "num";
    placeholder: string;
    bind_to: string | false;
    input_name: string;
    r: 1 | 0;
}[];
type MDef = { name: string; desc: string; longDesc: string };

class ZPWAPP {
    public sveltePath: string;
    public serverPath: string;
    private where: string;

    constructor(filepath: string) {
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
                + origin
                    .split("\n")
                    .slice(origin.split("\n").indexOf("/*S*/") - 1)
                    .join("\n"),
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
        const props = `let values: {${preparedInputLines.map((v) => `${v[0]}: ${v[1]}`).join(",")}} = $state({});`;
        return `import Core from "@zpw/ui/app/Core";\nimport Input from "@zpw/ui/Input";\n${props}\n${input
            .trim()
            .split("\n")
            .filter((v) => !v.includes("zpw_input"))
            .join("\n")}`;
    }

    private formKeyParser(i: IDef[0]) {
        let str = "<";
        if (i.type == "txt") str += "Input\ntype='text'\n";

        str += `title="${i.placeholder}"\n`;
        str += `name="${i.input_name}"\n`;
        str += `required={${i.r == 1}}\n`;
        str += `bind:value={input.${i.bind_to}}`;
        str += "/>";
        return str;
    }
    private prepareMetaMarkup(input: string): string {
        return "// TODO";
    }
    private prepareFormMarkup(input: string): string {
        const obj = JSON.parse(input);
        const str = obj.map(this.formKeyParser);
        return "\n<Core bind:values {calculatorMethod}>\n" + str.join("\n") + "\n</Core>";
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
        const form = this.prepareFormMarkup(
            markupGenerator.split(";")[0].replace("const Q: IDef = ", "").trim()
        );
        // tengo crisises existenciales programando, a veces uso inglés y a veces español
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

export async function zpwappCodeGen(filepath: string) {
    const app = new ZPWAPP(filepath);
    app.build();
}
