import { useState } from "react";
import items from "../resources/videos";
import ExternalLink from "./ext-link";

export default function Buscador() {
    const [search, setSearch] = useState("");
    const filteredVideos = items.filter((v) =>
        v.title.trim().toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <section
            className="hero"
            style={{ flexDirection: "column", justifyContent: "center", gap: 40 }}
        >
            <div className="bg-grad">
                <input
                    type="text"
                    placeholder="Busca un video..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div
                className="row-ish"
                style={{
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "start",
                    maxHeight: "50vh",
                    overflow: "scroll",
                    padding: 5,
                    width: "80vw",
                }}
            >
                {search.trim() !== "" &&
                    filteredVideos.map((v) => (
                        <div
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
                                    <ExternalLink key={v.title} url={v.url}>
                                        Ver en YouTube &gt;
                                    </ExternalLink>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}
