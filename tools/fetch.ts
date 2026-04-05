import { normalize } from "@zhc.js/string-utils";

console.log(
    Bun.color("blue", "ansi"),
    "===> Actualización del repositorio de vídeos",
    Bun.color("white", "ansi")
);

const API_KEY = process.env["YOUTUBE"]!;
const BASE = "https://www.googleapis.com/youtube/v3";
type apiContent = {
    nextPageToken: string | null;
    items: { contentDetails: { videoId: string } }[];
};

function parserDuraciónISO(iso: string) {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    return `${Number(match?.[1] || 0)
        .toString()
        .padStart(2, "0")}:${Number(match?.[2] || 0)
        .toString()
        .padStart(2, "0")}:${Number(match?.[3] || 0)
        .toString()
        .padStart(2, "0")}`;
}

type Video = {
    kind: "youtube#video";
    etag: string;
    id: string;
    snippet: {
        publishedAt: Date;
        channelId: string;
        title: string;
        description: string;
        thumbnails: Record<"maxres" | "standard", { url: string; width: number; height: number }>;
        channelTitle: "ZakaProfe" | "ZakaTeka";
        tags: string[];
    };
    contentDetails: {
        duration: string;
    };
    statistics: {
        viewCount: string;
        likeCount: string;
        favoriteCount: string;
        commentCount: string;
    };
};

