import { normalize } from "@zhc.js/string-utils";
import {
    ISCourse_ZP,
    ISSubject_ZP,
    ISSubject_ZT,
    IVideo,
    ZP_COURSES,
    ZP_SUBJECTS,
    ZPCourse,
    ZPSubject,
    ZT_SUBJECTS,
    ZTCourse,
    ZTSubject,
} from "@zpw/types/types";

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

export const ZPCacheFile = Bun.file("zakaprofe.zakache");
const ZTCacheFile = Bun.file("zakateka.zakache");
const ZPVDs: IVideo[] = (await ZPCacheFile.exists())
        ? await JSON.parse(await ZPCacheFile.text())
        : [],
    ZTVDs: IVideo[] = (await ZTCacheFile.exists())
        ? await JSON.parse(await ZTCacheFile.text())
        : [];

const zpSubjectKeys: Record<ZPSubject, string> = {
    "Biología y Geología": "bio",
    "Ciencias Sociales": "cis",
    "Matemáticas": "mate",
    "Lengua Castellana": "esp",
    "Inglés": "eng",
    "Física y Química": "fyq",
};
const zpLevelKeys: Record<ZPCourse, string> = {
    "3ro ESO": "3eso",
    "4to ESO": "4eso",
};
const ztSubjectKeys: Record<ZTSubject, string> = {
    "Desarrollo web": "dev_web",
    "Sistemas Operativos": "dev_oses",
    "Programación": "dev",
};
const ztLevelKeys: Record<ZTCourse, string> = {
    "(SMR | DAM | DAW | ASIR)": "smr", // SMR pq es lo que estudio yo, lo que tiñe mis enseñanzas
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
            .trim(),
        subjectAndLevelDirty
            .slice(
                subjectAndLevelDirty.indexOf("4") == -1
                    ? subjectAndLevelDirty.indexOf("3")
                    : subjectAndLevelDirty.indexOf("4")
            )
            .trim(),
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

    if (!ISCourse_ZP(level) || !ISSubject_ZP(subject))
        throw new Error(
            `VD FAILED (Subject/Course constraint UNMET) GOT ${vid.snippet.title} (AS ${subject}) WHICH IS ABSENT IN ${ZP_SUBJECTS.join(",")} OR ${ZP_COURSES.join(",")}`
        );

    const subjectKey = zpSubjectKeys[subject];
    const levelKey = zpLevelKeys[level];
    const thumbnail = `t/${subjectKey}/${levelKey}/${normalize(title).replaceAll(" ", "_").replaceAll(",", "").replaceAll("(", "").replaceAll(")", "")}.avif`;

    if (!(await Bun.file("apps/profe/static/" + thumbnail).exists())) {
        const res = await fetch(vid.snippet.thumbnails.maxres.url);
        await Bun.file(`apps/profe/static/${thumbnail.replace(".avif", ".png")}`).write(
            await res.arrayBuffer()
        );
    }

    ZPVDs.push({
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
    const [title, _subject] = vid.snippet.title.split("/");
    const subject = _subject.trim();

    if (!ISSubject_ZT(subject))
        throw new Error(
            `VD FAILED (Subject/Course constraint UNMET) GOT ${vid.snippet.title} (AS ${subject}) WHICH IS ABSENT IN ${ZT_SUBJECTS.join(",")}`
        );

    const subjectKey = ztSubjectKeys[subject];
    const levelKey = ztLevelKeys["(SMR | DAM | DAW | ASIR)"];

    const thumbnail = `t/${subjectKey}/${levelKey}/${normalize(title).replaceAll(" ", "_").replaceAll(",", "").replaceAll("(", "").replaceAll(")", "")}.avif`;

    if (!(await Bun.file("apps/teka/static/" + thumbnail).exists())) {
        const res = await fetch(vid.snippet.thumbnails.maxres.url);
        await Bun.file(`apps/teka/static/${thumbnail.replace(".avif", ".png")}`).write(
            await res.arrayBuffer()
        );
    }

    ZTVDs.push({
        title,
        subject: subject.trim(),
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
await Promise.all(
    ["profe", "teka"].map(async (chn) => {
        const file = Bun.file(`apps/${chn}/src/lib/db.ts`);
        await file.write(
            `import { type IVideo } from "@zpw/types/types"; export const ${chn == "profe" ? "ZPVDs" : "ZTVDs"}: IVideo[] = ${JSON.stringify(chn == "profe" ? ZPVDs : ZTVDs)};`
        );
    })
);

console.log(
    Bun.color("lightgreen", "ansi"),
    "¡OK! Actualización del repositorio de vídeos",
    "\x1b[0m"
);

export {};
