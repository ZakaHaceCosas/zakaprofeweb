import { join, relative } from "node:path";

console.log(Bun.color("blue", "ansi"), "===> Generador de tipos para @zpw/ui", "\x1b[0m");

const src = join("packages/ui", "src").replaceAll("\\", "/");
const pkgJson = join("packages/ui", "package.json").replaceAll("\\", "/");

function buildExports(files: string[]): Record<string, object> {
    const exports: Record<string, object> = {};

    for (const file of files) {
        const rel = relative(src, file)
            .replace(/\.svelte$/, "")
            .replaceAll("\\", "/")
            .replace("packages/ui/src/", "");
        const exportKey = `./${rel}`;
        const filePath = `./src/${rel}.svelte`;

        exports[exportKey] = {
            svelte: filePath,
            default: filePath,
        };
    }

    return exports;
}

const files: string[] = [];

for (const entry of new Bun.Glob(`${src}/**/*.svelte`).scanSync()) {
    const fullPath = join(src, entry);
    files.push(fullPath);
}

const file = Bun.file(pkgJson);
const pkg = JSON.parse(await file.text());

pkg.exports = buildExports(files);

await file.write(JSON.stringify(pkg));

for (const key of Object.keys(pkg.exports)) {
    console.log(`  ${key}`);
}

console.log(Bun.color("lightgreen", "ansi"), "¡OK! Generador de tipos para @zpw/ui", "\x1b[0m");
