import RandomVideoFeed from "./random-vids.tsx";
import ExternalLink from "./ext-link.tsx";
import ZakAvailable from "./zakavailable.tsx";

export default function Home() {
    return (
        <section className="hero">
            <section className="side1" aria-labelledby="video-section">
                <h1 id="video-section">VIDEOS &gt;&gt;&gt;</h1>
                <div className="flex-container">
                    <h2 className="non-bold-header">ZakaProfe en YouTube</h2>
                    <RandomVideoFeed />
                    <ExternalLink
                        url="https://www.youtube.com/@ZakaProfe/"
                        aria-label="Visita el canal de ZakaProfe en YouTube"
                    >
                        Ver más en YouTube &gt;&gt;&gt;
                    </ExternalLink>
                </div>
            </section>
            <section id="main">
                <img id="zp-logo" src="./logo256.webp" alt="Logotipo de ZakaProfe" />
            </section>
            <section className="side2" aria-labelledby="contact-section">
                <h1 id="contact-section">&lt;&lt;&lt; CONTACTO</h1>
                <ZakAvailable />
            </section>
            <header className="mobile-hero">
                <h1>¡Hola!</h1>
                <p>Soy ZakaProfe, y hago videos para ayudarte a aprobar :].</p>
            </header>
        </section>
    );
}
