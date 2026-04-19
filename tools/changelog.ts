import { $, markdown, file } from "bun";

console.log(Bun.color("blue", "ansi"), "===> Actualización del CHANGELOG markup", "\x1b[0m");

await $`bun prettier --w .`.then(() => console.log("Empezando..."));

let verDate: string | null = null;

async function main(app: "profe" | "teka") {
    const tag = app === "profe" ? "[ZPW/PROFE]" : "[ZPW/TEKA]";
    const excludeTag = app === "profe" ? "[ZPW/TEKA]" : "[ZPW/PROFE]";

    const raw = await file("CHANGELOG.md").text();
    const filtered = raw
        .split("\n")
        .filter((line) => !line.includes(excludeTag))
        .map((line) => line.replaceAll(tag, "").trim())
        .join("\n");

    const markup = markdown
        .html(filtered)
        .replaceAll(
            "<p><strong>**Actualizaciones visibles para el usuario**</strong></p>",
            "<br/><p><strong>**Actualizaciones visibles para el usuario**</strong></p>"
        )
        .replaceAll(
            "<p><strong>**Actualizaciones internas (desarrollo)**</strong></p>",
            "<br/><p><strong>**Actualizaciones internas (desarrollo)**</strong></p>"
        )
        .replaceAll("<h3>", "<br><h3>")
        .replaceAll("</h3>", "</h3><br>")
        .replaceAll("<h2>", "<hr /> <h2>")
        .replace("<hr />", "");

    if (!verDate) verDate = markup.split("\n")[2].split("(")[1].split(")")[0];

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

    return markup;
}

await main("profe");
await main("teka");

const footerFile = file("packages/ui/src/global/Layout.svelte");
const footerLines = (await footerFile.text()).split("\n");
const footerLineStartIdx = footerLines.findIndex((s) =>
    s.trim().startsWith('<p class="md:flex-2 md:text-end">')
);
const ver = JSON.parse(await file(`./package.json`).text())["version"];
const newFooterLines = [
    ...footerLines.slice(0, footerLineStartIdx),
    `<p class="md:flex-2 md:text-end"><b>ZakaProfe WEB v${ver} (${verDate})</b> · <a href="/changelog" class="underline">¿Qué hay de nuevo en esta versión?</a> · <a href="#top" onclick={() => (document.getElementById("bugs-modal") as HTMLDialogElement).showModal()} class="underline">Reportar un fallo</a></p>`,
    ...footerLines.slice(footerLineStartIdx + 10),
];
await footerFile.write(newFooterLines.join("\n"));

await $`bun prettier --w .`.then(() =>
    console.log(
        Bun.color("lightgreen", "ansi"),
        "¡OK! Actualización del CHANGELOG markup",
        "\x1b[0m"
    )
);
