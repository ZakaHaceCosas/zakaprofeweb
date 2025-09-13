import { exec } from "child_process";
import { readdirSync, rmSync } from "fs";
import { join, basename, extname } from "path";

async function optimizeImages(dir: string) {
    const files: [string, string][] = [];

    readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = join(dir, dirent.name);
        if (dirent.isDirectory()) {
            optimizeImages(fullPath);
        } else if (dirent.isFile() && [".png", ".webp"].includes(extname(dirent.name))) {
            if (dirent.name.endsWith(".webp.webp")) {
                rmSync(join(dir, dirent.name));
            } else {
                const fileName = basename(dirent.name, ".png");
                const outputWebp = join(
                    dir,
                    fileName.endsWith(".webp") ? fileName : `${fileName}.webp`,
                );
                files.push([fullPath, outputWebp]);
            }
        }
    });

    await Promise.all(
        files.map(([fullPath, outputWebp]) =>
            exec(`cwebp -q 60 ${fullPath} -o ${outputWebp}`, (error, _, stderr) => {
                if (error) {
                    console.error(`Error optimizando ${fullPath}:`, stderr);
                } else {
                    console.log(`Optimizado ${fullPath} -> ${outputWebp}`);
                }
            }),
        ),
    );
}

await optimizeImages("public");
