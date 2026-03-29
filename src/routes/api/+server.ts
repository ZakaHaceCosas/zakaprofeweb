import { json } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { Profanity } from "@2toad/profanity";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

const MAX_REQ_POR_MINUTO = 2;
// no sé desde cuando esto existe (Emoji_presentation como regex)
// pensé que chatgpt estaba alucinando, pero funciona
const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

// llevo la vida sin usar Supabase, mare mía

export async function GET({ url }) {
    // em sí, /api asume que solo se va a usar para comentarios
    // no creo que vercel me pegue no?
    const pageId = url.searchParams.get("comments");
    if (!pageId)
        return json(
            { error: "Falta ID de página, esto es un fallo del programador de la página." },
            { status: 400 }
        );

    const { data: comments, error } = await supabase
        .from("comments")
        .select("*")
        .eq("page_id", pageId)
        .eq("approved", true)
        .order("created_at", { ascending: false });

    if (error) return json({ error: error.message }, { status: 500 });
    return json(comments);
}

const moderador = new Profanity({
    languages: ["es"],
    wholeWord: true,
    grawlix: "*****",
    grawlixChar: "*",
});

export async function POST({ request }) {
    const ip = crypto
        .createHash("sha256")
        .update(request.headers.get("x-forwarded-for") ?? "unknown")
        .digest("hex");

    const { text, author, pageId } = await request.json();

    if (!text || text.length < 3 || text.length > 500)
        return json(
            { error: "Texto inválido, o es muy corto (<3 letras) o muy largo (>500)." },
            { status: 400 }
        );

    if (author && (author.length < 3 || author.length > 64))
        return json(
            { error: "Autor inválido, o es muy corto (<3 letras) o muy largo (>64)." },
            { status: 400 }
        );

    const clean = moderador.censor(text);
    // podría prohibir las cosas malas directamente, pero bueno, vamos a ser algo más liberales
    // return json({ error: "Comentario moderado. No uses palabrotas." }, { status: 400 });

    // emojis sospechosos
    const emojis = text.match(EMOJI_REGEX) || [];
    const counts: Record<string, number> = {};
    for (const e of emojis) {
        counts[e] = (counts[e] || 0) + 1;
        if (counts[e] > 5)
            return json({ error: "Spam de emojis detectado. No te pases." }, { status: 400 });
    }

    const now = Date.now();
    const { data: rateData } = await supabase
        .from("rate_limits")
        .select("*")
        .eq("ip_hash", ip)
        .limit(1)
        .single();

    if (rateData) {
        if (rateData.reset_at > now && rateData.count >= MAX_REQ_POR_MINUTO)
            return json(
                {
                    error: `Demasiadas solicitudes. Estás limitado a ${MAX_REQ_POR_MINUTO} comentarios por minuto.`,
                },
                { status: 429 }
            );
        else if (rateData.reset_at <= now) {
            await supabase
                .from("rate_limits")
                .upsert({ ip_hash: ip, count: 1, reset_at: now + 60_000 });
        } else {
            await supabase
                .from("rate_limits")
                .update({ count: rateData.count + 1 })
                .eq("ip_hash", ip);
        }
    } else {
        await supabase
            .from("rate_limits")
            .insert({ ip_hash: ip, count: 1, reset_at: now + 60_000 });
    }

    const { error: insertError } = await supabase.from("comments").insert({
        page_id: pageId,
        text: clean,
        ip_hash: ip,
        created_at: now,
        approved: false,
        author: author.trim() == "" ? null : author,
        is_wm: false,
        admin_res: null,
    });

    if (insertError) return json({ error: insertError.message }, { status: 500 });
    return json({ ok: true });
}
