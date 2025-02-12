import React from "react";
import "../App.css";
import RandomVideoFeed from "./random-vids.js";
import ExternalLink from "../utils/ext-link";
import ZakAvailable from "./zakavailable.js";

export default function Home() {
    return (
        <section className="hero">
            <header className="mobile-hero">
                <h1>¡Hola!</h1>
                <p>Soy ZakaProfe, y hago videos para ayudarte a aprobar :].</p>
            </header>
            <section className="side1" aria-labelledby="video-section">
                <h1 id="video-section" className="big-header">
                    VIDEOS &gt;&gt;&gt;
                </h1>
                <div className="bg-grad">
                    <div className="flex-container">
                        <h2 className="non-bold-header">ZakaProfe en YouTube</h2>
                        <RandomVideoFeed />
                        <ExternalLink
                            url="https://youtube.com/@ZakaProfe/"
                            aria-label="Visita el canal de ZakaProfe en YouTube"
                        >
                            Ver más en YouTube &gt;&gt;&gt;
                        </ExternalLink>
                    </div>
                </div>
            </section>
            <section id="main">
                <img id="zp-logo" src="./logo256.webp" alt="Logotipo de ZakaProfe" />
            </section>
            <section className="side2" aria-labelledby="contact-section">
                <h1 id="contact-section" className="big-header">
                    &lt;&lt;&lt; CONTACTO
                </h1>
                <div className="bg-grad">
                    <ZakAvailable />
                </div>
            </section>
        </section>
    );
}
