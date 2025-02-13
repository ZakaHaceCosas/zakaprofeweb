import { useState } from "react";
import items from "../resources/videos";
import ExternalLink from "./ext-link";
import { StringUtils } from "@zakahacecosas/string-utils";

export default function Buscador() {
    const [search, setSearch] = useState("");
    const searchTerm = StringUtils.normalize(search, true, true);

    const filteredVideos =
        searchTerm === ""
            ? []
            : items.filter(
                  (v) =>
                      StringUtils.normalize(v.title, true, true).includes(searchTerm) ||
                      StringUtils.normalize(v.topic, true, true).includes(searchTerm)
              );

    return (
        <section
            className="hero"
            style={{ flexDirection: "column", justifyContent: "center", gap: 15 }}
        >
            <h1>Buscador de vídeos</h1>
            <p>
                Con enlace directo a YouTube. Carga más rápido que el propio buscador de YT, así que
                te será útil.
            </p>
            <hr />
            <div style={{ minWidth: "30vw" }}>
                <input
                    type="text"
                    placeholder="Busca un video..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {filteredVideos.length > 2 && (
                <p style={{ fontSize: "x-small", opacity: 0.45 }}>
                    (puedes deslizar abajo, hay más)
                </p>
            )}
            <div
                className="row-ish search-results"
                style={{
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "start",
                    maxHeight: "45vh",
                    overflow: "scroll",
                    padding: 5,
                    width: "80vw",
                }}
            >
                {filteredVideos.map((v) => (
                    <div
                        key={v.title}
                        style={{
                            backgroundColor: "var(--fff25)",
                            borderRadius: 17,
                            padding: 2,
                            width: "100%",
                        }}
                    >
                        <div className="result">
                            <img
                                src={v.thumbnail}
                                alt={`${v.title}, ${v.topic}, ${v.level}`}
                                style={{ maxWidth: "250px", borderRadius: 10 }}
                            />
                            <div
                                className="result-content"
                                style={{
                                    alignItems: "start",
                                    justifyContent: "start",
                                    paddingTop: 0,
                                }}
                            >
                                <h3>{v.title}</h3>
                                <hr />
                                <p style={{ fontSize: "smaller", opacity: 0.5 }}>
                                    {v.topic} · {v.level}
                                </p>
                                <ExternalLink url={v.url}>Ver en YouTube &gt;</ExternalLink>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredVideos.length > 7 && <p>Cuántos videos, ¿no?</p>}
            </div>
        </section>
    );
}
