import { optimize } from "svgo";
import { exec } from "child_process";
import { readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join, basename, extname } from "path";

console.log(Bun.color("blue", "ansi"), "===> Optimización de imágenes", "\x1b[0m");

const EXT_ARRAY = [".png", ".webp"];

async function optimizeImages(dir: string) {
    const files: [string, string][] = [];

    readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = join(dir, dirent.name);
        if (dirent.isDirectory()) {
            optimizeImages(fullPath);
        } else if (dirent.isFile() && EXT_ARRAY.includes(extname(dirent.name))) {
            if (dirent.name.endsWith(".webp.webp") || dirent.name.endsWith(".avif.avif")) {
                console.log("Eliminando", join(dir, dirent.name));
                rmSync(join(dir, dirent.name));
            } else if (
                dirent.name.includes("favicon")
                || (dirent.name.startsWith("logo") && dirent.name.endsWith("webp"))
            ) {
                console.log("Omitiendo", dirent.name);
            } else {
                const fileName = basename(dirent.name, ".png");
                const outputAvif = join(
                    dir,
                    fileName.endsWith(".avif") ? fileName : `${fileName}.avif`
                );
                files.push([fullPath, outputAvif]);
            }
        }
    });

    await Promise.all(
        files.map(([fullPath, outputAvif]) => {
            exec(`avifenc ${fullPath} -o ${outputAvif}`, (error, _, stderr) => {
                if (error) {
                    console.error(`Error optimizando ${fullPath}:`, stderr);
                    return;
                }
                console.log(`Optimizado ${fullPath} -> ${outputAvif}`);
                exec(
                    `${process.platform === "win32" ? "powershell Remove-Item" : "rm"} ${fullPath}`,
                    (error, _, stderr) => {
                        if (error) {
                            console.error(`Error borrando ${fullPath}:`, stderr);
                            return;
                        }
                        console.log(`Borrado ${fullPath}`);
                    }
                );
            });
        })
    );
}

await optimizeImages("apps/profe/static");
await optimizeImages("apps/teka/static");

["profe", "teka"].forEach((v) => {
    for (const s of new Bun.Glob(`apps/${v}/src/routes/apps/**/**.svg`).scanSync()) {
        console.log(`Optimizando SVG ${s}`);
        writeFileSync(
            s,
            optimize(readFileSync(s, { encoding: "utf-8" }), {
                plugins: [
                    {
                        name: "preset-default",
                        params: {
                            overrides: {
                                removeComments: false,
                            },
                        },
                    },
                ],
            })
                .data.replace("-->", "\n-->\n")
                .replace("<!--", "<!--\n")
        );
    }
});

console.log(Bun.color("lightgreen", "ansi"), "¡OK! Optimización de imágenes", "\x1b[0m");
