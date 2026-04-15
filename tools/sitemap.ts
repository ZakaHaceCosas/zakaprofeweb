import { writeFileSync } from "fs";
import { execSync } from "child_process";

console.log(Bun.color("blue", "ansi"), "===> Sitemap.XML", Bun.color("white", "ansi"));

const app = Bun.argv[2];
if (!["profe", "teka"].includes(app)) {
    console.error(Bun.color("#ff3232", "ansi"), "App desconocida:", app, "\x1b[0m");
    process.exit(1);
}

const domains: Record<string, string> = {
    profe: "https://profe.zhc.es",
    teka: "https://teka.zhc.es",
};
const base = domains[app];

const _pages: string[] = ["/", "/search", "/changelog", "/bugs", "/apps"];

const glob = new Bun.Glob(`apps/${app}/src/routes/apps/**/+page.svelte`);
for await (const file of glob.scan(".")) {
    const a = file.split("\\apps\\")[1].trim().replace("\\+page.svelte", "");
    if (a == "+page.svelte") continue;
    _pages.push("/apps/" + a);
}

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
        <loc>${base}${page[0]}</loc>
        <lastmod>${page[1].trim()}</lastmod>
    </url>`
).join("\n")}
</urlset>
`;

writeFileSync(`apps/${app}/static/sitemap.xml`, body);

console.log(Bun.color("lightgreen", "ansi"), "¡OK! Sitemap.XML", "\x1b[0m");
