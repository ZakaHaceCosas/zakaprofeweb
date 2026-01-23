import { writeFileSync } from "fs";
import { execSync } from "child_process";

const _pages: [string, undefined][] = [
    ["/", undefined],
    ["/apps/calculadora-notas", undefined],
    ["/apps/contador-palabras", undefined],
    ["/apps/calcular-ip-cidr", undefined],
    ["/apps/convertir-binario-decimal-hexadecimal", undefined],
    ["/search", undefined],
    ["/apps", undefined],
];

const PAGES = _pages.map((p) => {
    const cmd = `git log -1 --format=%cs -- src/routes${p[0] === "/" ? "" : p[0]}/+page.svelte`;
    console.log(cmd);
    const out = execSync(cmd);
    console.log(out.toString("utf8"));
    return [p[0], out.toString("utf-8")];
});

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
    (page) => `    <url>
        <loc>https://profe.zhc.es${page[0]}</loc>
        <lastmod>${page[1].trim()}</lastmod>
    </url>`
).join("")}
</urlset>
`;

writeFileSync("static/sitemap.xml", body);
