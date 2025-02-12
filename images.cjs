const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function optimizeImages(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            optimizeImages(fullPath);
        } else if (dirent.isFile() && path.extname(dirent.name).toLowerCase() === ".png") {
            const fileName = path.basename(dirent.name, ".png");
            const outputWebp = path.join(dir, `${fileName}.webp`);
            const command = `cwebp -q 85 "${fullPath}" -o "${outputWebp}"`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error con ${fullPath}:`, stderr);
                } else {
                    console.log(`Optimizado ${fullPath} -> ${outputWebp}`);
                }
            });
        }
    });
}

optimizeImages("public");
