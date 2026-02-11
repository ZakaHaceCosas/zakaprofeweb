import { exec } from "child_process";
import { readdirSync, rmSync } from "fs";
import { join, basename, extname } from "path";

const EXT_ARRAY = [".png", ".webp"];

async function optimizeImages(dir: string) {
    const files: [string, string][] = [];

    readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = join(dir, dirent.name);
        if (dirent.isDirectory()) {
            optimizeImages(fullPath);
        } else if (dirent.isFile() && EXT_ARRAY.includes(extname(dirent.name))) {
            if (dirent.name.endsWith(".webp.webp") || dirent.name.endsWith(".avif.avif")) {
                rmSync(join(dir, dirent.name));
            } else if (dirent.name.includes("favicon-")) return;
            else {
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
                } else {
                    console.log(`Optimizado ${fullPath} -> ${outputAvif}`);
                }
            });
            exec(
                `${process.platform === "win32" ? "powershell Remove-Item" : "rm"} ${fullPath}`,
                (error, _, stderr) => {
                    if (error) {
                        console.error(`Error borrando ${fullPath}:`, stderr);
                    } else {
                        console.log(`Borrado ${fullPath}`);
                    }
                }
            );
        })
    );
}

await optimizeImages("static");