/** puta API de YT que no me da la lista de playlists al obtener un video... */
async function playlists(channelId: string) {
    const file = Bun.file("playlists.zakache");
    if (await file.exists()) {
        return JSON.parse(await file.text());
    }

    const map = new Map();

    // fetch helper
    async function get(url: string, params: Record<string, string | null>) {
        const u = new URL(url);
        Object.entries(params).forEach(([k, v]) => {
            if (v) u.searchParams.set(k, v);
        });
        const res = await fetch(u.toString());
        return res.json();
    }

    let nextPageToken = null;
    const playlists = [];
    do {
        const data = await get(`${BASE}/playlists`, {
            part: "snippet",
            channelId,
            maxResults: "50",
            pageToken: nextPageToken,
            key: API_KEY,
        });
        playlists.push(...data.items);
        nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    for (const pl of playlists) {
        const title: string = pl.snippet.title;
        const key = title.includes("Temporada")
            ? title.replace("ZakaProfe / Temporada ", "S")
            : title;
        const playlistId = pl.id;

        nextPageToken = null;
        const videos = [];

        do {
            const data: apiContent = await get(`${BASE}/playlistItems`, {
                part: "contentDetails",
                playlistId,
                maxResults: "50",
                pageToken: nextPageToken,
                key: API_KEY,
            });

            videos.push(...data.items.map((i) => i.contentDetails.videoId));
            nextPageToken = data.nextPageToken;
        } while (nextPageToken);

        map.set(key, videos);
    }

    const output = Object.fromEntries(map.entries());
    await file.write(JSON.stringify(output));
    return output;
}

async function hola(channelId: string) {
    const channelRes = await fetch(
        `${BASE}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();

    const uploadsId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    const videos: Video[] = [];
    let nextPageToken: string | null = "";

    while (nextPageToken != null) {
        const playlistRes = await fetch(
            `${BASE}/playlistItems?part=contentDetails&playlistId=${uploadsId}&maxResults=50&pageToken=${nextPageToken || ""}&key=${API_KEY}`
        );
        const playlistData: apiContent = await playlistRes.json();

        const ids = playlistData.items.map((item) => item.contentDetails.videoId);

        const videosRes = await fetch(
            `${BASE}/videos?part=snippet,statistics,contentDetails&id=${ids.join(",")}&key=${API_KEY}`
        );
        const videosData = await videosRes.json();

        videos.push(...videosData.items);

        nextPageToken = playlistData.nextPageToken;
    }

    return videos;
}

const ZPTemporadas: Record<string, string[]> = await playlists("UC-MFtBk1HQB0qyrQ5NgYGrA");
const ZakaProfe = await hola("UC-MFtBk1HQB0qyrQ5NgYGrA");
const ZakaTeka = await hola("UCU-pq21TjveQWm4DgEyFSiw");

// # types #
export const SUBJECTS = [
    "Física y Química",
    "Matemáticas",
    "Ciencias Sociales",
    "Biología y Geología",
    "Lengua Castellana",
    "Inglés",
    "Desarrollo web",
    "Programación",
    "Sistemas Operativos",
] as const;
export const COURSES = ["4to ESO", "3ro ESO", "(SMR | DAM | DAW | ASIR)"] as const;
export type Subject = (typeof SUBJECTS)[number];
export type Course = (typeof COURSES)[number];
interface ZakaVideo {
    title: string;
    duration: string;
    channel: "ZakaProfe" | "ZakaTeka"; // compat.
    thumbnail: string;
    url: `https://www.youtube.com/watch?v=${string}`;
    subject: Subject;
    level: Course;
    likes: number;
    seen: number;
    season: number;
}
// # types! #

const ZPCacheFile = Bun.file("zakaprofe.zakache");
const ZTCacheFile = Bun.file("zakateka.zakache");
const ZPVDs: ZakaVideo[] = (await ZPCacheFile.exists())
        ? await JSON.parse(await ZPCacheFile.text())
        : [],
    ZTVDs: ZakaVideo[] = (await ZTCacheFile.exists())
        ? await JSON.parse(await ZTCacheFile.text())
        : [];

const subjectKeys: Record<Subject, string> = {
    "Biología y Geología": "bio",
    "Ciencias Sociales": "cis",
    "Desarrollo web": "dev_web",
    "Sistemas Operativos": "dev_oses",
    "Programación": "dev",
    "Matemáticas": "mate",
    "Lengua Castellana": "esp",
    "Inglés": "eng",
    "Física y Química": "fyq",
};
const levelKeys: Record<Course, string> = {
    "(SMR | DAM | DAW | ASIR)": "smr", // SMR pq es lo que estudio yo, lo que tiñe mis enseñanzas
    "3ro ESO": "3eso",
    "4to ESO": "4eso",
};

const stringsForFile: string[] = [];

for (const vid of ZakaProfe) {
    if (ZPVDs.find((v) => v.url.endsWith(vid.id))) continue;
    const [titleDirty, subjectAndLevelDirty] = vid.snippet.title.split("/");
    const title = titleDirty
        .slice(
            1,
            (titleDirty.slice(1).indexOf('"') == -1
                ? titleDirty.slice(1).indexOf("»")
                : titleDirty.slice(1).indexOf('"')) + 1
        )
        .trim();
    const [subject, level] = [
        subjectAndLevelDirty
            .slice(
                0,
                subjectAndLevelDirty.indexOf("4") == -1
                    ? subjectAndLevelDirty.indexOf("3")
                    : subjectAndLevelDirty.indexOf("4")
            )
            .trim() as Subject,
        subjectAndLevelDirty
            .slice(
                subjectAndLevelDirty.indexOf("4") == -1
                    ? subjectAndLevelDirty.indexOf("3")
                    : subjectAndLevelDirty.indexOf("4")
            )
            .trim() as Course,
    ];

    const season = Number(
        Object.entries(ZPTemporadas)
            .map(([k, v]) => {
                if (!k.startsWith("S")) return null;
                if (v.includes(vid.id)) return k.slice(1);
                return null;
            })
            .find((i) => i !== null)!
    );

    const subjectKey = subjectKeys[subject];
    const levelKey = levelKeys[level];
    const thumbnail = `t/zp/${subjectKey}/${levelKey}/${normalize(title).replaceAll(" ", "_").replaceAll(",", "").replaceAll("(", "").replaceAll(")", "")}.avif`;

    if (!(await Bun.file("static/" + thumbnail).exists())) {
        const res = await fetch(vid.snippet.thumbnails.maxres.url);
        await Bun.file(`static/${thumbnail.replace(".avif", ".png")}`).write(
            await res.arrayBuffer()
        );
    }

    ZPVDs.push({
        channel: "ZakaProfe",
        title,
        subject,
        duration: parserDuraciónISO(vid.contentDetails.duration),
        level,
        url: `https://www.youtube.com/watch?v=${vid.id}`,
        season,
        thumbnail,
        likes: Number(vid.statistics.likeCount),
        seen: Number(vid.statistics.viewCount),
    });
}

await ZPCacheFile.write(JSON.stringify(ZPVDs));
stringsForFile.push(`const ZPVDs: IVideo[] = ${JSON.stringify(ZPVDs)};`);

for (const vid of ZakaTeka) {
    if (ZTVDs.find((v) => v.url.endsWith(vid.id))) continue;
    const [title, subject] = vid.snippet.title.split("/");

    const subjectKey = subjectKeys[subject as Subject];
    const levelKey = levelKeys["(SMR | DAM | DAW | ASIR)"];

    const thumbnail = `t/zt/${subjectKey}/${levelKey}/${normalize(title).replaceAll(" ", "_").replaceAll(",", "").replaceAll("(", "").replaceAll(")", "")}.avif`;

    if (!(await Bun.file("static/" + thumbnail).exists())) {
        const res = await fetch(vid.snippet.thumbnails.maxres.url);
        await Bun.file(`static/${thumbnail.replace(".avif", ".png")}`).write(
            await res.arrayBuffer()
        );
    }

    ZTVDs.push({
        channel: "ZakaTeka",
        title,
        subject: subject.trim() as Subject,
        level: "(SMR | DAM | DAW | ASIR)",
        url: `https://www.youtube.com/watch?v=${vid.id}`,
        duration: parserDuraciónISO(vid.contentDetails.duration),
        season: 4,
        thumbnail,
        likes: Number(vid.statistics.likeCount),
        seen: Number(vid.statistics.viewCount),
    });
}

await ZTCacheFile.write(JSON.stringify(ZTVDs));
stringsForFile.push(`const ZTVDs: IVideo[] = ${JSON.stringify(ZTVDs)};`);
stringsForFile.push("export { ZPVDs, ZTVDs };");
const file = Bun.file("src/lib/db.ts");
const cnt = (await file.text()).split("\n");
const injectionPoint = cnt.findIndex((s) => s == "// # INYECTAR AQUÍ AMIGO # //");
const thisFile = Bun.file("tools/fetch.ts");
const thisCnt = (await thisFile.text()).split("\n");
const [thisCntIS, thisCntIE] = [
    thisCnt.findIndex((s) => s == "// # types #"),
    thisCnt.findIndex((s) => s == "// # types! #"),
];
await file.write(
    [...cnt.slice(0, injectionPoint + 1), ...thisCnt.slice(thisCntIS, thisCntIE), ...stringsForFile]
        .join("\n")
        .replace("interface ZakaVideo", "export interface IVideo")
);

console.log(
    Bun.color("lightgreen", "ansi"),
    "¡OK! Actualización del repositorio de vídeos",
    Bun.color("white", "ansi")
);

export {};
