import { writeFileSync } from "fs";
import { execSync } from "child_process";

console.log(Bun.color("blue", "ansi"), "===> Sitemap.XML", Bun.color("white", "ansi"));

const _pages: string[] = [
    "/",
    "/search",
    "/changelog",
    "/bugs",
    "/apps",
    "/apps/acumuladores",
    "/apps/calculadora-finiquitos",
    "/apps/calculadora-nominas",
    "/apps/calculadora-notas",
    "/apps/calcular-flsm",
    "/apps/calcular-ip-cidr",
    "/apps/calcular-vlsm",
    "/apps/contador-palabras",
    "/apps/convertir-binario-decimal-hexadecimal",
    "/apps/windows-cmd-parser",
];

console.log(_pages.join("\n- "));

const PAGES: [string, string][] = _pages.map((p) => {
    const cmd = `git log -1 --format=%cs -- src/routes${p === "/" ? "" : p}/+page.svelte`;
    const out = execSync(cmd);
    console.log(cmd);
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

console.log(Bun.color("lightgreen", "ansi"), "¡OK! Sitemap.XML", Bun.color("white", "ansi"));
