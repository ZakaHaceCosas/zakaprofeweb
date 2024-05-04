import React from 'react';
import '../App.css';
import RandomVideoFeed from './randomvids.js';

function Home() {
    return (
        <section className="hero">
            <div className="mobilehero">
                <h1>¡Hola!</h1>
                <hr></hr>
                <p>
                    Esta página todavía no está del todo adaptada a dispositivos móviles o con pantallas pequeñas. Ábrela en PC, o vuelve otro día. ¡Gracias por tu visita (y tu paciencia)!
                </p>
            </div>
            <section className="side1">
                <h1 className="bigh">VIDEOS &gt;&gt;&gt;</h1>
                <div className="bggrad">
                    <div className="flexcont">
                        <div className="flexcont2">
                            <h2 className="nonboldh">ZakaProfe en YouTube</h2>
                            <RandomVideoFeed/>
                            <a href="https://youtube.com/@ZakaProfe" target="_blank" rel='noopener noreferrer'>
                                Ver más en YouTube
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section id="main">
                <img id="zplogo" src="./logo512.png" alt="Logotipo de ZakaProfe" />
            </section>
        </section>
    )
}

export default Home;