import { writeFileSync } from "fs";
import { execSync } from "child_process";

const _pages: string[] = [
    "/",
    "/search",
    "/changelog",
    "/bugs",
    "/apps",
    "/apps/calculadora-notas",
    "/apps/contador-palabras",
    "/apps/calculadora-nominas",
    "/apps/calcular-ip-cidr",
    "/apps/calcular-vlsm",
    "/apps/calcular-flsm",
    "/apps/convertir-binario-decimal-hexadecimal",
    "/apps/windows-cmd-parser",
];

const PAGES: [string, string][] = _pages.map((p) => {
    const cmd = `git log -1 --format=%cs -- src/routes${p === "/" ? "" : p}/+page.svelte`;
    console.log(cmd);
    const out = execSync(cmd);
    console.log(out.toString("utf8"));
    return [p, out.toString("utf-8")];
});

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
    (page) => `    <url>
        <loc>https://profe.zhc.es${page[0]}</loc>
        <lastmod>${page[1].trim()}</lastmod>
    </url>`
).join("\n")}
</urlset>
`;

writeFileSync("static/sitemap.xml", body);
