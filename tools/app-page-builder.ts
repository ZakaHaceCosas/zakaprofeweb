import { readFileSync } from "node:fs";

console.log(Bun.color("blue", "ansi"), "===> Ensamblador de páginas de aplicación", "\x1b[0m");

const app = Bun.argv[2];
if (!["profe", "teka"].includes(app)) {
    console.error(Bun.color("#ff3232", "ansi"), "App desconocida:", app, "\x1b[0m");
    process.exit(1);
}

const glob = new Bun.Glob(`apps/${app}/src/routes/apps/**`);

const asignaturas: Set<string> = new Set();
const apps: {
    appName: string;
    icon: string;
    title: string;
    asignatura: string;
    body: string;
}[] = [];

for (const _ of glob.scanSync()) {
    const path = _.replaceAll("\\", "/").replaceAll("apps/teka/src/routes/apps/", "");
    if (!path.includes("/")) continue;
    if (path.includes(".server.")) continue;
    if (path.includes("+")) continue;
    const cnt = readFileSync(_, { encoding: "utf-8" });
    const lines = cnt.split("\n");
    const icon = lines
        .slice(lines.findIndex((l) => l.includes("-->")) + 1)
        .join("\n")
        .trim();
    const appName = path.split("/")[0].trim();
    const asignatura = lines
        .find((l) => l.startsWith("asi:"))!
        .replace("asi:", "")
        .trim();
    const title = lines
        .find((l) => l.startsWith("title:"))!
        .replace("title:", "")
        .trim();
    const body = lines
        .find((l) => l.startsWith("body:"))!
        .replace("body:", "")
        .trim();
    asignaturas.add(asignatura);
    apps.push({
        appName,
        icon,
        title,
        asignatura,
        body,
    });
}

const file = Bun.file(`apps/${app}/src/routes/apps/+page.svelte`);
const prevContent = await file.text();
const split = prevContent.split("\n");
const idx = split.findIndex((l) => l == "<!--apps-->");

let code = ``;

asignaturas.values().forEach((v) => {
    code += `<div class="flex w-full flex-row items-center gap-4">
    <p class="whitespace-nowrap">
        <span class="text-(--accent)">${app == "profe" ? "ZakaProfe" : "ZakaTeka"}</span> · ${v}
    </p>
    <hr />
</div><div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">${apps
        .filter((w) => w.asignatura == v)
        .map(
            (x) => `
    <CardLink target="apps/${x.appName}" title="${x.title}" body="${x.body}"
        >{#snippet svg()}${x.icon}{/snippet}
    </CardLink>`
        )
        .join("\n")}</div>`;
});

await file.write([split.slice(0, idx + 1).join("\n"), code].join("\n"));
