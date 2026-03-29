import { $, markdown, file } from "bun";

// necesario pq los putos números de linea están hardcoded
await $`bun prettier --w .`.then(() => console.log("Vamos allá..."));

const markup = markdown
    .html(await file("CHANGELOG.md").text())
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

const codeFile = file("src/routes/changelog/+page.svelte");
const lines = (await codeFile.text()).split("\n");
const startIdx = lines.findIndex((s) => s.trim().startsWith("<!--#CHG-->"));
const endIdx = lines.findIndex((s) => s.trim().startsWith("<!--CHG#-->"));
const newLines = [
    ...lines.slice(0, startIdx + 1),
    ...markup.trim().split("\n").slice(2),
    ...lines.slice(endIdx),
];
await codeFile.write(newLines.join("\n"));

const footerFile = file("src/routes/+layout.svelte");
const footerFileLines = (await footerFile.text()).split("\n");
const footerLineStartIdx = footerFileLines.findIndex((s) =>
    s.trim().startsWith('<p class="text-end">')
);
const ver = JSON.parse(await file("package.json").text())["version"];
const newFooterLines = [
    ...footerFileLines.slice(0, footerLineStartIdx),
    `<p class="text-end"><b>ZakaProfe WEB v${ver}</b> · <a href="/changelog" class="underline">¿Qué hay de nuevo en esta versión?</a> · <a href="/bugs" class="underline">Reportar un fallo</a></p>`,
    ...footerFileLines.slice(footerLineStartIdx + 5),
];
await footerFile.write(newFooterLines.join("\n"));
