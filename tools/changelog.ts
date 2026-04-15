import { $, markdown, file } from "bun";

console.log(Bun.color("blue", "ansi"), "===> Actualización del CHANGELOG markup", "\x1b[0m");

const app = Bun.argv[2];
if (!["profe", "teka"].includes(app)) {
    console.error(Bun.color("#ff3232", "ansi"), "App desconocida:", app, "\x1b[0m");
    process.exit(1);
}

const tag = app === "profe" ? "[ZPW/PROFE]" : "[ZPW/TEKA]";
const excludeTag = app === "profe" ? "[ZPW/TEKA]" : "[ZPW/PROFE]";

await $`bun prettier --w .`.then(() => console.log("Empezando..."));

const raw = await file("CHANGELOG.md").text();
const filtered = raw
    .split("\n")
    .filter((line) => !line.includes(excludeTag))
    .map((line) => line.replaceAll(tag, "").trim())
    .join("\n");

const markup = markdown
    .html(filtered)
    .replaceAll(
        "<p>Actualizaciones visibles para el usuario:</p>",
        "<h3>Actualizaciones visibles para el usuario:</h3>"
    )
    .replaceAll(
        "<p>Actualizaciones internas (desarrollo):</p>",
        "<h3>Actualizaciones internas (desarrollo):</h3>"
    )
    .replaceAll("<h2>", "<hr /> <h2>")
    .replace("<hr />", "");

const codeFile = file(`apps/${app}/src/routes/changelog/+page.svelte`);
const lines = (await codeFile.text()).split("\n");
const startIdx = lines.findIndex((s) => s.trim().startsWith("<!--#CHG-->"));
const endIdx = lines.findIndex((s) => s.trim().startsWith("<!--CHG#-->"));
const newLines = [
    ...lines.slice(0, startIdx + 1),
    ...markup.trim().split("\n").slice(2),
    ...lines.slice(endIdx),
];
await codeFile.write(newLines.join("\n"));

const footerFile = file(`apps/${app}/src/routes/+layout.svelte`);
const footerLines = (await footerFile.text()).split("\n");
const footerLineStartIdx = footerLines.findIndex((s) =>
    s.trim().startsWith('<p class="md:flex-2 md:text-end">')
);
const ver = JSON.parse(await file(`apps/${app}/package.json`).text())["version"];
const newFooterLines = [
    ...footerLines.slice(0, footerLineStartIdx),
    `<p class="md:flex-2 md:text-end"><b>ZakaProfe WEB v${ver} (${markup.split("\n")[2].split("(")[1].split(")")[0]})</b> · <a href={resolve("/changelog")} class="underline">¿Qué hay de nuevo en esta versión?</a> · <a href={resolve("/bugs")} class="underline">Reportar un fallo</a></p>`,
    ...footerLines.slice(footerLineStartIdx + 5),
];
await footerFile.write(newFooterLines.join("\n"));

await $`bun prettier --w .`.then(() =>
    console.log(
        Bun.color("lightgreen", "ansi"),
        "¡OK! Actualización del CHANGELOG markup",
        "\x1b[0m"
    )
);
