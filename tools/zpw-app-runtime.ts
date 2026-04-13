import path from "path";
import fs from "fs";

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
    }

    // TODO: turn this into actual code-gen
    private convert() {
        return fs.readFileSync(this.where)
    }

    public build() {
        fs.mkdirSync(path.dirname(this.sveltePath), { recursive: true });
        fs.writeFileSync(this.sveltePath, this.convert(), { encoding: "utf-8" })
        fs.writeFileSync(this.serverPath, "export const prerender = true;\n", { encoding: "utf-8" })
    }
}

export async function zpwappCodeGen(filepath: string) {
    const app = new ZPWAPP(filepath);
    app.build();
}
