import React from "react";
import "../App.css";
import RandomVideoFeed from "./random-vids.js";
import ExternalLink from "../utils/ext-link";
import ZakAvailable from "./zakavailable.js";

export default function Home() {
    return (
        <section className="hero">
            <div className="mobile-hero">
                <h1>¡Hola!</h1>
                <p>Soy ZakaProfe, y hago videos para ayudarte a aprobar :].</p>
            </div>
            <section className="side1">
                <h1 className="big-header">VIDEOS &gt;&gt;&gt;</h1>
                <div className="bg-grad">
                    <div className="flex-container">
                        <h2 className="non-bold-header">ZakaProfe en YouTube</h2>
                        <RandomVideoFeed />
                        <ExternalLink url="https://youtube.com/@ZakaProfe">
                            Ver más en YouTube
                        </ExternalLink>
                    </div>
                </div>
            </section>
            <section id="main">
                <img id="zp-logo" src="./logo256.png" alt="Logotipo de ZakaProfe" />
            </section>
            <section className="side2">
                <h1 className="big-header">&lt;&lt;&lt; CONTACTO</h1>
                <div className="bg-grad">
                    <ZakAvailable />
                </div>
            </section>
        </section>
    );
}
