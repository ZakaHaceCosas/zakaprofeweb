const toggle = Bun.argv[2];

if (!["y", "n"].includes(toggle)) process.exit(0);

const gitignore = Bun.file(".gitignore");
const text = await gitignore.text();
const lines = text.split("\n");
const apps = lines.filter((l) => l.startsWith("**/") || l.startsWith("#**/"));

const newLines = lines.map((l) => {
    if (!apps.includes(l)) return l;
    if (toggle == "y") return l.replace("#", "");
    else return l.startsWith("#") ? l : "#" + l;
});

await gitignore.write(newLines.join("\n"));

export {};
