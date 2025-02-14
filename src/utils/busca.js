import { useState, useMemo } from "react";
import items from "../resources/videos";
import ExternalLink from "./ext-link";
import { StringUtils } from "@zakahacecosas/string-utils";

export default function Buscador() {
    const [search, setSearch] = useState("");
    const searchTerm = useMemo(() => StringUtils.normalize(search, true), [search]);

    const filteredVideos = useMemo(() => {
        if (!StringUtils.validate(searchTerm) || searchTerm.length < 3) return [];

        return items.filter(
            (v) =>
                StringUtils.normalize(v.title, true, true).includes(searchTerm) ||
                StringUtils.normalize(v.topic, true, true).includes(searchTerm)
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
            <div
                style={{
                    minWidth: "50vw",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                }}
            >
                <input
                    type="text"
                    placeholder="Busca un video..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Buscar videos"
                />
                <p style={{ fontSize: "small", opacity: 0.65, minWidth: "15%" }} aria-live="polite">
                    Mostrando
                    <br />
                    <b>{filteredVideos.length}</b> videos
                </p>
            </div>
            {filteredVideos.length > 2 && (
                <p style={{ fontSize: "x-small", opacity: 0.45 }}>
                    (puedes deslizar abajo, hay más)
                </p>
            )}
            <div className="search-results">
                {searchTerm.length > 3 &&
                    filteredVideos.map((v) => (
                        <div className="result" key={v.title}>
                            <img src={v.thumbnail} alt={`${v.title}, ${v.topic}, ${v.level}`} />
                            <div className="result-content">
                                <h3>{v.title}</h3>
                                <hr />
                                <p style={{ fontSize: "smaller", opacity: 0.5 }}>
                                    {v.topic} · {v.level}
                                </p>
                                <div className="react-button-as-href">
                                    <ExternalLink url={v.url}>Ver en YouTube &gt;</ExternalLink>
                                </div>
                            </div>
                        </div>
                    ))}
                {filteredVideos.length > 7 && <p>Cuántos videos, ¿no?</p>}
                {filteredVideos.length === 0 &&
                    searchTerm.length > 3 &&
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
