import { useState, useMemo } from "react";
import items from "../resources/videos";
import { StringUtils } from "@zakahacecosas/string-utils";

export default function Buscador() {
    const [search, setSearch] = useState("");
    const searchTerm = useMemo(() => StringUtils.normalize(search, true), [search]);

    const filteredVideos = useMemo(() => {
        if (!StringUtils.validate(searchTerm) || searchTerm.length < 3) return [];

        return items.filter(
            (v) =>
                StringUtils.normalize(v.title, true, true).includes(searchTerm) ||
                StringUtils.normalize(v.topic, true, true).includes(searchTerm) ||
                StringUtils.normalize(v.level, true, true).includes(searchTerm)
        );
    }, [searchTerm]);

    return (
        <section
            className="hero"
            style={{ flexDirection: "column", justifyContent: "center", gap: 15 }}
        >
            <h1>Buscador de vídeos</h1>
            <p>
                Es más rápido que el propio buscador de YouTube y tiene enlace directo a cada video,
                por lo que te será útil.
            </p>
            <hr />
            <input
                type="text"
                placeholder="Busca un video..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar videos"
            />
            <p className="disclaimer" aria-live="polite">
                {StringUtils.pluralOrNot("Encontrado", filteredVideos.length)}{" "}
                <b>{filteredVideos.length}</b>{" "}
                {StringUtils.pluralOrNot("video", filteredVideos.length)}.
                {filteredVideos.length > 2 && " Puedes deslizar abajo, hay más."}
            </p>
            <div className="search-results">
                {searchTerm.length > 2 &&
                    filteredVideos.map((v) => (
                        <div className="result" key={v.title}>
                            <img src={v.thumbnail} alt={`${v.title}, ${v.topic}, ${v.level}`} />
                            <div className="result-content">
                                <h2>{v.title}</h2>
                                <hr />
                                <p className="disclaimer">
                                    {v.topic} · {v.level} · S{v.season}
                                </p>
                                <a
                                    className="btn"
                                    href={v.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver en YouTube &gt;
                                </a>
                            </div>
                        </div>
                    ))}
                {filteredVideos.length > 7 && <p className="disclaimer">Cuántos videos, ¿no?</p>}
                {filteredVideos.length === 0 &&
                    searchTerm.length > 2 &&
                    searchTerm !== "voyaaprobar" && (
                        <p>
                            No se han encontrado resultados para <b>{search}</b>.
                        </p>
                    )}
                {searchTerm === "voyaaprobar" && <p>Di que sí campeón</p>}
                {searchTerm.length !== 0 && searchTerm.length < 3 && (
                    <p>Mínimo {3} letras para buscar.</p>
                )}
            </div>
        </section>
    );
}
